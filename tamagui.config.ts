/**
 * Tamagui UI 库的配置文件
 * 
 * 统一 UI 设计系统（Tokens & Themes）。
 * - 定义颜色/间距/尺寸/圆角/zIndex 等基础 Tokens
 * - 定义 light/dark 主题并映射到 Tokens
 */

import { createTamagui, createFont } from '@tamagui/core'

const tokens = {
  color: {
    // 基础
    white: '#FFFFFF',
    black: '#000000',

    // 品牌与功能色
    primary: '#0ea5e9',
    primarySolid: '#2563EB',
    primarySoft: '#E6F2FF',
    success: '#10b981',
    successDark: '#34D399',
    warning: '#f59e0b',
    danger: '#ef4444',

    // 中性色（浅色系）
    gray0: '#F8FAFC',
    gray1: '#F3F4F6',
    gray2: '#E5E7EB',
    gray3: '#EEF2F7',
    gray6: '#6b7280',
    gray7: '#374151',
    text: '#111827',

    // 中性色（深色系）
    darkBg: '#0F1416',
    darkCard: '#1C1F24',
    darkBorder: '#2A2E33',
    textLight: '#E5E7EB',
    mutedDark: '#78828A',
    secondaryDark: '#A7B0B8',

    // UI 专用映射
    bgPageLight: '#F8FAFC',
    bgPageDark: '#0F1416',
    cardBgLight: '#FFFFFF',
    cardBgDark: '#1C1F24',
    borderLight: '#E5E7EB',
    borderDark: '#2A2E33',
    textPrimaryLight: '#111827',
    textPrimaryDark: '#E5E7EB',
    textSecondaryLight: '#6b7280',
    textSecondaryDark: '#A7B0B8',
    mutedLight: '#9CA3AF',
    accentLight: '#0ea5e9',
    accentDark: '#4DB6FF',
    badgeBgLight: '#F3F4F6',
    badgeBgDark: '#28313A',
    iconBgLight: '#E6F2FF',
    iconBgDark: '#22303C',
    fabBg: '#2563EB',
    modalBgLight: '#FFFFFF',
    modalBgDark: '#1C1F24',
  },
  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
  },
  size: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
  },
  radius: {
    0: 0,
    1: 4,
    2: 8,
    3: 10,
    4: 12,
    5: 14,
    6: 16,
    7: 20,
    8: 25,
  },
  zIndex: {
    0: 0,
    1: 10,
    2: 20,
    3: 50,
    4: 100,
    10: 1000,
  },
} as const

const fonts = {
  body: createFont({
    family: 'System',
    size: {
      1: 12,
      2: 14,
      3: 16,
      4: 18,
      5: 20,
    },
    lineHeight: {
      1: 18,
      2: 20,
      3: 22,
      4: 24,
      5: 26,
    },
    weight: {
      1: '400',
      2: '500',
      3: '600',
      4: '700',
    },
  }),
} as const

const themes = {
  light: {
    color: 'text',
    background: 'bgPageLight',
    borderColor: 'borderLight',
    shadowColor: 'black',
    placeholderColor: 'gray6',
  },
  dark: {
    color: 'textLight',
    background: 'bgPageDark',
    borderColor: 'borderDark',
    shadowColor: 'black',
    placeholderColor: 'secondaryDark',
  },
} as const

const tamaguiConfig = createTamagui({
  tokens,
  themes,
  fonts,
})

export default tamaguiConfig

export type Conf = typeof tamaguiConfig