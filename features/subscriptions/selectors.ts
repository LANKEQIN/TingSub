import { RootState } from '../../store'
import type { Subscription } from './slice'

/**
 * 选择器：获取所有订阅列表
 * 
 * @param {RootState} state - Redux 根状态
 * @returns {Subscription[]} 订阅列表数组
 */
export const selectSubscriptions = (state: RootState): Subscription[] => state.subscriptions.list

/**
 * 选择器工厂：根据 ID 获取特定订阅
 * 
 * @param {string} id - 订阅的唯一标识符
 * @returns {(state: RootState) => (Subscription | undefined)} 返回一个选择器函数
 */
export const selectSubscriptionById = (id: string) => (state: RootState): Subscription | undefined =>
  state.subscriptions.list.find((s) => s.id === id)

/**
 * 选择器：计算所有订阅的月度等效总成本
 * 
 * 此选择器将不同周期的订阅费用转换为月度等效值并求和。
 * - 月付：直接使用价格
 * - 季付：价格除以 3
 * - 年付：价格除以 12
 * - 终身/其他：视为 0
 * 
 * @param {RootState} state - Redux 根状态
 * @returns {number} 月度等效总成本
 */
export const selectTotalMonthlyCost = (state: RootState): number => {
  /**
   * 辅助函数：计算单个订阅的月度等效成本
   * 
   * @param {Subscription} s - 订阅对象
   * @returns {number} 月度等效成本
   */
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