/**
 * 通知服务
 * 负责管理本地推送通知，包括通知权限申请、通知发送和通知配置
 */

import * as Notifications from 'expo-notifications';
import type { Subscription } from '../../../types/subscription';
import type { User } from '../../../types/user';
import { Logger } from '../../utils/loggerUtils';

/**
 * 通知配置接口
 */
export interface NotificationConfig {
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: boolean;
  vibration?: boolean;
}

/**
 * 通知服务类
 */
export class NotificationService {
  private static instance: NotificationService;

  private constructor() {
    this.configureNotificationHandler();
  }

  /**
   * 获取单例实例
   */
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * 配置通知处理器
   */
  private configureNotificationHandler(): void {
    Notifications.setNotificationHandler({
      handleNotification: async () => {
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        };
      },
    });
  }

  /**
   * 请求通知权限
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Logger.warn('通知权限未授予');
        return false;
      }

      Logger.info('通知权限已授予');
      return true;
    } catch (error) {
      Logger.error('请求通知权限失败', error);
      return false;
    }
  }

  /**
   * 检查通知权限
   */
  async checkPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      Logger.error('检查通知权限失败', error);
      return false;
    }
  }

  /**
   * 发送即时通知
   */
  async sendNotification(config: NotificationConfig): Promise<string | null> {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        Logger.warn('无通知权限，无法发送通知');
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: config.title,
          body: config.body,
          data: config.data || {},
          sound: config.sound !== false,
          vibrate: config.vibration !== false ? [0, 250, 250, 250] : undefined,
        },
        trigger: null,
      });

      Logger.info(`通知已发送，ID: ${notificationId}`);
      return notificationId;
    } catch (error) {
      Logger.error('发送通知失败', error);
      return null;
    }
  }

  /**
   * 发送订阅到期提醒通知
   */
  async sendExpirationReminder(subscription: Subscription, daysUntilExpiry: number): Promise<string | null> {
    const title = daysUntilExpiry === 0 ? '订阅今日到期' : `订阅将在${daysUntilExpiry}天后到期`;
    const body = `${subscription.name} 的订阅将于 ${this.formatDate(subscription.renewalDate)} 到期`;

    return this.sendNotification({
      title,
      body,
      data: {
        type: 'expiration',
        subscriptionId: subscription.id,
        subscriptionName: subscription.name,
        renewalDate: subscription.renewalDate.toISOString(),
      },
    });
  }

  /**
   * 发送订阅续费提醒通知
   */
  async sendRenewalReminder(subscription: Subscription, daysUntilRenewal: number): Promise<string | null> {
    const title = daysUntilRenewal === 0 ? '订阅今日续费' : `订阅将在${daysUntilRenewal}天后续费`;
    const body = `${subscription.name} 的订阅将于 ${this.formatDate(subscription.renewalDate)} 自动续费，费用：${subscription.price} ${subscription.currency}`;

    return this.sendNotification({
      title,
      body,
      data: {
        type: 'renewal',
        subscriptionId: subscription.id,
        subscriptionName: subscription.name,
        renewalDate: subscription.renewalDate.toISOString(),
        price: subscription.price,
        currency: subscription.currency,
      },
    });
  }

  /**
   * 安排定时通知
   */
  async scheduleNotification(config: NotificationConfig, trigger: Notifications.NotificationTriggerInput): Promise<string | null> {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        Logger.warn('无通知权限，无法安排通知');
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: config.title,
          body: config.body,
          data: config.data || {},
          sound: config.sound !== false,
          vibrate: config.vibration !== false ? [0, 250, 250, 250] : undefined,
        },
        trigger,
      });

      Logger.info(`定时通知已安排，ID: ${notificationId}`);
      return notificationId;
    } catch (error) {
      Logger.error('安排定时通知失败', error);
      return null;
    }
  }

  /**
   * 安排订阅到期提醒
   */
  async scheduleExpirationReminder(
    subscription: Subscription,
    advanceDays: number
  ): Promise<string | null> {
    const reminderDate = new Date(subscription.renewalDate);
    reminderDate.setDate(reminderDate.getDate() - advanceDays);

    const now = new Date();
    if (reminderDate <= now) {
      Logger.warn(`提醒日期 ${reminderDate.toISOString()} 已过，无法安排通知`);
      return null;
    }

    const title = '订阅即将到期';
    const body = `${subscription.name} 的订阅将于 ${advanceDays} 天后到期`;

    return this.scheduleNotification(
      {
        title,
        body,
        data: {
          type: 'expiration',
          subscriptionId: subscription.id,
          subscriptionName: subscription.name,
          renewalDate: subscription.renewalDate.toISOString(),
        },
      },
      {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderDate,
      }
    );
  }

  /**
   * 安排订阅续费提醒
   */
  async scheduleRenewalReminder(
    subscription: Subscription,
    advanceDays: number
  ): Promise<string | null> {
    const reminderDate = new Date(subscription.renewalDate);
    reminderDate.setDate(reminderDate.getDate() - advanceDays);

    const now = new Date();
    if (reminderDate <= now) {
      Logger.warn(`提醒日期 ${reminderDate.toISOString()} 已过，无法安排通知`);
      return null;
    }

    const title = '订阅即将续费';
    const body = `${subscription.name} 的订阅将于 ${advanceDays} 天后自动续费，费用：${subscription.price} ${subscription.currency}`;

    return this.scheduleNotification(
      {
        title,
        body,
        data: {
          type: 'renewal',
          subscriptionId: subscription.id,
          subscriptionName: subscription.name,
          renewalDate: subscription.renewalDate.toISOString(),
          price: subscription.price,
          currency: subscription.currency,
        },
      },
      {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderDate,
      }
    );
  }

  /**
   * 取消通知
   */
  async cancelNotification(notificationId: string): Promise<boolean> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      Logger.info(`通知已取消，ID: ${notificationId}`);
      return true;
    } catch (error) {
      Logger.error('取消通知失败', error);
      return false;
    }
  }

  /**
   * 取消所有通知
   */
  async cancelAllNotifications(): Promise<boolean> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      Logger.info('所有通知已取消');
      return true;
    } catch (error) {
      Logger.error('取消所有通知失败', error);
      return false;
    }
  }

  /**
   * 获取所有已安排的通知
   */
  async getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      Logger.info(`获取到 ${notifications.length} 个已安排的通知`);
      return notifications;
    } catch (error) {
      Logger.error('获取已安排的通知失败', error);
      return [];
    }
  }

  /**
   * 获取应用角标数量
   */
  async getBadgeCount(): Promise<number> {
    try {
      const badgeCount = await Notifications.getBadgeCountAsync();
      return badgeCount;
    } catch (error) {
      Logger.error('获取应用角标数量失败', error);
      return 0;
    }
  }

  /**
   * 设置应用角标数量
   */
  async setBadgeCount(count: number): Promise<boolean> {
    try {
      await Notifications.setBadgeCountAsync(count);
      Logger.info(`应用角标数量已设置为 ${count}`);
      return true;
    } catch (error) {
      Logger.error('设置应用角标数量失败', error);
      return false;
    }
  }

  /**
   * 清除应用角标
   */
  async clearBadge(): Promise<boolean> {
    return this.setBadgeCount(0);
  }

  /**
   * 添加通知监听器
   */
  addNotificationListener(listener: (notification: Notifications.Notification) => void): Notifications.Subscription {
    const subscription = Notifications.addNotificationReceivedListener(listener);
    Logger.info('通知监听器已添加');
    return subscription;
  }

  /**
   * 添加通知响应监听器
   */
  addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    const subscription = Notifications.addNotificationResponseReceivedListener(listener);
    Logger.info('通知响应监听器已添加');
    return subscription;
  }

  /**
   * 移除监听器
   */
  removeSubscription(subscription: Notifications.Subscription): void {
    subscription.remove();
    Logger.info('监听器已移除');
  }

  /**
   * 格式化日期
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * 根据用户设置配置通知
   */
  async configureByUserSettings(user: User): Promise<void> {
    if (!user.reminderSettings.enabled) {
      Logger.info('用户已禁用提醒，不配置通知');
      return;
    }

    const hasPermission = await this.checkPermissions();
    if (!hasPermission) {
      const granted = await this.requestPermissions();
      if (!granted) {
        Logger.warn('无法获取通知权限');
        return;
      }
    }

    const localChannel = user.reminderSettings.notificationChannels.find(
      (channel) => channel.type === 'local'
    );

    if (localChannel && !localChannel.enabled) {
      Logger.info('用户已禁用本地通知');
      return;
    }

    Logger.info('通知配置已根据用户设置更新');
  }

  /**
   * 初始化通知服务
   */
  async initialize(user: User): Promise<boolean> {
    try {
      await this.configureByUserSettings(user);
      Logger.info('通知服务初始化成功');
      return true;
    } catch (error) {
      Logger.error('通知服务初始化失败', error);
      return false;
    }
  }
}

/**
 * 导出单例实例
 */
export const notificationService = NotificationService.getInstance();
