import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Text } from 'tamagui';
import {
  Bell,
  User,
  Search,
  Plus,
  CalendarDays,
  CreditCard,
  BarChart3,
  Music,
  Video,
  Apple as AppleIcon,
} from '@tamagui/lucide-icons';
import Svg, { Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { addSubscription } from '../store';

// 计算型工具
const cycleLabelMap = { monthly: '月付', quarterly: '季付', yearly: '年付', lifetime: '终身', other: '其他' };
function formatPrice(price, cycle){
  if(cycle==='yearly') return `¥${price}/年`;
  if(cycle==='quarterly') return `¥${price}/季`;
  if(cycle==='lifetime') return `¥${price}/终身`;
  if(cycle==='other') return `¥${price}`;
  return `¥${price}/月`;
}
function daysUntil(dateISO){
  if(!dateISO) return null;
  const d = new Date(dateISO);
  const diff = Math.ceil((d.getTime() - Date.now())/86400000);
  return diff;
}

const UpcomingCard = ({ item }) => (
  <View style={styles.upcomingCard}>
    <View style={styles.upcomingIconBox}>
      <Music size={20} color="#0ea5e9" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.upcomingName}>{item.name}</Text>
      <Text style={styles.upcomingCycle}>{item.cycle}</Text>
      <View style={styles.upcomingMetaRow}>
        <View style={styles.badgeInfo}>
          <CalendarDays size={14} color="#6b7280" />
          <Text style={styles.badgeText}>{item.next}</Text>
        </View>
        <View style={styles.badgeInfo}>
          <CreditCard size={14} color="#6b7280" />
          <Text style={styles.badgeText}>{item.price}</Text>
        </View>
      </View>
    </View>
  </View>
);

const BarChart = ({ data, width = 300, height = 180, barColor = '#4f46e5' }) => {
  const maxVal = useMemo(() => Math.max(...data, 1), [data]);
  const barWidth = Math.floor((width - 20) / data.length);
  return (
    <Svg width={width} height={height}>
      {data.map((v, i) => {
        const h = Math.round((v / maxVal) * (height - 20));
        return (
          <Rect
            key={i}
            x={10 + i * barWidth}
            y={height - h - 10}
            width={barWidth - 8}
            height={h}
            rx={6}
            fill={barColor}
          />
        );
      })}
    </Svg>
  );
};

const SectionHeader = ({ title, actionText, onPress }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {actionText ? (
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.link}>{actionText}</Text>
      </TouchableOpacity>
    ) : (
      <View />
    )}
  </View>
);

const ActiveRow = ({ item, index }) => (
  <View style={styles.activeRow}>
    <View style={styles.activeIconBox}>
      {item.id === 'am' ? (
        <AppleIcon size={18} color="#111827" />
      ) : item.id === 'ytp' ? (
        <Video size={18} color="#111827" />
      ) : (
        <BarChart3 size={18} color="#111827" />
      )}
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.activeName}>{item.name}</Text>
      <Text style={styles.activeHint}>{item.price}</Text>
    </View>
    <Text style={styles.activeNext}>{item.next}</Text>
  </View>
);

const SummaryCard = ({ title, value, sub }) => (
  <View style={styles.summaryCard}>
    <Text style={styles.summaryTitle}>{title}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
    {sub ? <Text style={styles.summarySub}>{sub}</Text> : null}
  </View>
);

