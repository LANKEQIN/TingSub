/**
 * 提醒历史数据模型
 * 使用Realm数据库存储提醒历史记录
 */

import Realm from 'realm';
import type { ReminderHistory } from '../../types/subscription';

/**
 * 提醒历史模型
 */
export class ReminderHistoryModel extends Realm.Object<ReminderHistoryModel> {
  id!: string;
  userId!: string;
  subscriptionId!: string;
  reminderType!: string;
  reminderDate!: Date;
  status!: string;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'ReminderHistory',
    primaryKey: 'id',
    properties: {
      id: 'string',
      userId: 'string',
      subscriptionId: 'string',
      reminderType: 'string',
      reminderDate: 'date',
      status: 'string',
      createdAt: 'date',
    },
  };

  /**
   * 转换为提醒历史类型
   */
  toReminderHistoryType(): ReminderHistory {
    return {
      id: this.id,
      userId: this.userId,
      subscriptionId: this.subscriptionId,
      reminderType: this.reminderType as 'expiration' | 'renewal',
      reminderDate: this.reminderDate,
      status: this.status as 'sent' | 'viewed' | 'dismissed',
      createdAt: this.createdAt,
    };
  }

  /**
   * 从提醒历史类型创建Realm对象
   */
  static fromReminderHistoryType(
    reminderHistory: Omit<ReminderHistory, 'id' | 'createdAt'>
  ): Omit<ReminderHistory, 'id' | 'createdAt'> {
    return {
      userId: reminderHistory.userId,
      subscriptionId: reminderHistory.subscriptionId,
      reminderType: reminderHistory.reminderType,
      reminderDate: reminderHistory.reminderDate,
      status: reminderHistory.status,
    };
  }

  /**
   * 检查提醒是否已过期
   */
  isExpired(): boolean {
    const now = new Date();
    return this.reminderDate < now;
  }

  /**
   * 检查提醒是否在指定天数内
   */
  isWithinDays(days: number): boolean {
    const now = new Date();
    const diffTime = this.reminderDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= days;
  }
}
