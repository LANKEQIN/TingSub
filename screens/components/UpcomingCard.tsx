import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';
import { Music, CalendarDays, CreditCard } from '@tamagui/lucide-icons';

/**
 * UpcomingCard 组件属性接口
 * @property {Object} item - 订阅项目数据
 * @property {string} item.id - 项目唯一标识符
 * @property {string} item.name - 项目名称
 * @property {string} item.cycle - 订阅周期
 * @property {string} item.next - 下次扣款日期
 * @property {string} item.price - 价格
 * @property {Function} [onLongPress] - 长按事件回调函数
 * @property {Object} styles - 样式对象
 */
type UpcomingCardProps = {
  item: { id: string; name: string; cycle: string; next: string; price: string }
  onLongPress?: () => void
  styles: any
}

/**
 * 即将到期的订阅卡片组件
 * 显示订阅项目的图标、名称、周期、下次扣款日期和价格
 * 支持长按操作
 * 
 * @param {UpcomingCardProps} props - 组件属性
 * @returns {JSX.Element} 渲染的卡片组件
 */
const UpcomingCard: React.FC<UpcomingCardProps> = ({ item, onLongPress, styles }) => (
  <TouchableOpacity style={styles.upcomingCard} onLongPress={onLongPress}>
    <View style={styles.upcomingIconBox}>
      <Music size={20} color={styles?.colors?.accent ?? '#0ea5e9'} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.upcomingName}>{item.name}</Text>
      <Text style={styles.upcomingCycle}>{item.cycle}</Text>
      <View style={styles.upcomingMetaRow}>
        <View style={styles.badgeInfo}>
          <CalendarDays size={14} color={styles?.colors?.muted ?? '#6b7280'} />
          <Text style={styles.badgeText}>{item.next}</Text>
        </View>
        <View style={styles.badgeInfo}>
          <CreditCard size={14} color={styles?.colors?.muted ?? '#6b7280'} />
          <Text style={styles.badgeText}>{item.price}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default UpcomingCard;
