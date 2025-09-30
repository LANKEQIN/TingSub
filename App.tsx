import React, { useMemo, useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet } from 'react-native'
import { TamaguiProvider } from 'tamagui'
import tamaguiConfig from './tamagui.config'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useColorScheme } from 'react-native'
import { Home, BarChart3, Bell, User } from '@tamagui/lucide-icons'
import HomeScreen from './screens/HomeScreen'
import StatisticsScreen from './screens/StatisticsScreen'
import NotificationsScreen from './screens/NotificationsScreen'
import ProfileScreen from './screens/ProfileScreen'
import ThemeScreen from './screens/ThemeScreen'
import SettingsScreen from './screens/SettingsScreen'
import PaymentMethodsScreen from './screens/PaymentMethodsScreen'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { store, persistor } from './store'
import { PersistGate } from 'redux-persist/integration/react'
import type { RootStackParamList, TabParamList } from './lib/navigation'

import { ThemeContext } from './lib/theme'
import { I18nProvider, t } from './lib/i18n'

const Tab = createBottomTabNavigator<TabParamList, 'main-tabs'>()
const Stack = createNativeStackNavigator<RootStackParamList, 'root-stack'>()

/**
 * 主要标签页导航组件
 * 
 * @component
 * @param {Object} props - 组件属性
 * @param {'light' | 'dark'} props.effectiveScheme - 当前生效的主题方案
 * @returns {JSX.Element} 返回底部标签导航组件
 * 
 * @description
 * 此组件负责渲染应用的底部标签导航栏，包含四个主要页面：
 * - 主页：显示订阅概览和即将到期的订阅
 * - 统计：显示订阅支出分析和图表
 * - 通知：显示系统通知
 * - 我的：用户个人设置和账户信息
 * 
 * 根据当前主题方案(effectiveScheme)动态调整导航栏的样式，包括背景色、
 * 图标颜色、阴影效果等，确保在亮色和暗色模式下都有良好的视觉体验。
 */
function MainTabs({ effectiveScheme }: { effectiveScheme: 'light' | 'dark' }) {
  const insets = useSafeAreaInsets()
  return (
    <Tab.Navigator
      id="main-tabs"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let IconComponent
          if (route.name === 'Home') {
            IconComponent = Home
          } else if (route.name === 'Statistics') {
            IconComponent = BarChart3
          } else if (route.name === 'Notifications') {
            IconComponent = Bell
          } else if (route.name === 'Profile') {
            IconComponent = User
          }
          return <IconComponent size={size} color={color} />
        },
        tabBarActiveTintColor: effectiveScheme === 'dark' ? '#4DB6FF' : '#007AFF',
        tabBarInactiveTintColor: effectiveScheme === 'dark' ? '#B0B0B8' : '#8E8E93',
        tabBarStyle: {
          backgroundColor: effectiveScheme === 'dark' ? '#121212' : '#FFFFFF',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: effectiveScheme === 'dark' ? '#000' : '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          paddingBottom: Math.max(8, insets.bottom),
          paddingTop: 8,
          height: 70 + insets.bottom,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500', marginTop: 4 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('tabs.home'), tabBarLabel: t('tabs.home') }} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} options={{ title: t('tabs.statistics'), tabBarLabel: t('tabs.statistics') }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ title: t('tabs.notifications'), tabBarLabel: t('tabs.notifications') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: t('tabs.profile'), tabBarLabel: t('tabs.profile') }} />
    </Tab.Navigator>
  )
}

/**
 * 应用根组件
 * 
 * @component
 * @returns {JSX.Element} 返回应用的根组件
 * 
 * @description
 * 此组件是整个应用的入口点，负责设置和管理以下核心功能：
 * 1. 主题管理：通过ThemeContext提供主题模式(auto/light/dark)和当前生效的主题方案
 * 2. 状态管理：通过Redux Provider提供全局状态管理
 * 3. 持久化：通过PersistGate确保Redux状态在应用重启后能正确恢复
 * 4. UI框架：通过TamaguiProvider提供UI组件和主题支持
 * 5. 安全区域：通过SafeAreaProvider处理设备安全区域
 * 6. 导航：通过NavigationContainer管理应用导航
 * 
 * 主题模式(themeMode)可以是'auto'(跟随系统)、'light'(亮色)或'dark'(暗色)。
 * effectiveScheme根据themeMode和系统主题计算出当前实际使用的主题方案。
 */
export default function App() {
  const systemScheme = useColorScheme()
  const [themeMode, setThemeMode] = useState<'auto' | 'light' | 'dark'>('auto')
  // 计算当前生效的主题方案：如果主题模式为'auto'，则使用系统主题；否则使用指定的主题
  const effectiveScheme = useMemo(() => (themeMode === 'auto' ? (systemScheme ?? 'light') : themeMode), [themeMode, systemScheme]) as 'light' | 'dark'

  const navigationTheme = effectiveScheme === 'dark' ? DarkTheme : DefaultTheme

  return (
    <I18nProvider>
      <ThemeContext.Provider value={{ themeMode, setThemeMode, effectiveScheme }}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <TamaguiProvider config={tamaguiConfig} defaultTheme={effectiveScheme}>
              <SafeAreaProvider>
                <NavigationContainer theme={navigationTheme}>
                  <Stack.Navigator id="root-stack">
                    <Stack.Screen name="Tabs" options={{ headerShown: false }}>
                      {() => <MainTabs effectiveScheme={effectiveScheme} />}
                    </Stack.Screen>
                    <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: t('settings.title') }} />
                    <Stack.Screen name="Theme" component={ThemeScreen} options={{ title: t('nav.theme') }} />
                    <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ title: t('nav.paymentMethods') }} />
                  </Stack.Navigator>
                  <StatusBar style="auto" />
                </NavigationContainer>
              </SafeAreaProvider>
            </TamaguiProvider>
          </PersistGate>
        </Provider>
      </ThemeContext.Provider>
    </I18nProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})