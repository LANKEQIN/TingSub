import React, { useContext } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ThemeContext } from '../../lib/theme'
import tamaguiConfig from '../../tamagui.config'
import { getVariableValue } from '@tamagui/core'
import { UI } from '../../lib/ui'
import { useAppSelector } from '../../store'
import { selectDisplayScale } from '../../features/ui/selectors'

type Props = {
  children: React.ReactNode
  scrollable?: boolean
  contentContainerStyle?: any
  style?: any
}

/**
 * 统一页面容器：负责安全区、背景色、内边距以及可选滚动
 */
const ScreenContainer: React.FC<Props> = ({ children, scrollable, contentContainerStyle, style }) => {
  const insets = useSafeAreaInsets()
  const { effectiveScheme } = useContext(ThemeContext)
  const scale = useAppSelector(selectDisplayScale)
  const s = createStyles(effectiveScheme, scale, insets.top, insets.bottom)

  if (scrollable) {
    return (
      <ScrollView
        style={[s.container, style]}
        contentContainerStyle={[s.scrollContent, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    )
  }

  return (
    <View style={[s.container, s.staticContent, style]}>
      {children}
    </View>
  )
}

function createStyles(scheme: 'light' | 'dark', scale: number, topInset: number, bottomInset: number){
  const isDark = scheme === 'dark'
  const c = tamaguiConfig.tokens.color
  const v = getVariableValue
  const colors = {
    pageBg: v(isDark ? c.bgPageDark : c.bgPageLight),
    border: v(isDark ? c.borderDark : c.borderLight),
  }
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.pageBg as string,
      paddingTop: topInset + UI.space.lg * scale,
    },
    scrollContent: {
      paddingHorizontal: UI.space.md * scale,
      // UI.space 没有 xl，统一使用 lg；底部加入安全区以避免被底部栏遮挡
      paddingBottom: bottomInset + UI.space.lg * scale,
    },
    staticContent: {
      alignItems: 'center',
    },
  })
}

export default ScreenContainer