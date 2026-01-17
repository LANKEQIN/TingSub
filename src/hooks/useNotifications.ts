import { useCallback, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { NotificationService } from '../services/notification/NotificationService';

/**
 * 自定义Hook用于管理通知功能
 * 封装了通知权限申请、本地通知发送等操作
 */
export const useNotifications = () => {
  const [notificationPermission, setNotificationPermission] = useState<Notifications.PermissionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化检查通知权限
  useEffect(() => {
    const checkNotificationPermission = async () => {
      setLoading(true);
      try {
        const status = await Notifications.getPermissionsAsync();
        setNotificationPermission(status);
      } catch (err) {
        setError(err instanceof Error ? err.message : '检查通知权限失败');
      } finally {
        setLoading(false);
      }
    };

    checkNotificationPermission();
  }, []);

  // 请求通知权限
  const requestNotificationPermission = useCallback(async () => {
    setLoading(true);
    try {
      const status = await Notifications.requestPermissionsAsync();
      setNotificationPermission(status);
      setError(null);
      return status;
    } catch (err) {
      setError(err instanceof Error ? err.message : '请求通知权限失败');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 发送本地通知
  const sendLocalNotification = useCallback(
    async (
      title: string,
      body: string,
      data?: Record<string, any>,
      trigger?: Notifications.NotificationTrigger
    ) => {
      setLoading(true);
      try {
        const notificationId = await NotificationService.sendNotification(title, body, data, trigger);
        setError(null);
        return notificationId;
      } catch (err) {
        setError(err instanceof Error ? err.message : '发送通知失败');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 取消本地通知
  const cancelLocalNotification = useCallback(
    async (notificationId: string) => {
      setLoading(true);
      try {
        await NotificationService.cancelNotification(notificationId);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '取消通知失败');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 调度到期提醒
  const scheduleExpirationReminder = useCallback(
    async (subscriptionId: string, title: string, body: string, triggerDate: Date) => {
      setLoading(true);
      try {
        const notificationId = await NotificationService.scheduleExpirationReminder(
          subscriptionId,
          title,
          body,
          triggerDate
        );
        setError(null);
        return notificationId;
      } catch (err) {
        setError(err instanceof Error ? err.message : '调度提醒失败');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 取消到期提醒
  const cancelExpirationReminder = useCallback(
    async (subscriptionId: string) => {
      setLoading(true);
      try {
        await NotificationService.cancelExpirationReminder(subscriptionId);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '取消提醒失败');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    notificationPermission,
    loading,
    error,
    requestNotificationPermission,
    sendLocalNotification,
    cancelLocalNotification,
    scheduleExpirationReminder,
    cancelExpirationReminder,
    clearError: () => setError(null),
    hasPermission: notificationPermission?.granted || false,
  };
};