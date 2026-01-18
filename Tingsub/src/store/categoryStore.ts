/**
 * 分类状态管理
 * 使用Zustand管理分类相关的全局状态
 */

import { create } from 'zustand';
import { CategoryRepository } from '../repositories/CategoryRepository';
import type {
  Category,
  CreateCategoryParams,
  UpdateCategoryParams,
  CategoryQueryParams,
  CategoryStats,
} from '../../types/category';

/**
 * 分类状态接口
 */
interface CategoryState {
  // 状态数据
  categories: Category[];
  currentCategory: Category | null;
  stats: CategoryStats[] | null;
  isLoading: boolean;
  error: string | null;

  // 分类操作方法
  loadCategories: (repository: CategoryRepository, userId: string) => Promise<void>;
  loadCategory: (repository: CategoryRepository, id: string) => Promise<void>;
  createCategory: (
    repository: CategoryRepository,
    params: CreateCategoryParams
  ) => Promise<Category>;
  updateCategory: (
    repository: CategoryRepository,
    id: string,
    params: UpdateCategoryParams
  ) => Promise<Category>;
  deleteCategory: (repository: CategoryRepository, id: string) => Promise<void>;
  loadStats: (repository: CategoryRepository, userId: string) => Promise<void>;
  queryCategories: (
    repository: CategoryRepository,
    params: CategoryQueryParams
  ) => Promise<Category[]>;
  getDefaultCategories: (repository: CategoryRepository) => Promise<Category[]>;
  getUserCategories: (repository: CategoryRepository, userId: string) => Promise<Category[]>;
  searchCategories: (
    repository: CategoryRepository,
    userId: string,
    keyword: string
  ) => Promise<Category[]>;
  sortByName: (
    repository: CategoryRepository,
    userId: string,
    order?: 'asc' | 'desc'
  ) => Promise<void>;
  sortByCreatedAt: (
    repository: CategoryRepository,
    userId: string,
    order?: 'asc' | 'desc'
  ) => Promise<void>;
  sortByUpdatedAt: (
    repository: CategoryRepository,
    userId: string,
    order?: 'asc' | 'desc'
  ) => Promise<void>;
  updateName: (repository: CategoryRepository, id: string, name: string) => Promise<void>;
  updateColor: (repository: CategoryRepository, id: string, color: string) => Promise<void>;
  updateIcon: (repository: CategoryRepository, id: string, icon: string) => Promise<void>;
  updateDescription: (
    repository: CategoryRepository,
    id: string,
    description: string
  ) => Promise<void>;
  initializeDefaultCategories: (
    repository: CategoryRepository,
    userId: string
  ) => Promise<Category[]>;
  clearError: () => void;
}

/**
 * 分类状态管理Store
 */
