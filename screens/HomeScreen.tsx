import React, { useMemo, useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Text } from 'tamagui';
import {
  Bell,
  User,
  Search,
  Plus,
  Check
} from '@tamagui/lucide-icons';
import SectionHeader from './components/SectionHeader';
import SummaryCard from './components/SummaryCard';
import UpcomingCard from './components/UpcomingCard';
import ActiveRow from './components/ActiveRow';
import BarChart from './components/BarChart';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { addSubscription, updateSubscription, removeSubscription } from '../features/subscriptions/slice';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  const styles = createStyles(effectiveScheme);
  const preferredCurrency = useAppSelector(selectPreferredCurrency);

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
        next: s.nextDueISO ? `${d}天内` : '未设置',
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
    next: s.nextDueISO ? `${daysUntil(s.nextDueISO)}天内` : '未设置',
  })), [subs, preferredCurrency]);

  // 新增：支出分析数据（近 6 个月的预计月支出）
  const spendByMonth = useMemo(() => {
    const monthly = subs.reduce((sum, s) => {
      const from = s.currency ?? 'CNY'
      const add = (s.cycle === 'monthly') ? s.price
        : (s.cycle === 'quarterly') ? s.price/3
        : (s.cycle === 'yearly') ? s.price/12
        : 0
      return sum + convertCurrency(add, from as any, preferredCurrency as any)
    }, 0);
    const val = Math.round(monthly);
    return [val, val, val, val, val, val];
  }, [subs, preferredCurrency]);
  // 表单弹窗状态
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    categoryGroup: CategoryGroup;
    categoryId?: string;
    categoryLabel: string;
    price: string;
    cycle: Cycle;
    nextDueISO: string;
    autoRenew: boolean;
    currency: 'CNY'|'USD'|'JPY';
    paymentMethodId?: string;
  }>({ name: '', categoryGroup: '影音娱乐', categoryId: undefined, categoryLabel: '', price: '', cycle: 'monthly', nextDueISO: '', autoRenew: false, currency: 'CNY', paymentMethodId: undefined });
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
        nextDueISO: form.nextDueISO || undefined,
        autoRenew: form.autoRenew,
        currency: form.currency,
        paymentMethodId: form.paymentMethodId,
      };
      dispatch(addSubscription(payload));
    }
    closeModal();
    setForm({ name: '', categoryGroup: '影音娱乐', categoryId: undefined, categoryLabel: '', price: '', cycle: 'monthly', nextDueISO: '', autoRenew: false, currency: 'CNY', paymentMethodId: undefined });
  };

  return (
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

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 订阅概览 */}
        <SectionHeader title={t('home.overview')} actionText={t('home.viewAll')} styles={styles} />
        <View style={styles.summaryGrid}>
          <SummaryCard title={t('home.totalSubs')} value={summaryData.totalSubs} sub="" styles={styles} />
          <SummaryCard title={t('home.monthlySpend')} value={CurrencyService.format(summaryData.monthlySpend, preferredCurrency as any)} sub={``} styles={styles} />
          <SummaryCard title={t('home.upcoming')} value={summaryData.upcomingBills} sub={t('home.upcomingIn7Days')} styles={styles} />
          <SummaryCard title={t('home.yearlySpend')} value={CurrencyService.format(summaryData.yearlySpend, preferredCurrency as any)} sub={``} styles={styles} />
        </View>

        {/* 即将到期（仅在7天内有到期项时显示） */}
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

        {/* 支出分析已移至统计页 */}

        {/* 活跃订阅 */}
        <SectionHeader title={t('home.active')} styles={styles} />
        <View style={{ gap: 8 }}>
          {activeSubs.map((s, idx) => (
            <ActiveRow key={s.id} item={s} index={idx} onLongPress={() => openActionFor(s.id)} styles={styles} />
          ))}
        </View>


        <View style={{ height: 80 }} />
      </ScrollView>

      {/* 悬浮添加按钮 */}
      <TouchableOpacity style={styles.fab} onPress={openModal}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      {/* 操作弹窗：编辑或删除 */}
      {actionOpen && (
        <View style={styles.modalMask}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>选择操作</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnGhost} onPress={() => { setActionOpen(false); setSelectedSub(null); }}>
                <Text style={styles.btnGhostText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={startEditSelected}>
                <Text style={styles.btnPrimaryText}>编辑</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: '#EF4444' }]} onPress={deleteSelected}>
                <Text style={styles.btnPrimaryText}>删除</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* 添加/编辑订阅弹窗（简易） */}
      {modalOpen && (
        <View style={styles.modalMask}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{editMode ? '编辑订阅' : '添加新订阅'}</Text>
        <View style={styles.formRow}><Text style={styles.formLabel}>订阅名称</Text><TextInput style={styles.formInput} value={form.name} onChangeText={(t)=>setForm(v=>({...v,name:t}))} placeholder="例如：网易云音乐VIP" placeholderTextColor={styles.colors.muted} /></View>
            <View style={styles.formRow}><Text style={styles.formLabel}>订阅类型</Text>
              <View style={styles.selectRow}>
                {categoryGroupOptions.map((opt)=> (
                  <TouchableOpacity key={opt} style={[styles.selectItem, form.categoryGroup===opt?styles.selectItemActive:null]} onPress={()=>setForm(v=>({...v, categoryGroup: opt, categoryId: undefined, categoryLabel: ''}))}>
                    <Text style={[styles.selectText, form.categoryGroup===opt?styles.selectTextActive:null]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {form.categoryGroup!=='其他' && (
                <View style={{ marginTop: 8 }}>
                  <Text style={styles.formLabel}>分类标签</Text>
                  <View style={styles.selectRow}>
                    {getCategoriesByGroup(form.categoryGroup).map((c)=> (
                      <TouchableOpacity key={c.id} style={[styles.selectItem, form.categoryId===c.id?styles.selectItemActive:null]} onPress={()=>setForm(v=>({...v, categoryId: c.id, categoryLabel: ''}))}>
                        <Text style={[styles.selectText, form.categoryId===c.id?styles.selectTextActive:null]}>{c.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
              {form.categoryGroup==='其他' ? (
                <View style={{ marginTop: 8 }}>
          <TextInput style={styles.formInput} value={form.categoryLabel} onChangeText={(t)=>setForm(v=>({...v, categoryLabel: t}))} placeholder="自定义类型名称（例如：视频会员/健身会员等）" placeholderTextColor={styles.colors.muted} />
                  <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>提示：保存时底层分类依然归为“其他”</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>价格</Text>
              <TextInput
                style={styles.formInput}
                keyboardType="numeric"
                value={form.price}
                onChangeText={(t)=>setForm(v=>({...v,price:t}))}
                placeholder={pricePlaceholder}
                placeholderTextColor={styles.colors.muted}
              />
              <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                按所选币种输入原价（{form.currency}）。当前偏好币种为 {preferredCurrency}，将自动换算展示。
              </Text>
              {pricePreview ? (
                <Text style={{ fontSize: 12, color: '#374151', marginTop: 4 }}>
                  预览：{pricePreview}
                </Text>
              ) : null}
            </View>
            <View style={styles.formRow}><Text style={styles.formLabel}>货币</Text>
              <View style={styles.selectRow}>
                {(['CNY','USD','JPY'] as const).map((code)=> (
                  <TouchableOpacity key={code} style={[styles.selectItem, form.currency===code?styles.selectItemActive:null]} onPress={()=>setForm(v=>({...v, currency: code}))}>
                    <Text style={[styles.selectText, form.currency===code?styles.selectTextActive:null]}>
                      {code==='CNY'?'人民币（¥）': code==='USD'?'美元（$）':'日元（¥）'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.formRow}><Text style={styles.formLabel}>支付方式</Text>
              <View style={styles.selectRow}>
                {paymentMethods.length === 0 ? (
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>请先到设置页添加支付方式</Text>
                ) : paymentMethods.map((m)=> (
                  <TouchableOpacity key={m.id} style={[styles.selectItem, form.paymentMethodId===m.id?styles.selectItemActive:null]} onPress={()=>setForm(v=>({...v, paymentMethodId: m.id}))}>
                    <Text style={[styles.selectText, form.paymentMethodId===m.id?styles.selectTextActive:null]}>
                      {m.label ?? `${m.type==='credit_card'?'信用卡': m.type==='debit_card'?'借记卡': m.type==='bank_account'?'银行账户': m.type==='alipay'?'支付宝': m.type==='wechat'?'微信支付':'电子钱包'}${m.last4?` ****${m.last4}`:''}`}
                  </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.formRow}><Text style={styles.formLabel}>计费周期</Text>
              <View style={styles.selectRow}>
                {(Object.entries(cycleLabelMap) as [Cycle, string][]).map(([key,label])=> (
                  <TouchableOpacity key={key} style={[styles.selectItem, form.cycle===key?styles.selectItemActive:null]} onPress={()=>setForm(v=>({...v,cycle:key}))}>
                    <Text style={[styles.selectText, form.cycle===key?styles.selectTextActive:null]}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.formRow}><Text style={styles.formLabel}>到期日期</Text>
              {Platform.OS === 'web' ? (
                <>
                  <input
                    type="date"
                    value={form.nextDueISO || `${dateParts.year}-${pad2(dateParts.month)}-${pad2(dateParts.day)}`}
                    onChange={(e)=>{
                      const val = e.target.value;
                      setForm(v=>({...v, nextDueISO: val }));
                      if(val){
                        const [y,m,d] = val.split('-').map(Number);
                        setDateParts({ year: y, month: m, day: d });
                      }
                    }}
                    style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 8, padding: '8px 10px' }}
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                    <TouchableOpacity onPress={()=>{ setForm(v=>({...v, nextDueISO: ''})); }}>
                      <Text style={{ color: '#0ea5e9', fontSize: 12 }}>清除</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{ const t=new Date(); const iso=`${t.getFullYear()}-${pad2(t.getMonth()+1)}-${pad2(t.getDate())}`; setForm(v=>({...v, nextDueISO: iso})); setDateParts({ year: t.getFullYear(), month: t.getMonth()+1, day: t.getDate() }); }}>
                      <Text style={{ color: '#0ea5e9', fontSize: 12 }}>今天</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <TouchableOpacity style={[styles.selectItem, styles.selectItemActive]} onPress={() => setShowPicker(true)}>
                    <Text style={[styles.selectText, styles.selectTextActive]}>{form.nextDueISO || `${dateParts.year}-${pad2(dateParts.month)}-${pad2(dateParts.day)}`}</Text>
                  </TouchableOpacity>
                  {showPicker && (
                    <DateTimePicker
                      value={new Date(dateParts.year, dateParts.month - 1, dateParts.day)}
                      mode="date"
                      display="calendar"
                      onChange={onAndroidDateChange}
                    />
                  )}
                </>
              )}
            </View>
            <View style={styles.formRow}>
              <TouchableOpacity onPress={()=>setForm(v=>({...v,autoRenew:!v.autoRenew}))} style={styles.checkboxRow}>
                <View style={[styles.checkboxBox, form.autoRenew?styles.checkboxBoxChecked:null]}>
                  {form.autoRenew ? <Check size={14} color="#fff" /> : null}
                </View>
                <Text style={styles.checkboxText}>自动续费</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnGhost} onPress={closeModal}><Text style={styles.btnGhostText}>取消</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={submitForm}><Text style={styles.btnPrimaryText}>{editMode ? '保存' : '添加'}</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

// 样式补充
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  logoBox: {
    backgroundColor: '#E6F2FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  logoText: { fontSize: 14, fontWeight: '700', color: '#0ea5e9' },
  iconBtn: {
    backgroundColor: '#EEF2F7',
    padding: 8,
    borderRadius: 10,
  },
  searchBox: {
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: { flex: 1, fontSize: 15, color: '#111827' },
  scroll: { paddingHorizontal: 16, paddingBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  link: { color: '#0ea5e9', fontSize: 13 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  summaryCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryTitle: { fontSize: 13, color: '#6b7280', marginBottom: 6 },
  summaryValue: { fontSize: 20, fontWeight: '700', color: '#111827' },
  summarySub: { fontSize: 12, color: '#10b981', marginTop: 4 },

  upcomingCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  upcomingIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E6F2FF' },
  upcomingName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  upcomingCycle: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  upcomingMetaRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  badgeInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F3F4F6', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8 },
  badgeText: { fontSize: 12, color: '#374151' },

  chartCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  chartAxis: { fontSize: 12, color: '#6b7280', marginTop: 8 },

  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeIconBox: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  activeName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  activeHint: { fontSize: 12, color: '#6b7280' },
  activeNext: { fontSize: 12, color: '#10b981' },

  todoBox: { marginTop: 18, backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  todoTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 6 },
  todoItem: { fontSize: 12, color: '#374151', marginTop: 2 },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },

  // 弹窗样式
  modalMask: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  modalBox: { width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  formRow: { marginBottom: 10 },
  formLabel: { fontSize: 13, color: '#6b7280', marginBottom: 6 },
  formInput: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  selectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  selectItem: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  selectItemActive: { backgroundColor: '#E6F2FF', borderColor: '#60A5FA' },
  selectText: { fontSize: 12, color: '#374151' },
  selectTextActive: { color: '#1D4ED8', fontWeight: '700' },
  // 新增复选框样式
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  checkboxBox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  checkboxBoxChecked: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  checkbox: { paddingVertical: 8 },
  checkboxText: { fontSize: 13, color: '#374151' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 6 },
  btnGhost: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  btnGhostText: { color: '#374151' },
  btnPrimary: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, backgroundColor: '#2563EB' },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },
});

// 替换为按主题生成样式（深色/浅色）
function createStyles(scheme){
  const isDark = scheme === 'dark';
  const colors = {
    pageBg: isDark ? '#0F1416' : '#F8FAFC',
    cardBg: isDark ? '#1C1F24' : '#FFFFFF',
    border: isDark ? '#2A2E33' : '#E5E7EB',
    textPrimary: isDark ? '#E5E7EB' : '#111827',
    textSecondary: isDark ? '#A7B0B8' : '#6b7280',
    muted: isDark ? '#78828A' : '#9CA3AF',
    accent: isDark ? '#4DB6FF' : '#0ea5e9',
    badgeBg: isDark ? '#28313A' : '#F3F4F6',
    iconBg: isDark ? '#22303C' : '#E6F2FF',
    fabBg: isDark ? '#2563EB' : '#2563EB',
    modalBg: isDark ? '#1C1F24' : '#FFFFFF',
  };
  const sheet = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.pageBg },
    topbar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    logoBox: {
      backgroundColor: isDark ? '#163957' : '#E6F2FF',
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 6,
    },
    logoText: { fontSize: 14, fontWeight: '700', color: colors.accent },
    iconBtn: {
      backgroundColor: isDark ? '#1F2830' : '#EEF2F7',
      padding: 8,
      borderRadius: 10,
    },
    searchBox: {
      marginHorizontal: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: { flex: 1, fontSize: 15, color: colors.textPrimary },
    scroll: { paddingHorizontal: 16, paddingBottom: 24 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
    link: { color: colors.accent, fontSize: 13 },
    summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    summaryCard: {
      width: '47%',
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    summaryTitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
    summaryValue: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
    summarySub: { fontSize: 12, color: isDark ? '#34D399' : '#10b981', marginTop: 4 },

    upcomingCard: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    upcomingIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.iconBg },
    upcomingName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
    upcomingCycle: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    upcomingMetaRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
    badgeInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.badgeBg, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8 },
    badgeText: { fontSize: 12, color: colors.textSecondary },

    chartCard: { backgroundColor: colors.cardBg, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
    chartAxis: { fontSize: 12, color: colors.textSecondary, marginTop: 8 },

    activeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activeIconBox: { width: 30, height: 30, borderRadius: 8, backgroundColor: colors.badgeBg, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    activeName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
    activeHint: { fontSize: 12, color: colors.textSecondary },
    activeNext: { fontSize: 12, color: isDark ? '#34D399' : '#10b981' },

    todoBox: { marginTop: 18, backgroundColor: colors.cardBg, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border },
    todoTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 6 },
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
    modalBox: { width: '90%', backgroundColor: colors.modalBg, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
    modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: colors.textPrimary },
    formRow: { marginBottom: 10 },
    formLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
    formInput: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, color: colors.textPrimary, backgroundColor: colors.cardBg },
    selectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    selectItem: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardBg },
    selectItemActive: { backgroundColor: isDark ? '#163957' : '#E6F2FF', borderColor: isDark ? '#2B78C2' : '#60A5FA' },
    selectText: { fontSize: 12, color: colors.textSecondary },
    selectTextActive: { color: isDark ? '#93C5FD' : '#1D4ED8', fontWeight: '700' },

    checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
    checkboxBox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardBg, alignItems: 'center', justifyContent: 'center' },
    checkboxBoxChecked: { backgroundColor: colors.fabBg, borderColor: colors.fabBg },
    checkbox: { paddingVertical: 8 },
    checkboxText: { fontSize: 13, color: colors.textSecondary },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 6 },
    btnGhost: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardBg },
    btnGhostText: { color: colors.textSecondary },
    btnPrimary: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, backgroundColor: colors.fabBg },
    btnPrimaryText: { color: '#fff', fontWeight: '700' },
  });
  return { ...sheet, colors };
}

export default HomeScreen;