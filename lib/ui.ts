import { getVariableValue } from '@tamagui/core'
import { useWindowDimensions } from 'react-native'
import tamaguiConfig from '../tamagui.config'

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