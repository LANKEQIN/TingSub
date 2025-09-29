import React, { useMemo, useState, useContext } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Text } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BarChart from './components/BarChart'
import SectionHeader from './components/SectionHeader'
import { useSelector } from 'react-redux'
import { ThemeContext } from '../App'

const StatisticsScreen = () => {
  const insets = useSafeAreaInsets()
  const subs = useSelector((state) => state.subscriptions.list)
  const [chartW, setChartW] = useState(330)
  const { effectiveScheme } = useContext(ThemeContext)
  const styles = createStyles(effectiveScheme)
  const isDark = effectiveScheme === 'dark'

  // 近 6 个月的预计月支出（从主页迁移的逻辑）
  const spendByMonth = useMemo(() => {
    const monthly = subs.reduce((sum, s) => {
      if (s.cycle === 'monthly') return sum + s.price
      if (s.cycle === 'quarterly') return sum + s.price / 3
      if (s.cycle === 'yearly') return sum + s.price / 12
      return sum // lifetime/other 不计入月支出
    }, 0)
    const val = Math.round(monthly)
    return [val, val, val, val, val, val]
  }, [subs])

  // X 轴月份标签：近 6 个月（含本月）
  const monthLabels = useMemo(() => {
    const now = new Date()
    const labels = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      labels.push(`${d.getMonth() + 1}月`)
    }
    return labels
  }, [])

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>统计</Text>

        {/* 支出分析 */}
        <SectionHeader title="支出分析" styles={styles} />
        <View style={styles.chartCard} onLayout={(e) => {
          const w = e.nativeEvent.layout.width
          // chartCard 有左右各 12 的内边距，此处减去 24 作为图表宽度，设定最小宽度以保证可读性
          setChartW(Math.max(280, Math.floor(w - 24)))
        }}>
          <BarChart data={spendByMonth} labels={monthLabels} width={chartW} height={200} barColor={isDark ? '#4DB6FF' : '#4f46e5'} gridColor={isDark ? '#2A2E33' : '#E5E7EB'} axisLabelColor={isDark ? '#A7B0B8' : '#6b7280'} />
          <Text style={styles.chartAxis}>单位：¥/月</Text>
        </View>
      </ScrollView>
    </View>
  )
}

function createStyles(scheme){
  const isDark = scheme === 'dark'
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: isDark ? '#0F1416' : '#F8FAFC' },
    scroll: { paddingHorizontal: 16, paddingBottom: 24 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'left', color: isDark ? '#E5E7EB' : '#111827' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: isDark ? '#E5E7EB' : '#111827' },
    link: { color: isDark ? '#4DB6FF' : '#0ea5e9', fontSize: 13 },
    chartCard: { backgroundColor: isDark ? '#1C1F24' : '#FFFFFF', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: isDark ? '#2A2E33' : '#E5E7EB', alignItems: 'center' },
    chartAxis: { fontSize: 12, color: isDark ? '#A7B0B8' : '#6b7280', marginTop: 8 },
  })
}

export default StatisticsScreen