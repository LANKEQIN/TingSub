import React, { useMemo } from 'react';
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

// 临时硬编码数据（TODO: 替换为真实数据源，并接入状态管理/数据库）
const summaryData = {
  totalSubs: 8,
  monthlySpend: 128,
  upcomingBills: 2,
  yearlySpend: 1536,
  deltas: {
    monthlySpend: '+30',
    yearlySpend: '+12.5%'
  }
};

const upcomingList = [
  { id: '1', name: '网易云音乐VIP', cycle: '个人会员 · 月付', next: '3天内', price: '¥15/月' },
  { id: '2', name: 'B站大会员', cycle: '年度会员 · 年付', next: '7天内', price: '¥148/年' },
];

const spendByMonth = [
  90, 160, 120, 140, 115, 130, 100, 135, 125, 150, 110,
];

const activeSubs = [
  { id: 'm365', name: 'Microsoft 365', price: '¥498/年', next: '6个月后到期' },
  { id: 'am', name: 'Apple Music', price: '¥10/月', next: '1个月后到期' },
  { id: 'ytp', name: 'YouTube Premium', price: '¥30/月', next: '2个月后到期' },
  { id: 'dn', name: 'Discord Nitro', price: '¥30/月', next: '3个月后到期' },
];

const SectionHeader = ({ title, actionText }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {actionText ? (
      <TouchableOpacity>
        <Text style={styles.link}>{actionText}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const SummaryCard = ({ title, value, sub }) => (
  <View style={styles.summaryCard}>
    <Text style={styles.summaryTitle}>{title}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
    {sub ? <Text style={styles.summarySub}>{sub}</Text> : null}
  </View>
);

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

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
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
          <SummaryCard title="总订阅数" value={summaryData.totalSubs} sub="较上月 +2" />
          <SummaryCard title="本月支出" value={`¥${summaryData.monthlySpend}`} sub={`较上月 ${summaryData.deltas.monthlySpend}`} />
          <SummaryCard title="即将到期" value={summaryData.upcomingBills} sub="3天内" />
          <SummaryCard title="年度支出" value={`¥${summaryData.yearlySpend}`} sub={`同比 ${summaryData.deltas.yearlySpend}`} />
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
      <TouchableOpacity style={styles.fab}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

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
});

export default HomeScreen;