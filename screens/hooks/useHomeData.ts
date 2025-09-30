import { useMemo } from 'react'
import { convertCurrency, CurrencyService } from '../../features/currency/services'
import type { CurrencyCode } from '../../features/currency/types'
import type { Subscription } from '../../features/subscriptions/slice'
import { cycleLabelMap, daysUntil, formatPriceBoth } from '../utils/subscriptions'

export const useHomeData = (subs: Subscription[], preferredCurrency: CurrencyCode) => {
  const summaryData = useMemo(() => {
    const totalSubs = subs.length
    const monthlySpend = subs.reduce((sum, s) => {
      const from = s.currency ?? 'CNY'
      const add = s.cycle === 'monthly' ? s.price : s.cycle === 'quarterly' ? s.price / 3 : s.cycle === 'yearly' ? s.price / 12 : 0
      return sum + convertCurrency(add, from as CurrencyCode, preferredCurrency as CurrencyCode)
    }, 0)
    const yearlySpend = subs.reduce((sum, s) => {
      const from = s.currency ?? 'CNY'
      const add = s.cycle === 'monthly' ? s.price * 12 : s.cycle === 'quarterly' ? s.price * 4 : s.cycle === 'yearly' ? s.price : 0
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
            next: s.nextDueISO ? `${d}天内` : '未设置',
            price: formatPriceBoth(s.price, s.cycle, (s.currency ?? 'CNY') as CurrencyCode, preferredCurrency as CurrencyCode),
            dueDays: d,
          }
        })
        .filter((u) => u.dueDays !== null && u.dueDays >= 0 && u.dueDays <= 7)
        .sort((a, b) => (a.dueDays as number) - (b.dueDays as number)),
    [subs, preferredCurrency]
  )

  const activeSubs = useMemo(
    () =>
      subs.map((s) => ({
        id: s.id,
        name: s.name,
        price: formatPriceBoth(s.price, s.cycle, (s.currency ?? 'CNY') as CurrencyCode, preferredCurrency as CurrencyCode),
        next: s.nextDueISO ? `${daysUntil(s.nextDueISO)}天内` : '未设置',
      })),
    [subs, preferredCurrency]
  )

  const spendByMonth = useMemo(() => {
    const monthly = subs.reduce((sum, s) => {
      const from = s.currency ?? 'CNY'
      const add = s.cycle === 'monthly' ? s.price : s.cycle === 'quarterly' ? s.price / 3 : s.cycle === 'yearly' ? s.price / 12 : 0
      return sum + convertCurrency(add, from as CurrencyCode, preferredCurrency as CurrencyCode)
    }, 0)
    const val = Math.round(monthly)
    return [val, val, val, val, val, val]
  }, [subs, preferredCurrency])

  return { summaryData, upcomingList, activeSubs, spendByMonth }
}

export default useHomeData