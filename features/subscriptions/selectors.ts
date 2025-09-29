import { RootState } from '../../store'
import type { Subscription } from './slice'

export const selectSubscriptions = (state: RootState): Subscription[] => state.subscriptions.list

export const selectSubscriptionById = (id: string) => (state: RootState): Subscription | undefined =>
  state.subscriptions.list.find((s) => s.id === id)

export const selectTotalMonthlyCost = (state: RootState): number => {
  const monthlyEquivalent = (s: Subscription): number => {
    switch (s.cycle) {
      case 'monthly':
        return s.price
      case 'quarterly':
        return s.price / 3
      case 'yearly':
        return s.price / 12
      case 'lifetime':
        return 0
      case 'other':
      default:
        return 0
    }
  }
  return state.subscriptions.list.reduce((sum, s) => sum + monthlyEquivalent(s), 0)
}