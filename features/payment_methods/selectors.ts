import type { RootState } from '../../store'
import type { PaymentMethod } from './types'

/**
 * 选择器：获取所有支付方式列表
 */
export const selectPaymentMethods = (state: RootState): PaymentMethod[] => state.paymentMethods.list

/**
 * 选择器工厂：根据ID获取支付方式
 */
export const selectPaymentMethodById = (id: string) => (state: RootState): PaymentMethod | undefined =>
  state.paymentMethods.list.find((p) => p.id === id)