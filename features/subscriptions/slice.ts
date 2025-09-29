/**
 * 订阅功能 Redux Slice
 * 
 * @description
 * 此文件定义了管理订阅列表状态的 Redux slice，包括以下功能：
 * - 添加新订阅
 * - 更新现有订阅
 * - 删除订阅
 * - 设置完整的订阅列表
 * 
 * 使用 Redux Toolkit 的 createSlice 简化 reducer 逻辑，自动处理不可变更新。
 * 状态持久化通过 redux-persist 实现，确保应用重启后数据不会丢失。
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Subscription, Cycle } from './types'

/**
 * 订阅状态接口
 * 
 * @typedef {Object} SubscriptionsState
 * @property {Subscription[]} list - 订阅列表
 */
interface SubscriptionsState {
  list: Subscription[]
}

/**
 * 初始状态
 * 
 * @description
 * 订阅列表初始为空数组
 */
const initialState: SubscriptionsState = {
  list: [],
}

/**
 * 订阅 Redux Slice
 * 
 * @description
 * 创建名为 'subscriptions' 的 Redux slice，包含管理订阅列表的 reducers
 */
const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    /**
     * 添加订阅
     * 
     * @param {SubscriptionsState} state - 当前状态
     * @param {PayloadAction<Subscription>} action - 包含新订阅的 action
     * 
     * @description
     * 将新的订阅对象添加到订阅列表末尾
     */
    addSubscription(state, action: PayloadAction<Subscription>) {
      state.list.push(action.payload)
    },
    /**
     * 更新订阅
     * 
     * @param {SubscriptionsState} state - 当前状态
     * @param {PayloadAction<Subscription>} action - 包含更新后订阅的 action
     * 
     * @description
     * 根据订阅 ID 查找并替换现有订阅
     * 如果找不到匹配的订阅，则不执行任何操作
     */
    updateSubscription(state, action: PayloadAction<Subscription>) {
      const idx = state.list.findIndex((s) => s.id === action.payload.id)
      if (idx >= 0) state.list[idx] = action.payload
    },
    /**
     * 删除订阅
     * 
     * @param {SubscriptionsState} state - 当前状态
     * @param {PayloadAction<string>} action - 包含要删除订阅 ID 的 action
     * 
     * @description
     * 根据订阅 ID 过滤掉要删除的订阅
     */
    removeSubscription(state, action: PayloadAction<string>) {
      state.list = state.list.filter((s) => s.id !== action.payload)
    },
    /**
     * 设置订阅列表
     * 
     * @param {SubscriptionsState} state - 当前状态
     * @param {PayloadAction<Subscription[]>} action - 包含完整订阅列表的 action
     * 
     * @description
     * 用新的订阅列表完全替换当前状态
     * 通常用于从持久化存储或远程 API 加载数据
     */
    setSubscriptions(state, action: PayloadAction<Subscription[]>) {
      state.list = action.payload
    },
  },
})

// 导出 action creators
export const { addSubscription, updateSubscription, removeSubscription, setSubscriptions } = subscriptionsSlice.actions

// 导出 reducer
export default subscriptionsSlice.reducer
export type { Subscription, Cycle } from './types'