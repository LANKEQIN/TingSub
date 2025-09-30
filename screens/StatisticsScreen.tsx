import React, { useMemo, useState, useContext } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Text } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BarChart from './components/BarChart'
import SectionHeader from './components/SectionHeader'
import { useSelector } from 'react-redux'
import { useAppSelector } from '../store'
import { selectPreferredCurrency } from '../features/currency/slice'
import { convertCurrency, getSymbol } from '../features/currency/services'
import { ThemeContext } from '../lib/theme'
import { I18nContext } from '../lib/i18n'
import type { RouteProp } from '@react-navigation/native'
import type { TabParamList } from '../lib/navigation'
import type { RootState } from '../store'
import type { CategoryGroup } from '../features/subscriptions/types'
import { getVariableValue } from '@tamagui/core'
import tamaguiConfig from '../tamagui.config'

type StatisticsScreenProps = {
  route: RouteProp<TabParamList, 'Statistics'>
}

const StatisticsScreen: React.FC<StatisticsScreenProps> = () => {
  const insets = useSafeAreaInsets()
  const subs = useSelector((state: RootState) => state.subscriptions.list)
  const [chartW, setChartW] = useState(330)
  const { effectiveScheme } = useContext(ThemeContext)
  const { t, locale } = useContext(I18nContext)
  const styles = createStyles(effectiveScheme)
  const isDark = effectiveScheme === 'dark'
  const preferredCurrency = useAppSelector(selectPreferredCurrency)

  // 过滤器：时间范围与分类
  type TimeRange = '3m' | '6m' | '12m' | 'this_year' | 'prev_quarter'
  const [timeRange, setTimeRange] = useState<TimeRange>('6m')
  const categoryGroups: (CategoryGroup | '全部')[] = ['全部', '影音娱乐', '工作', '生活', '其他']
  const [group, setGroup] = useState<(CategoryGroup | '全部')>('全部')
  const categoryOptions = useMemo(() => {
    const list = subs
      .filter(s => group === '全部' ? true : s.categoryGroup === group)
      .map(s => s.category)
      .filter(Boolean) as string[]
    const uniq = Array.from(new Set(list))
    return ['全部', ...uniq]
  }, [subs, group])
  const [category, setCategory] = useState<string>('全部')

  // 依据过滤器筛选订阅
  const filteredSubs = useMemo(() => {
    return subs.filter(s => {
      const groupOk = group === '全部' ? true : s.categoryGroup === group
      const catOk = category === '全部' ? true : (s.category === category)
      return groupOk && catOk
    })
  }, [subs, group, category])

  // 月等效支出（过滤后）
  const monthlyEquivalent = useMemo(() => {
    const monthly = filteredSubs.reduce((sum, s) => {
      const from = s.currency ?? 'CNY'
      const base = (s.cycle === 'monthly') ? s.price
        : (s.cycle === 'quarterly') ? s.price / 3
        : (s.cycle === 'yearly') ? s.price / 12
        : 0
      return sum + convertCurrency(base, from as any, preferredCurrency as any)
    }, 0)
    return Math.round(monthly)
  }, [filteredSubs, preferredCurrency])

  // 根据时间范围生成月份标签
  const monthLabels = useMemo(() => {
    const now = new Date()
    const labels: string[] = []
    const pushMonth = (y: number, m: number) => {
      // 根据当前语言显示月份标签（中文："n月"；英文：缩写月份）
      if (locale === 'zh') {
        labels.push(`${m}月`)
      } else {
        const d = new Date(y, m - 1, 1)
        labels.push(d.toLocaleString('en-US', { month: 'short' }))
      }
    }
    if (timeRange === '3m' || timeRange === '6m' || timeRange === '12m') {
      const n = timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : 12
      for (let i = n - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        pushMonth(d.getFullYear(), d.getMonth() + 1)
      }
    } else if (timeRange === 'this_year') {
      for (let m = 1; m <= now.getMonth() + 1; m++) pushMonth(now.getFullYear(), m)
    } else {
      // prev_quarter：上季度的三个月
      const currQ = Math.floor(now.getMonth() / 3) + 1 // 1..4
      let prevQ = currQ - 1
      let year = now.getFullYear()
      if (prevQ <= 0) { prevQ = 4; year -= 1 }
      const startM = (prevQ - 1) * 3 + 1
      for (let m = startM; m <= startM + 2; m++) {
        const adjMonth = m > 12 ? m - 12 : m
        const adjYear = m > 12 ? year + 1 : year
        pushMonth(adjYear, adjMonth)
      }
    }
    return labels
  }, [timeRange])

  // 图表数据：使用月等效支出填充所选范围
  const chartData = useMemo(() => new Array(monthLabels.length).fill(monthlyEquivalent), [monthLabels, monthlyEquivalent])

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('statistics.title')}</Text>

        {/* 支出分析 */}
        <SectionHeader title={t('statistics.spendAnalysis')} styles={styles} />
        {/* 过滤器：时间范围 */}
        <View style={styles.filterRow}>
          {[
            { key: '3m', label: t('statistics.ranges.m3') },
            { key: '6m', label: t('statistics.ranges.m6') },
            { key: '12m', label: t('statistics.ranges.m12') },
            { key: 'this_year', label: t('statistics.ranges.this_year') },
            { key: 'prev_quarter', label: t('statistics.ranges.prev_quarter') },
          ].map((opt: any) => (
            <TouchableOpacity key={opt.key} style={[styles.chip, timeRange === opt.key ? styles.chipActive : null]} onPress={() => setTimeRange(opt.key)}>
              <Text style={[styles.chipText, timeRange === opt.key ? styles.chipTextActive : null]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* 过滤器：分类分组与分类 */}
        <View style={styles.filterRow}>
          {categoryGroups.map((g) => {
            const label = g === '全部'
              ? t('statistics.groups.all')
              : g === '影音娱乐'
                ? t('statistics.groups.entertainment')
                : g === '工作'
                  ? t('statistics.groups.work')
                  : g === '生活'
                    ? t('statistics.groups.life')
                    : t('statistics.groups.other')
            return (
              <TouchableOpacity key={g} style={[styles.chip, group === g ? styles.chipActive : null]} onPress={() => { setGroup(g); setCategory('全部') }}>
                <Text style={[styles.chipText, group === g ? styles.chipTextActive : null]}>{label}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <View style={styles.filterRow}>
          {categoryOptions.map((c) => (
            <TouchableOpacity key={c} style={[styles.chipSm, category === c ? styles.chipActive : null]} onPress={() => setCategory(c)}>
              <Text style={[styles.chipTextSm, category === c ? styles.chipTextActive : null]}>{c === '全部' ? t('statistics.category_all') : c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.chartCard} onLayout={(e) => {
          const w = e.nativeEvent.layout.width
          // chartCard 有左右各 12 的内边距，此处减去 24 作为图表宽度，设定最小宽度以保证可读性
          setChartW(Math.max(280, Math.floor(w - 24)))
        }}>
          <BarChart data={chartData} labels={monthLabels} width={chartW} height={200} barColor={isDark ? '#4DB6FF' : '#4f46e5'} gridColor={isDark ? '#2A2E33' : '#E5E7EB'} axisLabelColor={isDark ? '#A7B0B8' : '#6b7280'} currencySymbol={getSymbol(preferredCurrency as any)} />
          <Text style={styles.chartAxis}>{t('statistics.axisUnit', { symbol: getSymbol(preferredCurrency as any) })}</Text>
        </View>
      </ScrollView>
    </View>
  )
}

function createStyles(scheme: 'light' | 'dark'){
  const isDark = scheme === 'dark'
  const c = tamaguiConfig.tokens.color
  const gv = getVariableValue
  const colors = {
    pageBg: gv(isDark ? c.bgPageDark : c.bgPageLight),
    cardBg: gv(isDark ? c.cardBgDark : c.cardBgLight),
    border: gv(isDark ? c.borderDark : c.borderLight),
    textPrimary: gv(isDark ? c.textPrimaryDark : c.textPrimaryLight),
    textSecondary: gv(isDark ? c.textSecondaryDark : c.textSecondaryLight),
    muted: gv(isDark ? c.mutedDark : c.mutedLight),
    accent: gv(isDark ? c.accentDark : c.accentLight),
  }
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.pageBg },
    scroll: { paddingHorizontal: 16, paddingBottom: 24 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'left', color: colors.textPrimary },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
    link: { color: colors.accent as string, fontSize: 13 },
    filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
    chip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1, borderColor: colors.border as string, backgroundColor: colors.cardBg as string },
    chipSm: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999, borderWidth: 1, borderColor: colors.border as string, backgroundColor: colors.cardBg as string },
    chipActive: { borderColor: colors.accent as string, backgroundColor: isDark ? gv(c.iconBgDark) as string : gv(c.iconBgLight) as string },
    chipText: { fontSize: 13, color: colors.textSecondary },
    chipTextSm: { fontSize: 12, color: colors.textSecondary },
    chipTextActive: { color: colors.accent as string, fontWeight: '600' },
    chartCard: { backgroundColor: colors.cardBg as string, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: colors.border as string, alignItems: 'center' },
    chartAxis: { fontSize: 12, color: colors.muted as string, marginTop: 8 },
  })
}

export default StatisticsScreen