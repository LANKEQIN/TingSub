/**
 * 分类仓储类
 * 提供分类数据访问操作
 */

import Realm from 'realm';
import { BaseRepository } from './BaseRepository';
import { CategoryModel } from '../models/Category';
import { ValidationUtils } from '../utils/validationUtils';
import { Logger } from '../utils/loggerUtils';
import type {
  Category,
  CreateCategoryParams,
  UpdateCategoryParams,
  CategoryQueryParams,
  CategoryStats,
} from '../../types/category';

/**
 * 分类仓储类
 */
export class CategoryRepository extends BaseRepository<Category> {
  constructor(realm: Realm) {
    super(realm, 'Category');
  }

  /**
   * 创建分类
   * @param params 创建分类参数
   * @returns 创建的分类
   */
  async createCategory(params: CreateCategoryParams): Promise<Category> {
    return this.executeOperation(async () => {
      const now = new Date();

      const categoryData: Category = {
        id: this.generateUUID(),
        userId: params.userId,
        name: params.name,
        description: params.description,
        color: params.color,
        icon: params.icon,
        isDefault: params.isDefault ?? false,
        createdAt: now,
        updatedAt: now,
      };

      ValidationUtils.validateCategory(categoryData);

      const realmData = CategoryModel.fromCategoryType(categoryData);

      return this.realm.write(() => {
        const created = this.realm.create('Category', realmData);
        return (created as any).toCategoryType();
      });
    }, '创建分类失败');
  }

