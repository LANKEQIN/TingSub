import { getVariableValue } from '@tamagui/core'
import { Platform, useWindowDimensions, type ViewStyle, type RegisteredStyle } from 'react-native'
import tamaguiConfig from '../tamagui.config'

/**
 * 创建跨平台阴影样式
 * 返回类型兼容 StyleSheet.create
 */
const makeShadow = (opts: { elevation: number; radius: number; y: number; opacity: number }): ViewStyle =>
  Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: opts.y },
      shadowOpacity: opts.opacity,
      shadowRadius: opts.radius,
    },
    android: { elevation: opts.elevation },
    default: {},
  }) as ViewStyle

// 统一的间距与圆角辅助：将常用尺寸映射到 Tamagui Tokens
// 在 React Native StyleSheet 中直接使用这些数值，减少重复与魔法数字
export const UI = {
  space: {
    xs: getVariableValue(tamaguiConfig.tokens.space[2]), // 8
    sm: getVariableValue(tamaguiConfig.tokens.space[3]), // 12
    md: getVariableValue(tamaguiConfig.tokens.space[4]), // 16
    lg: getVariableValue(tamaguiConfig.tokens.space[6]), // 24
  },
  radius: {
    xs: getVariableValue(tamaguiConfig.tokens.radius[2]), // 8
    sm: getVariableValue(tamaguiConfig.tokens.radius[3]), // 10
    md: getVariableValue(tamaguiConfig.tokens.radius[4]), // 12
    lg: getVariableValue(tamaguiConfig.tokens.radius[5]), // 14
    xl: getVariableValue(tamaguiConfig.tokens.radius[6]), // 16
    pill: getVariableValue(tamaguiConfig.tokens.radius[7]), // 20
    round: getVariableValue(tamaguiConfig.tokens.radius[8]), // 25
  },
  shadow: {
    sm: makeShadow({ elevation: 2, radius: 6, y: 2, opacity: 0.08 }),
    md: makeShadow({ elevation: 4, radius: 10, y: 4, opacity: 0.12 }),
    lg: makeShadow({ elevation: 8, radius: 16, y: 8, opacity: 0.16 }),
  },
} as const

export type UISpaceKey = keyof typeof UI.space
export type UIRadiusKey = keyof typeof UI.radius

export const s = (key: UISpaceKey) => UI.space[key]
export const r = (key: UIRadiusKey) => UI.radius[key]

// 响应式：用于判断是否为大屏并提供布局信息
export const LARGE_WIDTH_BREAKPOINT = 900
export function useResponsiveLayout() {
  const { width } = useWindowDimensions()
  const isLarge = width >= LARGE_WIDTH_BREAKPOINT
  const columns = isLarge ? 2 : 1
  return { isLarge, columns, width }
}
