import React from 'react';
import { View, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SPACING, TYPOGRAPHY, NEUTRAL_COLORS } from '../../constants/theme';

// 趋势数据点接口
export interface TrendDataPoint {
  // 日期
  date: Date;
  // 日期标签（显示用）
  label: string;
  // 支出金额
  expense: number;
  // 订阅数量
  count?: number;
}

// 趋势图表Props接口
export interface TrendChartProps {
  // 趋势数据
  data: TrendDataPoint[];
  // 图表类型
  chartType?: 'line' | 'area' | 'bar';
  // 自定义样式
  style?: ViewStyle;
  // 图表高度
  height?: number;
  // 是否显示网格线
  showGrid?: boolean;
  // 是否显示数据点
  showDataPoints?: boolean;
  // 是否显示数值
  showValues?: boolean;
  // 线条颜色
  lineColor?: string;
  // 填充颜色
  fillColor?: string;
  // 点击事件
  onPress?: (point: TrendDataPoint) => void;
}

// 趋势图表组件
const TrendChart: React.FC<TrendChartProps> = ({
  data,
  chartType = 'line',
  style,
  height = 250,
  showGrid = true,
  showDataPoints = true,
  showValues = false,
  lineColor,
}) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;

  // 计算最大值和最小值
  const maxExpense = Math.max(...data.map(item => item.expense), 1);
  const minExpense = Math.min(...data.map(item => item.expense), 0);

  // 获取Y轴刻度
  const getYAxisTicks = (): number[] => {
    const range = maxExpense - minExpense;
    const step = Math.ceil(range / 5);
    const ticks: number[] = [];
    for (let i = 0; i <= 5; i++) {
      ticks.push(minExpense + step * i);
    }
    return ticks;
  };

  // 获取数据点的Y坐标
  const getYCoordinate = (expense: number): number => {
    const chartHeight = height - 60;
    const range = maxExpense - minExpense;
    if (range === 0) return chartHeight / 2;
    return chartHeight - ((expense - minExpense) / range) * chartHeight;
  };

  // 获取数据点的X坐标
  const getXCoordinate = (index: number): number => {
    const chartWidth = screenWidth - SPACING.md * 4 - 60;
    const step = chartWidth / (data.length - 1 || 1);
    return step * index;
  };

  // 渲染网格线
  const renderGridLines = () => {
    if (!showGrid) return null;

    const ticks = getYAxisTicks();
    const chartHeight = height - 60;

    return (
      <View style={styles.gridContainer}>
        {ticks.map((tick, index) => {
          const y = (chartHeight / 5) * index;
          return (
            <View key={index} style={[styles.gridLine, { top: y }]}>
              <Text
                style={[styles.gridLabel, { color: NEUTRAL_COLORS.text.secondary }]}
              >
                ¥{tick.toLocaleString()}
              </Text>
              <View
                style={[
                  styles.gridLineHorizontal,
                  { backgroundColor: NEUTRAL_COLORS.border.light },
                ]}
              />
            </View>
          );
        })}
      </View>
    );
  };

  // 渲染X轴标签
  const renderXAxisLabels = () => {
    return (
      <View style={styles.xAxisContainer}>
        {data.map((item, index) => {
          const x = getXCoordinate(index);
          return (
            <Text
              key={index}
              style={[
                styles.xAxisLabel,
                {
                  left: x,
                  color: NEUTRAL_COLORS.text.secondary,
                },
              ]}
            >
              {item.label}
            </Text>
          );
        })}
      </View>
    );
  };

  // 渲染折线图
  const renderLineChart = () => {
    const defaultLineColor = lineColor || theme.colors.primary;

    return (
      <View style={styles.chartContainer}>
        {renderGridLines()}
        <View style={styles.lineChart}>
          {showDataPoints &&
            data.map((item, index) => {
              const x = getXCoordinate(index);
              const y = getYCoordinate(item.expense);
              return (
                <View
                  key={index}
                  style={[
                    styles.dataPoint,
                    {
                      left: x - 6,
                      top: y - 6,
                      backgroundColor: defaultLineColor,
                    },
                  ]}
                />
              );
            })}
          {showValues &&
            data.map((item, index) => {
              const x = getXCoordinate(index);
              const y = getYCoordinate(item.expense);
              return (
                <Text
                  key={index}
                  style={[
                    styles.dataValue,
                    {
                      left: x - 20,
                      top: y - 24,
                      color: NEUTRAL_COLORS.text.primary,
                    },
                  ]}
                >
                  ¥{item.expense.toLocaleString()}
                </Text>
              );
            })}
        </View>
        {renderXAxisLabels()}
      </View>
    );
  };

  // 渲染柱状图
  const renderBarChart = () => {
    const barWidth = Math.max(20, ((screenWidth - SPACING.md * 4 - 60) / data.length) * 0.6);
    const defaultLineColor = lineColor || theme.colors.primary;

    return (
      <View style={styles.chartContainer}>
        {renderGridLines()}
        <View style={styles.barChart}>
          {data.map((item, index) => {
            const x = getXCoordinate(index);
            const y = getYCoordinate(item.expense);
            const barHeight = (height - 60) - y;

            return (
              <View
                key={index}
                style={[
                  styles.bar,
                  {
                    left: x - barWidth / 2,
                    top: y,
                    width: barWidth,
                    height: barHeight,
                    backgroundColor: defaultLineColor,
                  },
                ]}
              >
                {showValues && (
                  <Text
                    style={[
                      styles.barValue,
                      { color: NEUTRAL_COLORS.text.primary },
                    ]}
                  >
                    ¥{item.expense.toLocaleString()}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
        {renderXAxisLabels()}
      </View>
    );
  };

  // 根据图表类型渲染
  const renderChart = () => {
    switch (chartType) {
      case 'line':
      case 'area':
        return renderLineChart();
      case 'bar':
        return renderBarChart();
      default:
        return renderLineChart();
    }
  };

  // 计算平均支出
  const averageExpense = data.length > 0
    ? data.reduce((sum, item) => sum + item.expense, 0) / data.length
    : 0;

  // 计算总支出
  const totalExpense = data.reduce((sum, item) => sum + item.expense, 0);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: NEUTRAL_COLORS.text.primary }]}>
          支出趋势
        </Text>
        <View style={styles.summary}>
          <Text style={[styles.summaryLabel, { color: NEUTRAL_COLORS.text.secondary }]}>
            总支出:
          </Text>
          <Text style={[styles.summaryValue, { color: NEUTRAL_COLORS.text.primary }]}>
            ¥{totalExpense.toLocaleString()}
          </Text>
          <Text style={[styles.summaryLabel, { color: NEUTRAL_COLORS.text.secondary }]}>
            平均:
          </Text>
          <Text style={[styles.summaryValue, { color: NEUTRAL_COLORS.text.primary }]}>
            ¥{averageExpense.toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={[styles.chartWrapper, { height }]}>
        {renderChart()}
      </View>
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.h4,
    fontWeight: '600',
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.fontSize.body3,
    marginRight: 4,
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.fontSize.body2,
    fontWeight: '600',
    marginRight: SPACING.md,
  },
  chartWrapper: {
    overflow: 'hidden',
  },
  chartContainer: {
    position: 'relative',
    paddingLeft: 60,
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridLabel: {
    position: 'absolute',
    left: 0,
    width: 50,
    fontSize: TYPOGRAPHY.fontSize.body3,
    textAlign: 'right',
  },
  gridLineHorizontal: {
    flex: 1,
    height: 1,
  },
  xAxisContainer: {
    position: 'absolute',
    bottom: 0,
    left: 60,
    right: 0,
    height: 20,
  },
  xAxisLabel: {
    position: 'absolute',
    fontSize: TYPOGRAPHY.fontSize.body3,
    transform: [{ translateX: -20 }],
  },
  lineChart: {
    position: 'relative',
    height: '100%',
  },
  dataPoint: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  dataValue: {
    position: 'absolute',
    fontSize: TYPOGRAPHY.fontSize.body3,
    fontWeight: '500',
  },
  barChart: {
    position: 'relative',
    height: '100%',
  },
  bar: {
    position: 'absolute',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  barValue: {
    fontSize: TYPOGRAPHY.fontSize.body3,
    fontWeight: '500',
    marginBottom: 2,
  },
});

export default TrendChart;
