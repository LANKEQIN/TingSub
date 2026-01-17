import { useCallback, useEffect, useState } from 'react';
import { Subscription } from '../types/subscription';
import { useSubscriptionStore } from '../store/subscriptionStore';

/**
 * 自定义Hook用于管理订阅数据
 * 封装了订阅的增删改查操作
 */
export const useSubscriptions = () => {
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription, loadSubscriptions } = useSubscriptionStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化加载订阅数据
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        await loadSubscriptions();
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载订阅失败');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [loadSubscriptions]);

  // 添加订阅
  const handleAddSubscription = useCallback(
    async (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
      setLoading(true);
      try {
        await addSubscription(subscription);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '添加订阅失败');
      } finally {
        setLoading(false);
      }
    },
    [addSubscription]
  );

  // 更新订阅
  const handleUpdateSubscription = useCallback(
    async (subscription: Subscription) => {
      setLoading(true);
      try {
        await updateSubscription(subscription);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '更新订阅失败');
      } finally {
        setLoading(false);
      }
    },
    [updateSubscription]
  );

  // 删除订阅
  const handleDeleteSubscription = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await deleteSubscription(id);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '删除订阅失败');
      } finally {
        setLoading(false);
      }
    },
    [deleteSubscription]
  );

  // 按分类筛选订阅
  const filterSubscriptionsByCategory = useCallback(
    (categoryId: string) => {
      return subscriptions.filter(sub => sub.categoryId === categoryId);
    },
    [subscriptions]
  );

  // 按标签筛选订阅
  const filterSubscriptionsByTag = useCallback(
    (tagId: string) => {
      return subscriptions.filter(sub => sub.tagIds.includes(tagId));
    },
    [subscriptions]
  );

  // 获取即将到期的订阅
  const getExpiringSubscriptions = useCallback(() => {
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return subscriptions.filter(sub => sub.endDate && new Date(sub.endDate) <= sevenDaysLater);
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