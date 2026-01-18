import { useCallback, useEffect, useState } from 'react';
import type { Subscription } from '../../types/subscription';
import type { SubscriptionRepository } from '../repositories/SubscriptionRepository';
import { useSubscriptionStore } from '../store/subscriptionStore';

/**
 * 自定义Hook用于管理订阅数据
 * 封装了订阅的增删改查操作
 */
export const useSubscriptions = (repository: SubscriptionRepository, userId: string) => {
  const {
    subscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    loadSubscriptions,
  } = useSubscriptionStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化加载订阅数据
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        await loadSubscriptions(repository, userId);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载订阅失败');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [loadSubscriptions, repository, userId]);

  // 添加订阅
  const handleAddSubscription = useCallback(
    async (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
      setLoading(true);
      try {
        await createSubscription(repository, subscription);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '添加订阅失败');
      } finally {
        setLoading(false);
      }
    },
    [createSubscription, repository]
  );

  // 更新订阅
  const handleUpdateSubscription = useCallback(
    async (subscription: Subscription) => {
      setLoading(true);
      try {
        await updateSubscription(repository, subscription.id, subscription);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '更新订阅失败');
      } finally {
        setLoading(false);
      }
    },
    [updateSubscription, repository]
  );

  // 删除订阅
  const handleDeleteSubscription = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await deleteSubscription(repository, id);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '删除订阅失败');
      } finally {
        setLoading(false);
      }
    },
    [deleteSubscription, repository]
  );

  // 按分类筛选订阅
  const filterSubscriptionsByCategory = useCallback(
    (categoryId: string) => {
      return subscriptions.filter((sub: Subscription) => sub.categoryId === categoryId);
    },
    [subscriptions]
  );

  // 按标签筛选订阅
  const filterSubscriptionsByTag = useCallback(
    (tagId: string) => {
      return subscriptions.filter((sub: Subscription) => sub.tags.includes(tagId));
    },
    [subscriptions]
  );

  // 获取即将到期的订阅
  const getExpiringSubscriptions = useCallback(() => {
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return subscriptions.filter(
      (sub: Subscription) => sub.endDate && new Date(sub.endDate) <= sevenDaysLater
    );
  }, [subscriptions]);

  return {
    subscriptions,
    loading,
    error,
    addSubscription: handleAddSubscription,
    updateSubscription: handleUpdateSubscription,
    deleteSubscription: handleDeleteSubscription,
    filterSubscriptionsByCategory,
    filterSubscriptionsByTag,
    getExpiringSubscriptions,
    clearError: () => setError(null),
  };
};
