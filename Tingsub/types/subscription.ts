/**
 * 订阅相关类型定义
 * 包含订阅信息、提醒历史等类型
 */

import type { SubscriptionType, SubscriptionStatus, Currency, UUID } from './common';

/**
 * 订阅信息接口
 */
export interface Subscription {
  id: UUID;
  userId: UUID;
  name: string;
  description?: string;
  categoryId: UUID;
  tags: string[];
  type: SubscriptionType;
  price: number;
  currency: Currency;
  billingDate: Date;
  startDate: Date;
  endDate?: Date;
  renewalDate: Date;
  autoRenew: boolean;
  status: SubscriptionStatus;
  platform: string;
  paymentMethod: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 创建订阅参数接口（不包含自动生成的字段）
 */
export interface CreateSubscriptionParams {
  userId: UUID;
  name: string;
  description?: string;
  categoryId: UUID;
  tags?: string[];
  type: SubscriptionType;
  price: number;
  currency?: Currency;
  billingDate: Date;
  startDate: Date;
  endDate?: Date;
  autoRenew?: boolean;
  status?: SubscriptionStatus;
  platform: string;
  paymentMethod: string;
  notes?: string;
}

/**
 * 更新订阅参数接口
 */
export interface UpdateSubscriptionParams {
  name?: string;
  description?: string;
  categoryId?: UUID;
  tags?: string[];
  type?: SubscriptionType;
  price?: number;
  currency?: Currency;
  billingDate?: Date;
  startDate?: Date;
  endDate?: Date;
  renewalDate?: Date;
  autoRenew?: boolean;
  status?: SubscriptionStatus;
  platform?: string;
  paymentMethod?: string;
  notes?: string;
}

/**
 * 订阅查询参数接口
 */
export interface SubscriptionQueryParams {
  userId?: UUID;
  categoryId?: UUID;
  status?: SubscriptionStatus;
  type?: SubscriptionType;
  tags?: string[];
  startDate?: Date;
  endDate?: Date;
  renewalDateStart?: Date;
  renewalDateEnd?: Date;
}

/**
 * 提醒历史接口
 */
export interface ReminderHistory {
  id: UUID;
  userId: UUID;
  subscriptionId: UUID;
  reminderType: 'expiration' | 'renewal';
  reminderDate: Date;
  status: 'sent' | 'viewed' | 'dismissed';
  createdAt: Date;
}

/**
 * 创建提醒历史参数接口
 */
export interface CreateReminderHistoryParams {
  userId: UUID;
  subscriptionId: UUID;
  reminderType: 'expiration' | 'renewal';
  reminderDate: Date;
  status?: 'sent' | 'viewed' | 'dismissed';
}

/**
 * 订阅统计信息接口
 */
export interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  expiredSubscriptions: number;
  totalMonthlyExpense: number;
  totalYearlyExpense: number;
  upcomingRenewals: number;
  expiringSoon: number;
}
