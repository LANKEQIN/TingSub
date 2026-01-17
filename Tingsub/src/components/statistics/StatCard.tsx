import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SPACING, TYPOGRAPHY, NEUTRAL_COLORS } from '../../constants/theme';

// 统计卡片Props接口
export interface StatCardProps {
  // 标题
  title: string;
  // 数值
  value: string | number;
  // 单位
  unit?: string;
  // 图标
  icon?: React.ReactNode;
  // 趋势（正数表示增长，负数表示下降）
  trend?: number;
  // 趋势标签
  trendLabel?: string;
  // 自定义样式
  style?: ViewStyle;
  // 是否显示边框
  bordered?: boolean;
  // 背景色
  backgroundColor?: string;
  // 文字颜色
  textColor?: string;
  // 是否紧凑模式
  compact?: boolean;
}

// 统计卡片组件
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  trendLabel,
  style,
  bordered = true,
  backgroundColor,
  textColor,
  compact = false,
}) => {
  const theme = useTheme();

  // 格式化数值
  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  // 获取趋势颜色
  const getTrendColor = (): string => {
    if (trend === undefined) return NEUTRAL_COLORS.text.secondary;
    if (trend > 0) return '#52C41A';
    if (trend < 0) return '#F5222D';
    return NEUTRAL_COLORS.text.secondary;
  };

  // 获取趋势图标
  const getTrendIcon = (): string => {
    if (trend === undefined) return '';
    if (trend > 0) return '↑';
    if (trend < 0) return '↓';
    return '→';
  };

  // 渲染趋势信息
  const renderTrend = () => {
    if (trend === undefined) return null;

    return (
      <View style={styles.trendContainer}>
        <Text style={[styles.trendText, { color: getTrendColor() }]}>
          {getTrendIcon()} {Math.abs(trend)}%
        </Text>
        {trendLabel && (
          <Text style={[styles.trendLabel, { color: NEUTRAL_COLORS.text.secondary }]}>
            {trendLabel}
          </Text>
        )}
      </View>
    );
  };

  // 获取卡片样式
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.card,
      backgroundColor: backgroundColor || theme.colors.surface,
      padding: compact ? SPACING.md : SPACING.lg,
      ...(bordered && {
        borderWidth: 1,
        borderColor: NEUTRAL_COLORS.border.light,
      }),
    };

    return baseStyle;
  };

  return (
    <View style={[getCardStyle(), style]}>
      <View style={styles.header}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text
          style={[
            styles.title,
            {
              color: textColor || NEUTRAL_COLORS.text.secondary,
              fontSize: compact ? TYPOGRAPHY.fontSize.body2 : TYPOGRAPHY.fontSize.body1,
            },
          ]}
        >
          {title}
        </Text>
      </View>

      <View style={styles.valueContainer}>
        <Text
          style={[
            styles.value,
            {
              color: textColor || NEUTRAL_COLORS.text.primary,
              fontSize: compact ? TYPOGRAPHY.fontSize.h3 : TYPOGRAPHY.fontSize.h2,
            },
          ]}
        >
          {formatValue(value)}
          {unit && (
            <Text
              style={[
                styles.unit,
                {
                  color: textColor || NEUTRAL_COLORS.text.secondary,
                  fontSize: compact ? TYPOGRAPHY.fontSize.body2 : TYPOGRAPHY.fontSize.body1,
                },
              ]}
            >
              {unit}
            </Text>
          )}
        </Text>
      </View>

      {renderTrend()}
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 8,
  },
  title: {
    fontWeight: '500',
    flex: 1,
  },
  valueContainer: {
    marginBottom: 4,
  },
  value: {
    fontWeight: '700',
    lineHeight: 36,
  },
  unit: {
    fontWeight: '400',
    marginLeft: 4,
    fontSize: 16,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  trendLabel: {
    fontSize: 12,
  },
});

export default StatCard;
