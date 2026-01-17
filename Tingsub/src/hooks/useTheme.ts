import { useCallback, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { DefaultTheme, MD3DarkTheme } from 'react-native-paper';
import { StorageUtils } from '../utils/storageUtils';
import { USER_STORAGE_KEYS } from '../constants/storageKeys';

// 主题类型定义
export type ThemeType = 'light' | 'dark' | 'system';

// 自定义主题配置
const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200EE',
    accent: '#03DAC6',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    error: '#B00020',
    text: '#212121',
    onSurface: '#212121',
    disabled: '#BDBDBD',
    placeholder: '#757575',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#6200EE',
  },
};

const CustomDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',
    accent: '#03DAC6',
    background: '#121212',
    surface: '#121212',
    error: '#CF6679',
    text: '#FFFFFF',
    onSurface: '#FFFFFF',
    disabled: '#424242',
    placeholder: '#9E9E9E',
    backdrop: 'rgba(0, 0, 0, 0.7)',
    notification: '#BB86FC',
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
        const savedTheme = await StorageUtils.getItem<string>(USER_STORAGE_KEYS.THEME_SETTING);
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
      await StorageUtils.setItem(USER_STORAGE_KEYS.THEME_SETTING, newTheme);
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
