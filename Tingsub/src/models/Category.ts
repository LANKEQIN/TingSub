/**
 * 分类数据模型
 * 使用Realm数据库存储分类信息
 */

import Realm from 'realm';
import type { Category } from '../../types/category';

/**
 * 分类模型
 */
export class CategoryModel extends Realm.Object<CategoryModel> {
  id!: string;
  userId!: string;
  name!: string;
  description?: string;
  color!: string;
  icon!: string;
  isDefault!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Category',
    primaryKey: 'id',
    properties: {
      id: 'string',
      userId: 'string',
      name: 'string',
      description: 'string?',
      color: 'string',
      icon: 'string',
      isDefault: 'bool',
      createdAt: 'date',
      updatedAt: 'date',
    },
  };

  /**
   * 转换为分类类型
   */
  toCategoryType(): Category {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      description: this.description,
      color: this.color as `#${string}`,
      icon: this.icon,
      isDefault: this.isDefault,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * 从分类类型创建Realm对象
   */
  static fromCategoryType(
    category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
  ): Omit<Category, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      userId: category.userId,
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
      isDefault: category.isDefault,
    };
  }

  /**
   * 获取预设分类列表
   */
  static getDefaultCategories(): Omit<Category, 'id' | 'createdAt' | 'updatedAt'>[] {
    return [
      {
        userId: 'default',
        name: '视频',
        description: '视频流媒体服务',
        color: '#FF0000',
        icon: 'movie',
        isDefault: true,
      },
      {
        userId: 'default',
        name: '音乐',
        description: '音乐流媒体服务',
        color: '#1DB954',
        icon: 'music-note',
        isDefault: true,
      },
      {
        userId: 'default',
        name: '工具',
        description: '生产力工具软件',
        color: '#007AFF',
        icon: 'wrench',
        isDefault: true,
      },
      {
        userId: 'default',
        name: '教育',
        description: '在线教育课程',
        color: '#5856D6',
        icon: 'book',
        isDefault: true,
      },
      {
        userId: 'default',
        name: '生活',
        description: '生活服务订阅',
        color: '#34C759',
        icon: 'heart',
        isDefault: true,
      },
    ];
  }

  /**
   * 验证颜色格式
   */
  static isValidColor(color: string): boolean {
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    return colorRegex.test(color);
  }

  /**
   * 验证图标名称
   */
  static isValidIcon(icon: string): boolean {
    return icon.length > 0 && icon.length <= 50;
  }
}
