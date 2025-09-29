import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Cycle = 'monthly' | 'quarterly' | 'yearly' | 'lifetime' | 'other'

export interface Subscription {
  id: string
  name: string
  category?: string
  categoryGroup?: string
  price: number
  cycle: Cycle
  nextDueISO?: string
  autoRenew?: boolean
  currency?: 'CNY'
}

const initialSubs: Subscription[] = []

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState: { list: initialSubs } as { list: Subscription[] },
  reducers: {
    addSubscription(state, action: PayloadAction<Subscription>) {
      state.list.push(action.payload)
    },
    updateSubscription(state, action: PayloadAction<Subscription>) {
      const idx = state.list.findIndex((s) => s.id === action.payload.id)
      if (idx >= 0) state.list[idx] = action.payload
    },
    removeSubscription(state, action: PayloadAction<string>) {
      state.list = state.list.filter((s) => s.id !== action.payload)
    },
    setSubscriptions(state, action: PayloadAction<Subscription[]>) {
      state.list = action.payload
    },
  },
})

export const { addSubscription, updateSubscription, removeSubscription, setSubscriptions } = subscriptionsSlice.actions

export default subscriptionsSlice.reducer