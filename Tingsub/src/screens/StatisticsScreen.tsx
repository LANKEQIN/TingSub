import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useTheme, Appbar, SegmentedButtons, Divider, Menu } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StatCard from '../components/statistics/StatCard';
import ExpenseChart, { ExpenseDataItem } from '../components/statistics/ExpenseChart';
import TrendChart, { TrendDataPoint } from '../components/statistics/TrendChart';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useCategoryStore } from '../store/categoryStore';
import { CATEGORY_COLORS, NEUTRAL_COLORS } from '../constants/theme';

interface StatisticsScreenProps {
  navigation: any;
}

const StatisticsScreen: React.FC<StatisticsScreenProps> = () => {
  const theme = useTheme() as any;
  const { subscriptions } = useSubscriptionStore();
  const { categories } = useCategoryStore();

  const [timePeriod, setTimePeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'horizontal'>('pie');
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    loadStatistics();
  }, [timePeriod]);

  const loadStatistics = async () => {
    try {
      // 计算统计数据
      const activeSubscriptions = subscriptions.filter((sub: any) => sub.status === 'active');
      const totalExpense = activeSubscriptions.reduce(
        (sum: number, sub: any) => sum + sub.price,
        0
      );
      const subscriptionCount = activeSubscriptions.length;

      // 按分类统计支出
      const categoryStats: Record<
        string,
        { expense: number; count: number; name: string; color: string }
      > = {};
      activeSubscriptions.forEach((sub: any) => {
        const category = categories.find((cat: any) => cat.id === sub.categoryId);
        if (category) {
          if (!categoryStats[category.id]) {
            categoryStats[category.id] = {
              expense: 0,
              count: 0,
              name: category.name,
              color: category.color || CATEGORY_COLORS.other,
            };
          }
          categoryStats[category.id].expense += sub.price;
          categoryStats[category.id].count += 1;
        }
      });

      // 转换为支出图表数据
      const expenseData: ExpenseDataItem[] = Object.values(categoryStats).map((stat) => ({
        categoryId: stat.name,
        categoryName: stat.name,
        expense: stat.expense,
        count: stat.count,
        color: stat.color,
      }));

      // 生成趋势数据
      const trendData: TrendDataPoint[] = generateTrendData(timePeriod, activeSubscriptions);

      setStatsData({
        totalExpense,
        subscriptionCount,
        expenseData,
        trendData,
      });
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
  };

  const generateTrendData = (period: string, activeSubscriptions: any[]): TrendDataPoint[] => {
    const now = new Date();
    const data: TrendDataPoint[] = [];

    if (period === 'month') {
      // 按天统计本月数据
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(now.getFullYear(), now.getMonth(), i);
        const dayExpense = activeSubscriptions.reduce((sum: number, sub: any) => {
          const billingDate = new Date(sub.billingDate);
          if (billingDate.getDate() === i) {
            return sum + sub.price;
          }
          return sum;
        }, 0);

        data.push({
          date,
          label: `${i}日`,
          expense: dayExpense,
          count: 0,
        });
      }
    } else if (period === 'quarter') {
      // 按月统计本季度数据
      const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
      for (let i = 0; i < 3; i++) {
        const month = quarterStartMonth + i;
        const date = new Date(now.getFullYear(), month, 1);
        const monthExpense = activeSubscriptions.reduce((sum: number, sub: any) => {
          const billingDate = new Date(sub.billingDate);
          if (billingDate.getMonth() === month) {
            return sum + sub.price;
          }
          return sum;
        }, 0);

        data.push({
          date,
          label: `${month + 1}月`,
          expense: monthExpense,
          count: 0,
        });
      }
    } else if (period === 'year') {
      // 按月统计本年数据
      for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), i, 1);
        const monthExpense = activeSubscriptions.reduce((sum: number, sub: any) => {
          const billingDate = new Date(sub.billingDate);
          if (billingDate.getMonth() === i) {
            return sum + sub.price;
          }
          return sum;
        }, 0);

        data.push({
          date,
          label: `${i + 1}月`,
          expense: monthExpense,
          count: 0,
        });
      }
    }

    return data;
  };

  const [statsData, setStatsData] = useState<{
    totalExpense: number;
    subscriptionCount: number;
    expenseData: ExpenseDataItem[];
    trendData: TrendDataPoint[];
  }>({
    totalExpense: 0,
    subscriptionCount: 0,
    expenseData: [],
    trendData: [],
  });

  const handleExport = () => {
    console.log('导出统计数据');
  };

  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value as 'month' | 'quarter' | 'year');
  };

  const handleChartTypeChange = (type: 'pie' | 'bar' | 'horizontal') => {
    setChartType(type);
    setMenuVisible(false);
  };

  const getChartTypeLabel = () => {
    switch (chartType) {
      case 'pie':
        return '饼图';
      case 'bar':
        return '柱状图';
      case 'horizontal':
        return '水平柱状图';
      default:
        return '饼图';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="统计分析" />
        <Appbar.Action icon="download" onPress={handleExport} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        {/* 时间周期选择 */}
        <View style={styles.periodSelector}>
          <SegmentedButtons
            value={timePeriod}
            onValueChange={handleTimePeriodChange}
            buttons={[
              { value: 'month', label: '本月' },
              { value: 'quarter', label: '本季度' },
              { value: 'year', label: '本年' },
            ]}
            style={styles.segmentedButtons}
          />
        </View>

        {/* 统计卡片 */}
        <View style={styles.statsContainer}>
          <StatCard
            title="总支出"
            value={statsData.totalExpense}
            unit="元"
            icon={<MaterialCommunityIcons name="wallet" size={24} color={theme.colors.primary} />}
            style={styles.statCard}
          />
          <StatCard
            title="订阅数量"
            value={statsData.subscriptionCount}
            unit="个"
            icon={
              <MaterialCommunityIcons
                name="playlist-check"
                size={24}
                color={theme.colors.primary}
              />
            }
            style={styles.statCard}
          />
        </View>

        {/* 支出分类 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: NEUTRAL_COLORS.text.primary }]}>
              支出分类
            </Text>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                  <View style={styles.chartTypeButton}>
                    <Text style={[styles.chartTypeText, { color: NEUTRAL_COLORS.text.secondary }]}>
                      {getChartTypeLabel()}
                    </Text>
                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={20}
                      color={NEUTRAL_COLORS.text.secondary}
                    />
                  </View>
                </TouchableOpacity>
              }
            >
              <Menu.Item
                onPress={() => handleChartTypeChange('pie')}
                title="饼图"
                leadingIcon="chart-pie"
              />
              <Menu.Item
                onPress={() => handleChartTypeChange('bar')}
                title="柱状图"
                leadingIcon="chart-bar"
              />
              <Menu.Item
                onPress={() => handleChartTypeChange('horizontal')}
                title="水平柱状图"
                leadingIcon="chart-bar-stacked"
              />
            </Menu>
          </View>

          <View style={styles.chartContainer}>
            {statsData.expenseData.length > 0 ? (
              <ExpenseChart
                data={statsData.expenseData}
                totalExpense={statsData.totalExpense}
                chartType={chartType}
                showLegend={true}
                showPercentage={true}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                  name="chart-box-outline"
                  size={48}
                  color={NEUTRAL_COLORS.text.tertiary}
                />
                <Text style={[styles.emptyText, { color: NEUTRAL_COLORS.text.tertiary }]}>
                  暂无数据
                </Text>
              </View>
            )}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* 支出趋势 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: NEUTRAL_COLORS.text.primary }]}>
            支出趋势
          </Text>
          <View style={styles.chartContainer}>
            {statsData.trendData.length > 0 ? (
              <TrendChart
                data={statsData.trendData}
                chartType="line"
                showGrid={true}
                showDataPoints={true}
                showValues={false}
                height={250}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                  name="chart-line-variant"
                  size={48}
                  color={NEUTRAL_COLORS.text.tertiary}
                />
                <Text style={[styles.emptyText, { color: NEUTRAL_COLORS.text.tertiary }]}>
                  暂无数据
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  chartTypeButton: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chartTypeText: {
    fontSize: 14,
    marginRight: 4,
  },
  container: {
    flex: 1,
  },
  divider: {
    marginVertical: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
  },
  periodSelector: {
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  segmentedButtons: {
    width: '100%',
  },
  statCard: {
    flex: 1,
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
});

export default StatisticsScreen;
