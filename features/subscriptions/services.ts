import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Subscription } from './slice'

// 示例服务：如未来接入远端数据源，可直接替换 baseUrl
export const subscriptionsApi = createApi({
  reducerPath: 'subscriptionsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://example.com/api/' }),
  tagTypes: ['Subscriptions'],
  endpoints: (builder) => ({
    getSubscriptions: builder.query<Subscription[], void>({
      query: () => ({ url: 'subscriptions', method: 'GET' }),
      providesTags: (result) =>
        result ? [...result.map((s) => ({ type: 'Subscriptions' as const, id: s.id })), { type: 'Subscriptions', id: 'LIST' }] : [{ type: 'Subscriptions', id: 'LIST' }],
    }),
    addSubscription: builder.mutation<Subscription, Partial<Subscription>>({
      query: (body) => ({ url: 'subscriptions', method: 'POST', body }),
      invalidatesTags: [{ type: 'Subscriptions', id: 'LIST' }],
    }),
    updateSubscriptionRemote: builder.mutation<Subscription, Subscription>({
      query: (body) => ({ url: `subscriptions/${body.id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [{ type: 'Subscriptions', id: arg.id }],
    }),
    removeSubscriptionRemote: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({ url: `subscriptions/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Subscriptions', id }],
    }),
  }),
})

export const {
  useGetSubscriptionsQuery,
  useAddSubscriptionMutation,
  useUpdateSubscriptionRemoteMutation,
  useRemoveSubscriptionRemoteMutation,
} = subscriptionsApi