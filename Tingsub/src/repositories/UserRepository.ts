/**
 * 用户仓储类
 * 提供用户数据访问操作
 */

import Realm from 'realm';
import { BaseRepository } from './BaseRepository';
import { UserModel } from '../models/User';
import { ValidationUtils, ValidationError } from '../utils/validationUtils';
import { Logger } from '../utils/loggerUtils';
import type { User, CreateUserParams, UpdateUserParams, UserQueryParams } from '../../types/user';

/**
 * 用户仓储类
 */
export class UserRepository extends BaseRepository<User> {
  constructor(realm: Realm) {
    super(realm, 'User');
  }

  /**
   * 将Realm对象转换为User类型
   * @param realmObj Realm对象
   * @returns User类型对象
   */
  private convertToUserType(realmObj: any): User {
    const reminderSettings = realmObj.reminderSettings as any;
    return {
      id: String(realmObj.id),
      username: String(realmObj.username),
      email: realmObj.email ? String(realmObj.email) : undefined,
      avatar: realmObj.avatar ? String(realmObj.avatar) : undefined,
      theme: realmObj.theme as 'light' | 'dark' | 'system',
      currency: realmObj.currency as 'CNY' | 'USD' | 'EUR' | 'JPY' | 'GBP',
      reminderSettings: {
        enabled: Boolean(reminderSettings?.enabled),
        advanceDays: Number(reminderSettings?.advanceDays || 0),
        repeatInterval: (reminderSettings?.repeatInterval || 'none') as 'none' | 'daily' | 'weekly',
        notificationChannels: (reminderSettings?.notificationChannels || []).map((channel: any) => ({
          type: channel.type as 'local',
          enabled: Boolean(channel.enabled),
          sound: Boolean(channel.sound),
          vibration: Boolean(channel.vibration),
        })),
      },
      createdAt: new Date(realmObj.createdAt),
      updatedAt: new Date(realmObj.updatedAt),
    };
  }

