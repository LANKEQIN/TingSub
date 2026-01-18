/**
 * 订阅状态管理
 * 使用Zustand管理订阅相关的全局状态
 */

import { create } from 'zustand';
import { SubscriptionRepository } from '../repositories/SubscriptionRepository';
import type {
  Subscription,
  CreateSubscriptionParams,
  UpdateSubscriptionParams,
  SubscriptionQueryParams,
  SubscriptionStats,
} from '../../types/subscription';

/**
 * 订阅状态接口
 */
interface SubscriptionState {
  // 状态数据
  subscriptions: Subscription[];
  currentSubscription: Subscription | null;
  stats: SubscriptionStats | null;
  isLoading: boolean;
  error: string | null;

  // 订阅操作方法
  loadSubscriptions: (repository: SubscriptionRepository, userId: string) => Promise<void>;
  loadSubscription: (repository: SubscriptionRepository, id: string) => Promise<void>;
  createSubscription: (
    repository: SubscriptionRepository,
    params: CreateSubscriptionParams
  ) => Promise<Subscription>;
  updateSubscription: (
    repository: SubscriptionRepository,
    id: string,
    params: UpdateSubscriptionParams
  ) => Promise<Subscription>;
  deleteSubscription: (repository: SubscriptionRepository, id: string) => Promise<void>;
  loadStats: (repository: SubscriptionRepository, userId: string) => Promise<void>;
  querySubscriptions: (
    repository: SubscriptionRepository,
    params: SubscriptionQueryParams
  ) => Promise<Subscription[]>;
  getExpiringSoon: (repository: SubscriptionRepository, userId: string) => Promise<Subscription[]>;
  getExpired: (repository: SubscriptionRepository, userId: string) => Promise<Subscription[]>;
  getActiveSubscriptions: (
    repository: SubscriptionRepository,
    userId: string
  ) => Promise<Subscription[]>;
  searchSubscriptions: (
    repository: SubscriptionRepository,
    userId: string,
    keyword: string
  ) => Promise<Subscription[]>;
  sortByRenewalDate: (
    repository: SubscriptionRepository,
    userId: string,
    order?: 'asc' | 'desc'
  ) => Promise<void>;
  sortByPrice: (
    repository: SubscriptionRepository,
    userId: string,
    order?: 'asc' | 'desc'
  ) => Promise<void>;
  sortByCreatedAt: (
    repository: SubscriptionRepository,
    userId: string,
    order?: 'asc' | 'desc'
  ) => Promise<void>;
  updateStatus: (
    repository: SubscriptionRepository,
    id: string,
    status: 'active' | 'cancelled' | 'expired'
  ) => Promise<void>;
  updateAutoRenew: (
    repository: SubscriptionRepository,
    id: string,
    autoRenew: boolean
  ) => Promise<void>;
  addTag: (repository: SubscriptionRepository, id: string, tag: string) => Promise<void>;
  removeTag: (repository: SubscriptionRepository, id: string, tag: string) => Promise<void>;
  clearError: () => void;
}

/**
 * 订阅状态管理Store
 */
