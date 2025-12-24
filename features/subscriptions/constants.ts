import type { Cycle } from './types'

/**
 * 计费周期标签常量
 * 
 * 提供统一的 Cycle 标签映射，支持中英文
 * 所有 UI 文本应使用此常量，避免硬编码中文字符串
 */
export const CYCLE_LABELS: Record<Cycle, { zh: string; en: string }> = {
  monthly: { zh: '月付', en: 'Monthly' },
  quarterly: { zh: '季付', en: 'Quarterly' },
  yearly: { zh: '年付', en: 'Yearly' },
  lifetime: { zh: '终身', en: 'Lifetime' },
  other: { zh: '其他', en: 'Other' },
}

/**
 * 计费周期后缀常量
 * 
 * 用于价格显示时的单位后缀，如 "/月"、"/年" 等
 */
export const CYCLE_SUFFIXES: Record<Cycle, { zh: string; en: string }> = {
  monthly: { zh: '/月', en: '/mo' },
  quarterly: { zh: '/季', en: '/quarter' },
  yearly: { zh: '/年', en: '/year' },
  lifetime: { zh: '/终身', en: '/lifetime' },
  other: { zh: '', en: '' },
}

/**
 * 获取计费周期标签
 * 
 * @param cycle - 计费周期类型
 * @param locale - 语言环境 ('zh' | 'en')
 * @returns 对应语言的周期标签
 */
export function getCycleLabel(cycle: Cycle, locale: 'zh' | 'en' = 'zh'): string {
  return CYCLE_LABELS[cycle][locale]
}

/**
 * 获取计费周期后缀
 * 
 * @param cycle - 计费周期类型
 * @param locale - 语言环境 ('zh' | 'en')
 * @returns 对应语言的周期后缀
 */
export function getCycleSuffix(cycle: Cycle, locale: 'zh' | 'en' = 'zh'): string {
  return CYCLE_SUFFIXES[cycle][locale]
}

/**
 * 所有计费周期选项数组
 * 
 * 用于遍历和生成 UI 选项
 */
export const CYCLE_OPTIONS: Cycle[] = ['monthly', 'quarterly', 'yearly', 'lifetime', 'other']