  /**
   * 创建用户
   * @param params 创建用户参数
   * @returns 创建的用户
   */
  async createUser(params: CreateUserParams): Promise<User> {
    return this.executeOperation(async () => {
      const now = new Date();

      const userData: User = {
        id: this.generateUUID(),
        username: params.username,
        email: params.email || '',
        avatar: params.avatar || '',
        theme: params.theme || 'system',
        currency: params.currency || 'CNY',
        reminderSettings: params.reminderSettings || {
          enabled: true,
          advanceDays: 3,
          repeatInterval: 'none',
          notificationChannels: [
            {
              type: 'local',
              enabled: true,
              sound: true,
              vibration: true,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
      };

      try {
        ValidationUtils.validateUser(userData);
      } catch (error) {
        if (error instanceof ValidationError) {
          Logger.error('用户数据验证失败:', error.details);
          throw new Error(`创建用户失败: ${error.message}`);
        }
        throw error;
      }

      const realmData = UserModel.fromUserTypeForRealm(userData);

      return this.realm.write(() => {
        const created = this.realm.create('User', realmData) as any;
        // 手动转换为User类型，因为Realm对象可能没有toUserType方法
        return this.convertToUserType(created);
      });
    }, '创建用户失败');
  }

  /**
   * 更新用户
   * @param id 用户ID
   * @param params 更新用户参数
   * @returns 更新后的用户
   */
  async updateUser(id: string, params: UpdateUserParams): Promise<User> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('用户不存在');
      }

      const mergedData: User = {
        ...existing,
        ...params,
        reminderSettings: params.reminderSettings
          ? { ...existing.reminderSettings, ...params.reminderSettings }
          : existing.reminderSettings,
        updatedAt: new Date(),
      };

      ValidationUtils.validateUser(mergedData);

      const realmData = UserModel.fromUserType(mergedData);

      return this.realm.write(() => {
        const updated = this.realm.create('User', { ...realmData, id }, true) as any;
        // 手动转换为User类型
        return this.convertToUserType(updated);
      });
    }, '更新用户失败');
  }

  /**
   * 根据用户名查找用户
   * @param username 用户名
   * @returns 用户对象或null
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.executeOperation(() => {
      const objects = this.realm.objects('User').filtered('username == $0', username);
      if (objects.length === 0) {
        return null;
      }
      return this.convertToUserType(objects[0]);
    }, '根据用户名查找用户失败');
  }

  /**
   * 根据邮箱查找用户
   * @param email 邮箱
   * @returns 用户对象或null
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.executeOperation(() => {
      const objects = this.realm.objects('User').filtered('email == $0', email);
      if (objects.length === 0) {
        return null;
      }
      return this.convertToUserType(objects[0]);
    }, '根据邮箱查找用户失败');
  }

  /**
   * 查询用户
   * @param params 查询参数
   * @returns 用户数组
   */
  async queryUsers(params: UserQueryParams): Promise<User[]> {
    return this.executeOperation(() => {
      let objects = this.realm.objects('User');

      if (params.id) {
        objects = objects.filtered('id == $0', params.id);
      }
      if (params.username) {
        objects = objects.filtered('username CONTAINS[c] $0', params.username);
      }
      if (params.email) {
        objects = objects.filtered('email == $0', params.email);
      }

      return objects.map((obj: any) => this.convertToUserType(obj));
    }, '查询用户失败');
  }

  /**
   * 更新用户主题
   * @param id 用户ID
   * @param theme 主题
   * @returns 更新后的用户
   */
  async updateTheme(id: string, theme: 'light' | 'dark' | 'system'): Promise<User> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('用户不存在');
      }

      return this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('User', id);
        if (object) {
          (object as any).theme = theme;
          (object as any).updatedAt = new Date();
          return this.convertToUserType(object);
        }
        throw new Error('用户不存在');
      });
    }, '更新用户主题失败');
  }

  /**
   * 更新用户货币
   * @param id 用户ID
   * @param currency 货币类型
   * @returns 更新后的用户
   */
  async updateCurrency(id: string, currency: 'CNY' | 'USD' | 'EUR' | 'JPY' | 'GBP'): Promise<User> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('用户不存在');
      }

      return this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('User', id);
        if (object) {
          (object as any).currency = currency;
          (object as any).updatedAt = new Date();
          return this.convertToUserType(object);
        }
        throw new Error('用户不存在');
      });
    }, '更新用户货币失败');
  }

  /**
   * 更新用户头像
   * @param id 用户ID
   * @param avatar 头像路径
   * @returns 更新后的用户
   */
  async updateAvatar(id: string, avatar: string): Promise<User> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('用户不存在');
      }

      return this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('User', id);
        if (object) {
          (object as any).avatar = avatar;
          (object as any).updatedAt = new Date();
          return this.convertToUserType(object);
        }
        throw new Error('用户不存在');
      });
    }, '更新用户头像失败');
  }

  /**
   * 更新提醒设置
   * @param id 用户ID
   * @param reminderSettings 提醒设置
   * @returns 更新后的用户
   */
  async updateReminderSettings(
    id: string,
    reminderSettings: Partial<{
      enabled: boolean;
      advanceDays: number;
      repeatInterval: 'none' | 'daily' | 'weekly';
      notificationChannels: Array<{
        type: 'local';
        enabled: boolean;
        sound: boolean;
        vibration: boolean;
      }>;
    }>
  ): Promise<User> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('用户不存在');
      }

      return this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('User', id);
        if (object) {
          const userObj = object as any;
          if (reminderSettings.enabled !== undefined) {
            userObj.reminderSettings.enabled = reminderSettings.enabled;
          }
          if (reminderSettings.advanceDays !== undefined) {
            userObj.reminderSettings.advanceDays = reminderSettings.advanceDays;
          }
          if (reminderSettings.repeatInterval !== undefined) {
            userObj.reminderSettings.repeatInterval = reminderSettings.repeatInterval;
          }
          if (reminderSettings.notificationChannels) {
            userObj.reminderSettings.notificationChannels = reminderSettings.notificationChannels;
          }
          userObj.updatedAt = new Date();
          return this.convertToUserType(object);
        }
        throw new Error('用户不存在');
      });
    }, '更新提醒设置失败');
  }

  /**
   * 检查用户名是否已存在
   * @param username 用户名
   * @param excludeId 排除的用户ID（用于更新时检查）
   * @returns 是否已存在
   */
  async isUsernameExists(username: string, excludeId?: string): Promise<boolean> {
    return this.executeOperation(() => {
      let objects = this.realm.objects('User').filtered('username == $0', username);
      if (excludeId) {
        objects = objects.filtered('id != $0', excludeId);
      }
      return objects.length > 0;
    }, '检查用户名是否存在失败');
  }

  /**
   * 检查邮箱是否已存在
   * @param email 邮箱
   * @param excludeId 排除的用户ID（用于更新时检查）
   * @returns 是否已存在
   */
  async isEmailExists(email: string, excludeId?: string): Promise<boolean> {
    return this.executeOperation(() => {
      let objects = this.realm.objects('User').filtered('email == $0', email);
      if (excludeId) {
        objects = objects.filtered('id != $0', excludeId);
      }
      return objects.length > 0;
    }, '检查邮箱是否存在失败');
  }

  /**
   * 获取用户总数
   * @returns 用户总数
   */
  async getUserCount(): Promise<number> {
    return this.executeOperation(() => {
      return this.realm.objects('User').length;
    }, '获取用户总数失败');
  }

  /**
   * 检查是否有用户
   * @returns 是否有用户
   */
  async hasUsers(): Promise<boolean> {
    return this.executeOperation(() => {
      return this.realm.objects('User').length > 0;
    }, '检查是否有用户失败');
  }

  /**
   * 获取第一个用户
   * @returns 第一个用户或null
   */
  async getFirstUser(): Promise<User | null> {
    return this.executeOperation(() => {
      const objects = this.realm.objects('User');
      if (objects.length === 0) {
        return null;
      }
      return this.convertToUserType(objects[0]);
    }, '获取第一个用户失败');
  }

  /**
   * 搜索用户
   * @param keyword 搜索关键词
   * @returns 匹配的用户数组
   */
  async searchUsers(keyword: string): Promise<User[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('User')
        .filtered('username CONTAINS[c] $0 OR email CONTAINS[c] $0', keyword);
      return objects.map((obj: any) => this.convertToUserType(obj));
    }, '搜索用户失败');
  }

  /**
   * 按主题筛选用户
   * @param theme 主题
   * @returns 用户数组
   */
  async filterByTheme(theme: 'light' | 'dark' | 'system'): Promise<User[]> {
    return this.executeOperation(() => {
      const objects = this.realm.objects('User').filtered('theme == $0', theme);
      return objects.map((obj: any) => this.convertToUserType(obj));
    }, '按主题筛选用户失败');
  }

  /**
   * 按货币筛选用户
   * @param currency 货币类型
   * @returns 用户数组
   */
  async filterByCurrency(currency: 'CNY' | 'USD' | 'EUR' | 'JPY' | 'GBP'): Promise<User[]> {
    return this.executeOperation(() => {
      const objects = this.realm.objects('User').filtered('currency == $0', currency);
      return objects.map((obj: any) => this.convertToUserType(obj));
    }, '按货币筛选用户失败');
  }

  /**
   * 按创建时间排序用户
   * @param order 排序顺序
   * @returns 用户数组
   */
  async sortByCreatedAt(order: 'asc' | 'desc' = 'desc'): Promise<User[]> {
    return this.executeOperation(() => {
      const objects = this.realm.objects('User').sorted('createdAt', order === 'desc');
      return objects.map((obj: any) => this.convertToUserType(obj));
    }, '按创建时间排序用户失败');
  }

  /**
   * 按更新时间排序用户
   * @param order 排序顺序
   * @returns 用户数组
   */
  async sortByUpdatedAt(order: 'asc' | 'desc' = 'desc'): Promise<User[]> {
    return this.executeOperation(() => {
      const objects = this.realm.objects('User').sorted('updatedAt', order === 'desc');
      return objects.map((obj: any) => this.convertToUserType(obj));
    }, '按更新时间排序用户失败');
  }

  /**
   * 获取最近更新的用户
   * @param limit 数量限制
   * @returns 用户数组
   */
  async getRecentlyUpdated(limit: number = 10): Promise<User[]> {
    return this.executeOperation(() => {
      const objects = this.realm.objects('User').sorted('updatedAt', true).slice(0, limit);
      return objects.map((obj: any) => this.convertToUserType(obj));
    }, '获取最近更新的用户失败');
  }

  /**
   * 删除用户
   * @param id 用户ID
   */
  async deleteUser(id: string): Promise<void> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('用户不存在');
      }

      this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('User', id);
        if (object) {
          this.realm.delete(object);
        }
      });

      Logger.info(`用户已删除: ${id}`);
    }, '删除用户失败');
  }

  /**
   * 清空所有用户
   */
  async clearAllUsers(): Promise<void> {
    return this.executeOperation(() => {
      this.realm.write(() => {
        this.realm.delete(this.realm.objects('User'));
      });
      Logger.info('所有用户已清空');
    }, '清空所有用户失败');
  }
}
