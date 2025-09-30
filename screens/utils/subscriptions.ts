import { CurrencyService, convertCurrency } from '../../features/currency/services'
import type { CurrencyCode } from '../../features/currency/types'
import type { Cycle, Subscription } from '../../features/subscriptions/slice'
import type { CategoryGroup } from '../../features/subscriptions/types'

// 计费周期标签映射（带类型）
export const cycleLabelMap: Record<Cycle, string> = {
  monthly: '月付',
  quarterly: '季付',
  yearly: '年付',
  lifetime: '终身',
  other: '其他',
}

// 可选的订阅分组选项（带类型）
export const categoryGroupOptions: CategoryGroup[] = ['影音娱乐', '工作', '生活', '其他']

// 类型守卫与转换器
export const isCategoryGroup = (val: string): val is CategoryGroup => (categoryGroupOptions as string[]).includes(val)
export const toCategoryGroup = (val?: string): CategoryGroup => (val && isCategoryGroup(val) ? val : '其他')

export function formatPriceByPref(
  price: number,
  cycle: string,
  fromCode: CurrencyCode,
  toCode: CurrencyCode
) {
  const converted = convertCurrency(price, fromCode, toCode)
  const base = CurrencyService.format(converted, toCode)
  const suffix = cycle === 'yearly' ? '/年' : cycle === 'quarterly' ? '/季' : cycle === 'lifetime' ? '/终身' : cycle === '其他' || cycle === 'other' ? '' : '/月'
  return `${base}${suffix}`
}

// 原价 + 换算价的透明显示
export function formatPriceBoth(
  price: number,
  cycle: string,
  fromCode: CurrencyCode,
  toCode: CurrencyCode
) {
  const orig = CurrencyService.format(price, fromCode)
  const conv = CurrencyService.convertAndFormat(price, fromCode, toCode)
  const suffix = cycle === 'yearly' ? '/年' : cycle === 'quarterly' ? '/季' : cycle === 'lifetime' ? '/终身' : cycle === '其他' || cycle === 'other' ? '' : '/月'
  if (fromCode === toCode) {
    return `${orig}${suffix}`
  }
  return `${orig}${suffix} · ≈ ${conv}${suffix}`
}

export function daysUntil(dateISO?: string | null) {
  if (!dateISO) return null
  const d = new Date(dateISO)
  const diff = Math.ceil((d.getTime() - Date.now()) / 86400000)
  return diff
}

// Cycle 类型已从 slice 统一导出，这里无需再次从 types 导入

const pad2 = (n: number) => String(n).padStart(2, '0')
const formatISO = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

function addMonthsSafe(date: Date, months: number): Date {
  const y = date.getFullYear()
  const m = date.getMonth()
  const day = date.getDate()
  const base = new Date(y, m + months, 1)
  const lastDay = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate()
  const safeDay = Math.min(day, lastDay)
  return new Date(base.getFullYear(), base.getMonth(), safeDay)
}

/**
 * 根据周期推进到期日（用于自动续费）
 * - monthly: +1 月
 * - quarterly: +3 月
 * - yearly: +12 月
 * - lifetime/other: 不推进
 * 若当前到期日已过去，会循环推进直至未来日期
 */
export function advanceNextDueISO(currentISO: string, cycle: Cycle): string {
  if (!currentISO) return currentISO
  let due = new Date(currentISO)
  const today = new Date()
  const months = cycle === 'monthly' ? 1 : cycle === 'quarterly' ? 3 : cycle === 'yearly' ? 12 : 0
  if (months <= 0) return currentISO
  while (due.getTime() <= today.getTime()) {
    due = addMonthsSafe(due, months)
  }
  return formatISO(due)
}

// 便捷类型导出（如组件/Hook 需要）
export type { Subscription, CategoryGroup, Cycle, CurrencyCode }