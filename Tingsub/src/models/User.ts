/**
 * 用户数据模型
 * 使用Realm数据库存储用户信息
 */

import Realm from 'realm';
import type { User } from '../../types/user';

/**
 * 提醒设置模型（Realm嵌套对象）
 */
export class ReminderSettingsModel extends Realm.Object {
  enabled!: boolean;
  advanceDays!: number;
  repeatInterval!: string;
  notificationChannels!: Realm.List<NotificationChannelModel>;

  static schema: Realm.ObjectSchema = {
    name: 'ReminderSettings',
    embedded: true,
    properties: {
      enabled: 'bool',
      advanceDays: 'int',
      repeatInterval: 'string',
      notificationChannels: 'NotificationChannel[]',
    },
  };
}

/**
 * 通知渠道模型（Realm嵌套对象）
 */
export class NotificationChannelModel extends Realm.Object {
  type!: string;
  enabled!: boolean;
  sound!: boolean;
  vibration!: boolean;

  static schema: Realm.ObjectSchema = {
    name: 'NotificationChannel',
    embedded: true,
    properties: {
      type: 'string',
      enabled: 'bool',
      sound: 'bool',
      vibration: 'bool',
    },
  };
}

/**
 * 用户模型
 */
export class UserModel extends Realm.Object<UserModel> {
  id!: string;
  username!: string;
  email?: string;
  avatar?: string;
  theme!: string;
  currency!: string;
  reminderSettings!: ReminderSettingsModel;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'User',
    primaryKey: 'id',
    properties: {
      id: 'string',
      username: 'string',
      email: 'string?',
      avatar: 'string?',
      theme: 'string',
      currency: 'string',
      reminderSettings: 'ReminderSettings',
      createdAt: 'date',
      updatedAt: 'date',
    },
  };

  /**
   * 转换为用户类型
   */
  toUserType(): User {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      avatar: this.avatar,
      theme: this.theme as 'light' | 'dark' | 'system',
      currency: this.currency as 'CNY' | 'USD' | 'EUR' | 'JPY' | 'GBP',
      reminderSettings: {
        enabled: this.reminderSettings.enabled,
        advanceDays: this.reminderSettings.advanceDays,
        repeatInterval: this.reminderSettings.repeatInterval as 'none' | 'daily' | 'weekly',
        notificationChannels: this.reminderSettings.notificationChannels.map((channel) => ({
          type: channel.type as 'local',
          enabled: channel.enabled,
          sound: channel.sound,
          vibration: channel.vibration,
        })),
      },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * 从用户类型创建Realm对象
   */
  static fromUserType(user: User): Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      theme: user.theme,
      currency: user.currency,
      reminderSettings: {
        enabled: user.reminderSettings.enabled,
        advanceDays: user.reminderSettings.advanceDays,
        repeatInterval: user.reminderSettings.repeatInterval,
        notificationChannels: user.reminderSettings.notificationChannels.map((channel) => ({
          type: channel.type,
          enabled: channel.enabled,
          sound: channel.sound,
          vibration: channel.vibration,
        })),
      },
    };
  }

  /**
   * 从用户类型创建Realm对象（用于Realm.write）
   */
  static fromUserTypeForRealm(user: User): any {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      theme: user.theme,
      currency: user.currency,
      reminderSettings: {
        enabled: user.reminderSettings.enabled,
        advanceDays: user.reminderSettings.advanceDays,
        repeatInterval: user.reminderSettings.repeatInterval,
        notificationChannels: user.reminderSettings.notificationChannels.map((channel) => ({
          type: channel.type,
          enabled: channel.enabled,
          sound: channel.sound,
          vibration: channel.vibration,
        })),
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
