import React, { useMemo, useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Text, getVariableValue } from 'tamagui';
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
import { selectPaymentMethods } from '../features/payment_methods/selectors';
import { advanceNextDueISO } from './utils/subscriptions';
import { selectDisplayScale } from '../features/ui/selectors'

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

  const summaryData = useMemo(() => {
    const totalSubs = subs.length;
    const monthlySpend = subs.reduce((sum, s) => {
      const from = s.currency ?? 'CNY'
      const add = (s.cycle === 'monthly') ? s.price
        : (s.cycle === 'quarterly') ? s.price/3
        : (s.cycle === 'yearly') ? s.price/12
        : 0
      return sum + convertCurrency(add, from as any, preferredCurrency as any)
    }, 0)
    const yearlySpend = subs.reduce((sum, s) => {
      const from = s.currency ?? 'CNY'
      const add = (s.cycle === 'monthly') ? s.price*12
        : (s.cycle === 'quarterly') ? s.price*4
        : (s.cycle === 'yearly') ? s.price
        : 0
      return sum + convertCurrency(add, from as any, preferredCurrency as any)
    }, 0)
    const upcomingBills = subs.filter(s=>{
      const d = daysUntil(s.nextDueISO);
      return d!==null && d>=0 && d<=7;
    }).length;
    return { totalSubs, monthlySpend, yearlySpend, upcomingBills, deltas: { monthlySpend: '+0', yearlySpend: '+0' } };
  }, [subs, preferredCurrency]);

  const upcomingList = useMemo(() => subs
    .map(s => {
      const d = daysUntil(s.nextDueISO);
      return {
        id: s.id,
        name: s.name,
        cycle: `${s.category ?? '订阅'} · ${cycleLabelMap[s.cycle]}`,
        next: s.nextDueISO
          ? (s.autoRenew && d !== null && d >= 0 && d <= 7
              ? `在${d}天后自动续费`
              : `${d}天内`)
          : '未设置',
        price: formatPriceBoth(s.price, s.cycle, (s.currency ?? 'CNY') as any, preferredCurrency as any),
        dueDays: d,
      };
    })
    .filter(u => u.dueDays !== null && u.dueDays >= 0 && u.dueDays <= 7)
    .sort((a, b) => a.dueDays - b.dueDays)
  , [subs, preferredCurrency]);

  // 新增：活跃订阅列表（用于 ActiveRow）
  const activeSubs = useMemo(() => subs.map(s => ({
    id: s.id,
    name: s.name,
    price: formatPriceBoth(s.price, s.cycle, (s.currency ?? 'CNY') as any, preferredCurrency as any),
    next: (() => {
      const d = daysUntil(s.nextDueISO);
      return s.nextDueISO
        ? (s.autoRenew && d !== null && d >= 0 && d <= 7
            ? `在${d}天后自动续费`
            : `${d}天内`)
        : '未设置';
    })(),
  })), [subs, preferredCurrency]);

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
  // Android DateTimePicker 变更处理
  const onAndroidDateChange = (event, selectedDate) => {
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
    const symbol = CurrencyService.symbol(form.currency as any)
    const example = form.currency==='JPY' ? '1500' : '15'
    return `例如：${symbol} ${example}`
  }, [form.currency])
  const pricePreview = useMemo(() => {
    const num = Number(form.price)
    if(!Number.isFinite(num) || num<=0) return ''
    return formatPriceBoth(num, form.cycle, form.currency, preferredCurrency as any)
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
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity style={styles.iconBtn}><Bell size={20} color={styles.colors.textPrimary} /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><User size={20} color={styles.colors.textPrimary} /></TouchableOpacity>
        </View>
      </View>

      {/* 搜索框 */}
      <View style={styles.searchBox}>
        <Search size={18} color={styles.colors.muted} />
        <TextInput style={styles.searchInput} placeholder={t('home.searchPlaceholder')} placeholderTextColor={styles.colors.muted} />
      </View>

      {isLarge ? (
        <View style={{ flexDirection: 'row', gap: UI.space.md }}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
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
                  <SummaryCard title={t('home.totalSubs')} value={summaryData.totalSubs} sub="" styles={styles} />
                  <SummaryCard title={t('home.monthlySpend')} value={CurrencyService.format(summaryData.monthlySpend, preferredCurrency as any)} sub={``} styles={styles} />
                  <SummaryCard title={t('home.upcoming')} value={summaryData.upcomingBills} sub={t('home.upcomingIn7Days')} styles={styles} />
                  <SummaryCard title={t('home.yearlySpend')} value={CurrencyService.format(summaryData.yearlySpend, preferredCurrency as any)} sub={``} styles={styles} />
                </View>

                {upcomingList.length > 0 && (
                  <>
                    <SectionHeader title={t('home.upcoming')} actionText={t('home.more')} styles={styles} />
                    <View style={{ gap: 12 }}>
                      {upcomingList.map((u) => (
                        <UpcomingCard key={u.id} item={u} onLongPress={() => openActionFor(u.id)} styles={styles} />
                      ))}
                    </View>
                  </>
                )}
              </>
            )}
          </ScrollView>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            {loading ? (
              <LoadingSkeleton styles={styles} />
            ) : subs.length === 0 ? (
              <View />
            ) : (
              <>
                <SectionHeader title={t('home.active')} styles={styles} />
                <View style={{ gap: 8 }}>
                  {activeSubs.map((s, idx) => (
                    <ActiveRow key={s.id} item={s} index={idx} onLongPress={() => openActionFor(s.id)} styles={styles} />
                  ))}
                </View>
              </>
            )}
            <View style={{ height: 80 }} />
          </ScrollView>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
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
                <SummaryCard title={t('home.totalSubs')} value={summaryData.totalSubs} sub="" styles={styles} />
                <SummaryCard title={t('home.monthlySpend')} value={CurrencyService.format(summaryData.monthlySpend, preferredCurrency as any)} sub={``} styles={styles} />
                <SummaryCard title={t('home.upcoming')} value={summaryData.upcomingBills} sub={t('home.upcomingIn7Days')} styles={styles} />
                <SummaryCard title={t('home.yearlySpend')} value={CurrencyService.format(summaryData.yearlySpend, preferredCurrency as any)} sub={``} styles={styles} />
              </View>

              {upcomingList.length > 0 && (
                <>
                  <SectionHeader title={t('home.upcoming')} actionText={t('home.more')} styles={styles} />
                  <View style={{ gap: 12 }}>
                    {upcomingList.map((u) => (
                      <UpcomingCard key={u.id} item={u} onLongPress={() => openActionFor(u.id)} styles={styles} />
                    ))}
                  </View>
                </>
              )}

              <SectionHeader title={t('home.active')} styles={styles} />
              <View style={{ gap: 8 }}>
                {activeSubs.map((s, idx) => (
                  <ActiveRow key={s.id} item={s} index={idx} onLongPress={() => openActionFor(s.id)} styles={styles} />
                ))}
              </View>

              <View style={{ height: 80 }} />
            </>
          )}
        </ScrollView>
      )}

      {/* 悬浮添加按钮 */}
      <TouchableOpacity style={styles.fab} onPress={openModal}>
        <Plus size={24} color="#fff" />
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
        setForm={(updater)=>setForm(updater as any)}
        pricePlaceholder={pricePlaceholder}
        pricePreview={pricePreview}
        preferredCurrency={preferredCurrency as any}
        categoryGroupOptions={categoryGroupOptions as any}
        getCategoriesByGroup={getCategoriesByGroup}
        years={years}
        months={months}
        days={days}
        dateParts={dateParts}
        setDateParts={setDateParts}
        showPicker={showPicker}
        setShowPicker={setShowPicker}
        onAndroidDateChange={onAndroidDateChange}
        paymentMethods={paymentMethods as any}
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
      backgroundColor: colors.iconBg,
      borderRadius: UI.radius.sm,
      paddingHorizontal: UI.space.sm * scale,
      paddingVertical: UI.space.xs * scale,
    },
    logoText: { fontSize: 14 * scale, fontWeight: '700', color: colors.accent },
    iconBtn: {
      backgroundColor: gv(c.gray3),
      padding: UI.space.xs,
      borderRadius: UI.radius.sm,
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
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: { flex: 1, fontSize: 15, color: colors.textPrimary },
    scroll: { paddingHorizontal: UI.space.md, paddingBottom: UI.space.lg },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: UI.space.xs, marginBottom: UI.space.sm },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
    link: { color: colors.accent, fontSize: 13 },
    summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: UI.space.sm },
    summaryCard: {
      width: '47%',
      backgroundColor: colors.cardBg,
      borderRadius: UI.radius.xl,
      padding: UI.space.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    summaryTitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
    summaryValue: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
    summarySub: { fontSize: 12, color: gv(isDark ? c.successDark : c.success), marginTop: 4 },

    upcomingCard: {
      flexDirection: 'row',
      gap: UI.space.sm,
      alignItems: 'center',
      backgroundColor: colors.cardBg,
      borderRadius: UI.radius.lg,
      padding: UI.space.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    upcomingIconBox: { width: 36, height: 36, borderRadius: UI.radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.iconBg },
    upcomingName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
    upcomingCycle: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    upcomingMetaRow: { flexDirection: 'row', gap: UI.space.sm, marginTop: UI.space.xs },
    badgeInfo: { flexDirection: 'row', alignItems: 'center', gap: UI.space.xs, backgroundColor: colors.badgeBg, paddingVertical: UI.space.xs, paddingHorizontal: UI.space.xs, borderRadius: UI.radius.xs },
    badgeText: { fontSize: 12, color: colors.textSecondary },

    chartCard: { backgroundColor: colors.cardBg, borderRadius: UI.radius.lg, padding: UI.space.sm, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
    chartAxis: { fontSize: 12, color: colors.textSecondary, marginTop: UI.space.xs },

    activeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: UI.space.sm,
      paddingHorizontal: UI.space.sm,
      backgroundColor: colors.cardBg,
      borderRadius: UI.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activeIconBox: { width: 30, height: 30, borderRadius: UI.radius.xs, backgroundColor: colors.badgeBg, alignItems: 'center', justifyContent: 'center', marginRight: UI.space.sm },
    activeName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
    activeHint: { fontSize: 12, color: colors.textSecondary },
    activeNext: { fontSize: 12, color: gv(isDark ? c.successDark : c.success) },

    todoBox: { marginTop: UI.space.md, backgroundColor: colors.cardBg, borderRadius: UI.radius.md, padding: UI.space.sm, borderWidth: 1, borderColor: colors.border },
    todoTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: UI.space.xs },
    todoItem: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

    fab: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.fabBg,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 6,
    },

    modalMask: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: isDark ? 'rgba(0,0,0,0.50)' : 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
    modalBox: { width: '90%', maxHeight: '85%', backgroundColor: colors.modalBg, borderRadius: UI.radius.md, padding: UI.space.md, borderWidth: 1, borderColor: colors.border },
    modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: UI.space.sm, color: colors.textPrimary },
    formRow: { marginBottom: UI.space.sm },
    formLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: UI.space.xs },
    formInput: { borderWidth: 1, borderColor: colors.border, borderRadius: UI.radius.xs, paddingHorizontal: UI.space.sm, paddingVertical: UI.space.xs, color: colors.textPrimary, backgroundColor: colors.cardBg },
    selectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: UI.space.xs },
    selectItem: { paddingHorizontal: UI.space.sm, paddingVertical: UI.space.xs, borderRadius: UI.radius.xs, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardBg },
    selectItemActive: { backgroundColor: isDark ? gv(c.iconBgDark) : gv(c.primarySoft), borderColor: gv(c.primarySolid) },
    selectText: { fontSize: 12, color: colors.textSecondary },
    selectTextActive: { color: isDark ? '#93C5FD' : '#1D4ED8', fontWeight: '700' },

    checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: UI.space.xs, paddingVertical: UI.space.xs },
    checkboxBox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardBg, alignItems: 'center', justifyContent: 'center' },
    checkboxBoxChecked: { backgroundColor: colors.fabBg, borderColor: colors.fabBg },
    checkbox: { paddingVertical: UI.space.xs },
    checkboxText: { fontSize: 13, color: colors.textSecondary },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: UI.space.sm, marginTop: UI.space.xs },
    btnGhost: { paddingHorizontal: UI.space.md, paddingVertical: UI.space.sm, borderRadius: UI.radius.xs, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardBg },
    btnGhostText: { color: colors.textSecondary },
    btnPrimary: { paddingHorizontal: UI.space.md, paddingVertical: UI.space.sm, borderRadius: UI.radius.xs, backgroundColor: colors.fabBg },
    btnPrimaryText: { color: '#fff', fontWeight: '700' },
  });
  return { ...sheet, colors } as ReturnType<typeof StyleSheet.create> & { colors: ColorPalette };
}

export default HomeScreen;
