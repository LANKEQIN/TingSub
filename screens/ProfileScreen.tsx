import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootStackParamList, TabParamList } from '../lib/navigation';
import { ThemeContext } from '../lib/theme';
import { I18nContext } from '../lib/i18n';
import { useAppDispatch, useAppSelector } from '../store';
import { selectPreferredCurrency, setPreferredCurrency } from '../features/currency/slice';
import { getVariableValue } from '@tamagui/core';
import tamaguiConfig from '../tamagui.config';
import { UI } from '../lib/ui';
import { selectDisplayScale } from '../features/ui/selectors'
import ScreenContainer from './components/ScreenContainer'

/**
 * 我的屏幕的属性类型定义
 * @typedef {Object} ProfileScreenProps
 * @property {CompositeNavigationProp<BottomTabNavigationProp<TabParamList, 'Profile'>, NativeStackNavigationProp<RootStackParamList>>} navigation - 导航对象，用于屏幕间跳转
 */

type ProfileScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Profile'>,
    NativeStackNavigationProp<RootStackParamList>
  >
}

type OptionProps = {
  active: boolean;
  label: string;
  onPress: () => void;
};

/**
 * 我的屏幕组件
 * 
 * 此组件展示应用的个人中心页面，包含主题设置等选项。
 * 它使用 ThemeContext 来适配当前的主题模式（浅色/深色），
 * 并使用 useSafeAreaInsets 来处理设备的安全区域。
 * 导航对象用于跳转到其他屏幕，例如主题设置屏幕。
 * 
 * @component
 * @param {ProfileScreenProps} props - 组件属性
 * @returns {JSX.Element} 渲染个人中心页面的 JSX 元素
 */

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  // 从 ThemeContext 获取当前生效的主题方案
  const { effectiveScheme } = useContext(ThemeContext);
  const { t } = useContext(I18nContext);
  const scale = useAppSelector(selectDisplayScale)
  const styles = createStyles(effectiveScheme, scale);
  const dispatch = useAppDispatch();
  const preferredCurrency = useAppSelector(selectPreferredCurrency);
  const Option: React.FC<OptionProps> = ({ active, label, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.option, active ? styles.optionActive : null]}>
      <Text style={[styles.optionText, active ? styles.optionTextActive : null]}>{label}</Text>
    </TouchableOpacity>
  );
  return (
    <ScreenContainer scrollable>
      <Text style={styles.title}>{t('profile.title')}</Text>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Theme')}>
        <Text style={styles.itemText}>{t('profile.theme')}</Text>
        <Text style={styles.itemSub}>设置深色模式，调整色彩</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, { marginTop: 12 }]} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.itemText}>{t('profile.appSettings')}</Text>
        <Text style={styles.itemSub}>{t('profile.appSettingsSub')}</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
};

/**
 * 根据主题方案创建样式对象
 * 
 * @param {('light' | 'dark')} scheme - 当前的主题方案
 * @returns {StyleSheet.NamedStyles} 返回适配指定主题的样式对象
 */
function createStyles(scheme: 'light' | 'dark', scale: number){
  // 判断是否为深色主题
  const isDark = scheme === 'dark';
  const c = tamaguiConfig.tokens.color;
  const v = getVariableValue;
  const colors = {
    pageBg: v(isDark ? c.bgPageDark : c.bgPageLight),
    cardBg: v(isDark ? c.cardBgDark : c.cardBgLight),
    border: v(isDark ? c.borderDark : c.borderLight),
    textPrimary: v(isDark ? c.textPrimaryDark : c.textPrimaryLight),
    textSecondary: v(isDark ? c.textSecondaryDark : c.textSecondaryLight),
    accent: v(isDark ? c.accentDark : c.accentLight),
    iconBg: v(isDark ? c.iconBgDark : c.iconBgLight),
  };
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
    title: {
      fontSize: 24 * scale,
      fontWeight: 'bold',
      marginBottom: 20 * scale,
      color: colors.textPrimary as string,
    },
    sectionTitle: {
      fontSize: 18 * scale,
      fontWeight: '700',
      alignSelf: 'flex-start',
      marginLeft: '5%',
      marginBottom: UI.space.sm * scale,
      color: colors.textPrimary as string,
    },
    item: {
      width: '100%',
      backgroundColor: colors.cardBg as string,
      padding: UI.space.md * scale,
      borderRadius: UI.radius.lg,
      borderWidth: 1,
      borderColor: colors.border as string,
    },
    itemText: {
      fontSize: 18 * scale,
      fontWeight: '600',
      marginBottom: 6 * scale,
      color: colors.textPrimary as string,
    },
    itemSub: {
      color: colors.textSecondary as string,
    },
    row: { flexDirection: 'row', gap: UI.space.sm * scale },
    option: {
      paddingVertical: UI.space.sm * scale,
      paddingHorizontal: 18 * scale,
      borderRadius: UI.radius.lg,
      backgroundColor: colors.iconBg as string,
      borderWidth: 1,
      borderColor: colors.border as string,
    },
    optionActive: {
      backgroundColor: colors.cardBg as string,
      borderWidth: 1,
      borderColor: colors.accent as string,
    },
    optionText: { fontSize: 14 * scale, color: colors.textSecondary as string },
    optionTextActive: { color: colors.accent as string, fontWeight: '700' },
  });
}

export default ProfileScreen;