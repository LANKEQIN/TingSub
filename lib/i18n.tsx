import { I18n } from 'i18n-js'
import * as Localization from 'expo-localization'
import React, { createContext, useMemo, useState } from 'react'

const i18n = new I18n()

i18n.translations = {
  en: {
    common: { appName: 'Subscriptions' },
    tabs: { home: 'Home', statistics: 'Statistics', notifications: 'Notifications', profile: 'Profile' },
    nav: { settings: 'Settings', theme: 'Theme', paymentMethods: 'Payment Methods' },
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
    paymentMethods: {
      title: 'Payment Methods',
      add: 'Add Payment Method',
      list: 'Saved Methods',
      empty: 'No payment methods yet',
      save: 'Save',
      label: 'Label',
      labelPh: 'e.g. Visa ****1234',
      issuer: 'Issuer/Bank',
      holder: 'Holder Name',
      last4: 'Last 4 digits',
      expiryMonth: 'Expiry Month',
      expiryYear: 'Expiry Year',
      provider: 'Wallet Provider',
      types: { credit_card: 'Credit Card', debit_card: 'Debit Card', bank_account: 'Bank Account', e_wallet: 'E-Wallet', alipay: 'Alipay', wechat: 'WeChat Pay' },
    },
  },
  zh: {
    common: { appName: '订阅' },
    tabs: { home: '主页', statistics: '统计', notifications: '通知', profile: '我的' },
    nav: { settings: '应用设置', theme: '主题', paymentMethods: '支付方式' },
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
    paymentMethods: {
      title: '支付方式',
      add: '新增支付方式',
      list: '已保存的支付方式',
      empty: '还没有添加支付方式',
      save: '保存',
      label: '展示标签',
      labelPh: '例如：招商信用卡 ****1234',
      issuer: '发卡行/开户行',
      holder: '持卡人/账户名',
      last4: '后四位',
      expiryMonth: '到期月份',
      expiryYear: '到期年份',
      provider: '钱包提供方',
      types: { credit_card: '信用卡', debit_card: '借记卡', bank_account: '银行账户', e_wallet: '电子钱包', alipay: '支付宝', wechat: '微信支付' },
    },
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