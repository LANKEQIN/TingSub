import { I18n } from 'i18n-js'
import * as Localization from 'expo-localization'
import React, { createContext, useMemo, useState } from 'react'

const i18n = new I18n()

i18n.translations = {
  en: {
    common: { appName: 'Subscriptions' },
    tabs: { home: 'Home', statistics: 'Statistics', notifications: 'Notifications', profile: 'Profile' },
    nav: { settings: 'Settings', theme: 'Theme' },
    home: {
      title: 'Subscriptions',
      searchPlaceholder: 'Search subscriptions…',
      overview: 'Overview',
      active: 'Active',
      upcoming: 'Upcoming',
      viewAll: 'View All',
      more: 'More',
      totalSubs: 'Total Subscriptions',
      monthlySpend: 'Monthly Spend',
      yearlySpend: 'Yearly Spend',
      upcomingIn7Days: 'In 7 days',
    },
    notifications: { title: 'Notifications', content: 'This is the notifications page' },
    profile: { title: 'Profile', theme: 'Theme', appSettings: 'App Settings', appSettingsSub: 'Currency preference etc.' },
    theme: { title: 'Theme', auto: 'Auto', light: 'Light', dark: 'Dark', currencyPref: 'Preferred Currency' },
    settings: { title: 'Settings', lang: { zh: '中文', en: 'English' } },
  },
  zh: {
    common: { appName: '订阅' },
    tabs: { home: '主页', statistics: '统计', notifications: '通知', profile: '我的' },
    nav: { settings: '应用设置', theme: '主题' },
    home: {
      title: '订阅',
      searchPlaceholder: '搜索订阅…',
      overview: '订阅概览',
      active: '活跃订阅',
      upcoming: '即将到期',
      viewAll: '查看全部',
      more: '更多',
      totalSubs: '总订阅数',
      monthlySpend: '本月支出',
      yearlySpend: '年度支出',
      upcomingIn7Days: '7天内',
    },
    notifications: { title: '通知', content: '这是通知页面内容' },
    profile: { title: '我的', theme: '主题', appSettings: '应用设置', appSettingsSub: '偏好货币等应用偏好设置' },
    theme: { title: '主题模式', auto: '自动', light: '浅色', dark: '深色', currencyPref: '偏好货币' },
    settings: { title: '应用设置', lang: { zh: '中文', en: '英语' } },
  },
}

i18n.enableFallback = true

export type Locale = 'zh' | 'en'

export const I18nContext = createContext<{ locale: Locale; setLocale: (l: Locale) => void; t: typeof i18n.t }>({
  locale: 'zh', setLocale: () => {}, t: i18n.t.bind(i18n),
})

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = (Localization.getLocales()[0]?.languageTag ?? 'zh').toLowerCase().startsWith('zh') ? 'zh' : 'en'
  const [locale, setLocale] = useState<Locale>(initial)
  i18n.locale = locale
  const value = useMemo(() => ({ locale, setLocale, t: i18n.t.bind(i18n) }), [locale])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const t = (key: Parameters<typeof i18n.t>[0], config?: Parameters<typeof i18n.t>[1]) => i18n.t(key, config)