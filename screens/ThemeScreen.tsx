import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';
import { ThemeContext } from '../lib/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../lib/navigation';
import { I18nContext } from '../lib/i18n';
import { getVariableValue } from '@tamagui/core';
import tamaguiConfig from '../tamagui.config';
import { useAppSelector } from '../store'
import { selectDisplayScale } from '../features/ui/selectors'

/**
 * 主题选项组件的属性类型定义
 * @typedef {Object} OptionProps
 * @property {boolean} active - 指示该选项是否为当前激活状态
 * @property {string} label - 选项显示的文本标签
 * @property {() => void} onPress - 点击选项时触发的回调函数
 */

type OptionProps = {
  active: boolean;
  label: string;
  onPress: () => void;
  styles?: any;
};

/**
 * 主题选项按钮组件
 * 
 * 此组件渲染一个可点击的主题选项按钮，根据激活状态显示不同的样式。
 * 
 * @component
 * @param {OptionProps} props - 组件属性
 * @returns {JSX.Element} 渲染主题选项按钮的 JSX 元素
 */

const Option: React.FC<OptionProps> = ({ active, label, onPress, styles }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.option, active ? styles.optionActive : null]}
  >
    <Text style={[styles.optionText, active ? styles.optionTextActive : null]}>{label}</Text>
  </TouchableOpacity>
);

type ThemeScreenProps = {
  route: RouteProp<RootStackParamList, 'Theme'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Theme'>;
};

/**
 * 主题设置屏幕组件
 * 
 * 此组件允许用户选择应用的主题模式：自动、浅色或深色。
 * 它通过 ThemeContext 访问和修改全局主题状态，并根据当前生效的主题方案渲染 UI。
 * 
 * @component
 * @param {ThemeScreenProps} props - 组件属性（当前未直接使用）
 * @returns {JSX.Element} 渲染主题设置页面的 JSX 元素
 */

const ThemeScreen: React.FC<ThemeScreenProps> = ({}) => {
  // 从 ThemeContext 获取当前主题模式、设置函数和生效的主题方案
  const { themeMode, setThemeMode, effectiveScheme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const { t } = useContext(I18nContext);
  const scale = useAppSelector(selectDisplayScale)
  const styles = createStyles(effectiveScheme, scale);

  return (
    <View style={[
      styles.container,
      { paddingTop: insets.top + 32 }
    ]}>
      <Text style={styles.title}>{t('theme.title')}</Text>
      <View style={styles.row}>
        <Option styles={styles} label={t('theme.auto')} active={themeMode === 'auto'} onPress={() => setThemeMode('auto')} />
        <Option styles={styles} label={t('theme.light')} active={themeMode === 'light'} onPress={() => setThemeMode('light')} />
        <Option styles={styles} label={t('theme.dark')} active={themeMode === 'dark'} onPress={() => setThemeMode('dark')} />
      </View>
    </View>
  );
};

function createStyles(scheme: 'light' | 'dark', scale: number){
  const isDark = scheme === 'dark';
  const c = tamaguiConfig.tokens.color;
  const v = getVariableValue;
  const colors = {
    pageBg: v(isDark ? c.bgPageDark : c.bgPageLight),
    border: v(isDark ? c.borderDark : c.borderLight),
    textPrimary: v(isDark ? c.textPrimaryDark : c.textPrimaryLight),
    textSecondary: v(isDark ? c.textSecondaryDark : c.textSecondaryLight),
    accent: v(isDark ? c.accentDark : c.accentLight),
    optionBg: v(isDark ? c.gray3 : c.gray2),
  };
  return StyleSheet.create({
    container: { flex: 1, alignItems: 'center', backgroundColor: colors.pageBg as string },
    title: { fontSize: 22 * scale, fontWeight: '700', marginBottom: 24 * scale, color: colors.textPrimary as string },
    // gap 在 RN 类型中不一定存在，这里做类型断言避免 TS 报错
    row: { flexDirection: 'row', gap: 12 * scale } as any,
    option: { paddingVertical: 16 * scale, paddingHorizontal: 22 * scale, borderRadius: 16, backgroundColor: colors.optionBg as string, borderWidth: 1, borderColor: colors.border as string },
    optionActive: { backgroundColor: isDark ? v(c.iconBgDark) as string : v(c.iconBgLight) as string, borderWidth: 1, borderColor: colors.accent as string },
    optionText: { fontSize: 16 * scale, color: colors.textSecondary as string },
    optionTextActive: { color: colors.accent as string, fontWeight: '700' },
  });
}

export default ThemeScreen;