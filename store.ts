import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

// 简单计数示例 reducer（保留）
const counterReducer = (state = { value: 0 }, action: { type: string }) => {
  switch (action.type) {
    case 'counter/increment':
      return { ...state, value: state.value + 1 };
    case 'counter/decrement':
      return { ...state, value: state.value - 1 };
    default:
      return state;
  }
};

// 订阅相关类型和初始数据
export type Cycle = 'monthly' | 'quarterly' | 'yearly' | 'lifetime' | 'other';
export interface Subscription {
  id: string;
  name: string;
  category?: string; // 订阅类型（如：视频会员）
  price: number; // 金额（元）
  cycle: Cycle; // 计费周期
  nextDueISO?: string; // 下次到期日期（ISO 字符串）
  autoRenew?: boolean; // 是否自动续费
}

const initialSubs: Subscription[] = [];

// 创建 subscriptions slice
const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState: { list: initialSubs } as { list: Subscription[] },
  reducers: {
    addSubscription(state, action: PayloadAction<Subscription>) {
      state.list.push(action.payload);
    },
    updateSubscription(state, action: PayloadAction<Subscription>) {
      const idx = state.list.findIndex((s) => s.id === action.payload.id);
      if (idx >= 0) state.list[idx] = action.payload;
    },
    removeSubscription(state, action: PayloadAction<string>) {
      state.list = state.list.filter((s) => s.id !== action.payload);
    },
  },
});

export const { addSubscription, updateSubscription, removeSubscription } = subscriptionsSlice.actions;

// 配置 store
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    subscriptions: subscriptionsSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;