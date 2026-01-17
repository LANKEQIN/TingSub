/**
 * 提醒历史仓储类
 * 提供提醒历史数据访问操作
 */

import Realm from 'realm';
import { BaseRepository } from './BaseRepository';
import { ReminderHistoryModel } from '../models/ReminderHistory';
import { ValidationUtils } from '../utils/validationUtils';
import { Logger } from '../utils/loggerUtils';
import type {
  ReminderHistory,
  CreateReminderHistoryParams,
} from '../../types/subscription';

/**
 * 提醒历史仓储类
 */
export class ReminderHistoryRepository extends BaseRepository<ReminderHistory> {
  constructor(realm: Realm) {
    super(realm, 'ReminderHistory');
  }

  /**
   * 创建提醒历史
   * @param params 创建提醒历史参数
   * @returns 创建的提醒历史
   */
  async createReminderHistory(params: CreateReminderHistoryParams): Promise<ReminderHistory> {
    return this.executeOperation(async () => {
      const now = new Date();

      const reminderHistoryData: ReminderHistory = {
        id: this.generateUUID(),
        userId: params.userId,
        subscriptionId: params.subscriptionId,
        reminderType: params.reminderType,
        reminderDate: params.reminderDate,
        status: params.status || 'sent',
        createdAt: now,
      };

      ValidationUtils.validateReminderHistory(reminderHistoryData);

      const realmData = ReminderHistoryModel.fromReminderHistoryType(reminderHistoryData);

      return this.realm.write(() => {
        const created = this.realm.create('ReminderHistory', realmData);
        return (created as any).toReminderHistoryType();
      });
    }, '创建提醒历史失败');
  }

