import { createSlice } from '@reduxjs/toolkit'

/**
 * 计数器状态接口
 * 
 * @interface CounterState
 * @property {number} value - 计数器的当前值
 */
interface CounterState {
  value: number
}

/**
 * 计数器的初始状态
 * 
 * @type {CounterState}
 */
const initialState: CounterState = { value: 0 }

/**
 * 计数器 Redux Slice
 * 
 * 此 Slice 管理一个简单的计数器状态，提供增加和减少计数的功能。
 * 使用 Redux Toolkit 的 createSlice API 创建。
 * 
 * @type {Slice<CounterState>}
 */
const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    /**
     * 增加计数器值的 reducer
     * 
     * @param {CounterState} state - 当前状态（Redux Toolkit 允许直接修改）
     */
    increment(state) {
      state.value += 1
    },
    /**
     * 减少计数器值的 reducer
     * 
     * @param {CounterState} state - 当前状态（Redux Toolkit 允许直接修改）
     */
    decrement(state) {
      state.value -= 1
    },
  },
})

export const { increment, decrement } = counterSlice.actions

export default counterSlice.reducer