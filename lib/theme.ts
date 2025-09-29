import React from 'react'

/**
 * 主题模式类型
 * 
 * @typedef {'auto' | 'light' | 'dark'} ThemeMode
 * @description
 * - 'auto': 跟随系统主题
 * - 'light': 强制使用亮色主题
 * - 'dark': 强制使用暗色主题
 */
export type ThemeMode = 'auto' | 'light' | 'dark'

/**
 * 有效主题方案类型
 * 
 * @typedef {'light' | 'dark'} EffectiveScheme
 * @description
 * 表示当前实际应用的主题方案，由ThemeMode和系统主题共同决定
 */
export type EffectiveScheme = 'light' | 'dark'

/**
 * 主题上下文类型
 * 
 * @typedef {Object} ThemeContextType
 * @property {ThemeMode} themeMode - 当前主题模式
 * @property {function(ThemeMode): void} setThemeMode - 设置主题模式的函数
 * @property {EffectiveScheme} effectiveScheme - 当前生效的主题方案
 */
export type ThemeContextType = {
  themeMode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void
  effectiveScheme: EffectiveScheme
}

/**
 * 主题上下文
 * 
 * @description
 * 用于在组件树中传递主题相关状态和方法的React Context
 * 使用useContext hook可以访问主题状态和设置方法
 */
export const ThemeContext = React.createContext<ThemeContextType>({
  themeMode: 'auto',
  setThemeMode: (() => {}) as React.Dispatch<React.SetStateAction<ThemeMode>>,
  effectiveScheme: 'light',
})