// ... existing code ...
const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const subs = useSelector((state) => state.subscriptions.list);

  const summaryData = useMemo(() => {
    const totalSubs = subs.length;
    const monthlySpend = subs.filter(s=>s.cycle==='monthly').reduce((sum,s)=>sum+s.price,0);
    const yearlySpend = subs.filter(s=>s.cycle==='yearly').reduce((sum,s)=>sum+s.price,0) + monthlySpend*12 + subs.filter(s=>s.cycle==='quarterly').reduce((sum,s)=>sum+s.price*4,0);
    const upcomingBills = subs.filter(s=>{
      const d = daysUntil(s.nextDueISO);
      return d!==null && d<=7;
    }).length;
    return { totalSubs, monthlySpend, yearlySpend, upcomingBills, deltas: { monthlySpend: '+0', yearlySpend: '+0' } };
  }, [subs]);

  const upcomingList = useMemo(() => subs
    .map(s=>({
      id: s.id,
      name: s.name,
      cycle: `${s.category ?? '订阅'} · ${cycleLabelMap[s.cycle]}`,
      next: s.nextDueISO ? `${daysUntil(s.nextDueISO)}天内` : '未设置',
      price: formatPrice(s.price, s.cycle),
    }))
    .sort((a,b)=>{
      const ad = parseInt(a.next)||9999, bd = parseInt(b.next)||9999; return ad-bd;
    })
  , [subs]);

  // 新增：活跃订阅列表（用于 ActiveRow）
  const activeSubs = useMemo(() => subs.map(s => ({
    id: s.id,
    name: s.name,
    price: formatPrice(s.price, s.cycle),
    next: s.nextDueISO ? `${daysUntil(s.nextDueISO)}天内` : '未设置',
  })), [subs]);

  // 新增：支出分析数据（近 6 个月的预计月支出）
  const spendByMonth = useMemo(() => {
    const monthly = subs.reduce((sum, s) => {
      if (s.cycle === 'monthly') return sum + s.price;
      if (s.cycle === 'quarterly') return sum + s.price / 3;
      if (s.cycle === 'yearly') return sum + s.price / 12;
      return sum; // lifetime/other 不计入月支出
    }, 0);
    const val = Math.round(monthly);
    return [val, val, val, val, val, val];
  }, [subs]);
  // 表单弹窗状态
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: '视频会员', price: '', cycle: 'monthly', nextDueISO: '', autoRenew: false });

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const submitForm = () => {
    if(!form.name || !form.price) return;
    const payload = {
      id: `${Date.now()}`,
      name: form.name,
      category: form.category,
      price: Number(form.price),
      cycle: form.cycle,
      nextDueISO: form.nextDueISO || undefined,
      autoRenew: form.autoRenew,
    };
    dispatch(addSubscription(payload));
    closeModal();
    setForm({ name: '', category: '视频会员', price: '', cycle: 'monthly', nextDueISO: '', autoRenew: false });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      {/* 顶部导航 */}
      <View style={styles.topbar}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>订阅</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity style={styles.iconBtn}><Bell size={20} color="#111827" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><User size={20} color="#111827" /></TouchableOpacity>
        </View>
      </View>

      {/* 搜索框 */}
      <View style={styles.searchBox}>
        <Search size={18} color="#6b7280" />
        <TextInput style={styles.searchInput} placeholder="搜索订阅…" placeholderTextColor="#9CA3AF" />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 订阅概览 */}
        <SectionHeader title="订阅概览" actionText="查看全部" />
        <View style={styles.summaryGrid}>
          <SummaryCard title="总订阅数" value={summaryData.totalSubs} sub="" />
          <SummaryCard title="本月支出" value={`¥${summaryData.monthlySpend}`} sub={``} />
          <SummaryCard title="即将到期" value={summaryData.upcomingBills} sub="7天内" />
          <SummaryCard title="年度支出" value={`¥${summaryData.yearlySpend}`} sub={``} />
        </View>

        {/* 即将到期 */}
        <SectionHeader title="即将到期" actionText="更多" />
        <View style={{ gap: 12 }}>
          {upcomingList.map((u) => (
            <UpcomingCard key={u.id} item={u} />
          ))}
        </View>

        {/* 支出分析 */}
        <SectionHeader title="支出分析" />
        <View style={styles.chartCard}>
          <BarChart data={spendByMonth} width={330} height={180} />
          <Text style={styles.chartAxis}>1月 3月 5月 7月 9月 11月</Text>
        </View>

        {/* 活跃订阅 */}
        <SectionHeader title="活跃订阅" />
        <View style={{ gap: 8 }}>
          {activeSubs.map((s, idx) => (
            <ActiveRow key={s.id} item={s} index={idx} />
          ))}
        </View>

        {/* TODO 提示 */}
        <View style={styles.todoBox}>
          <Text style={styles.todoTitle}>后续待办</Text>
          <Text style={styles.todoItem}>• 接入真实数据源（本地数据库/云同步）</Text>
          <Text style={styles.todoItem}>• 新增/编辑订阅表单与校验</Text>
          <Text style={styles.todoItem}>• 支出统计图表组件抽离与交互</Text>
          <Text style={styles.todoItem}>• 通知与到期提醒设置</Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* 悬浮添加按钮 */}
      <TouchableOpacity style={styles.fab} onPress={openModal}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      {/* 添加订阅弹窗（简易） */}
      {modalOpen && (
        <View style={styles.modalMask}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>添加新订阅</Text>
            <View style={styles.formRow}><Text style={styles.formLabel}>订阅名称</Text><TextInput style={styles.formInput} value={form.name} onChangeText={(t)=>setForm(v=>({...v,name:t}))} placeholder="例如：网易云音乐VIP" /></View>
            <View style={styles.formRow}><Text style={styles.formLabel}>订阅类型</Text><TextInput style={styles.formInput} value={form.category} onChangeText={(t)=>setForm(v=>({...v,category:t}))} placeholder="如：视频会员" /></View>
            <View style={styles.formRow}><Text style={styles.formLabel}>价格</Text><TextInput style={styles.formInput} keyboardType="numeric" value={form.price} onChangeText={(t)=>setForm(v=>({...v,price:t}))} placeholder="例如：15" /></View>
            <View style={styles.formRow}><Text style={styles.formLabel}>计费周期</Text>
              <View style={styles.selectRow}>
                {Object.entries(cycleLabelMap).map(([key,label])=> (
                  <TouchableOpacity key={key} style={[styles.selectItem, form.cycle===key?styles.selectItemActive:null]} onPress={()=>setForm(v=>({...v,cycle:key}))}>
                    <Text style={[styles.selectText, form.cycle===key?styles.selectTextActive:null]}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.formRow}><Text style={styles.formLabel}>到期日期</Text><TextInput style={styles.formInput} value={form.nextDueISO} onChangeText={(t)=>setForm(v=>({...v,nextDueISO:t}))} placeholder="YYYY-MM-DD" /></View>
            <View style={styles.formRow}><TouchableOpacity onPress={()=>setForm(v=>({...v,autoRenew:!v.autoRenew}))} style={styles.checkbox}><Text style={styles.checkboxText}>{form.autoRenew? '✓ 自动续费' : '自动续费'}</Text></TouchableOpacity></View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnGhost} onPress={closeModal}><Text style={styles.btnGhostText}>取消</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={submitForm}><Text style={styles.btnPrimaryText}>添加</Text></TouchableOpacity>
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
  checkbox: { paddingVertical: 8 },
  checkboxText: { fontSize: 13, color: '#374151' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 6 },
  btnGhost: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  btnGhostText: { color: '#374151' },
  btnPrimary: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, backgroundColor: '#2563EB' },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },
});

export default HomeScreen;