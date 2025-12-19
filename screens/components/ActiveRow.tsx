/**
 * 活跃订阅列表项组件
 * 
 * 此组件用于在主页的活跃订阅列表中渲染单个订阅项。
 * 它显示订阅的图标、名称、价格和下次扣款日期。
 * 
 * @component
 * @param {Object} props - 组件属性
 * @param {Object} props.item - 订阅项数据
 * @param {string} props.item.id - 订阅ID
 * @param {string} props.item.name - 订阅名称
 * @param {string} props.item.price - 订阅价格
 * @param {string} props.item.next - 下次扣款日期
 * @param {number} props.index - 列表中的索引（当前未使用）
 * @param {Function} [props.onLongPress] - 长按事件处理函数
 * @param {Object} props.styles - 样式对象
 * @returns {JSX.Element} 返回渲染的列表项
 */

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';
import { Apple as AppleIcon, Video, BarChart3 } from '@tamagui/lucide-icons';

/**
 * ActiveRow 组件的属性接口
 * 
 * @interface ActiveRowProps
 * @property {Object} item - 订阅项数据对象
 * @property {string} item.id - 订阅的唯一标识符
 * @property {string} item.name - 订阅的名称
 * @property {string} item.price - 订阅的价格（格式化后的字符串）
 * @property {string} item.next - 下次扣款的日期（格式化后的字符串）
 * @property {number} index - 该项在列表中的索引
 * @property {Function} [onLongPress] - 可选的长按事件处理函数
 * @property {Object} styles - 从父组件传递的样式对象
 */
type ActiveRowProps = {
  item: { id: string; name: string; price: string; next: string }
  index: number
  onLongPress?: () => void
  styles: any
}

const ActiveRow: React.FC<ActiveRowProps> = ({ item, index, onLongPress, styles }) => (
  <TouchableOpacity style={styles.activeRow} onLongPress={onLongPress}>
    <View style={styles.activeIconBox}>
      {item.id === 'am' ? (
        <AppleIcon size={18} color={styles.colors?.accent || styles.colors?.textPrimary || '#111827'} />
      ) : item.id === 'ytp' ? (
        <Video size={18} color={styles.colors?.accent || styles.colors?.textPrimary || '#111827'} />
      ) : (
        <BarChart3 size={18} color={styles.colors?.accent || styles.colors?.textPrimary || '#111827'} />
      )}
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.activeName}>{item.name}</Text>
      <Text style={styles.activeHint}>{item.price}</Text>
    </View>
    <Text style={styles.activeNext}>{item.next}</Text>
  </TouchableOpacity>
);

export default ActiveRow;
