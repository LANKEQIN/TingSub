import { useCallback, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { DefaultTheme, DarkTheme } from 'react-native-paper';
import { storageUtils } from '../utils/storageUtils';
import { STORAGE_KEYS } from '../constants/storageKeys';

// 主题类型定义
export type ThemeType = 'light' | 'dark' | 'system';

// 自定义主题配置
const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200EE', // 主色调
    accent: '#03DAC6', // 强调色
    background: '#FFFFFF', // 背景色
    surface: '#FFFFFF', // 表面色
    error: '#B00020', // 错误色
    text: '#212121', // 文本色
    onSurface: '#212121', // 表面文本色
    disabled: '#BDBDBD', // 禁用色
    placeholder: '#757575', // 占位符色
    backdrop: 'rgba(0, 0, 0, 0.5)', // 背景遮罩色
    notification: '#6200EE', // 通知色
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#BB86FC', // 主色调
    accent: '#03DAC6', // 强调色
    background: '#121212', // 背景色
    surface: '#121212', // 表面色
    error: '#CF6679', // 错误色
    text: '#FFFFFF', // 文本色
    onSurface: '#FFFFFF', // 表面文本色
    disabled: '#424242', // 禁用色
    placeholder: '#9E9E9E', // 占位符色
    backdrop: 'rgba(0, 0, 0, 0.7)', // 背景遮罩色
    notification: '#BB86FC', // 通知色
  },
};

/**
 * 自定义Hook用于管理主题切换
 * 支持浅色、深色和系统主题
 */
export const useTheme = () => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>('system');
  const [currentTheme, setCurrentTheme] = useState(CustomLightTheme);

  // 从存储加载主题设置
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await storageUtils.getString(STORAGE_KEYS.THEME);
        if (savedTheme) {
          setTheme(savedTheme as ThemeType);
        }
      } catch (err) {
        console.error('加载主题失败:', err);
      }
    };

    loadTheme();
  }, []);

  // 根据主题类型更新当前主题
  useEffect(() => {
    let resolvedTheme: typeof CustomLightTheme;

    if (theme === 'light') {
      resolvedTheme = CustomLightTheme;
    } else if (theme === 'dark') {
      resolvedTheme = CustomDarkTheme;
    } else {
      resolvedTheme = systemTheme === 'dark' ? CustomDarkTheme : CustomLightTheme;
    }

    setCurrentTheme(resolvedTheme);
  }, [theme, systemTheme]);

  // 切换主题
  const toggleTheme = useCallback(async (newTheme: ThemeType) => {
    try {
      setTheme(newTheme);
      await storageUtils.setString(STORAGE_KEYS.THEME, newTheme);
    } catch (err) {
      console.error('保存主题失败:', err);
    }
  }, []);

  // 切换到浅色主题
  const switchToLightTheme = useCallback(() => {
    toggleTheme('light');
  }, [toggleTheme]);

  // 切换到深色主题
  const switchToDarkTheme = useCallback(() => {
    toggleTheme('dark');
  }, [toggleTheme]);

  // 切换到系统主题
  const switchToSystemTheme = useCallback(() => {
    toggleTheme('system');
  }, [toggleTheme]);

  return {
    theme,
    currentTheme,
    toggleTheme,
    switchToLightTheme,
    switchToDarkTheme,
    switchToSystemTheme,
    isDark: currentTheme === CustomDarkTheme,
    isLight: currentTheme === CustomLightTheme,
  };
};