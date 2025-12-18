import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { PaymentMethod } from './types'

/**
 * 支付方式状态接口
 */
interface PaymentMethodsState {
  list: PaymentMethod[]
}

/**
 * 初始状态：空列表
 */
const initialState: PaymentMethodsState = {
  list: [],
}

/**
 * 支付方式 Redux Slice
 *
 * 提供增删改与整表替换能力，用于管理用户的卡片/账户/钱包。
 */
const paymentMethodsSlice = createSlice({
  name: 'paymentMethods',
  initialState,
  reducers: {
    addPaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.list.push(action.payload)
    },
    updatePaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      const idx = state.list.findIndex((p) => p.id === action.payload.id)
      if (idx >= 0) state.list[idx] = action.payload
    },
    removePaymentMethod(state, action: PayloadAction<string>) {
      state.list = state.list.filter((p) => p.id !== action.payload)
    },
    setPaymentMethods(state, action: PayloadAction<PaymentMethod[]>) {
      state.list = action.payload
    },
  },
})

export const { addPaymentMethod, updatePaymentMethod, removePaymentMethod, setPaymentMethods } = paymentMethodsSlice.actions
export default paymentMethodsSlice.reducer
export type { PaymentMethod } from './types'