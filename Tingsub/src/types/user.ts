/**
 * 用户类型定义
 * 定义用户相关的数据结构
 */

import type { ThemeMode, Currency } from './common';

/**
 * 通知渠道
 */
export interface NotificationChannel {
  type: 'local';
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
}

/**
 * 提醒设置
 */
export interface ReminderSettings {
  enabled: boolean;
  advanceDays: number;
  repeatInterval: 'none' | 'daily' | 'weekly';
  notificationChannels: NotificationChannel[];
}

/**
 * 用户信息
 */
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  theme: ThemeMode;
  currency: Currency;
  reminderSettings: ReminderSettings;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 创建用户参数
 */
export type CreateUserParams = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * 更新用户参数
 */
export type UpdateUserParams = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * 用户表单数据
 */
export interface UserFormData {
  username: string;
  email?: string;
  avatar?: string;
  theme: ThemeMode;
  currency: Currency;
}

/**
 * 用户表单验证错误
 */
export interface UserFormErrors {
  username?: string;
  email?: string;
  theme?: string;
  currency?: string;
}

/**
 * 提醒设置表单数据
 */
export interface ReminderSettingsFormData {
  enabled: boolean;
  advanceDays: number;
  repeatInterval: 'none' | 'daily' | 'weekly';
  notificationChannels: NotificationChannel[];
}

/**
 * 提醒设置表单验证错误
 */
export interface ReminderSettingsFormErrors {
  advanceDays?: string;
  repeatInterval?: string;
}
