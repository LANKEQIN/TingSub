/**
 * Redux store 配置文件
 * 
 * @description
 * 此文件负责配置应用的 Redux store，包括：
 * 1. reducer 的组合
 * 2. 中间件的配置
 * 3. 状态持久化设置
 * 4. 类型定义和自定义 hooks
 * 
 * 使用 redux-persist 库实现状态持久化，确保应用重启后订阅数据不会丢失。
 * 使用 Redux Toolkit 简化 store 配置，并集成 RTK Query 用于数据获取。
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import counterReducer from './features/counter/slice'
import subscriptionsReducer from './features/subscriptions/slice'
import currencyReducer from './features/currency/slice'
import paymentMethodsReducer from './features/payment_methods/slice'
import { subscriptionsApi } from './features/subscriptions/services'

/**
 * 订阅数据持久化配置
 * 
 * @constant
 * @type {Object}
 * @property {string} key - 持久化存储的键名
 * @property {Object} storage - 存储引擎，使用 AsyncStorage
 * 
 * @description
 * 仅对 subscriptions slice 做持久化，避免在根状态注入 _persist
 */
const persistConfigSubs = {
  key: 'subscriptions',
  storage: AsyncStorage,
}

/**
 * 货币偏好持久化配置
 */
const persistConfigCurrency = {
  key: 'currency',
  storage: AsyncStorage,
}

/**
 * 支付方式持久化配置
 */
const persistConfigPaymentMethods = {
  key: 'paymentMethods',
  storage: AsyncStorage,
}

/**
 * 持久化的订阅 reducer
 * 
 * @constant
 * @type {Reducer}
 * 
 * @description
 * 使用 persistReducer 包装原始的 subscriptionsReducer，使其支持状态持久化
 */
const persistedSubscriptionsReducer = persistReducer(persistConfigSubs, subscriptionsReducer)
const persistedCurrencyReducer = persistReducer(persistConfigCurrency, currencyReducer)
const persistedPaymentMethodsReducer = persistReducer(persistConfigPaymentMethods, paymentMethodsReducer)

/**
 * 根 reducer
 * 
 * @constant
 * @type {Reducer}
 * 
 * @description
 * 组合所有 reducer，包括：
 * - counter: 计数器 reducer
 * - subscriptions: 持久化的订阅 reducer
 * - [subscriptionsApi.reducerPath]: RTK Query 自动生成的 reducer
 */
const rootReducer = combineReducers({
  counter: counterReducer,
  subscriptions: persistedSubscriptionsReducer,
  currency: persistedCurrencyReducer,
  paymentMethods: persistedPaymentMethodsReducer,
  [subscriptionsApi.reducerPath]: subscriptionsApi.reducer,
})

/**
 * Redux store 实例
 * 
 * @constant
 * @type {Store}
 * 
 * @description
 * 使用 configureStore 创建 Redux store，配置包括：
 * - reducer: 使用组合后的 rootReducer
 * - middleware: 添加默认中间件和 RTK Query 中间件
 * - serializableCheck: 忽略 redux-persist 相关的 action 和路径，避免序列化警告
 */
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // 可选：忽略持久化标记路径，减少序列化检查噪音
        ignoredPaths: ['subscriptions._persist', 'currency._persist', 'paymentMethods._persist'],
      },
    }).concat(subscriptionsApi.middleware),
})

/**
 * Redux persistor 实例
 * 
 * @constant
 * @type {Persistor}
 * 
 * @description
 * 用于控制状态的持久化和恢复，与 PersistGate 组件配合使用
 */
export const persistor = persistStore(store)

/**
 * Redux 根状态类型
 * 
 * @typedef {Object} RootState
 * @description 从 store.getState() 推导出的根状态类型
 */
export type RootState = ReturnType<typeof store.getState>

/**
 * Redux dispatch 类型
 * 
 * @typedef {Function} AppDispatch
 * @description store.dispatch 的类型
 */
export type AppDispatch = typeof store.dispatch

// 导出类型安全的 hooks

/**
 * 类型安全的 useDispatch hook
 * 
 * @function useAppDispatch
 * @returns {AppDispatch} 返回类型化的 dispatch 函数
 */
export const useAppDispatch = () => useDispatch<AppDispatch>()

/**
 * 类型安全的 useSelector hook
 * 
 * @function useAppSelector
 * @param {Function} selector - 选择器函数
 * @returns {*} 返回选择的状态
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector