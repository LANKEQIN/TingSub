import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CurrencyCode } from './types'

/**
 * 货币偏好状态
 */
interface CurrencyState {
  preferred: CurrencyCode
}

const initialState: CurrencyState = {
  preferred: 'CNY',
}

/**
 * Currency 偏好 Redux Slice
 */
const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setPreferredCurrency(state, action: PayloadAction<CurrencyCode>) {
      state.preferred = action.payload
    },
  },
})

export const { setPreferredCurrency } = currencySlice.actions
export const selectPreferredCurrency = (state: any): CurrencyCode => state.currency?.preferred ?? 'CNY'

export default currencySlice.reducer