export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  // 初始状态
  subscriptions: [],
  currentSubscription: null,
  stats: null,
  isLoading: false,
  error: null,

  /**
   * 加载订阅列表
   */
  loadSubscriptions: async (repository: SubscriptionRepository, userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const subscriptions = await repository.getByUserId(userId);
      set({ subscriptions, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载订阅列表失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 加载单个订阅
   */
  loadSubscription: async (repository: SubscriptionRepository, id: string) => {
    set({ isLoading: true, error: null });

    try {
      const subscription = await repository.getById(id);
      set({ currentSubscription: subscription || null, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载订阅失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 创建订阅
   */
  createSubscription: async (
    repository: SubscriptionRepository,
    params: CreateSubscriptionParams
  ) => {
    set({ isLoading: true, error: null });

    try {
      const subscription = await repository.createSubscription(params);

      const { subscriptions } = get();
      set({
        subscriptions: [...subscriptions, subscription],
        currentSubscription: subscription,
        isLoading: false,
      });

      return subscription;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建订阅失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 更新订阅
   */
  updateSubscription: async (
    repository: SubscriptionRepository,
    id: string,
    params: UpdateSubscriptionParams
  ) => {
    set({ isLoading: true, error: null });

    try {
      const updatedSubscription = await repository.updateSubscription(id, params);

      const { subscriptions, currentSubscription } = get();
      const newSubscriptions = subscriptions.map((sub) =>
        sub.id === id ? updatedSubscription : sub
      );

      set({
        subscriptions: newSubscriptions,
        currentSubscription:
          currentSubscription?.id === id ? updatedSubscription : currentSubscription,
        isLoading: false,
      });

      return updatedSubscription;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新订阅失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 删除订阅
   */
  deleteSubscription: async (repository: SubscriptionRepository, id: string) => {
    set({ isLoading: true, error: null });

    try {
      await repository.deleteSubscription(id);

      const { subscriptions, currentSubscription } = get();
      const newSubscriptions = subscriptions.filter((sub) => sub.id !== id);

      set({
        subscriptions: newSubscriptions,
        currentSubscription: currentSubscription?.id === id ? null : currentSubscription,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除订阅失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 加载统计信息
   */
  loadStats: async (repository: SubscriptionRepository, userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const stats = await repository.getSubscriptionStats(userId);
      set({ stats, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载统计信息失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 查询订阅
   */
  querySubscriptions: async (
    repository: SubscriptionRepository,
    params: SubscriptionQueryParams
  ) => {
    set({ isLoading: true, error: null });

    try {
      const subscriptions = await repository.querySubscriptions(params);
      set({ subscriptions, isLoading: false });
      return subscriptions;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '查询订阅失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 获取即将到期的订阅
   */
  getExpiringSoon: async (repository: SubscriptionRepository, userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const subscriptions = await repository.getExpiringSoon(userId);
      set({ subscriptions, isLoading: false });
      return subscriptions;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取即将到期订阅失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 获取已过期的订阅
   */
  getExpired: async (repository: SubscriptionRepository, userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const subscriptions = await repository.getExpired(userId);
      set({ subscriptions, isLoading: false });
      return subscriptions;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取已过期订阅失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 获取活跃订阅
   */
  getActiveSubscriptions: async (repository: SubscriptionRepository, userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const subscriptions = await repository.getActiveSubscriptions(userId);
      set({ subscriptions, isLoading: false });
      return subscriptions;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取活跃订阅失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 搜索订阅
   */
  searchSubscriptions: async (
    repository: SubscriptionRepository,
    userId: string,
    keyword: string
  ) => {
    set({ isLoading: true, error: null });

    try {
      const subscriptions = await repository.searchSubscriptions(userId, keyword);
      set({ subscriptions, isLoading: false });
      return subscriptions;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '搜索订阅失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 按续费日期排序
   */
  sortByRenewalDate: async (
    repository: SubscriptionRepository,
    userId: string,
    order: 'asc' | 'desc' = 'asc'
  ) => {
    set({ isLoading: true, error: null });

    try {
      const subscriptions = await repository.sortByRenewalDate(userId, order);
      set({ subscriptions, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '按续费日期排序失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 按价格排序
   */
  sortByPrice: async (
    repository: SubscriptionRepository,
    userId: string,
    order: 'asc' | 'desc' = 'desc'
  ) => {
    set({ isLoading: true, error: null });

    try {
      const subscriptions = await repository.sortByPrice(userId, order);
      set({ subscriptions, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '按价格排序失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 按创建时间排序
   */
  sortByCreatedAt: async (
    repository: SubscriptionRepository,
    userId: string,
    order: 'asc' | 'desc' = 'desc'
  ) => {
    set({ isLoading: true, error: null });

    try {
      const subscriptions = await repository.sortByCreatedAt(userId, order);
      set({ subscriptions, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '按创建时间排序失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 更新订阅状态
   */
  updateStatus: async (
    repository: SubscriptionRepository,
    id: string,
    status: 'active' | 'cancelled' | 'expired'
  ) => {
    set({ isLoading: true, error: null });

    try {
      const updatedSubscription = await repository.updateStatus(id, status);

      const { subscriptions, currentSubscription } = get();
      const newSubscriptions = subscriptions.map((sub) =>
        sub.id === id ? updatedSubscription : sub
      );

      set({
        subscriptions: newSubscriptions,
        currentSubscription:
          currentSubscription?.id === id ? updatedSubscription : currentSubscription,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新订阅状态失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 更新自动续费设置
   */
  updateAutoRenew: async (repository: SubscriptionRepository, id: string, autoRenew: boolean) => {
    set({ isLoading: true, error: null });

    try {
      const updatedSubscription = await repository.updateAutoRenew(id, autoRenew);

      const { subscriptions, currentSubscription } = get();
      const newSubscriptions = subscriptions.map((sub) =>
        sub.id === id ? updatedSubscription : sub
      );

      set({
        subscriptions: newSubscriptions,
        currentSubscription:
          currentSubscription?.id === id ? updatedSubscription : currentSubscription,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新自动续费设置失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 添加标签
   */
  addTag: async (repository: SubscriptionRepository, id: string, tag: string) => {
    set({ isLoading: true, error: null });

    try {
      const updatedSubscription = await repository.addTag(id, tag);

      const { subscriptions, currentSubscription } = get();
      const newSubscriptions = subscriptions.map((sub) =>
        sub.id === id ? updatedSubscription : sub
      );

      set({
        subscriptions: newSubscriptions,
        currentSubscription:
          currentSubscription?.id === id ? updatedSubscription : currentSubscription,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '添加标签失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 移除标签
   */
  removeTag: async (repository: SubscriptionRepository, id: string, tag: string) => {
    set({ isLoading: true, error: null });

    try {
      const updatedSubscription = await repository.removeTag(id, tag);

      const { subscriptions, currentSubscription } = get();
      const newSubscriptions = subscriptions.map((sub) =>
        sub.id === id ? updatedSubscription : sub
      );

      set({
        subscriptions: newSubscriptions,
        currentSubscription:
          currentSubscription?.id === id ? updatedSubscription : currentSubscription,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '移除标签失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 清除错误信息
   */
  clearError: () => {
    set({ error: null });
  },
}));