  /**
   * 根据用户ID获取提醒历史
   * @param userId 用户ID
   * @param limit 数量限制
   * @returns 提醒历史数组
   */
  async getByUserId(userId: string, limit: number = 50): Promise<ReminderHistory[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('ReminderHistory')
        .filtered('userId == $0', userId)
        .sorted('reminderDate', true)
        .slice(0, limit);
      return objects.map((obj: any) => obj.toReminderHistoryType());
    }, '根据用户ID获取提醒历史失败');
  }

  /**
   * 根据订阅ID获取提醒历史
   * @param subscriptionId 订阅ID
   * @returns 提醒历史数组
   */
  async getBySubscriptionId(subscriptionId: string): Promise<ReminderHistory[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('ReminderHistory')
        .filtered('subscriptionId == $0', subscriptionId)
        .sorted('reminderDate', true);
      return objects.map((obj: any) => obj.toReminderHistoryType());
    }, '根据订阅ID获取提醒历史失败');
  }

  /**
   * 根据状态获取提醒历史
   * @param status 提醒状态
   * @returns 提醒历史数组
   */
  async getByStatus(status: 'sent' | 'viewed' | 'dismissed'): Promise<ReminderHistory[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('ReminderHistory')
        .filtered('status == $0', status)
        .sorted('reminderDate', true);
      return objects.map((obj: any) => obj.toReminderHistoryType());
    }, '根据状态获取提醒历史失败');
  }

  /**
   * 根据提醒类型获取提醒历史
   * @param reminderType 提醒类型
   * @returns 提醒历史数组
   */
  async getByReminderType(reminderType: 'expiration' | 'renewal'): Promise<ReminderHistory[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('ReminderHistory')
        .filtered('reminderType == $0', reminderType)
        .sorted('reminderDate', true);
      return objects.map((obj: any) => obj.toReminderHistoryType());
    }, '根据提醒类型获取提醒历史失败');
  }

  /**
   * 获取待发送的提醒
   * @param subscriptionId 订阅ID
   * @param reminderDate 提醒日期
   * @returns 提醒历史或null
   */
  async getPendingReminder(
    subscriptionId: string,
    reminderDate: Date
  ): Promise<ReminderHistory | null> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('ReminderHistory')
        .filtered(
          'subscriptionId == $0 AND reminderDate == $1 AND status == "sent"',
          subscriptionId,
          reminderDate
        );
      if (objects.length === 0) {
        return null;
      }
      return (objects[0] as any).toReminderHistoryType();
    }, '获取待发送的提醒失败');
  }

  /**
   * 获取即将到期的提醒
   * @param userId 用户ID
   * @param days 天数
   * @returns 提醒历史数组
   */
  async getUpcomingReminders(userId: string, days: number = 7): Promise<ReminderHistory[]> {
    return this.executeOperation(() => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      const objects = this.realm
        .objects('ReminderHistory')
        .filtered(
          'userId == $0 AND reminderDate >= $1 AND reminderDate <= $2 AND status == "sent"',
          userId,
          now,
          futureDate
        )
        .sorted('reminderDate', true);
      return objects.map((obj: any) => obj.toReminderHistoryType());
    }, '获取即将到期的提醒失败');
  }

  /**
   * 获取已过期的提醒
   * @param userId 用户ID
   * @returns 提醒历史数组
   */
  async getExpiredReminders(userId: string): Promise<ReminderHistory[]> {
    return this.executeOperation(() => {
      const now = new Date();
      const objects = this.realm
        .objects('ReminderHistory')
        .filtered('userId == $0 AND reminderDate < $1 AND status == "sent"', userId, now)
        .sorted('reminderDate', true);
      return objects.map((obj: any) => obj.toReminderHistoryType());
    }, '获取已过期的提醒失败');
  }

  /**
   * 更新提醒状态
   * @param id 提醒历史ID
   * @param status 提醒状态
   * @returns 更新后的提醒历史
   */
  async updateReminderStatus(
    id: string,
    status: 'sent' | 'viewed' | 'dismissed'
  ): Promise<ReminderHistory> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('提醒历史不存在');
      }

      return this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('ReminderHistory', id);
        if (object) {
          (object as any).status = status;
          return (object as any).toReminderHistoryType();
        }
        throw new Error('提醒历史不存在');
      });
    }, '更新提醒状态失败');
  }

  /**
   * 取消订阅的所有待发送提醒
   * @param subscriptionId 订阅ID
   */
  async cancelPendingReminders(subscriptionId: string): Promise<void> {
    return this.executeOperation(() => {
      this.realm.write(() => {
        const objects = this.realm
          .objects('ReminderHistory')
          .filtered('subscriptionId == $0 AND status == "sent"', subscriptionId);
        this.realm.delete(objects);
      });
      Logger.info(`订阅 ${subscriptionId} 的待发送提醒已取消`);
    }, '取消待发送提醒失败');
  }

  /**
   * 删除提醒历史
   * @param id 提醒历史ID
   */
  async deleteReminderHistory(id: string): Promise<void> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('提醒历史不存在');
      }

      this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('ReminderHistory', id);
        if (object) {
          this.realm.delete(object);
        }
      });

      Logger.info(`提醒历史已删除: ${id}`);
    }, '删除提醒历史失败');
  }

  /**
   * 清空用户的所有提醒历史
   * @param userId 用户ID
   */
  async clearUserReminderHistories(userId: string): Promise<void> {
    return this.executeOperation(() => {
      this.realm.write(() => {
        const objects = this.realm.objects('ReminderHistory').filtered('userId == $0', userId);
        this.realm.delete(objects);
      });
      Logger.info(`用户 ${userId} 的所有提醒历史已清空`);
    }, '清空用户提醒历史失败');
  }

  /**
   * 清空订阅的所有提醒历史
   * @param subscriptionId 订阅ID
   */
  async clearSubscriptionReminderHistories(subscriptionId: string): Promise<void> {
    return this.executeOperation(() => {
      this.realm.write(() => {
        const objects = this.realm
          .objects('ReminderHistory')
          .filtered('subscriptionId == $0', subscriptionId);
        this.realm.delete(objects);
      });
      Logger.info(`订阅 ${subscriptionId} 的所有提醒历史已清空`);
    }, '清空订阅提醒历史失败');
  }

  /**
   * 获取提醒统计信息
   * @param userId 用户ID
   * @returns 统计信息
   */
  async getReminderStats(userId: string): Promise<{
    totalReminders: number;
    sentReminders: number;
    viewedReminders: number;
    dismissedReminders: number;
  }> {
    return this.executeOperation(() => {
      const objects = this.realm.objects('ReminderHistory').filtered('userId == $0', userId);

      const totalReminders = objects.length;
      const sentReminders = objects.filtered('status == "sent"').length;
      const viewedReminders = objects.filtered('status == "viewed"').length;
      const dismissedReminders = objects.filtered('status == "dismissed"').length;

      return {
        totalReminders,
        sentReminders,
        viewedReminders,
        dismissedReminders,
      };
    }, '获取提醒统计信息失败');
  }

  /**
   * 按日期范围获取提醒历史
   * @param userId 用户ID
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @returns 提醒历史数组
   */
  async getByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ReminderHistory[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('ReminderHistory')
        .filtered(
          'userId == $0 AND reminderDate >= $1 AND reminderDate <= $2',
          userId,
          startDate,
          endDate
        )
        .sorted('reminderDate', true);
      return objects.map((obj: any) => obj.toReminderHistoryType());
    }, '按日期范围获取提醒历史失败');
  }

  /**
   * 获取最近的提醒
   * @param userId 用户ID
   * @param limit 数量限制
   * @returns 提醒历史数组
   */
  async getRecentReminders(userId: string, limit: number = 10): Promise<ReminderHistory[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('ReminderHistory')
        .filtered('userId == $0', userId)
        .sorted('reminderDate', true)
        .slice(0, limit);
      return objects.map((obj: any) => obj.toReminderHistoryType());
    }, '获取最近的提醒失败');
  }

  /**
   * 搜索提醒历史
   * @param userId 用户ID
   * @param keyword 搜索关键词
   * @returns 提醒历史数组
   */
  async searchReminderHistories(
    userId: string,
    keyword: string
  ): Promise<ReminderHistory[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('ReminderHistory')
        .filtered(
          'userId == $0 AND subscriptionId CONTAINS[c] $0',
          userId,
          keyword
        )
        .sorted('reminderDate', true);
      return objects.map((obj: any) => obj.toReminderHistoryType());
    }, '搜索提醒历史失败');
  }

  /**
   * 批量更新提醒状态
   * @param ids 提醒历史ID数组
   * @param status 提醒状态
   * @returns 更新后的提醒历史数组
   */
  async batchUpdateReminderStatus(
    ids: string[],
    status: 'sent' | 'viewed' | 'dismissed'
  ): Promise<ReminderHistory[]> {
    return this.executeOperation(() => {
      return this.realm.write(() => {
        const updated: ReminderHistory[] = [];
        for (const id of ids) {
          const object = this.realm.objectForPrimaryKey('ReminderHistory', id);
          if (object) {
            (object as any).status = status;
            updated.push((object as any).toReminderHistoryType());
          }
        }
        return updated;
      });
    }, '批量更新提醒状态失败');
  }

  /**
   * 清理过期的提醒历史
   * @param days 保留天数
   */
  async cleanupExpiredReminders(days: number = 30): Promise<void> {
    return this.executeOperation(() => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      this.realm.write(() => {
        const objects = this.realm
          .objects('ReminderHistory')
          .filtered('reminderDate < $0', cutoffDate);
        this.realm.delete(objects);
      });

      Logger.info(`已清理 ${days} 天前的过期提醒历史`);
    }, '清理过期提醒历史失败');
  }
}
