import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootStackParamList, TabParamList } from '../lib/navigation';
import { ThemeContext } from '../lib/theme';
import { I18nContext } from '../lib/i18n';
import { useAppDispatch, useAppSelector } from '../store';
import { selectPreferredCurrency, setPreferredCurrency } from '../features/currency/slice';

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
  const insets = useSafeAreaInsets();
  // 从 ThemeContext 获取当前生效的主题方案
  const { effectiveScheme } = useContext(ThemeContext);
  const { t } = useContext(I18nContext);
  const styles = createStyles(effectiveScheme);
  const dispatch = useAppDispatch();
  const preferredCurrency = useAppSelector(selectPreferredCurrency);
  const Option: React.FC<OptionProps> = ({ active, label, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.option, active ? styles.optionActive : null]}>
      <Text style={[styles.optionText, active ? styles.optionTextActive : null]}>{label}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={[styles.container, { paddingTop: insets.top + 32 }]}>
      <Text style={styles.title}>{t('profile.title')}</Text>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Theme')}>
        <Text style={styles.itemText}>{t('profile.theme')}</Text>
        <Text style={styles.itemSub}>设置深色模式，调整色彩</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, { marginTop: 12 }]} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.itemText}>{t('profile.appSettings')}</Text>
        <Text style={styles.itemSub}>{t('profile.appSettingsSub')}</Text>
      </TouchableOpacity>
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
      justifyContent: 'flex-start',
      paddingTop: 32,
      backgroundColor: isDark ? '#0F1416' : '#FFFFFF',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: isDark ? '#E5E7EB' : '#111827',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      alignSelf: 'flex-start',
      marginLeft: '5%',
      marginBottom: 12,
      color: isDark ? '#E5E7EB' : '#111827',
    },
    item: {
      width: '90%',
      backgroundColor: isDark ? '#1C1F24' : '#F5F5F7',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#2A2E33' : 'transparent',
    },
    itemText: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 6,
      color: isDark ? '#E5E7EB' : '#111827',
    },
    itemSub: {
      color: isDark ? '#A7B0B8' : '#6b7280',
    },
    row: { flexDirection: 'row', gap: 12 },
    option: {
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 14,
      backgroundColor: isDark ? '#22262B' : '#EAEAEA',
      borderWidth: 1,
      borderColor: isDark ? '#30343A' : '#E5E7EB',
    },
    optionActive: {
      backgroundColor: isDark ? '#1F2A2E' : '#CFE8E8',
      borderWidth: 1,
      borderColor: isDark ? '#0f766e' : '#227A7A',
    },
    optionText: { fontSize: 14, color: isDark ? '#C9D1D9' : '#374151' },
    optionTextActive: { color: '#0f766e', fontWeight: '700' },
  });
}

export default ProfileScreen;