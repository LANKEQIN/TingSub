import React from 'react'

export type ThemeMode = 'auto' | 'light' | 'dark'
export type EffectiveScheme = 'light' | 'dark'
export type ThemeContextType = {
  themeMode: ThemeMode
  setThemeMode: React.Dispatch<React.SetStateAction<ThemeMode>>
  effectiveScheme: EffectiveScheme
}

export const ThemeContext = React.createContext<ThemeContextType>({
  themeMode: 'auto',
  setThemeMode: (() => {}) as React.Dispatch<React.SetStateAction<ThemeMode>>,
  effectiveScheme: 'light',
})