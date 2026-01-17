import React from 'react';
import { View, StyleSheet, ViewStyle, ScrollView, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SPACING, TYPOGRAPHY, CATEGORY_COLORS, NEUTRAL_COLORS } from '../../constants/theme';

// 支出数据项接口
export interface ExpenseDataItem {
  // 分类ID
  categoryId: string;
  // 分类名称
  categoryName: string;
  // 支出金额
  expense: number;
  // 订阅数量
  count: number;
  // 分类颜色
  color?: string;
}

// 支出图表Props接口
export interface ExpenseChartProps {
  // 支出数据
  data: ExpenseDataItem[];
  // 总支出
  totalExpense: number;
  // 图表类型
  chartType?: 'pie' | 'bar' | 'horizontal';
  // 自定义样式
  style?: ViewStyle;
  // 是否显示图例
  showLegend?: boolean;
  // 是否显示百分比
  showPercentage?: boolean;
  // 图表高度
  height?: number;
  // 点击事件
  onPress?: (item: ExpenseDataItem) => void;
}

// 支出图表组件
const ExpenseChart: React.FC<ExpenseChartProps> = ({
  data,
  totalExpense,
  chartType = 'pie',
  style,
  showLegend = true,
  showPercentage = true,
  height = 300,
}) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;

  // 获取分类颜色
  const getCategoryColor = (index: number): string => {
    const categoryColors = Object.values(CATEGORY_COLORS);
    return categoryColors[index % categoryColors.length];
  };

  // 计算百分比
  const calculatePercentage = (expense: number): string => {
    if (totalExpense === 0) return '0%';
    const percentage = (expense / totalExpense) * 100;
    return percentage.toFixed(1) + '%';
  };

  // 渲染饼图
  const renderPieChart = () => {
    const size = Math.min(screenWidth - SPACING.md * 4, 200);
    let startAngle = 0;

    return (
      <View style={[styles.pieChartContainer, { width: size, height: size }]}>
        {data.map((item, index) => {
          if (item.expense === 0) return null;

          const percentage = (item.expense / totalExpense) * 100;
          const angle = (percentage / 100) * 360;
          const endAngle = startAngle + angle;

          const color = item.color || getCategoryColor(index);

          // 使用简单的扇形表示
          const sliceStyle = {
            position: 'absolute' as const,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            transform: [
              { rotate: `${startAngle}deg` },
            ],
            overflow: 'hidden' as const,
          };

          startAngle = endAngle;

          return (
            <View key={item.categoryId} style={styles.pieSlice}>
              <View style={sliceStyle} />
            </View>
          );
        })}
        {/* 中心圆，形成环形图效果 */}
        <View
          style={[
            styles.pieCenter,
            {
              width: size * 0.6,
              height: size * 0.6,
              borderRadius: size * 0.3,
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          <Text style={[styles.totalExpense, { color: NEUTRAL_COLORS.text.primary }]}>
            ¥{totalExpense.toLocaleString()}
          </Text>
          <Text style={[styles.totalLabel, { color: NEUTRAL_COLORS.text.secondary }]}>
            总支出
          </Text>
        </View>
      </View>
    );
  };

  // 渲染柱状图
  const renderBarChart = () => {
    const maxExpense = Math.max(...data.map(item => item.expense), 1);
    const barWidth = 40;
    const gap = 16;

    return (
      <View style={[styles.barChartContainer, { height }]}>
        <View style={styles.barChart}>
          {data.map((item, index) => {
            if (item.expense === 0) return null;

            const barHeight = (item.expense / maxExpense) * (height - 60);
            const color = item.color || getCategoryColor(index);

            return (
              <View
                key={item.categoryId}
                style={[
                  styles.barItem,
                  { marginRight: index < data.length - 1 ? gap : 0 },
                ]}
              >
                <Text
                  style={[styles.barValue, { color: NEUTRAL_COLORS.text.secondary }]}
                  numberOfLines={1}
                >
                  ¥{item.expense.toLocaleString()}
                </Text>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: color,
                      width: barWidth,
                    },
                  ]}
                />
                <Text
                  style={[styles.barLabel, { color: NEUTRAL_COLORS.text.secondary }]}
                  numberOfLines={1}
                >
                  {item.categoryName}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // 渲染水平柱状图
  const renderHorizontalBarChart = () => {
    const maxExpense = Math.max(...data.map(item => item.expense), 1);
    const barHeight = 32;
    const gap = 12;

    return (
      <ScrollView style={[styles.horizontalBarChartContainer, { height }]}>
        {data.map((item, index) => {
          if (item.expense === 0) return null;

          const barWidth = (item.expense / maxExpense) * (screenWidth - SPACING.md * 4 - 100);
          const color = item.color || getCategoryColor(index);

          return (
            <View
              key={item.categoryId}
              style={[
                styles.horizontalBarItem,
                { marginBottom: index < data.length - 1 ? gap : 0 },
              ]}
            >
              <View style={styles.horizontalBarLabel}>
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: color },
                  ]}
                />
                <Text
                  style={[styles.categoryName, { color: NEUTRAL_COLORS.text.primary }]}
                  numberOfLines={1}
                >
                  {item.categoryName}
                </Text>
              </View>
              <View style={styles.horizontalBarValue}>
                <Text
                  style={[styles.expenseValue, { color: NEUTRAL_COLORS.text.primary }]}
                >
                  ¥{item.expense.toLocaleString()}
                </Text>
                {showPercentage && (
                  <Text
                    style={[styles.percentage, { color: NEUTRAL_COLORS.text.secondary }]}
                  >
                    {calculatePercentage(item.expense)}
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.horizontalBar,
                  {
                    width: barWidth,
                    backgroundColor: color,
                    height: barHeight,
                  },
                ]}
              />
            </View>
          );
        })}
      </ScrollView>
    );
  };

  // 渲染图例
  const renderLegend = () => {
    if (!showLegend) return null;

    return (
      <View style={styles.legendContainer}>
        {data.map((item, index) => {
          if (item.expense === 0) return null;

          const color = item.color || getCategoryColor(index);

          return (
            <View key={item.categoryId} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: color },
                ]}
              />
              <Text
                style={[styles.legendText, { color: NEUTRAL_COLORS.text.primary }]}
                numberOfLines={1}
              >
                {item.categoryName}
              </Text>
              {showPercentage && (
                <Text
                  style={[styles.legendPercentage, { color: NEUTRAL_COLORS.text.secondary }]}
                >
                  {calculatePercentage(item.expense)}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  // 根据图表类型渲染
  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return (
          <View style={styles.chartWrapper}>
            {renderPieChart()}
          </View>
        );
      case 'bar':
        return renderBarChart();
      case 'horizontal':
        return renderHorizontalBarChart();
      default:
        return renderPieChart();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {renderChart()}
      {renderLegend()}
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  pieChartContainer: {
    position: 'relative',
  },
  pieSlice: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  pieCenter: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalExpense: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    fontWeight: '700',
  },
  totalLabel: {
    fontSize: TYPOGRAPHY.fontSize.body3,
    marginTop: 4,
  },
  barChartContainer: {
    overflow: 'hidden',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  barItem: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    borderRadius: 4,
  },
  barValue: {
    fontSize: TYPOGRAPHY.fontSize.body3,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: TYPOGRAPHY.fontSize.body3,
    marginTop: 4,
    textAlign: 'center',
  },
  horizontalBarChartContainer: {
    flex: 1,
  },
  horizontalBarItem: {
    marginBottom: SPACING.sm,
  },
  horizontalBarLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: TYPOGRAPHY.fontSize.body2,
    fontWeight: '500',
    flex: 1,
  },
  horizontalBarValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  expenseValue: {
    fontSize: TYPOGRAPHY.fontSize.body1,
    fontWeight: '600',
  },
  percentage: {
    fontSize: TYPOGRAPHY.fontSize.body2,
  },
  horizontalBar: {
    borderRadius: 4,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
    marginBottom: SPACING.sm,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: TYPOGRAPHY.fontSize.body2,
    marginRight: 4,
  },
  legendPercentage: {
    fontSize: TYPOGRAPHY.fontSize.body3,
  },
});

export default ExpenseChart;
