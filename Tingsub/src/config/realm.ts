// Realm数据库配置文件
// 配置Realm数据库的初始化参数、加密设置和模型导入

import Realm from 'realm';
import { ENV, isDevelopment, isProduction } from './env';
import { UserModel, ReminderSettingsModel, NotificationChannelModel } from '../models/User';
import { SubscriptionModel } from '../models/Subscription';
import { CategoryModel } from '../models/Category';
import { TagModel } from '../models/Tag';
import { ReminderHistoryModel } from '../models/ReminderHistory';

// 全局声明TextEncoder
declare var TextEncoder: any;

// React Native环境中TextEncoder是全局可用的
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder: NodeTextEncoder } = require('util');
  (globalThis as any).TextEncoder = NodeTextEncoder;
}

// 加密配置：仅在生产环境使用加密，开发环境可选
const encryptionKey = isProduction ? new TextEncoder().encode(ENV.REALM_ENCRYPTION_KEY) : undefined;

// 数据库配置
export const realmConfig: Realm.Configuration = {
  // 数据库名称
  path: 'TingSub.realm',

  // 加密密钥（生产环境）
  encryptionKey,

  // 数据库版本
  schemaVersion: ENV.REALM_SCHEMA_VERSION,

  // 模型集合
  schema: [
    UserModel.schema,
    ReminderSettingsModel.schema,
    NotificationChannelModel.schema,
    SubscriptionModel.schema,
    CategoryModel.schema,
    TagModel.schema,
    ReminderHistoryModel.schema,
  ],

  // 迁移策略
  onMigration: (oldRealm) => {
    if (oldRealm.schemaVersion < ENV.REALM_SCHEMA_VERSION) {
      // 执行数据库迁移逻辑
      // 注意：迁移逻辑需要根据版本变化编写
      console.log(
        `Realm数据库从版本${oldRealm.schemaVersion}迁移到版本${ENV.REALM_SCHEMA_VERSION}`
      );
    }
  },

  // 开发环境配置
  deleteRealmIfMigrationNeeded: isDevelopment,
};

// 初始化Realm实例
export const initializeRealm = async (): Promise<Realm> => {
  try {
    const realm = await Realm.open(realmConfig);
    console.log('Realm数据库初始化成功');
    return realm;
  } catch (error) {
    console.error('Realm数据库初始化失败:', error);
    throw error;
  }
};

// 关闭Realm实例
export const closeRealm = (realm: Realm): void => {
  if (realm && !realm.isClosed) {
    realm.close();
    console.log('Realm数据库已关闭');
  }
};

// 清除Realm数据库（仅开发环境使用）
export const clearRealm = async (): Promise<void> => {
  if (isDevelopment) {
    try {
      await Realm.deleteFile(realmConfig);
      console.log('Realm数据库已清除');
    } catch (error) {
      console.error('清除Realm数据库失败:', error);
      throw error;
    }
  } else {
    throw new Error('仅开发环境允许清除数据库');
  }
};
