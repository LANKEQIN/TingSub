/**
 * 通用类型定义
 * 包含应用中使用的通用类型和接口
 */

/**
 * 主题类型
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * 货币类型
 */
export type Currency = 'CNY' | 'USD' | 'EUR' | 'JPY' | 'GBP';

/**
 * 订阅周期类型
 */
export type SubscriptionType = 'monthly' | 'yearly' | 'quarterly' | 'weekly' | 'one-time';

/**
 * 订阅状态类型
 */
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';

/**
 * 重复提醒间隔类型
 */
export type RepeatInterval = 'none' | 'daily' | 'weekly';

/**
 * 通知类型
 */
export type NotificationType = 'local';

/**
 * 提醒类型
 */
export type ReminderType = 'expiration' | 'renewal';

/**
 * 提醒状态类型
 */
export type ReminderStatus = 'sent' | 'viewed' | 'dismissed';

/**
 * 统计周期类型
 */
export type StatisticsPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * 通知渠道接口
 */
export interface NotificationChannel {
  type: NotificationType;
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
}

/**
 * 提醒设置接口
 */
export interface ReminderSettings {
  enabled: boolean;
  advanceDays: number;
  repeatInterval: RepeatInterval;
  notificationChannels: NotificationChannel[];
}

/**
 * 应用设置接口
 */
export interface AppSettings {
  language: string;
  analyticsEnabled: boolean;
  crashReportingEnabled: boolean;
}

/**
 * 分页参数接口
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * 分页响应接口
 */
export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 排序参数接口
 */
export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * 筛选参数接口
 */
export interface FilterParams {
  [key: string]: any;
}

/**
 * 查询参数接口
 */
export interface QueryParams {
  pagination?: PaginationParams;
  sort?: SortParams;
  filter?: FilterParams;
}

/**
 * API响应接口
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string[];
  };
}

/**
 * 表单错误接口
 */
export interface FormErrors {
  [key: string]: string;
}

/**
 * 加载状态类型
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * 加载状态接口
 */
export interface LoadingStatus {
  state: LoadingState;
  error?: string;
}

/**
 * 颜色格式（十六进制）
 */
export type HexColor = `#${string}`;

/**
 * UUID格式
 */
export type UUID = string;

/**
 * ISO日期字符串格式
 */
export type ISODateString = string;
