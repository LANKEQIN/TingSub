import { useMemo } from 'react'
import { convertCurrency, CurrencyService } from '../../features/currency/services'
import type { CurrencyCode } from '../../features/currency/types'
import type { Subscription } from '../../features/subscriptions/slice'
import { cycleLabelMap, daysUntil, formatPriceBoth } from '../utils/subscriptions'

const DEFAULT_MONTHS_COUNT = 6
const QUARTERLY_MONTHS = 3
const YEARLY_MONTHS = 12
const UPCOMING_DAYS_THRESHOLD = 7
const MONTHS_IN_YEAR = 12
const LAST_MONTH_INDEX = 11

export const useHomeData = (subs: Subscription[], preferredCurrency: CurrencyCode) => {
  const summaryData = useMemo(() => {
    const totalSubs = subs.length
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const daysInMonth = monthEnd.getDate()

    const monthlyEquivalent = (s: Subscription): number => {
      switch (s.cycle) {
        case 'monthly':
          return s.price
        case 'quarterly':
          return s.price / 3
        case 'yearly':
          return s.price / 12
        default:
          return 0
      }
    }

    const firstMonthFraction = (start: Date): number => {
      if (start > monthEnd) return 0
      if (start >= monthStart && start <= monthEnd) {
        return (daysInMonth - (start.getDate() - 1)) / daysInMonth
      }
      return 1
    }

    const monthlySpend = subs.reduce((sum, s) => {
      const from = s.currency ?? 'CNY'
      const eq = monthlyEquivalent(s)
      const frac = s.startISO ? firstMonthFraction(new Date(s.startISO)) : 1
      const add = eq * frac
      return sum + convertCurrency(add, from as CurrencyCode, preferredCurrency as CurrencyCode)
    }, 0)

    const yearlySpend = subs.reduce((sum, s) => {
      const from = s.currency ?? 'CNY'
      const eq = monthlyEquivalent(s)
      let months = MONTHS_IN_YEAR
      if (s.startISO) {
        const start = new Date(s.startISO)
        const currentYear = now.getFullYear()
        if (start.getFullYear() > currentYear) {
          months = 0
        } else if (start.getFullYear() === currentYear) {
          const startMonthIdx = start.getMonth()
          const after = LAST_MONTH_INDEX - startMonthIdx
          const monthStartY = new Date(currentYear, startMonthIdx, 1)
          const monthEndY = new Date(currentYear, startMonthIdx + 1, 0)
          const dim = monthEndY.getDate()
          const frac = start >= monthStartY && start <= monthEndY ? (dim - (start.getDate() - 1)) / dim : 1
          months = after + frac
        } else {
          months = MONTHS_IN_YEAR
        }
      }
      const add = eq * months
      return sum + convertCurrency(add, from as CurrencyCode, preferredCurrency as CurrencyCode)
    }, 0)
    const upcomingBills = subs.filter((s) => {
      const d = daysUntil(s.nextDueISO)
      return d !== null && d >= 0 && d <= 7
    }).length
    return { totalSubs, monthlySpend, yearlySpend, upcomingBills, deltas: { monthlySpend: '+0', yearlySpend: '+0' } }
  }, [subs, preferredCurrency])

  const upcomingList = useMemo(
    () =>
      subs
        .map((s) => {
          const d = daysUntil(s.nextDueISO)
          return {
            id: s.id,
            name: s.name,
            cycle: `${s.category ?? '订阅'} · ${cycleLabelMap[s.cycle]}`,
            next: s.nextDueISO
              ? s.autoRenew && d !== null && d >= 0 && d <= UPCOMING_DAYS_THRESHOLD
                ? `在${d}天后自动续费`
                : `${d}天内`
              : '未设置',
            price: formatPriceBoth(s.price, s.cycle, (s.currency ?? 'CNY') as CurrencyCode, preferredCurrency as CurrencyCode),
            dueDays: d,
          }
        })
        .filter((u) => u.dueDays !== null && u.dueDays >= 0 && u.dueDays <= UPCOMING_DAYS_THRESHOLD)
        .sort((a, b) => (a.dueDays as number) - (b.dueDays as number)),
    [subs, preferredCurrency]
  )

  const activeSubs = useMemo(
    () =>
      subs.map((s) => {
        const d = daysUntil(s.nextDueISO)
        return {
          id: s.id,
          name: s.name,
          price: formatPriceBoth(s.price, s.cycle, (s.currency ?? 'CNY') as CurrencyCode, preferredCurrency as CurrencyCode),
          next: s.nextDueISO
            ? s.autoRenew && d !== null && d >= 0 && d <= 7
              ? `在${d}天后自动续费`
              : `${d}天内`
            : '未设置',
        }
      }),
    [subs, preferredCurrency]
  )

  const spendByMonth = useMemo(() => {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const daysInMonth = monthEnd.getDate()
    const monthlyEquivalent = (s: Subscription): number => (s.cycle === 'monthly' ? s.price : s.cycle === 'quarterly' ? s.price / 3 : s.cycle === 'yearly' ? s.price / 12 : 0)
    const firstMonthFraction = (start: Date): number => {
      if (start > monthEnd) return 0
      if (start >= monthStart && start <= monthEnd) return (daysInMonth - (start.getDate() - 1)) / daysInMonth
      return 1
    }
    const monthly = subs.reduce((sum, s) => {
      const from = s.currency ?? 'CNY'
      const eq = monthlyEquivalent(s)
      const frac = s.startISO ? firstMonthFraction(new Date(s.startISO)) : 1
      const add = eq * frac
      return sum + convertCurrency(add, from as CurrencyCode, preferredCurrency as CurrencyCode)
    }, 0)
    const val = Math.round(monthly)
    return [val, val, val, val, val, val]
  }, [subs, preferredCurrency])

  return { summaryData, upcomingList, activeSubs, spendByMonth }
}

export default useHomeData