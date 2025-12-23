import React, { useMemo, useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, type ViewStyle } from 'react-native';
import { Text, getVariableValue } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import tamaguiConfig from '../tamagui.config'
import { UI, useResponsiveLayout } from '../lib/ui'
import {
  Bell,
  User,
  Search,
  Plus
} from '@tamagui/lucide-icons';
import SectionHeader from './components/SectionHeader';
import SummaryCard from './components/SummaryCard';
import UpcomingCard from './components/UpcomingCard';
import ActiveRow from './components/ActiveRow';
import SubscriptionActionSheet from './components/SubscriptionActionSheet';
import SubscriptionFormModal from './components/SubscriptionFormModal';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';
import LoadingSkeleton from './components/LoadingSkeleton';
import AnimatedCard from './components/AnimatedCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { addSubscription, updateSubscription, removeSubscription } from '../features/subscriptions/slice';
import { ThemeContext } from '../lib/theme';
import { I18nContext } from '../lib/i18n';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootStackParamList, TabParamList } from '../lib/navigation';
import type { RootState, AppDispatch } from '../store';
import type { Subscription, Cycle } from '../features/subscriptions/slice';
import type { CategoryGroup } from '../features/subscriptions/types';
import { getCategoriesByGroup } from '../features/subscriptions/categories';
import { useAppSelector } from '../store';
import { selectPreferredCurrency } from '../features/currency/slice';
import { CurrencyService, convertCurrency } from '../features/currency/services';
import type { CurrencyCode } from '../features/currency/types';
import { selectPaymentMethods } from '../features/paymentMethods/selectors';
import { advanceNextDueISO } from './utils/subscriptions';
import { selectDisplayScale } from '../features/ui/selectors'
import { useHomeData } from './hooks/useHomeData'

const ICON_SIZE_LG = 20
const ICON_SIZE_MD = 18
const ICON_SIZE_XL = 24
const BOTTOM_SPACING = 80
const UPCOMING_ICON_SIZE = 36
const ACTIVE_ICON_SIZE = 30
const CHECKBOX_SIZE = 18

// 计算型工具
// 类型：订阅分组使用领域类型
// 计费周期标签映射（带类型）
const cycleLabelMap: Record<Cycle, string> = { monthly: '月付', quarterly: '季付', yearly: '年付', lifetime: '终身', other: '其他' };
// 可选的订阅分组选项（带类型）
const categoryGroupOptions: CategoryGroup[] = ['影音娱乐','工作','生活','其他'];
// 类型守卫与转换器
const isCategoryGroup = (val: string): val is CategoryGroup => (categoryGroupOptions as string[]).includes(val);
const toCategoryGroup = (val?: string): CategoryGroup => (val && isCategoryGroup(val) ? val : '其他');
function formatPriceByPref(price: number, cycle: string, fromCode: 'CNY'|'USD'|'JPY', toCode: 'CNY'|'USD'|'JPY'){
  const converted = convertCurrency(price, fromCode, toCode)
  const base = CurrencyService.format(converted, toCode)
  const suffix = (cycle==='yearly')?'/年': (cycle==='quarterly')?'/季': (cycle==='lifetime')?'/终身': (cycle==='其他'||cycle==='other')?'': '/月'
  return `${base}${suffix}`
}
// 新增：原价 + 换算价的透明显示
function formatPriceBoth(price: number, cycle: string, fromCode: 'CNY'|'USD'|'JPY', toCode: 'CNY'|'USD'|'JPY'){
  const orig = CurrencyService.format(price, fromCode)
  const conv = CurrencyService.convertAndFormat(price, fromCode, toCode)
  const suffix = (cycle==='yearly')?'/年': (cycle==='quarterly')?'/季': (cycle==='lifetime')?'/终身': (cycle==='其他'||cycle==='other')?'': '/月'
  if(fromCode===toCode){
    return `${orig}${suffix}`
  }
  return `${orig}${suffix} · ≈ ${conv}${suffix}`
}
function daysUntil(dateISO){
  if(!dateISO) return null;
  const d = new Date(dateISO);
  const diff = Math.ceil((d.getTime() - Date.now())/86400000);
  return diff;
}

/* Components moved to screens/components: UpcomingCard, BarChart, SectionHeader, ActiveRow, SummaryCard */

type HomeScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Home'>,
    NativeStackNavigationProp<RootStackParamList>
  >;
  route: RouteProp<TabParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const subs = useSelector((state: RootState) => state.subscriptions.list);
  const { effectiveScheme } = useContext(ThemeContext);
  const { t } = useContext(I18nContext);
  const scale = useAppSelector(selectDisplayScale)
  const styles = createStyles(effectiveScheme, scale);
  const { isLarge } = useResponsiveLayout();
  const preferredCurrency = useAppSelector(selectPreferredCurrency);
  const scrollContentStyle = useMemo<ViewStyle>(
    () => StyleSheet.flatten([styles.scroll, { paddingBottom: UI.space.lg * scale + insets.bottom + 96 }]),
    [styles.scroll, insets.bottom, scale]
  )
  // 错误边界重置计数
  const [retryCount, setRetryCount] = useState(0);
  // 首屏轻量骨架演示：短暂显示骨架屏，后续可接入真实加载态
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // 自动续费：当到期（或今天到期）且开启自动续费时，推进 nextDueISO 到下一个周期
  useEffect(() => {
    const updates: Subscription[] = []
    subs.forEach((s) => {
      const d = daysUntil(s.nextDueISO)
      if (s.autoRenew && d !== null && d <= 0 && s.nextDueISO) {
        const nextISO = advanceNextDueISO(s.nextDueISO, s.cycle)
        if (nextISO !== s.nextDueISO) {
          updates.push({ ...s, nextDueISO: nextISO })
        }
      }
    })
    if (updates.length > 0) {
      updates.forEach((u) => dispatch(updateSubscription(u)))
    }
  }, [subs])

  const { summaryData, upcomingList, activeSubs } = useHomeData(subs, preferredCurrency as CurrencyCode);

  // 新增：支出分析数据（近 6 个月的预计月支出）
  //（已移至统计页，移除未使用的支出分析计算）
  // 表单弹窗状态
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    categoryGroup: CategoryGroup;
    categoryId?: string;
    categoryLabel: string;
    price: string;
    cycle: Cycle;
    startISO: string;
    nextDueISO: string;
    autoRenew: boolean;
    currency: 'CNY'|'USD'|'JPY';
    paymentMethodId?: string;
  }>({ name: '', categoryGroup: '影音娱乐', categoryId: undefined, categoryLabel: '', price: '', cycle: 'monthly', startISO: '', nextDueISO: '', autoRenew: false, currency: 'CNY', paymentMethodId: undefined });
  // 新增：编辑/操作相关状态（修复 actionOpen 未定义报错）
  const [editMode, setEditMode] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [actionOpen, setActionOpen] = useState(false);
  // 简易日期选择：年/月/日
  const pad2 = (n) => String(n).padStart(2, '0');
  const today = new Date();
  const [dateParts, setDateParts] = useState({ year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() });
  const years = useMemo(() => Array.from({ length: 6 }, (_, i) => today.getFullYear() + i), []);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();
  const days = useMemo(() => Array.from({ length: getDaysInMonth(dateParts.year, dateParts.month) }, (_, i) => i + 1), [dateParts.year, dateParts.month]);
  // 新增：Android 原生日期选择控件开关
  const [showPicker, setShowPicker] = useState(false);
  // 新增：Android DateTimePicker 变更处理
  const onAndroidDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS !== 'web') {
      const currentDate = selectedDate || new Date(dateParts.year, dateParts.month - 1, dateParts.day);
      setShowPicker(false);
      const y = currentDate.getFullYear();
      const m = currentDate.getMonth() + 1;
      const d = currentDate.getDate();
      const iso = `${y}-${pad2(m)}-${pad2(d)}`;
      setForm(v => ({ ...v, nextDueISO: iso }));
      setDateParts({ year: y, month: m, day: d });
    }
  };
  const openModal = () => {
    setModalOpen(true);
    const iso = `${dateParts.year}-${pad2(dateParts.month)}-${pad2(dateParts.day)}`;
    setForm((v) => ({ ...v, nextDueISO: iso }));
  };
  // 价格输入占位示例与预览文本
  const pricePlaceholder = useMemo(() => {
    const symbol = CurrencyService.symbol(form.currency as CurrencyCode)
    const example = form.currency==='JPY' ? '1500' : '15'
    return `例如：${symbol} ${example}`
  }, [form.currency])
  const pricePreview = useMemo(() => {
    const num = Number(form.price)
    if(!Number.isFinite(num) || num<=0) return ''
    return formatPriceBoth(num, form.cycle, form.currency, preferredCurrency as CurrencyCode)
  }, [form.price, form.cycle, form.currency, preferredCurrency])
  const paymentMethods = useAppSelector(selectPaymentMethods)
  // 新增：打开某订阅的操作面板
  const openActionFor = (id) => {
    const s = subs.find((x) => x.id === id);
    setSelectedSub(s || null);
    setActionOpen(true);
  };
  // 新增：开始编辑所选订阅
  const startEditSelected = () => {
    if (!selectedSub) return;
    const isGroupOption = selectedSub.category ? isCategoryGroup(selectedSub.category) : false;
    setForm({
      name: selectedSub.name,
      categoryGroup: toCategoryGroup(selectedSub.categoryGroup ?? (isGroupOption ? selectedSub.category : undefined)),
      // 根据分组尝试匹配默认分类ID
      categoryId: (() => {
        const grp = toCategoryGroup(selectedSub.categoryGroup ?? (isGroupOption ? selectedSub.category : undefined));
        const found = getCategoriesByGroup(grp).find(c => c.label === selectedSub.category);
        return found?.id;
      })(),
      categoryLabel: (selectedSub.categoryGroup ?? (isGroupOption ? (selectedSub.category as CategoryGroup) : '其他')) === '其他'
        ? (selectedSub.category ?? '')
        : (isGroupOption ? '' : (selectedSub.category ?? '')),
      price: String(selectedSub.price),
      cycle: selectedSub.cycle,
      startISO: selectedSub.startISO ?? '',
      nextDueISO: selectedSub.nextDueISO ?? '',
      autoRenew: !!selectedSub.autoRenew,
      currency: selectedSub.currency ?? 'CNY',
      paymentMethodId: selectedSub.paymentMethodId,
    });
    if (selectedSub.nextDueISO) {
      const [y, m, d] = selectedSub.nextDueISO.split('-').map(Number);
      setDateParts({ year: y, month: m, day: d });
    } else {
      const t = new Date();
      setDateParts({ year: t.getFullYear(), month: t.getMonth() + 1, day: t.getDate() });
    }
    setEditMode(true);
    setActionOpen(false);
    setModalOpen(true);
  };
  // 新增：删除所选订阅
  const deleteSelected = () => {
    if (!selectedSub) return;
    dispatch(removeSubscription(selectedSub.id));
    setActionOpen(false);
    setSelectedSub(null);
  };
  const closeModal = () => { setModalOpen(false); setEditMode(false); setSelectedSub(null); };
  const submitForm = () => {
    if(!form.name || !form.price) return;
    if (editMode && selectedSub) {
      const payloadUpdate: Subscription = {
        ...selectedSub,
        name: form.name,
        category: form.categoryGroup === '其他'
          ? (form.categoryLabel?.trim() || '其他')
          : (form.categoryId ? (getCategoriesByGroup(form.categoryGroup).find(c => c.id === form.categoryId)?.label || form.categoryGroup) : form.categoryGroup),
        categoryGroup: form.categoryGroup,
        price: Number(form.price),
        cycle: form.cycle,
        startISO: form.startISO || undefined,
        nextDueISO: form.nextDueISO || undefined,
        autoRenew: form.autoRenew,
        currency: form.currency,
        paymentMethodId: form.paymentMethodId,
      };
      dispatch(updateSubscription(payloadUpdate));
    } else {
      const payload: Subscription = {
        id: `${Date.now()}`,
        name: form.name,
        category: form.categoryGroup === '其他'
          ? (form.categoryLabel?.trim() || '其他')
          : (form.categoryId ? (getCategoriesByGroup(form.categoryGroup).find(c => c.id === form.categoryId)?.label || form.categoryGroup) : form.categoryGroup),
        categoryGroup: form.categoryGroup,
        price: Number(form.price),
        cycle: form.cycle,
        startISO: form.startISO || undefined,
        nextDueISO: form.nextDueISO || undefined,
        autoRenew: form.autoRenew,
        currency: form.currency,
        paymentMethodId: form.paymentMethodId,
      };
      dispatch(addSubscription(payload));
    }
    closeModal();
    setForm({ name: '', categoryGroup: '影音娱乐', categoryId: undefined, categoryLabel: '', price: '', cycle: 'monthly', startISO: '', nextDueISO: '', autoRenew: false, currency: 'CNY', paymentMethodId: undefined });
  };

  return (
    <ErrorBoundary
      resetKeys={[retryCount, subs.length]}
      fallback={<ErrorState styles={styles} onRetry={() => setRetryCount((c) => c + 1)} />}
    >
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      {/* 顶部导航 */}
      <View style={styles.topbar}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>{t('home.title')}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: UI.space.md }}>
          <TouchableOpacity style={styles.iconBtn}><Bell size={ICON_SIZE_LG} color={styles.colors.textPrimary} /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><User size={ICON_SIZE_LG} color={styles.colors.textPrimary} /></TouchableOpacity>
        </View>
      </View>

      {/* 搜索框 */}
      <View style={styles.searchBox}>
        <Search size={ICON_SIZE_MD} color={styles.colors.muted} />
        <TextInput style={styles.searchInput} placeholder={t('home.searchPlaceholder')} placeholderTextColor={styles.colors.muted} />
      </View>

      {isLarge ? (
        <View style={{ flexDirection: 'row', gap: UI.space.md }}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={scrollContentStyle} showsVerticalScrollIndicator={false}>
            {loading ? (
              <LoadingSkeleton styles={styles} />
            ) : subs.length === 0 ? (
              <>
                <SectionHeader title={t('home.overview')} styles={styles} />
                <EmptyState
                  title={t('home.emptyTitle') || '暂无订阅'}
                  description={t('home.emptyDesc') || '添加你的第一个订阅以开始统计与提醒'}
                  actionLabel={t('home.addSub') || '添加订阅'}
                  onAction={openModal}
                  styles={styles}
                />
              </>
            ) : (
              <>
                <SectionHeader title={t('home.overview')} actionText={t('home.viewAll')} styles={styles} />
                <View style={styles.summaryGrid}>
                  <AnimatedCard index={0} style={styles.summaryCard}>
                    <SummaryCard title={t('home.totalSubs')} value={summaryData.totalSubs} sub="" styles={styles} index={0} />
                  </AnimatedCard>
                  <AnimatedCard index={1} style={styles.summaryCard}>
                    <SummaryCard title={t('home.monthlySpend')} value={CurrencyService.format(summaryData.monthlySpend, preferredCurrency as CurrencyCode)} sub={``} styles={styles} index={1} />
                  </AnimatedCard>
                  <AnimatedCard index={2} style={styles.summaryCard}>
                    <SummaryCard title={t('home.upcoming')} value={summaryData.upcomingBills} sub={t('home.upcomingIn7Days')} styles={styles} index={2} />
                  </AnimatedCard>
                  <AnimatedCard index={3} style={styles.summaryCard}>
                    <SummaryCard title={t('home.yearlySpend')} value={CurrencyService.format(summaryData.yearlySpend, preferredCurrency as CurrencyCode)} sub={``} styles={styles} index={3} />
                  </AnimatedCard>
                </View>

                {upcomingList.length > 0 && (
                  <>
                    <SectionHeader title={t('home.upcoming')} actionText={t('home.more')} styles={styles} />
                    <View style={{ gap: UI.space.md }}>
                      {upcomingList.map((u, idx) => (
                        <AnimatedCard key={u.id} index={idx + 4}>
                          <UpcomingCard item={u} onLongPress={() => openActionFor(u.id)} styles={styles} />
                        </AnimatedCard>
                      ))}
                    </View>
                  </>
                )}
              </>
            )}
          </ScrollView>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={scrollContentStyle} showsVerticalScrollIndicator={false}>
            {loading ? (
              <LoadingSkeleton styles={styles} />
            ) : subs.length === 0 ? (
              <View />
            ) : (
              <>
                <SectionHeader title={t('home.active')} styles={styles} />
                <View style={{ gap: UI.space.sm }}>
                  {activeSubs.map((s, idx) => (
                    <AnimatedCard key={s.id} index={idx}>
                      <ActiveRow item={s} index={idx} onLongPress={() => openActionFor(s.id)} styles={styles} />
                    </AnimatedCard>
                  ))}
                </View>
              </>
            )}
            <View style={{ height: BOTTOM_SPACING }} />
          </ScrollView>
        </View>
      ) : (
        <ScrollView contentContainerStyle={scrollContentStyle} showsVerticalScrollIndicator={false}>
          {loading ? (
            <LoadingSkeleton styles={styles} />
          ) : subs.length === 0 ? (
            <>
              <SectionHeader title={t('home.overview')} styles={styles} />
              <EmptyState
                title={t('home.emptyTitle') || '暂无订阅'}
                description={t('home.emptyDesc') || '添加你的第一个订阅以开始统计与提醒'}
                actionLabel={t('home.addSub') || '添加订阅'}
                onAction={openModal}
                styles={styles}
              />
            </>
          ) : (
            <>
              <SectionHeader title={t('home.overview')} actionText={t('home.viewAll')} styles={styles} />
              <View style={styles.summaryGrid}>
                <AnimatedCard index={0} style={styles.summaryCard}>
                  <SummaryCard title={t('home.totalSubs')} value={summaryData.totalSubs} sub="" styles={styles} index={0} />
                </AnimatedCard>
                <AnimatedCard index={1} style={styles.summaryCard}>
                  <SummaryCard title={t('home.monthlySpend')} value={CurrencyService.format(summaryData.monthlySpend, preferredCurrency as CurrencyCode)} sub={``} styles={styles} index={1} />
                </AnimatedCard>
                <AnimatedCard index={2} style={styles.summaryCard}>
                  <SummaryCard title={t('home.upcoming')} value={summaryData.upcomingBills} sub={t('home.upcomingIn7Days')} styles={styles} index={2} />
                </AnimatedCard>
                <AnimatedCard index={3} style={styles.summaryCard}>
                  <SummaryCard title={t('home.yearlySpend')} value={CurrencyService.format(summaryData.yearlySpend, preferredCurrency as CurrencyCode)} sub={``} styles={styles} index={3} />
                </AnimatedCard>
              </View>

              {upcomingList.length > 0 && (
                <>
                  <SectionHeader title={t('home.upcoming')} actionText={t('home.more')} styles={styles} />
                  <View style={{ gap: UI.space.md }}>
                    {upcomingList.map((u, idx) => (
                      <AnimatedCard key={u.id} index={idx + 4}>
                        <UpcomingCard item={u} onLongPress={() => openActionFor(u.id)} styles={styles} />
                      </AnimatedCard>
                    ))}
                  </View>
                </>
              )}

              <SectionHeader title={t('home.active')} styles={styles} />
              <View style={{ gap: UI.space.sm }}>
                {activeSubs.map((s, idx) => (
                  <AnimatedCard key={s.id} index={idx}>
                    <ActiveRow item={s} index={idx} onLongPress={() => openActionFor(s.id)} styles={styles} />
                  </AnimatedCard>
                ))}
              </View>

              <View style={{ height: BOTTOM_SPACING }} />
            </>
          )}
        </ScrollView>
      )}

      {/* 悬浮添加按钮 */}
      <TouchableOpacity 
        style={[styles.fab, { bottom: insets.bottom + UI.space.md * scale, right: UI.space.md * scale }]} 
        onPress={openModal}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[getVariableValue(tamaguiConfig.tokens.color.gradientStart), getVariableValue(tamaguiConfig.tokens.color.gradientEnd)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={fabStyles.gradient}
        >
          <Plus size={ICON_SIZE_XL} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* 操作弹窗：编辑或删除 */}
      <SubscriptionActionSheet
        visible={actionOpen}
        styles={styles}
        onCancel={() => { setActionOpen(false); setSelectedSub(null); }}
        onEdit={startEditSelected}
        onDelete={deleteSelected}
      />

      {/* 添加/编辑订阅弹窗（简易） */}
      <SubscriptionFormModal
        visible={modalOpen}
        editMode={!!editMode}
        styles={styles}
        form={form}
        setForm={setForm}
        pricePlaceholder={pricePlaceholder}
        pricePreview={pricePreview}
        preferredCurrency={preferredCurrency as CurrencyCode}
        categoryGroupOptions={categoryGroupOptions}
        getCategoriesByGroup={getCategoriesByGroup}
        years={years}
        months={months}
        days={days}
        dateParts={dateParts}
        setDateParts={setDateParts}
        showPicker={showPicker}
        setShowPicker={setShowPicker}
        onAndroidDateChange={onAndroidDateChange}
        paymentMethods={paymentMethods.map(p => ({ id: p.id, label: p.label || '' }))}
        onSubmit={submitForm}
        onClose={closeModal}
      />
    </View>
    </ErrorBoundary>
  );
};

// 明确样式返回类型，包含颜色调色板
type ColorPalette = {
  pageBg: string;
  cardBg: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  muted: string;
  accent: string;
  badgeBg: string;
  iconBg: string;
  fabBg: string;
  modalBg: string;
};

// 替换为按主题生成样式（深色/浅色）
function createStyles(scheme: 'light' | 'dark', scale: number){
  const isDark = scheme === 'dark';
  const c = tamaguiConfig.tokens.color;
  const gv = getVariableValue;
  const colors: ColorPalette = {
    pageBg: gv(isDark ? c.bgPageDark : c.bgPageLight),
    cardBg: gv(isDark ? c.cardBgDark : c.cardBgLight),
    border: gv(isDark ? c.borderDark : c.borderLight),
    textPrimary: gv(isDark ? c.textPrimaryDark : c.textPrimaryLight),
    textSecondary: gv(isDark ? c.textSecondaryDark : c.textSecondaryLight),
    muted: gv(isDark ? c.mutedDark : c.mutedLight),
    accent: gv(isDark ? c.accentDark : c.accentLight),
    badgeBg: gv(isDark ? c.badgeBgDark : c.badgeBgLight),
    iconBg: gv(isDark ? c.iconBgDark : c.iconBgLight),
    fabBg: gv(c.fabBg),
    modalBg: gv(isDark ? c.modalBgDark : c.modalBgLight),
  };
  const sheet = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.pageBg },
    topbar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: UI.space.md * scale,
      paddingTop: UI.space.md * scale,
      paddingBottom: UI.space.xs * scale,
    },
    logoBox: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoText: { fontSize: 22 * scale, fontWeight: '800', color: colors.textPrimary },
    iconBtn: {
      width: 38 * scale,
      height: 38 * scale,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: UI.radius.pill,
      backgroundColor: colors.cardBg,
      borderWidth: isDark ? 1 : 0,
      borderColor: colors.border,
      ...UI.shadow.sm,
    },
    searchBox: {
      marginHorizontal: UI.space.md,
      marginBottom: UI.space.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: UI.space.xs,
      borderRadius: UI.radius.lg,
      paddingHorizontal: UI.space.sm,
      paddingVertical: UI.space.sm,
      backgroundColor: colors.cardBg,
      borderWidth: isDark ? 1 : 0,
      borderColor: colors.border,
      ...UI.shadow.sm,
    },
    searchInput: { flex: 1, fontSize: 15 * scale, color: colors.textPrimary },
    scroll: { paddingHorizontal: UI.space.md * scale },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: UI.space.xs, marginBottom: UI.space.sm },
    sectionTitle: { fontSize: 18 * scale, fontWeight: '800', color: colors.textPrimary },
    link: { color: colors.accent, fontSize: 13 * scale, fontWeight: '600' },
    summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: UI.space.sm },
    summaryCard: {
      width: '47%',
      backgroundColor: colors.cardBg,
      borderRadius: UI.radius.xl,
      padding: UI.space.md,
      borderWidth: isDark ? 1 : 0,
      borderColor: colors.border,
      ...UI.shadow.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: UI.space.sm,
    },
    summaryTitle: { fontSize: 12 * scale, color: colors.textSecondary },
    summaryValue: { fontSize: 18 * scale, fontWeight: '800', color: colors.textPrimary },
    summarySub: { fontSize: 11 * scale, color: gv(isDark ? c.successDark : c.success) },

    upcomingCard: {
      flexDirection: 'row',
      gap: UI.space.sm,
      alignItems: 'center',
      backgroundColor: colors.cardBg,
      borderRadius: UI.radius.lg,
      padding: UI.space.sm,
      borderWidth: isDark ? 1 : 0,
      borderColor: colors.border,
      ...UI.shadow.sm,
    },
    upcomingIconBox: { width: 36, height: 36, borderRadius: UI.radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.iconBg },
    upcomingName: { fontSize: 15 * scale, fontWeight: '800', color: colors.textPrimary },
    upcomingCycle: { fontSize: 12 * scale, color: colors.textSecondary, marginTop: 2 * scale },
    upcomingMetaRow: { flexDirection: 'row', gap: UI.space.sm, marginTop: UI.space.xs },
    badgeInfo: { flexDirection: 'row', alignItems: 'center', gap: UI.space.xs, backgroundColor: colors.badgeBg, paddingVertical: UI.space.xs, paddingHorizontal: UI.space.xs, borderRadius: UI.radius.xs },
    badgeText: { fontSize: 12 * scale, color: colors.textSecondary },

    chartCard: { backgroundColor: colors.cardBg, borderRadius: UI.radius.lg, padding: UI.space.sm, borderWidth: isDark ? 1 : 0, borderColor: colors.border, alignItems: 'center', ...UI.shadow.sm },
    chartAxis: { fontSize: 12 * scale, color: colors.textSecondary, marginTop: UI.space.xs },

    activeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: UI.space.sm,
      paddingHorizontal: UI.space.sm,
      backgroundColor: colors.cardBg,
      borderRadius: UI.radius.md,
      borderWidth: isDark ? 1 : 0,
      borderColor: colors.border,
      ...UI.shadow.sm,
    },
    activeIconBox: { width: 30, height: 30, borderRadius: UI.radius.xs, backgroundColor: colors.badgeBg, alignItems: 'center', justifyContent: 'center', marginRight: UI.space.sm },
    activeName: { fontSize: 15 * scale, fontWeight: '700', color: colors.textPrimary },
    activeHint: { fontSize: 12 * scale, color: colors.textSecondary },
    activeNext: { fontSize: 12 * scale, color: gv(isDark ? c.accentDark : c.accentLight) },

    todoBox: { marginTop: UI.space.md, backgroundColor: colors.cardBg, borderRadius: UI.radius.md, padding: UI.space.sm, borderWidth: isDark ? 1 : 0, borderColor: colors.border, ...UI.shadow.sm },
    todoTitle: { fontSize: 14 * scale, fontWeight: '800', color: colors.textPrimary, marginBottom: UI.space.xs },
    todoItem: { fontSize: 12 * scale, color: colors.textSecondary, marginTop: 2 },

    fab: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      width: 56 * scale,
      height: 56 * scale,
      borderRadius: 28 * scale,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },

    modalMask: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: isDark ? 'rgba(0,0,0,0.50)' : 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
    modalBox: { width: '90%', maxHeight: '85%', backgroundColor: colors.modalBg, borderRadius: UI.radius.md, padding: UI.space.md, borderWidth: 1, borderColor: colors.border, ...UI.shadow.md },
    modalTitle: { fontSize: 18 * scale, fontWeight: '800', marginBottom: UI.space.sm, color: colors.textPrimary },
    formRow: { marginBottom: UI.space.sm },
    formLabel: { fontSize: 13 * scale, color: colors.textSecondary, marginBottom: UI.space.xs },
    formInput: { borderWidth: 1, borderColor: colors.border, borderRadius: UI.radius.xs, paddingHorizontal: UI.space.sm, paddingVertical: UI.space.xs, color: colors.textPrimary, backgroundColor: colors.cardBg },
    selectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: UI.space.xs },
    selectItem: { paddingHorizontal: UI.space.sm, paddingVertical: UI.space.xs, borderRadius: UI.radius.xs, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardBg },
    selectItemActive: { backgroundColor: isDark ? gv(c.iconBgDark) : gv(c.primarySoft), borderColor: gv(c.primarySolid) },
    selectText: { fontSize: 12 * scale, color: colors.textSecondary },
    selectTextActive: { color: isDark ? '#93C5FD' : '#1D4ED8', fontWeight: '700' },

    checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: UI.space.xs, paddingVertical: UI.space.xs },
    checkboxBox: { width: CHECKBOX_SIZE, height: CHECKBOX_SIZE, borderRadius: 4, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardBg, alignItems: 'center', justifyContent: 'center' },
    checkboxBoxChecked: { backgroundColor: colors.fabBg, borderColor: colors.fabBg },
    checkbox: { paddingVertical: UI.space.xs },
    checkboxText: { fontSize: 13 * scale, color: colors.textSecondary },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: UI.space.sm, marginTop: UI.space.xs },
    btnGhost: { paddingHorizontal: UI.space.md, paddingVertical: UI.space.sm, borderRadius: UI.radius.xs, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardBg },
    btnGhostText: { color: colors.textSecondary },
    btnPrimary: { paddingHorizontal: UI.space.md, paddingVertical: UI.space.sm, borderRadius: UI.radius.xs, backgroundColor: colors.fabBg },
    btnPrimaryText: { color: '#fff', fontWeight: '700' },
  });
  return { ...sheet, colors } as ReturnType<typeof StyleSheet.create> & { colors: ColorPalette };
}

const fabStyles = StyleSheet.create({
  gradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default HomeScreen;
