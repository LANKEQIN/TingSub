/**
 * 区域标题组件
 * 
 * 此组件用于渲染带有可选操作按钮的区域标题。
 * 通常用于主页的各个部分（如活跃订阅、即将到期等）的标题栏。
 * 
 * @component
 * @param {Object} props - 组件属性
 * @param {string} props.title - 标题文本
 * @param {string} [props.actionText] - 可选的操作按钮文本
 * @param {Function} [props.onPress] - 可选的操作按钮点击事件处理函数
 * @param {Object} props.styles - 样式对象
 * @returns {JSX.Element} 返回渲染的标题组件
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'tamagui';
import { UI } from '../../lib/ui'

/**
 * SectionHeader 组件的属性接口
 * 
 * @interface SectionHeaderProps
 * @property {string} title - 区域的标题文本
 * @property {string} [actionText] - 可选的操作按钮文本（如"查看更多"）
 * @property {Function} [onPress] - 可选的操作按钮点击事件处理函数
 * @property {Object} styles - 从父组件传递的样式对象
 */
type SectionHeaderProps = {
  title: string
  actionText?: string
  onPress?: () => void
  styles: any
}

const fallback = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: UI.space.sm, marginBottom: UI.space.sm },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  link: { fontSize: 13 },
})

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionText, onPress, styles }) => (
  <View style={styles.sectionHeader ?? fallback.sectionHeader}>
    <Text style={styles.sectionTitle ?? fallback.sectionTitle}>{title}</Text>
    {actionText ? (
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.link ?? fallback.link}>{actionText}</Text>
      </TouchableOpacity>
    ) : (
      <View />
    )}
  </View>
);

export default SectionHeader;