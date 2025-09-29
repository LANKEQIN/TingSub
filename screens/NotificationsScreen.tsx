import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RouteProp } from '@react-navigation/native';
import type { TabParamList } from '../lib/navigation';
import { ThemeContext } from '../lib/theme';

/**
 * 通知屏幕的属性类型定义
 * @typedef {Object} NotificationsScreenProps
 * @property {RouteProp<TabParamList, 'Notifications'>} route - 导航路由属性，包含屏幕参数
 */

type NotificationsScreenProps = {
  route: RouteProp<TabParamList, 'Notifications'>;
};

/**
 * 通知屏幕组件
 * 
 * 此组件展示应用的通知页面内容。
 * 它使用 ThemeContext 来适配当前的主题模式（浅色/深色），
 * 并使用 useSafeAreaInsets 来处理设备的安全区域。
 * 
 * @component
 * @returns {JSX.Element} 渲染通知页面的 JSX 元素
 */

const NotificationsScreen: React.FC<NotificationsScreenProps> = () => {
  const insets = useSafeAreaInsets();
  // 从 ThemeContext 获取当前生效的主题方案
  const { effectiveScheme } = useContext(ThemeContext);
  const styles = createStyles(effectiveScheme);
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>通知</Text>
      <Text style={styles.text}>这是通知页面内容</Text>
    </View>
  );
};

/**
 * 根据主题方案创建样式对象
 * 
 * @param {('light' | 'dark')} scheme - 当前的主题方案
 * @returns {StyleSheet.NamedStyles} 返回适配指定主题的样式对象
 */
function createStyles(scheme: 'light' | 'dark'){
  // 判断是否为深色主题
  const isDark = scheme === 'dark';
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#0F1416' : '#FFFFFF',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: isDark ? '#E5E7EB' : '#111827',
    },
    text: {
      color: isDark ? '#A7B0B8' : '#111827',
    }
  })
}

export default NotificationsScreen;