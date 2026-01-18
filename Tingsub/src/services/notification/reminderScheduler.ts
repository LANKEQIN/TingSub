/**
 * 提醒调度器
 * 负责管理订阅到期和续费提醒的调度
 */

import type { Subscription } from '../../../types/subscription';
import type { User } from '../../../types/user';
import type { ReminderHistory } from '../../../types/subscription';
import { notificationService } from './NotificationService';
import { SubscriptionRepository } from '../../repositories/SubscriptionRepository';
import { UserRepository } from '../../repositories/UserRepository';
import { ReminderHistoryRepository } from '../../repositories/ReminderHistoryRepository';
import { Logger } from '../../utils/loggerUtils';
import { addDays, differenceInDays, startOfDay } from 'date-fns';

/**
 * 提醒调度器类
 */
export class ReminderScheduler {
  private static instance: ReminderScheduler;
  private subscriptionRepository!: SubscriptionRepository;
  private userRepository!: UserRepository;
  private reminderHistoryRepository!: ReminderHistoryRepository;
  private isRunning: boolean = false;
  private checkInterval: number | null = null;
  private readonly CHECK_INTERVAL_MS = 60 * 60 * 1000;

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): ReminderScheduler {
    if (!ReminderScheduler.instance) {
      ReminderScheduler.instance = new ReminderScheduler();
    }
    return ReminderScheduler.instance;
  }

  /**
   * 初始化调度器
   */
  async initialize(
    subscriptionRepository: SubscriptionRepository,
    userRepository: UserRepository,
    reminderHistoryRepository: ReminderHistoryRepository
  ): Promise<void> {
    this.subscriptionRepository = subscriptionRepository;
    this.userRepository = userRepository;
    this.reminderHistoryRepository = reminderHistoryRepository;
    Logger.info('提醒调度器已初始化');
  }

  /**
   * 启动调度器
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      Logger.warn('提醒调度器已在运行');
      return;
    }

    this.isRunning = true;
    await this.checkAndScheduleReminders();

    this.checkInterval = setInterval(async () => {
      await this.checkAndScheduleReminders();
    }, this.CHECK_INTERVAL_MS) as unknown as number;

    Logger.info('提醒调度器已启动');
  }

  /**
   * 停止调度器
   */
  stop(): void {
    if (!this.isRunning) {
      Logger.warn('提醒调度器未运行');
      return;
    }

    this.isRunning = false;
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    Logger.info('提醒调度器已停止');
  }

  /**
   * 检查并安排提醒
   */
  private async checkAndScheduleReminders(): Promise<void> {
    try {
      const users = await this.userRepository.getAll();
      for (const user of users) {
        if (!user.reminderSettings.enabled) {
          continue;
        }

        await this.scheduleRemindersForUser(user);
      }
    } catch (error) {
      Logger.error('检查并安排提醒失败', error);
    }
  }

  /**
   * 为用户安排提醒
   */
  private async scheduleRemindersForUser(user: User): Promise<void> {
    try {
      const subscriptions = await this.subscriptionRepository.getActiveSubscriptions(user.id);
      const advanceDays = user.reminderSettings.advanceDays;

      for (const subscription of subscriptions) {
        await this.scheduleReminderForSubscription(subscription, advanceDays, user.id);
      }
    } catch (error) {
      Logger.error(`为用户 ${user.id} 安排提醒失败`, error);
    }
  }

  /**
   * 为订阅安排提醒
   */
  private async scheduleReminderForSubscription(
    subscription: Subscription,
    advanceDays: number,
    userId: string
  ): Promise<void> {
    try {
      const now = startOfDay(new Date());
      const renewalDate = startOfDay(subscription.renewalDate);
      const daysUntilRenewal = differenceInDays(renewalDate, now);

      if (daysUntilRenewal < 0) {
        await this.handleExpiredSubscription(subscription);
        return;
      }

      if (daysUntilRenewal > advanceDays) {
        return;
      }

      const existingReminder = await this.reminderHistoryRepository.getPendingReminder(
        subscription.id,
        subscription.renewalDate
      );

      if (existingReminder) {
        return;
      }

      await this.createAndScheduleReminder(subscription, daysUntilRenewal, userId);
    } catch (error) {
      Logger.error(`为订阅 ${subscription.id} 安排提醒失败`, error);
    }
  }

  /**
   * 创建并安排提醒
   */
  private async createAndScheduleReminder(
    subscription: Subscription,
    daysUntilRenewal: number,
    userId: string
  ): Promise<void> {
    try {
      const reminderType = subscription.autoRenew ? 'renewal' : 'expiration';
      const reminderDate = new Date(subscription.renewalDate);
      reminderDate.setDate(reminderDate.getDate() - daysUntilRenewal);

      await this.reminderHistoryRepository.createReminderHistory({
        userId,
        subscriptionId: subscription.id,
        reminderType,
        reminderDate,
        status: 'sent',
      });

      if (subscription.autoRenew) {
        await notificationService.scheduleRenewalReminder(subscription, daysUntilRenewal);
      } else {
        await notificationService.scheduleExpirationReminder(subscription, daysUntilRenewal);
      }

      Logger.info(
        `已为订阅 ${subscription.name} 安排${subscription.autoRenew ? '续费' : '到期'}提醒，${daysUntilRenewal}天后`
      );
    } catch (error) {
      Logger.error('创建并安排提醒失败', error);
    }
  }

  /**
   * 处理已过期的订阅
   */
  private async handleExpiredSubscription(subscription: Subscription): Promise<void> {
    try {
      if (subscription.status !== 'expired') {
        await this.subscriptionRepository.updateStatus(subscription.id, 'expired');
        Logger.info(`订阅 ${subscription.name} 已标记为过期`);
      }

      await notificationService.sendExpirationReminder(subscription, 0);
    } catch (error) {
      Logger.error(`处理过期订阅 ${subscription.id} 失败`, error);
    }
  }

  /**
   * 为新订阅安排提醒
   */
  async scheduleReminderForNewSubscription(
    subscription: Subscription,
    userId: string
  ): Promise<void> {
    try {
      const user = await this.userRepository.getById(userId);
      if (!user || !user.reminderSettings.enabled) {
        return;
      }

      const advanceDays = user.reminderSettings.advanceDays;
      await this.scheduleReminderForSubscription(subscription, advanceDays, userId);
    } catch (error) {
      Logger.error(`为新订阅 ${subscription.id} 安排提醒失败`, error);
    }
  }

  /**
   * 为更新后的订阅重新安排提醒
   */
  async rescheduleReminderForUpdatedSubscription(
    subscription: Subscription,
    userId: string
  ): Promise<void> {
    try {
      await this.reminderHistoryRepository.cancelPendingReminders(subscription.id);
      await this.scheduleReminderForNewSubscription(subscription, userId);
    } catch (error) {
      Logger.error(`为更新后的订阅 ${subscription.id} 重新安排提醒失败`, error);
    }
  }

  /**
   * 为取消的订阅取消提醒
   */
  async cancelRemindersForSubscription(subscriptionId: string): Promise<void> {
    try {
      await this.reminderHistoryRepository.cancelPendingReminders(subscriptionId);
      Logger.info(`已取消订阅 ${subscriptionId} 的所有待发送提醒`);
    } catch (error) {
      Logger.error(`取消订阅 ${subscriptionId} 的提醒失败`, error);
    }
  }

  /**
   * 手动触发提醒检查
   */
  async triggerReminderCheck(): Promise<void> {
    Logger.info('手动触发提醒检查');
    await this.checkAndScheduleReminders();
  }

  /**
   * 获取即将到期的订阅
   */
  async getExpiringSubscriptions(userId: string, days: number = 7): Promise<Subscription[]> {
    try {
      const subscriptions = await this.subscriptionRepository.getExpiringSoon(userId);
      const now = startOfDay(new Date());
      const endDate = addDays(now, days);

      return subscriptions.filter((sub) => {
        const renewalDate = startOfDay(sub.renewalDate);
        return renewalDate >= now && renewalDate <= endDate;
      });
    } catch (error) {
      Logger.error('获取即将到期的订阅失败', error);
      return [];
    }
  }

  /**
   * 获取即将续费的订阅
   */
  async getUpcomingRenewals(userId: string, days: number = 7): Promise<Subscription[]> {
    try {
      const subscriptions = await this.subscriptionRepository.getExpiringSoon(userId);
      const now = startOfDay(new Date());
      const endDate = addDays(now, days);

      return subscriptions
        .filter((sub) => {
          const renewalDate = startOfDay(sub.renewalDate);
          return renewalDate >= now && renewalDate <= endDate && sub.autoRenew;
        })
        .sort((a, b) => a.renewalDate.getTime() - b.renewalDate.getTime());
    } catch (error) {
      Logger.error('获取即将续费的订阅失败', error);
      return [];
    }
  }

  /**
   * 获取提醒历史
   */
  async getReminderHistory(userId: string, limit: number = 50): Promise<ReminderHistory[]> {
    try {
      return this.reminderHistoryRepository.getByUserId(userId, limit);
    } catch (error) {
      Logger.error('获取提醒历史失败', error);
      return [];
    }
  }

  /**
   * 标记提醒为已查看
   */
  async markReminderAsViewed(reminderId: string): Promise<void> {
    try {
      await this.reminderHistoryRepository.updateReminderStatus(reminderId, 'viewed');
    } catch (error) {
      Logger.error(`标记提醒 ${reminderId} 为已查看失败`, error);
    }
  }

  /**
   * 标记提醒为已忽略
   */
  async markReminderAsDismissed(reminderId: string): Promise<void> {
    try {
      await this.reminderHistoryRepository.updateReminderStatus(reminderId, 'dismissed');
    } catch (error) {
      Logger.error(`标记提醒 ${reminderId} 为已忽略失败`, error);
    }
  }

  /**
   * 获取调度器状态
   */
  getStatus(): { isRunning: boolean } {
    return {
      isRunning: this.isRunning,
    };
  }
}

/**
 * 导出单例实例
 */
export const reminderScheduler = ReminderScheduler.getInstance();
