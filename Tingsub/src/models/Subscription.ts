/**
 * 订阅数据模型
 * 使用Realm数据库存储订阅信息
 */

import Realm from 'realm';
import type { Subscription } from '../../types/subscription';

/**
 * 订阅模型
 */
export class SubscriptionModel extends Realm.Object<SubscriptionModel> {
  id!: string;
  userId!: string;
  name!: string;
  description?: string;
  categoryId!: string;
  tags!: string[];
  type!: string;
  price!: number;
  currency!: string;
  billingDate!: Date;
  startDate!: Date;
  endDate?: Date;
  renewalDate!: Date;
  autoRenew!: boolean;
  status!: string;
  platform!: string;
  paymentMethod!: string;
  notes?: string;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Subscription',
    primaryKey: 'id',
    properties: {
      id: 'string',
      userId: 'string',
      name: 'string',
      description: 'string?',
      categoryId: 'string',
      tags: 'string[]',
      type: 'string',
      price: 'double',
      currency: 'string',
      billingDate: 'date',
      startDate: 'date',
      endDate: 'date?',
      renewalDate: 'date',
      autoRenew: 'bool',
      status: 'string',
      platform: 'string',
      paymentMethod: 'string',
      notes: 'string?',
      createdAt: 'date',
      updatedAt: 'date',
    },
  };

  /**
   * 转换为订阅类型
   */
  toSubscriptionType(): Subscription {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      description: this.description,
      categoryId: this.categoryId,
      tags: this.tags,
      type: this.type as 'monthly' | 'yearly' | 'quarterly' | 'weekly' | 'one-time',
      price: this.price,
      currency: this.currency as 'CNY' | 'USD' | 'EUR' | 'JPY' | 'GBP',
      billingDate: this.billingDate,
      startDate: this.startDate,
      endDate: this.endDate,
      renewalDate: this.renewalDate,
      autoRenew: this.autoRenew,
      status: this.status as 'active' | 'cancelled' | 'expired',
      platform: this.platform,
      paymentMethod: this.paymentMethod,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * 从订阅类型创建Realm对象
   */
  static fromSubscriptionType(
    subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>
  ): Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      userId: subscription.userId,
      name: subscription.name,
      description: subscription.description,
      categoryId: subscription.categoryId,
      tags: subscription.tags,
      type: subscription.type,
      price: subscription.price,
      currency: subscription.currency,
      billingDate: subscription.billingDate,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      renewalDate: subscription.renewalDate,
      autoRenew: subscription.autoRenew,
      status: subscription.status,
      platform: subscription.platform,
      paymentMethod: subscription.paymentMethod,
      notes: subscription.notes,
    };
  }

  /**
   * 计算下次续费日期
   */
  static calculateRenewalDate(startDate: Date, type: string): Date {
    const date = new Date(startDate);
    switch (type) {
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
      case 'one-time':
        return startDate;
      default:
        date.setMonth(date.getMonth() + 1);
    }
    return date;
  }

  /**
   * 计算月度费用（将所有周期转换为月度费用）
   */
  calculateMonthlyCost(): number {
    switch (this.type) {
      case 'weekly':
        return this.price * 4.33;
      case 'monthly':
        return this.price;
      case 'quarterly':
        return this.price / 3;
      case 'yearly':
        return this.price / 12;
      case 'one-time':
        return 0;
      default:
        return this.price;
    }
  }

  /**
   * 计算年度费用（将所有周期转换为年度费用）
   */
  calculateYearlyCost(): number {
    switch (this.type) {
      case 'weekly':
        return this.price * 52;
      case 'monthly':
        return this.price * 12;
      case 'quarterly':
        return this.price * 4;
      case 'yearly':
        return this.price;
      case 'one-time':
        return this.price;
      default:
        return this.price * 12;
    }
  }

  /**
   * 检查订阅是否即将到期（7天内）
   */
  isExpiringSoon(): boolean {
    const now = new Date();
    const daysUntilExpiry = Math.floor(
      (this.renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
  }

  /**
   * 检查订阅是否已过期
   */
  isExpired(): boolean {
    const now = new Date();
    return this.renewalDate < now;
  }
}
