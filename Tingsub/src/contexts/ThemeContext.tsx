import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { StorageUtils } from '../utils/storageUtils';
import { USER_STORAGE_KEYS } from '../constants/storageKeys';
import { LightTheme, DarkTheme, ThemeMode } from '../constants/theme';

interface ThemeContextType {
  themeMode: ThemeMode;
  currentTheme: typeof LightTheme;
  isDark: boolean;
  toggleTheme: (mode: ThemeMode) => Promise<void>;
  switchToLightTheme: () => Promise<void>;
  switchToDarkTheme: () => Promise<void>;
  switchToSystemTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [currentTheme, setCurrentTheme] = useState(LightTheme);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await StorageUtils.getItem<string>(USER_STORAGE_KEYS.THEME_SETTING);
        if (savedTheme) {
          setThemeMode(savedTheme as ThemeMode);
        }
      } catch (err) {
        console.error('加载主题失败:', err);
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    let resolvedTheme = LightTheme;

    if (themeMode === 'dark') {
      resolvedTheme = DarkTheme;
    } else if (themeMode === 'light') {
      resolvedTheme = LightTheme;
    } else {
      resolvedTheme = systemColorScheme === 'dark' ? DarkTheme : LightTheme;
    }

    setCurrentTheme(resolvedTheme);
  }, [themeMode, systemColorScheme]);

  const toggleTheme = async (newTheme: ThemeMode) => {
    try {
      setThemeMode(newTheme);
      await StorageUtils.setItem(USER_STORAGE_KEYS.THEME_SETTING, newTheme);
    } catch (err) {
      console.error('保存主题失败:', err);
    }
  };

  const switchToLightTheme = async () => {
    await toggleTheme('light');
  };

  const switchToDarkTheme = async () => {
    await toggleTheme('dark');
  };

  const switchToSystemTheme = async () => {
    await toggleTheme('system');
  };

  const isDark = currentTheme === DarkTheme;

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        currentTheme,
        isDark,
        toggleTheme,
        switchToLightTheme,
        switchToDarkTheme,
        switchToSystemTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