  /**
   * 更新分类
   * @param id 分类ID
   * @param params 更新分类参数
   * @returns 更新后的分类
   */
  async updateCategory(id: string, params: UpdateCategoryParams): Promise<Category> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('分类不存在');
      }

      const mergedData: Category = {
        ...existing,
        ...params,
        updatedAt: new Date(),
      };

      ValidationUtils.validateCategory(mergedData);

      const realmData = CategoryModel.fromCategoryType(mergedData);

      return this.realm.write(() => {
        const updated = this.realm.create('Category', { ...realmData, id }, true);
        return (updated as any).toCategoryType();
      });
    }, '更新分类失败');
  }

  /**
   * 根据用户ID获取分类列表
   * @param userId 用户ID
   * @returns 分类数组
   */
  async getByUserId(userId: string): Promise<Category[]> {
    return this.executeOperation(() => {
      const objects = this.realm.objects('Category').filtered('userId == $0', userId);
      return objects.map((obj: any) => obj.toCategoryType());
    }, '根据用户ID获取分类列表失败');
  }

  /**
   * 获取默认分类
   * @returns 默认分类数组
   */
  async getDefaultCategories(): Promise<Category[]> {
    return this.executeOperation(() => {
      const objects = this.realm.objects('Category').filtered('isDefault == true');
      return objects.map((obj: any) => obj.toCategoryType());
    }, '获取默认分类失败');
  }

  /**
   * 获取用户自定义分类
   * @param userId 用户ID
   * @returns 用户自定义分类数组
   */
  async getUserCategories(userId: string): Promise<Category[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('Category')
        .filtered('userId == $0 AND isDefault == false', userId);
      return objects.map((obj: any) => obj.toCategoryType());
    }, '获取用户自定义分类失败');
  }

  /**
   * 根据名称查找分类
   * @param userId 用户ID
   * @param name 分类名称
   * @returns 分类对象或null
   */
  async findByName(userId: string, name: string): Promise<Category | null> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('Category')
        .filtered('userId == $0 AND name == $1', userId, name);
      if (objects.length === 0) {
        return null;
      }
      return (objects[0] as any).toCategoryType();
    }, '根据名称查找分类失败');
  }

  /**
   * 查询分类
   * @param params 查询参数
   * @returns 分类数组
   */
  async queryCategories(params: CategoryQueryParams): Promise<Category[]> {
    return this.executeOperation(() => {
      let objects = this.realm.objects('Category');

      if (params.userId) {
        objects = objects.filtered('userId == $0', params.userId);
      }
      if (params.name) {
        objects = objects.filtered('name CONTAINS[c] $0', params.name);
      }
      if (params.isDefault !== undefined) {
        objects = objects.filtered('isDefault == $0', params.isDefault);
      }

      return objects.map((obj: any) => obj.toCategoryType());
    }, '查询分类失败');
  }

  /**
   * 搜索分类
   * @param userId 用户ID
   * @param keyword 搜索关键词
   * @returns 匹配的分类数组
   */
  async searchCategories(userId: string, keyword: string): Promise<Category[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('Category')
        .filtered(
          'userId == $0 AND (name CONTAINS[c] $1 OR description CONTAINS[c] $1)',
          userId,
          keyword
        );
      return objects.map((obj: any) => obj.toCategoryType());
    }, '搜索分类失败');
  }

  /**
   * 按名称排序分类
   * @param userId 用户ID
   * @param order 排序顺序
   * @returns 分类数组
   */
  async sortByName(userId: string, order: 'asc' | 'desc' = 'asc'): Promise<Category[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('Category')
        .filtered('userId == $0', userId)
        .sorted('name', order === 'desc');
      return objects.map((obj: any) => obj.toCategoryType());
    }, '按名称排序分类失败');
  }

  /**
   * 按创建时间排序分类
   * @param userId 用户ID
   * @param order 排序顺序
   * @returns 分类数组
   */
  async sortByCreatedAt(userId: string, order: 'asc' | 'desc' = 'desc'): Promise<Category[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('Category')
        .filtered('userId == $0', userId)
        .sorted('createdAt', order === 'desc');
      return objects.map((obj: any) => obj.toCategoryType());
    }, '按创建时间排序分类失败');
  }

  /**
   * 按更新时间排序分类
   * @param userId 用户ID
   * @param order 排序顺序
   * @returns 分类数组
   */
  async sortByUpdatedAt(userId: string, order: 'asc' | 'desc' = 'desc'): Promise<Category[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('Category')
        .filtered('userId == $0', userId)
        .sorted('updatedAt', order === 'desc');
      return objects.map((obj: any) => obj.toCategoryType());
    }, '按更新时间排序分类失败');
  }

  /**
   * 获取分类统计信息
   * @param userId 用户ID
   * @returns 分类统计信息数组
   */
  async getCategoryStats(userId: string): Promise<CategoryStats[]> {
    return this.executeOperation(() => {
      const categories = this.realm.objects('Category').filtered('userId == $0', userId);
      const subscriptions = this.realm.objects('Subscription').filtered('userId == $0', userId);

      const stats: CategoryStats[] = [];

      for (const category of categories) {
        const categorySubscriptions = subscriptions.filtered('categoryId == $0', category.id);
        const count = categorySubscriptions.length;
        let expense = 0;

        for (const sub of categorySubscriptions) {
          const type = sub.type as string;
          const price = sub.price as number;
          const monthlyCost = this.calculateMonthlyCost(price, type);
          expense += monthlyCost;
        }

        stats.push({
          categoryId: category.id as string,
          categoryName: category.name as string,
          expense,
          count,
          color: category.color as `#${string}`,
          icon: category.icon as string,
        });
      }

      return stats.sort((a, b) => b.expense - a.expense);
    }, '获取分类统计信息失败');
  }

  /**
   * 检查分类名称是否已存在
   * @param userId 用户ID
   * @param name 分类名称
   * @param excludeId 排除的分类ID（用于更新时检查）
   * @returns 是否已存在
   */
  async isNameExists(userId: string, name: string, excludeId?: string): Promise<boolean> {
    return this.executeOperation(() => {
      let objects = this.realm
        .objects('Category')
        .filtered('userId == $0 AND name == $1', userId, name);
      if (excludeId) {
        objects = objects.filtered('id != $0', excludeId);
      }
      return objects.length > 0;
    }, '检查分类名称是否存在失败');
  }

  /**
   * 初始化默认分类
   * @param userId 用户ID
   * @returns 创建的默认分类数组
   */
  async initializeDefaultCategories(userId: string): Promise<Category[]> {
    return this.executeOperation(async () => {
      const existing = await this.getByUserId(userId);
      if (existing.length > 0) {
        return existing;
      }

      const defaultCategories = CategoryModel.getDefaultCategories();
      const now = new Date();

      const created: Category[] = [];

      return this.realm.write(() => {
        for (const categoryData of defaultCategories) {
          const category: Category = {
            id: this.generateUUID(),
            userId,
            name: categoryData.name,
            description: categoryData.description,
            color: categoryData.color,
            icon: categoryData.icon,
            isDefault: categoryData.isDefault,
            createdAt: now,
            updatedAt: now,
          };

          const createdObj = this.realm.create('Category', category);
          created.push((createdObj as any).toCategoryType());
        }

        Logger.info(`已为用户 ${userId} 初始化默认分类`);
        return created;
      });
    }, '初始化默认分类失败');
  }

  /**
   * 更新分类名称
   * @param id 分类ID
   * @param name 新名称
   * @returns 更新后的分类
   */
  async updateName(id: string, name: string): Promise<Category> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('分类不存在');
      }

      return this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('Category', id);
        if (object) {
          (object as any).name = name;
          (object as any).updatedAt = new Date();
          return (object as any).toCategoryType();
        }
        throw new Error('分类不存在');
      });
    }, '更新分类名称失败');
  }

  /**
   * 更新分类颜色
   * @param id 分类ID
   * @param color 新颜色
   * @returns 更新后的分类
   */
  async updateColor(id: string, color: string): Promise<Category> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('分类不存在');
      }

      if (!CategoryModel.isValidColor(color)) {
        throw new Error('颜色格式不正确');
      }

      return this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('Category', id);
        if (object) {
          (object as any).color = color;
          (object as any).updatedAt = new Date();
          return (object as any).toCategoryType();
        }
        throw new Error('分类不存在');
      });
    }, '更新分类颜色失败');
  }

  /**
   * 更新分类图标
   * @param id 分类ID
   * @param icon 新图标
   * @returns 更新后的分类
   */
  async updateIcon(id: string, icon: string): Promise<Category> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('分类不存在');
      }

      if (!CategoryModel.isValidIcon(icon)) {
        throw new Error('图标名称不正确');
      }

      return this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('Category', id);
        if (object) {
          (object as any).icon = icon;
          (object as any).updatedAt = new Date();
          return (object as any).toCategoryType();
        }
        throw new Error('分类不存在');
      });
    }, '更新分类图标失败');
  }

  /**
   * 更新分类描述
   * @param id 分类ID
   * @param description 新描述
   * @returns 更新后的分类
   */
  async updateDescription(id: string, description: string): Promise<Category> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('分类不存在');
      }

      return this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('Category', id);
        if (object) {
          (object as any).description = description;
          (object as any).updatedAt = new Date();
          return (object as any).toCategoryType();
        }
        throw new Error('分类不存在');
      });
    }, '更新分类描述失败');
  }

  /**
   * 获取分类数量
   * @param userId 用户ID
   * @returns 分类数量
   */
  async getCategoryCount(userId: string): Promise<number> {
    return this.executeOperation(() => {
      return this.realm.objects('Category').filtered('userId == $0', userId).length;
    }, '获取分类数量失败');
  }

  /**
   * 检查是否有分类
   * @param userId 用户ID
   * @returns 是否有分类
   */
  async hasCategories(userId: string): Promise<boolean> {
    return this.executeOperation(() => {
      return this.realm.objects('Category').filtered('userId == $0', userId).length > 0;
    }, '检查是否有分类失败');
  }

  /**
   * 获取最近更新的分类
   * @param userId 用户ID
   * @param limit 数量限制
   * @returns 分类数组
   */
  async getRecentlyUpdated(userId: string, limit: number = 10): Promise<Category[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('Category')
        .filtered('userId == $0', userId)
        .sorted('updatedAt', true)
        .slice(0, limit);
      return objects.map((obj: any) => obj.toCategoryType());
    }, '获取最近更新的分类失败');
  }

  /**
   * 删除分类
   * @param id 分类ID
   */
  async deleteCategory(id: string): Promise<void> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('分类不存在');
      }

      if (existing.isDefault) {
        throw new Error('不能删除默认分类');
      }

      this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('Category', id);
        if (object) {
          this.realm.delete(object);
        }
      });

      Logger.info(`分类已删除: ${id}`);
    }, '删除分类失败');
  }

  /**
   * 清空用户的所有分类
   * @param userId 用户ID
   */
  async clearUserCategories(userId: string): Promise<void> {
    return this.executeOperation(() => {
      this.realm.write(() => {
        const objects = this.realm
          .objects('Category')
          .filtered('userId == $0 AND isDefault == false', userId);
        this.realm.delete(objects);
      });
      Logger.info(`用户 ${userId} 的所有自定义分类已清空`);
    }, '清空用户分类失败');
  }

  /**
   * 计算月度费用（将所有周期转换为月度费用）
   * @param price 价格
   * @param type 订阅类型
   * @returns 月度费用
   */
  private calculateMonthlyCost(price: number, type: string): number {
    switch (type) {
      case 'weekly':
        return price * 4.33;
      case 'monthly':
        return price;
      case 'quarterly':
        return price / 3;
      case 'yearly':
        return price / 12;
      case 'one-time':
        return 0;
      default:
        return price;
    }
  }
}