export const useCategoryStore = create<CategoryState>((set, get) => ({
  // 初始状态
  categories: [],
  currentCategory: null,
  stats: null,
  isLoading: false,
  error: null,

  /**
   * 加载分类列表
   */
  loadCategories: async (repository: CategoryRepository, userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const categories = await repository.getByUserId(userId);
      set({ categories, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载分类列表失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 加载单个分类
   */
  loadCategory: async (repository: CategoryRepository, id: string) => {
    set({ isLoading: true, error: null });

    try {
      const category = await repository.getById(id);
      set({ currentCategory: category || null, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载分类失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 创建分类
   */
  createCategory: async (repository: CategoryRepository, params: CreateCategoryParams) => {
    set({ isLoading: true, error: null });

    try {
      const category = await repository.createCategory(params);

      const { categories } = get();
      set({
        categories: [...categories, category],
        currentCategory: category,
        isLoading: false,
      });

      return category;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建分类失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 更新分类
   */
  updateCategory: async (
    repository: CategoryRepository,
    id: string,
    params: UpdateCategoryParams
  ) => {
    set({ isLoading: true, error: null });

    try {
      const updatedCategory = await repository.updateCategory(id, params);

      const { categories, currentCategory } = get();
      const newCategories = categories.map((cat) => (cat.id === id ? updatedCategory : cat));

      set({
        categories: newCategories,
        currentCategory: currentCategory?.id === id ? updatedCategory : currentCategory,
        isLoading: false,
      });

      return updatedCategory;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新分类失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 删除分类
   */
  deleteCategory: async (repository: CategoryRepository, id: string) => {
    set({ isLoading: true, error: null });

    try {
      await repository.deleteCategory(id);

      const { categories, currentCategory } = get();
      const newCategories = categories.filter((cat) => cat.id !== id);

      set({
        categories: newCategories,
        currentCategory: currentCategory?.id === id ? null : currentCategory,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除分类失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 加载统计信息
   */
  loadStats: async (repository: CategoryRepository, userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const stats = await repository.getCategoryStats(userId);
      set({ stats, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载统计信息失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 查询分类
   */
  queryCategories: async (repository: CategoryRepository, params: CategoryQueryParams) => {
    set({ isLoading: true, error: null });

    try {
      const categories = await repository.queryCategories(params);
      set({ categories, isLoading: false });
      return categories;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '查询分类失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 获取默认分类
   */
  getDefaultCategories: async (repository: CategoryRepository) => {
    set({ isLoading: true, error: null });

    try {
      const categories = await repository.getDefaultCategories();
      set({ categories, isLoading: false });
      return categories;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取默认分类失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 获取用户自定义分类
   */
  getUserCategories: async (repository: CategoryRepository, userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const categories = await repository.getUserCategories(userId);
      set({ categories, isLoading: false });
      return categories;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取用户分类失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 搜索分类
   */
  searchCategories: async (repository: CategoryRepository, userId: string, keyword: string) => {
    set({ isLoading: true, error: null });

    try {
      const categories = await repository.searchCategories(userId, keyword);
      set({ categories, isLoading: false });
      return categories;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '搜索分类失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 按名称排序
   */
  sortByName: async (
    repository: CategoryRepository,
    userId: string,
    order: 'asc' | 'desc' = 'asc'
  ) => {
    set({ isLoading: true, error: null });

    try {
      const categories = await repository.sortByName(userId, order);
      set({ categories, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '按名称排序失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 按创建时间排序
   */
  sortByCreatedAt: async (
    repository: CategoryRepository,
    userId: string,
    order: 'asc' | 'desc' = 'desc'
  ) => {
    set({ isLoading: true, error: null });

    try {
      const categories = await repository.sortByCreatedAt(userId, order);
      set({ categories, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '按创建时间排序失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 按更新时间排序
   */
  sortByUpdatedAt: async (
    repository: CategoryRepository,
    userId: string,
    order: 'asc' | 'desc' = 'desc'
  ) => {
    set({ isLoading: true, error: null });

    try {
      const categories = await repository.sortByUpdatedAt(userId, order);
      set({ categories, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '按更新时间排序失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 更新分类名称
   */
  updateName: async (repository: CategoryRepository, id: string, name: string) => {
    set({ isLoading: true, error: null });

    try {
      const updatedCategory = await repository.updateName(id, name);

      const { categories, currentCategory } = get();
      const newCategories = categories.map((cat) => (cat.id === id ? updatedCategory : cat));

      set({
        categories: newCategories,
        currentCategory: currentCategory?.id === id ? updatedCategory : currentCategory,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新分类名称失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 更新分类颜色
   */
  updateColor: async (repository: CategoryRepository, id: string, color: string) => {
    set({ isLoading: true, error: null });

    try {
      const updatedCategory = await repository.updateColor(id, color);

      const { categories, currentCategory } = get();
      const newCategories = categories.map((cat) => (cat.id === id ? updatedCategory : cat));

      set({
        categories: newCategories,
        currentCategory: currentCategory?.id === id ? updatedCategory : currentCategory,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新分类颜色失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 更新分类图标
   */
  updateIcon: async (repository: CategoryRepository, id: string, icon: string) => {
    set({ isLoading: true, error: null });

    try {
      const updatedCategory = await repository.updateIcon(id, icon);

      const { categories, currentCategory } = get();
      const newCategories = categories.map((cat) => (cat.id === id ? updatedCategory : cat));

      set({
        categories: newCategories,
        currentCategory: currentCategory?.id === id ? updatedCategory : currentCategory,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新分类图标失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 更新分类描述
   */
  updateDescription: async (repository: CategoryRepository, id: string, description: string) => {
    set({ isLoading: true, error: null });

    try {
      const updatedCategory = await repository.updateDescription(id, description);

      const { categories, currentCategory } = get();
      const newCategories = categories.map((cat) => (cat.id === id ? updatedCategory : cat));

      set({
        categories: newCategories,
        currentCategory: currentCategory?.id === id ? updatedCategory : currentCategory,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新分类描述失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 初始化默认分类
   */
  initializeDefaultCategories: async (repository: CategoryRepository, userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const categories = await repository.initializeDefaultCategories(userId);
      set({ categories, isLoading: false });
      return categories;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '初始化默认分类失败';
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
