import { configureStore, createSlice, PayloadAction, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'

// 简单计数示例 reducer（保留本地定义，避免引入不存在文件）
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
  category?: string; // 订阅类型（如：视频会员 或自定义标签）
  categoryGroup?: string; // 订阅所属分组：影音娱乐/工作/生活/其他（当选择“其他”时，底层分类此字段为“其他”）
  price: number; // 金额（元）
  cycle: Cycle; // 计费周期
  nextDueISO?: string; // 下次到期日期（ISO 字符串）
  autoRenew?: boolean; // 是否自动续费
  currency?: 'CNY'; // 货币（当前仅支持人民币）
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
    setSubscriptions(state, action: PayloadAction<Subscription[]>) {
      state.list = action.payload;
    },
  },
});

export const { addSubscription, updateSubscription, removeSubscription, setSubscriptions } = subscriptionsSlice.actions

// 配置 store 持久化（仅持久化 subscriptions slice）
const rootReducer = combineReducers({
  counter: counterReducer,
  subscriptions: subscriptionsSlice.reducer,
})

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['subscriptions'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch