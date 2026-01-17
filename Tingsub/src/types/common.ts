/**
 * 通用类型定义
 * 定义应用中使用的通用类型
 */

/**
 * 货币类型
 */
export type Currency = 'CNY' | 'USD' | 'EUR' | 'JPY' | 'GBP';

/**
 * 订阅周期类型
 */
export type SubscriptionType = 'monthly' | 'yearly' | 'quarterly' | 'weekly' | 'one-time';

/**
 * 订阅状态
 */
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';

/**
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * 排序方向
 */
export type SortOrder = 'asc' | 'desc';

/**
 * 排序字段
 */
export type SortField = 'renewalDate' | 'price' | 'createdAt' | 'name';

/**
 * 提醒类型
 */
export type ReminderType = 'expiration' | 'renewal';

/**
 * 提醒状态
 */
export type ReminderStatus = 'sent' | 'viewed' | 'dismissed';

/**
 * 通知渠道类型
 */
export type NotificationChannelType = 'local';

/**
 * 统计周期
 */
export type StatisticsPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * 导出格式
 */
export type ExportFormat = 'csv' | 'json';

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * 分页结果
 */
export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 查询参数
 */
export interface QueryParams extends PaginationParams {
  keyword?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}

/**
 * API响应
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 表单验证错误
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * 选项类型
 */
export interface Option {
  label: string;
  value: string | number;
}

/**
 * 颜色选项
 */
export interface ColorOption {
  label: string;
  value: string;
  color: string;
}

/**
 * 图标选项
 */
export interface IconOption {
  label: string;
  value: string;
  icon: string;
}
