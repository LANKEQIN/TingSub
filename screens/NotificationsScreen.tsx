import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RouteProp } from '@react-navigation/native';
import type { TabParamList } from '../lib/navigation';
import { ThemeContext } from '../lib/theme';
import { I18nContext } from '../lib/i18n';
import { getVariableValue } from '@tamagui/core';
import tamaguiConfig from '../tamagui.config';

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
  const { t } = useContext(I18nContext);
  const styles = createStyles(effectiveScheme);
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>{t('notifications.title')}</Text>
      <Text style={styles.text}>{t('notifications.content')}</Text>
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
  const c = tamaguiConfig.tokens.color;
  const v = getVariableValue;
  const colors = {
    pageBg: v(isDark ? c.bgPageDark : c.bgPageLight),
    textPrimary: v(isDark ? c.textPrimaryDark : c.textPrimaryLight),
    textSecondary: v(isDark ? c.textSecondaryDark : c.textSecondaryLight),
  };
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.pageBg as string,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: colors.textPrimary as string,
    },
    text: {
      color: colors.textSecondary as string,
    }
  })
}

export default NotificationsScreen;