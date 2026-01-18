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
  const maxExpense = Math.max(...data.map((item) => item.expense), 1);
  const minExpense = Math.min(...data.map((item) => item.expense), 0);

  // 获取Y轴刻度
  const getYAxisTicks = (): number[] => {
    const range = maxExpense - minExpense;
    let step: number;
    let ticks: number[] = [];

    // 处理所有值相同的情况
    if (range === 0) {
      const adjustedMax = Math.max(maxExpense, 1);
      step = adjustedMax / 5;
      for (let i = 0; i <= 5; i++) {
        ticks.push(step * i);
      }
      return ticks;
    }

    // 计算美观的步长值
    const magnitude = Math.pow(10, Math.floor(Math.log10(range / 5)));
    const roughStep = range / (5 * magnitude);
    step = Math.ceil(roughStep) * magnitude;

    // 从大于等于最小值的第一个刻度开始
    let startTick = Math.ceil(minExpense / step) * step;
    for (let i = 0; i <= 5; i++) {
      ticks.push(startTick + step * i);
    }

    return ticks;
  };

  // 获取数据点的Y坐标
  const getYCoordinate = (expense: number): number => {
    const chartHeight = height - 60;
    const ticks = getYAxisTicks();
    const tickRange = ticks[ticks.length - 1] - ticks[0];
    if (tickRange === 0) return chartHeight / 2;
    return chartHeight - ((expense - ticks[0]) / tickRange) * chartHeight;
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
    const tickRange = ticks[ticks.length - 1] - ticks[0];

    return (
      <View style={styles.gridContainer}>
        {ticks.map((tick, index) => {
          const y = chartHeight - ((tick - ticks[0]) / tickRange) * chartHeight;
          return (
            <View key={index} style={[styles.gridLine, { top: y }]}>
              <Text style={[styles.gridLabel, { color: NEUTRAL_COLORS.text.secondary }]}>
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
            const barHeight = height - 60 - y;

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
                  <Text style={[styles.barValue, { color: NEUTRAL_COLORS.text.primary }]}>
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
  const averageExpense =
    data.length > 0 ? data.reduce((sum, item) => sum + item.expense, 0) / data.length : 0;

  // 计算总支出
  const totalExpense = data.reduce((sum, item) => sum + item.expense, 0);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: NEUTRAL_COLORS.text.primary }]}>支出趋势</Text>
        <View style={styles.summary}>
          <Text style={[styles.summaryLabel, { color: NEUTRAL_COLORS.text.secondary }]}>
            总支出:
          </Text>
          <Text style={[styles.summaryValue, { color: NEUTRAL_COLORS.text.primary }]}>
            ¥{totalExpense.toLocaleString()}
          </Text>
          <Text style={[styles.summaryLabel, { color: NEUTRAL_COLORS.text.secondary }]}>平均:</Text>
          <Text style={[styles.summaryValue, { color: NEUTRAL_COLORS.text.primary }]}>
            ¥{averageExpense.toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={[styles.chartWrapper, { height }]}>{renderChart()}</View>
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  bar: {
    alignItems: 'center',
    borderRadius: 4,
    justifyContent: 'flex-end',
    paddingBottom: 4,
    position: 'absolute',
  },
  barChart: {
    height: '100%',
    position: 'relative',
  },
  barValue: {
    fontSize: TYPOGRAPHY.fontSize.body3,
    fontWeight: '500',
    marginBottom: 2,
  },
  chartContainer: {
    paddingLeft: 60,
    position: 'relative',
  },
  chartWrapper: {
    overflow: 'hidden',
  },
  container: {
    padding: SPACING.md,
  },
  dataPoint: {
    borderColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 2,
    height: 12,
    position: 'absolute',
    width: 12,
  },
  dataValue: {
    fontSize: TYPOGRAPHY.fontSize.body3,
    fontWeight: '500',
    position: 'absolute',
  },
  gridContainer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  gridLabel: {
    fontSize: TYPOGRAPHY.fontSize.body3,
    left: 0,
    position: 'absolute',
    textAlign: 'right',
    width: 50,
  },
  gridLine: {
    alignItems: 'center',
    flexDirection: 'row',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  gridLineHorizontal: {
    flex: 1,
    height: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  lineChart: {
    height: '100%',
    position: 'relative',
  },
  summary: {
    alignItems: 'center',
    flexDirection: 'row',
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
  title: {
    fontSize: TYPOGRAPHY.fontSize.h4,
    fontWeight: '600',
  },
  xAxisContainer: {
    bottom: 0,
    height: 20,
    left: 60,
    position: 'absolute',
    right: 0,
  },
  xAxisLabel: {
    fontSize: TYPOGRAPHY.fontSize.body3,
    position: 'absolute',
    transform: [{ translateX: -20 }],
  },
});

export default TrendChart;
