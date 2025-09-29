/**
 * 订阅功能 RTK Query 服务
 * 
 * @description
 * 此文件定义了使用 RTK Query 管理订阅数据的 API 服务，包括：
 * - 查询订阅列表
 * - 添加新订阅
 * - 更新现有订阅
 * - 删除订阅
 * 
 * 由于当前项目使用本地状态管理而非真实后端 API，
 * 此服务使用模拟数据和本地状态更新来模拟 API 交互。
 * 在实际生产环境中，应替换为真实的 API 端点。
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Subscription } from './slice'

/**
 * RTK Query API 服务实例
 * 
 * @constant
 * @type {Api}
 * @property {string} reducerPath - Redux reducer 的路径
 * @property {Function} baseQuery - 基础查询函数，配置了 API 基础 URL
 * @property {string[]} tagTypes - 缓存标签类型，用于缓存失效
 * @property {Object} endpoints - API 端点定义
 * 
 * @description
 * 创建 RTK Query API 服务实例，配置了基础 URL、缓存标签和端点。
 * 当前配置使用示例 URL，实际使用时应替换为真实 API 地址。
 */
// 示例服务：如未来接入远端数据源，可直接替换 baseUrl
export const subscriptionsApi = createApi({
  reducerPath: 'subscriptionsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://example.com/api/' }),
  tagTypes: ['Subscriptions'],
  endpoints: (builder) => ({
    /**
     * 获取订阅列表查询
     * 
     * @returns {Promise<Subscription[]>} 订阅列表
     * 
     * @description
     * 查询所有订阅数据，提供详细的缓存标签以支持精准缓存失效
     * 
     * @function getSubscriptions
     * @memberof subscriptionsApi
     * @type {QueryEndpoint}
     * @providesTags 为每个订阅项和列表提供缓存标签
     */
    getSubscriptions: builder.query<Subscription[], void>({
      query: () => ({ url: 'subscriptions', method: 'GET' }),
      providesTags: (result) =>
        result ? [...result.map((s) => ({ type: 'Subscriptions' as const, id: s.id })), { type: 'Subscriptions', id: 'LIST' }] : [{ type: 'Subscriptions', id: 'LIST' }],
    }),
    /**
     * 添加订阅变更
     * 
     * @param {Partial<Subscription>} body - 要添加的订阅数据
     * @returns {Promise<Subscription>} 添加后的完整订阅对象
     * 
     * @description
     * 向服务器发送 POST 请求添加新订阅
     * 使 'LIST' 标签失效，触发订阅列表重新获取
     * 
     * @function addSubscription
     * @memberof subscriptionsApi
     * @type {MutationEndpoint}
     * @invalidatesTags 使 'LIST' 标签失效
     */
    addSubscription: builder.mutation<Subscription, Partial<Subscription>>({
      query: (body) => ({ url: 'subscriptions', method: 'POST', body }),
      invalidatesTags: [{ type: 'Subscriptions', id: 'LIST' }],
    }),
    /**
     * 更新订阅变更
     * 
     * @param {Subscription} body - 要更新的完整订阅对象
     * @returns {Promise<Subscription>} 更新后的完整订阅对象
     * 
     * @description
     * 向服务器发送 PUT 请求更新现有订阅
     * 使对应订阅 ID 的标签失效，支持精准缓存更新
     * 
     * @function updateSubscriptionRemote
     * @memberof subscriptionsApi
     * @type {MutationEndpoint}
     * @invalidatesTags 使对应订阅 ID 的标签失效
     */
    updateSubscriptionRemote: builder.mutation<Subscription, Subscription>({
      query: (body) => ({ url: `subscriptions/${body.id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [{ type: 'Subscriptions', id: arg.id }],
    }),
    /**
     * 删除订阅变更
     * 
     * @param {string} id - 要删除的订阅 ID
     * @returns {Promise<{ success: boolean; id: string }>} 删除操作结果
     * 
     * @description
     * 向服务器发送 DELETE 请求删除指定订阅
     * 使对应订阅 ID 的标签失效
     * 
     * @function removeSubscriptionRemote
     * @memberof subscriptionsApi
     * @type {MutationEndpoint}
     * @invalidatesTags 使对应订阅 ID 的标签失效
     */
    removeSubscriptionRemote: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({ url: `subscriptions/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Subscriptions', id }],
    }),
  }),
})

// 导出自动生成的 hooks

/**
 * 自动生成的 RTK Query hooks
 * 
 * @description
 * RTK Query 自动生成的 React hooks，用于在组件中调用 API 端点
 * 
 * @property {Function} useGetSubscriptionsQuery - 用于获取订阅列表的查询 hook
 * @property {Function} useAddSubscriptionMutation - 用于添加订阅的变更 hook
 * @property {Function} useUpdateSubscriptionRemoteMutation - 用于更新订阅的变更 hook
 * @property {Function} useRemoveSubscriptionRemoteMutation - 用于删除订阅的变更 hook
 */
export const {
  useGetSubscriptionsQuery,
  useAddSubscriptionMutation,
  useUpdateSubscriptionRemoteMutation,
  useRemoveSubscriptionRemoteMutation,
} = subscriptionsApi