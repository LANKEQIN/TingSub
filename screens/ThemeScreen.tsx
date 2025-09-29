import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';
import { ThemeContext } from '../lib/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../lib/navigation';

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

const Option: React.FC<OptionProps> = ({ active, label, onPress }) => (
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

  return (
    <View style={[
      styles.container,
      effectiveScheme === 'dark' ? styles.containerDark : styles.containerLight,
      { paddingTop: insets.top + 32 }
    ]}>
      <Text style={styles.title}>主题模式</Text>
      <View style={styles.row}>
        <Option label="自动" active={themeMode === 'auto'} onPress={() => setThemeMode('auto')} />
        <Option label="浅色" active={themeMode === 'light'} onPress={() => setThemeMode('light')} />
        <Option label="深色" active={themeMode === 'dark'} onPress={() => setThemeMode('dark')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 32 },
  containerLight: { backgroundColor: '#F7FAFA' },
  containerDark: { backgroundColor: '#0F1416' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 24 },
  // gap 在 RN 类型中不一定存在，这里做类型断言避免 TS 报错
  row: { flexDirection: 'row', gap: 12 } as any,
  option: {
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: 16,
    backgroundColor: '#EAEAEA',
  },
  optionActive: { backgroundColor: '#CFE8E8', borderWidth: 1, borderColor: '#227A7A' },
  optionText: { fontSize: 16, color: '#374151' },
  optionTextActive: { color: '#0f766e', fontWeight: '700' },
});

export default ThemeScreen;