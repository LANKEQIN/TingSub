import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'

import counterReducer from './features/counter/slice'
import subscriptionsReducer from './features/subscriptions/slice'
import { subscriptionsApi } from './features/subscriptions/services'

// 仅对 subscriptions slice 做持久化，避免在根状态注入 _persist
const persistConfigSubs = {
  key: 'subscriptions',
  storage: AsyncStorage,
}

const persistedSubscriptionsReducer = persistReducer(persistConfigSubs, subscriptionsReducer)

const rootReducer = combineReducers({
  counter: counterReducer,
  subscriptions: persistedSubscriptionsReducer,
  [subscriptionsApi.reducerPath]: subscriptionsApi.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // 可选：忽略持久化标记路径，减少序列化检查噪音
        ignoredPaths: ['subscriptions._persist'],
      },
    }).concat(subscriptionsApi.middleware),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch