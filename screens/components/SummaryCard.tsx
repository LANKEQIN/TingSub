import React from 'react';
import { View } from 'react-native';
import { Text } from 'tamagui';

/**
 * SummaryCard 组件属性接口
 * @property {string} title - 卡片标题
 * @property {string|number} value - 主要数值
 * @property {string} [sub] - 子标题（可选）
 * @property {Object} styles - 样式对象
 */
type SummaryCardProps = {
  title: string
  value: string | number
  sub?: string
  styles: any
}

/**
 * 汇总信息卡片组件
 * 用于显示统计数据的标题、主要数值和可选的子标题
 * 
 * @param {SummaryCardProps} props - 组件属性
 * @returns {JSX.Element} 渲染的汇总卡片组件
 */
const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, sub, styles }) => (
  <View style={styles.summaryCard}>
    <Text style={styles.summaryTitle}>{title}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
    {sub ? <Text style={styles.summarySub}>{sub}</Text> : null}
  </View>
);

export default SummaryCard;