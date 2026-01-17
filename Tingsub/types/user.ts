/**
 * 用户相关类型定义
 * 包含用户信息、提醒设置等类型
 */

import type { Theme, Currency, ReminderSettings, UUID } from './common';

/**
 * 用户信息接口
 */
export interface User {
  id: UUID;
  username: string;
  email?: string;
  avatar?: string;
  theme: Theme;
  currency: Currency;
  reminderSettings: ReminderSettings;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 创建用户参数接口（不包含自动生成的字段）
 */
export interface CreateUserParams {
  username: string;
  email?: string;
  avatar?: string;
  theme?: Theme;
  currency?: Currency;
  reminderSettings?: ReminderSettings;
}

/**
 * 更新用户参数接口
 */
export interface UpdateUserParams {
  username?: string;
  email?: string;
  avatar?: string;
  theme?: Theme;
  currency?: Currency;
  reminderSettings?: Partial<ReminderSettings>;
}

/**
 * 用户查询参数接口
 */
export interface UserQueryParams {
  id?: UUID;
  username?: string;
  email?: string;
}
