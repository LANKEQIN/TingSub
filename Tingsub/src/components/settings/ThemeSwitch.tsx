import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

// 主题选项
export interface ThemeOption {
  value: 'light' | 'dark' | 'system';
  label: string;
  icon: string;
}

// 主题切换器Props接口
export interface ThemeSwitchProps {
  // 当前主题值
  value?: 'light' | 'dark' | 'system';
  // 自定义样式
  style?: ViewStyle;
  // 标题样式
  titleStyle?: TextStyle;
  // 是否显示图标
  showIcon?: boolean;
  // 主题切换回调
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
}

// 主题选项列表
const THEME_OPTIONS: ThemeOption[] = [
  {
    value: 'light',
    label: '浅色模式',
    icon: 'white-balance-sunny',
  },
  {
    value: 'dark',
    label: '深色模式',
    icon: 'moon-waning-crescent',
  },
  {
    value: 'system',
    label: '跟随系统',
    icon: 'theme-light-dark',
  },
];

// 主题切换器组件
const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
  value,
  style,
  titleStyle,
  showIcon = true,
  onThemeChange,
}) => {
  const { theme, currentTheme, toggleTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>(value || theme);

  // 处理主题切换
  const handleThemeChange = async (themeValue: 'light' | 'dark' | 'system') => {
    setSelectedTheme(themeValue);
    await toggleTheme(themeValue);
    onThemeChange?.(themeValue);
  };

  // 渲染主题选项
  const renderThemeOption = (option: ThemeOption) => {
    const isSelected = selectedTheme === option.value;

    return (
      <TouchableOpacity
        key={option.value}
        style={[
          styles.option,
          {
            backgroundColor: isSelected ? currentTheme.colors.primary : currentTheme.colors.surface,
            borderColor: isSelected ? currentTheme.colors.primary : currentTheme.colors.placeholder,
          },
        ]}
        onPress={() => handleThemeChange(option.value)}
        activeOpacity={0.7}
      >
        {showIcon && (
          <MaterialCommunityIcons
            name={option.icon as any}
            size={24}
            color={isSelected ? '#FFFFFF' : currentTheme.colors.text}
            style={styles.optionIcon}
          />
        )}
        <Text
          style={[
            styles.optionLabel,
            {
              color: isSelected ? '#FFFFFF' : currentTheme.colors.text,
            },
            titleStyle,
          ]}
        >
          {option.label}
        </Text>
        {isSelected && (
          <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" style={styles.checkIcon} />
        )}
      </TouchableOpacity>
    );
  };

  return <View style={[styles.container, style]}>{THEME_OPTIONS.map(renderThemeOption)}</View>;
};

// 样式定义
const styles = StyleSheet.create({
  checkIcon: {
    marginLeft: 8,
  },
  container: {
    gap: 8,
    width: '100%',
  },
  option: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
});

export default ThemeSwitch;
