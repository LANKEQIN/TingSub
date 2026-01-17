/**
 * 用户状态管理
 * 使用Zustand管理用户相关的全局状态
 */

import { create } from 'zustand';
import { UserRepository } from '../repositories/UserRepository';
import { StorageUtils } from '../utils/storageUtils';
import { USER_STORAGE_KEYS } from '../constants/storageKeys';
import type { User, CreateUserParams, UpdateUserParams } from '../../types/user';
import type { Theme, Currency } from '../../types/common';

/**
 * 用户状态接口
 */
interface UserState {
  // 状态数据
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;

  // 用户操作方法
  initializeUser: (repository: UserRepository) => Promise<void>;
  createUser: (repository: UserRepository, params: CreateUserParams) => Promise<User>;
  updateUser: (repository: UserRepository, params: UpdateUserParams) => Promise<User>;
  updateTheme: (repository: UserRepository, theme: Theme) => Promise<void>;
  updateCurrency: (repository: UserRepository, currency: Currency) => Promise<void>;
  updateAvatar: (repository: UserRepository, avatar: string) => Promise<void>;
  updateReminderSettings: (
    repository: UserRepository,
    settings: Partial<{
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
  ) => Promise<void>;
  deleteUser: (repository: UserRepository) => Promise<void>;
  clearError: () => void;
}

/**
 * 用户状态管理Store
 */
export const useUserStore = create<UserState>((set, get) => ({
  // 初始状态
  currentUser: null,
  isLoading: false,
  error: null,

  /**
   * 初始化用户
   * 从存储中读取当前用户ID并加载用户信息
   */
  initializeUser: async (repository: UserRepository) => {
    set({ isLoading: true, error: null });

    try {
      const userId = await StorageUtils.getItem(USER_STORAGE_KEYS.CURRENT_USER);

      if (userId && typeof userId === 'string') {
        const user = await repository.getById(userId);
        if (user) {
          set({ currentUser: user, isLoading: false });
          return;
        }
      }

      set({ currentUser: null, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '初始化用户失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 创建用户
   */
  createUser: async (repository: UserRepository, params: CreateUserParams) => {
    set({ isLoading: true, error: null });

    try {
      const user = await repository.createUser(params);

      await StorageUtils.setItem(USER_STORAGE_KEYS.CURRENT_USER, user.id);

      set({ currentUser: user, isLoading: false });

      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建用户失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 更新用户
   */
  updateUser: async (repository: UserRepository, params: UpdateUserParams) => {
    set({ isLoading: true, error: null });

    try {
      const { currentUser } = get();

      if (!currentUser) {
        throw new Error('当前用户不存在');
      }

      const updatedUser = await repository.updateUser(currentUser.id, params);

      set({ currentUser: updatedUser, isLoading: false });

      return updatedUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新用户失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 更新用户主题
   */
  updateTheme: async (repository: UserRepository, theme: Theme) => {
    set({ isLoading: true, error: null });

    try {
      const { currentUser } = get();

      if (!currentUser) {
        throw new Error('当前用户不存在');
      }

      const updatedUser = await repository.updateTheme(currentUser.id, theme);

      set({ currentUser: updatedUser, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新主题失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 更新用户货币
   */
  updateCurrency: async (repository: UserRepository, currency: Currency) => {
    set({ isLoading: true, error: null });

    try {
      const { currentUser } = get();

      if (!currentUser) {
        throw new Error('当前用户不存在');
      }

      const updatedUser = await repository.updateCurrency(currentUser.id, currency);

      set({ currentUser: updatedUser, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新货币失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 更新用户头像
   */
  updateAvatar: async (repository: UserRepository, avatar: string) => {
    set({ isLoading: true, error: null });

    try {
      const { currentUser } = get();

      if (!currentUser) {
        throw new Error('当前用户不存在');
      }

      const updatedUser = await repository.updateAvatar(currentUser.id, avatar);

      set({ currentUser: updatedUser, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新头像失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 更新提醒设置
   */
  updateReminderSettings: async (
    repository: UserRepository,
    settings: Partial<{
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
  ) => {
    set({ isLoading: true, error: null });

    try {
      const { currentUser } = get();

      if (!currentUser) {
        throw new Error('当前用户不存在');
      }

      const updatedUser = await repository.updateReminderSettings(currentUser.id, settings);

      set({ currentUser: updatedUser, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新提醒设置失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 删除用户
   */
  deleteUser: async (repository: UserRepository) => {
    set({ isLoading: true, error: null });

    try {
      const { currentUser } = get();

      if (!currentUser) {
        throw new Error('当前用户不存在');
      }

      await repository.deleteUser(currentUser.id);

      await StorageUtils.removeItem(USER_STORAGE_KEYS.CURRENT_USER);

      set({ currentUser: null, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除用户失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 清除错误信息
   */
  clearError: () => {
    set({ error: null });
  },
}));
