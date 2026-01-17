/**
 * 订阅类型定义
 * 定义订阅相关的数据结构
 */

import type { Currency, SubscriptionType, SubscriptionStatus } from './common';

/**
 * 订阅信息
 */
export interface Subscription {
  id: string;
  userId: string;
  name: string;
  description?: string;
  categoryId: string;
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
 * 创建订阅参数
 */
export type CreateSubscriptionParams = Omit<
  Subscription,
  'id' | 'createdAt' | 'updatedAt'
>;

/**
 * 更新订阅参数
 */
export type UpdateSubscriptionParams = Partial<
  Omit<
    Subscription,
    'id' | 'userId' | 'createdAt' | 'updatedAt'
  >
>;

/**
 * 订阅查询参数
 */
export interface SubscriptionQueryParams {
  userId: string;
  categoryId?: string;
  status?: SubscriptionStatus;
  type?: SubscriptionType;
  keyword?: string;
  sortBy?: 'renewalDate' | 'price' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * 订阅统计信息
 */
export interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  expiredSubscriptions: number;
  totalMonthlyCost: number;
  totalYearlyCost: number;
  expiringSoonCount: number;
  categoryStats: CategoryStat[];
}

/**
 * 分类统计
 */
export interface CategoryStat {
  categoryId: string;
  categoryName: string;
  count: number;
  totalCost: number;
  monthlyCost: number;
}

/**
 * 订阅摘要
 */
export interface SubscriptionSummary {
  id: string;
  name: string;
  price: number;
  currency: Currency;
  type: SubscriptionType;
  status: SubscriptionStatus;
  renewalDate: Date;
  categoryName: string;
  categoryColor: string;
  isExpiringSoon: boolean;
  isExpired: boolean;
}

/**
 * 订阅详情
 */
export interface SubscriptionDetail extends Subscription {
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  tagNames: string[];
  tagColors: string[];
  daysUntilRenewal: number;
  isExpiringSoon: boolean;
  isExpired: boolean;
  monthlyCost: number;
  yearlyCost: number;
}

/**
 * 订阅卡片数据
 */
export interface SubscriptionCardData {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: Currency;
  type: SubscriptionType;
  status: SubscriptionStatus;
  renewalDate: Date;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  tags: string[];
  autoRenew: boolean;
  isExpiringSoon: boolean;
  isExpired: boolean;
}

/**
 * 订阅筛选条件
 */
export interface SubscriptionFilter {
  categoryId?: string;
  status?: SubscriptionStatus;
  type?: SubscriptionType;
  keyword?: string;
  sortBy?: 'renewalDate' | 'price' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 订阅排序选项
 */
export interface SubscriptionSortOption {
  label: string;
  value: 'renewalDate' | 'price' | 'createdAt' | 'name';
  order: 'asc' | 'desc';
}

/**
 * 订阅表单数据
 */
export interface SubscriptionFormData {
  name: string;
  description?: string;
  categoryId: string;
  tags: string[];
  type: SubscriptionType;
  price: number;
  currency: Currency;
  billingDate: Date;
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  platform: string;
  paymentMethod: string;
  notes?: string;
}

/**
 * 订阅表单验证错误
 */
export interface SubscriptionFormErrors {
  name?: string;
  categoryId?: string;
  type?: string;
  price?: string;
  currency?: string;
  billingDate?: string;
  startDate?: string;
  platform?: string;
  paymentMethod?: string;
}

/**
 * 订阅操作类型
 */
export type SubscriptionAction = 'view' | 'edit' | 'delete' | 'cancel' | 'renew';
