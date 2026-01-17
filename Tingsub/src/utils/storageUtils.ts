/**
 * 存储工具
 * 提供基于AsyncStorage的数据存储功能
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { EncryptionUtils } from './encryptionUtils';
import { getStorageKey, getUserStorageKey } from '../constants/storageKeys';

/**
 * 存储配置
 */
const STORAGE_CONFIG = {
  DEFAULT_PREFIX: 'tingsub',
  ENCRYPTED_KEYS: ['user_info', 'payment_info', 'sensitive_data'],
  MAX_STORAGE_SIZE: 10 * 1024 * 1024, // 10MB
};

/**
 * 存储工具类
 */
export class StorageUtils {
  /**
   * 存储数据
   * @param key 存储键
   * @param value 存储值
   * @param options 配置选项
   * @returns 是否成功
   */
  static async setItem<T>(
    key: string,
    value: T,
    options: {
      encrypt?: boolean;
      prefix?: string;
      userId?: string;
    } = {}
  ): Promise<boolean> {
    try {
      const { encrypt = false, prefix, userId } = options;
      const storageKey = userId ? getUserStorageKey(key, userId) : getStorageKey(key, prefix);

      let stringValue: string;
      if (typeof value === 'string') {
        stringValue = value;
      } else {
        stringValue = JSON.stringify(value);
      }

      if (encrypt || STORAGE_CONFIG.ENCRYPTED_KEYS.includes(key)) {
        stringValue = EncryptionUtils.encrypt(stringValue);
      }

      await AsyncStorage.setItem(storageKey, stringValue);
      return true;
    } catch (error) {
      throw new Error(`存储失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 获取数据
   * @param key 存储键
   * @param options 配置选项
   * @returns 存储值
   */
  static async getItem<T>(
    key: string,
    options: {
      decrypt?: boolean;
      prefix?: string;
      userId?: string;
    } = {}
  ): Promise<T | null> {
    try {
      const { decrypt = false, prefix, userId } = options;
      const storageKey = userId ? getUserStorageKey(key, userId) : getStorageKey(key, prefix);

      const stringValue = await AsyncStorage.getItem(storageKey);
      if (stringValue === null) {
        return null;
      }

      let decryptedValue = stringValue;
      if (decrypt || STORAGE_CONFIG.ENCRYPTED_KEYS.includes(key)) {
        decryptedValue = EncryptionUtils.decrypt(stringValue);
      }

      try {
        return JSON.parse(decryptedValue) as T;
      } catch {
        return decryptedValue as T;
      }
    } catch (error) {
      throw new Error(`获取失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 删除数据
   * @param key 存储键
   * @param options 配置选项
   * @returns 是否成功
   */
  static async removeItem(
    key: string,
    options: {
      prefix?: string;
      userId?: string;
    } = {}
  ): Promise<boolean> {
    try {
      const { prefix, userId } = options;
      const storageKey = userId ? getUserStorageKey(key, userId) : getStorageKey(key, prefix);
      await AsyncStorage.removeItem(storageKey);
      return true;
    } catch (error) {
      throw new Error(`删除失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 清空所有数据
   * @returns 是否成功
   */
  static async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      throw new Error(`清空失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 获取所有键
   * @param prefix 前缀
   * @returns 键列表
   */
  static async getAllKeys(prefix?: string): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      if (prefix) {
        const fullPrefix = getStorageKey('', prefix);
        return keys.filter((key) => key.startsWith(fullPrefix));
      }
      return [...keys];
    } catch (error) {
      throw new Error(`获取键列表失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 批量获取数据
   * @param keys 存储键数组
   * @param options 配置选项
   * @returns 存储值数组
   */
  static async multiGet<T>(
    keys: string[],
    options: {
      decrypt?: boolean;
      prefix?: string;
      userId?: string;
    } = {}
  ): Promise<(T | null)[]> {
    try {
      const { decrypt = false, prefix, userId } = options;
      const storageKeys = keys.map((key) =>
        userId ? getUserStorageKey(key, userId) : getStorageKey(key, prefix)
      );

      const keyValuePairs = await AsyncStorage.multiGet(storageKeys);

      return keyValuePairs.map(([, value]) => {
        if (value === null) {
          return null;
        }

        let decryptedValue = value;
        if (decrypt) {
          decryptedValue = EncryptionUtils.decrypt(value);
        }

        try {
          return JSON.parse(decryptedValue) as T;
        } catch {
          return decryptedValue as T;
        }
      });
    } catch (error) {
      throw new Error(`批量获取失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 批量存储数据
   * @param keyValuePairs 键值对数组
   * @param options 配置选项
   * @returns 是否成功
   */
  static async multiSet<T>(
    keyValuePairs: [string, T][],
    options: {
      encrypt?: boolean;
      prefix?: string;
      userId?: string;
    } = {}
  ): Promise<boolean> {
    try {
      const { encrypt = false, prefix, userId } = options;

      const storageKeyValuePairs: [string, string][] = keyValuePairs.map(([key, value]) => {
        const storageKey = userId ? getUserStorageKey(key, userId) : getStorageKey(key, prefix);

        let stringValue: string;
        if (typeof value === 'string') {
          stringValue = value;
        } else {
          stringValue = JSON.stringify(value);
        }

        if (encrypt) {
          stringValue = EncryptionUtils.encrypt(stringValue);
        }

        return [storageKey, stringValue];
      });

      await AsyncStorage.multiSet(storageKeyValuePairs);
      return true;
    } catch (error) {
      throw new Error(`批量存储失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 批量删除数据
   * @param keys 存储键数组
   * @param options 配置选项
   * @returns 是否成功
   */
  static async multiRemove(
    keys: string[],
    options: {
      prefix?: string;
      userId?: string;
    } = {}
  ): Promise<boolean> {
    try {
      const { prefix, userId } = options;
      const storageKeys = keys.map((key) =>
        userId ? getUserStorageKey(key, userId) : getStorageKey(key, prefix)
      );

      await AsyncStorage.multiRemove(storageKeys);
      return true;
    } catch (error) {
      throw new Error(`批量删除失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 检查键是否存在
   * @param key 存储键
   * @param options 配置选项
   * @returns 是否存在
   */
  static async hasKey(
    key: string,
    options: {
      prefix?: string;
      userId?: string;
    } = {}
  ): Promise<boolean> {
    try {
      const { prefix, userId } = options;
      const storageKey = userId ? getUserStorageKey(key, userId) : getStorageKey(key, prefix);
      const value = await AsyncStorage.getItem(storageKey);
      return value !== null;
    } catch (error) {
      throw new Error(`检查键失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 获取存储大小
   * @returns 存储大小（字节）
   */
  static async getStorageSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keyValuePairs = await AsyncStorage.multiGet(keys);

      let totalSize = 0;
      for (const [, value] of keyValuePairs) {
        if (value) {
          totalSize += value.length * 2; // UTF-16编码，每个字符2字节
        }
      }

      return totalSize;
    } catch (error) {
      throw new Error(`获取存储大小失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 清空用户数据
   * @param userId 用户ID
   * @returns 是否成功
   */
  static async clearUserData(userId: string): Promise<boolean> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const userKeys = allKeys.filter((key) => key.includes(`user_${userId}`));

      if (userKeys.length > 0) {
        await AsyncStorage.multiRemove(userKeys);
      }

      return true;
    } catch (error) {
      throw new Error(`清空用户数据失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 导出数据
   * @param prefix 前缀
   * @returns 导出的数据
   */
  static async exportData(prefix?: string): Promise<Record<string, any>> {
    try {
      const keys = await this.getAllKeys(prefix);
      const keyValuePairs = await AsyncStorage.multiGet(keys);

      const data: Record<string, any> = {};
      for (const [key, value] of keyValuePairs) {
        if (value !== null) {
          try {
            data[key] = JSON.parse(value);
          } catch {
            data[key] = value;
          }
        }
      }

      return data;
    } catch (error) {
      throw new Error(`导出数据失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 导入数据
   * @param data 数据对象
   * @param options 配置选项
   * @returns 是否成功
   */
  static async importData(
    data: Record<string, any>,
    options: {
      overwrite?: boolean;
      encrypt?: boolean;
    } = {}
  ): Promise<boolean> {
    try {
      const { overwrite = false, encrypt = false } = options;

      const keyValuePairs: [string, string][] = [];
      for (const [key, value] of Object.entries(data)) {
        if (overwrite || !(await this.hasKey(key))) {
          let stringValue: string;
          if (typeof value === 'string') {
            stringValue = value;
          } else {
            stringValue = JSON.stringify(value);
          }

          if (encrypt) {
            stringValue = EncryptionUtils.encrypt(stringValue);
          }

          keyValuePairs.push([key, stringValue]);
        }
      }

      if (keyValuePairs.length > 0) {
        await AsyncStorage.multiSet(keyValuePairs);
      }

      return true;
    } catch (error) {
      throw new Error(`导入数据失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 合并数据
   * @param key 存储键
   * @param value 要合并的值
   * @param options 配置选项
   * @returns 是否成功
   */
  static async mergeItem<T extends Record<string, any>>(
    key: string,
    value: Partial<T>,
    options: {
      prefix?: string;
      userId?: string;
    } = {}
  ): Promise<boolean> {
    try {
      const { prefix, userId } = options;
      const storageKey = userId ? getUserStorageKey(key, userId) : getStorageKey(key, prefix);

      const existingValue = await this.getItem<T>(key, options);
      const mergedValue = existingValue ? { ...existingValue, ...value } : value;

      return await this.setItem(storageKey, mergedValue, options);
    } catch (error) {
      throw new Error(`合并数据失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 获取存储使用情况
   * @returns 存储使用情况
   */
  static async getStorageUsage(): Promise<{
    used: number;
    total: number;
    percentage: number;
  }> {
    try {
      const used = await this.getStorageSize();
      const total = STORAGE_CONFIG.MAX_STORAGE_SIZE;
      const percentage = (used / total) * 100;

      return {
        used,
        total,
        percentage,
      };
    } catch (error) {
      throw new Error(
        `获取存储使用情况失败: ${error instanceof Error ? error.message : '未知错误'}`
      );
    }
  }

  /**
   * 清理过期数据
   * @param maxAge 最大年龄（毫秒）
   * @returns 清理的键数量
   */
  static async cleanExpiredData(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keyValuePairs = await AsyncStorage.multiGet(keys);

      const now = Date.now();
      const keysToRemove: string[] = [];

      for (const [key, value] of keyValuePairs) {
        if (value) {
          try {
            const parsed = JSON.parse(value);
            if (parsed.timestamp && now - parsed.timestamp > maxAge) {
              keysToRemove.push(key);
            }
          } catch {
            continue;
          }
        }
      }

      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
      }

      return keysToRemove.length;
    } catch (error) {
      throw new Error(`清理过期数据失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 备份数据到字符串
   * @param prefix 前缀
   * @returns 备份字符串
   */
  static async backupToString(prefix?: string): Promise<string> {
    try {
      const data = await this.exportData(prefix);
      return JSON.stringify(data);
    } catch (error) {
      throw new Error(`备份数据失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 从字符串恢复数据
   * @param backupString 备份字符串
   * @param options 配置选项
   * @returns 是否成功
   */
  static async restoreFromString(
    backupString: string,
    options: {
      overwrite?: boolean;
    } = {}
  ): Promise<boolean> {
    try {
      const data = JSON.parse(backupString);
      return await this.importData(data, options);
    } catch (error) {
      throw new Error(`恢复数据失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }
}
