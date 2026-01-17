/**
 * 标签数据模型
 * 使用Realm数据库存储标签信息
 */

import Realm from 'realm';
import type { Tag } from '../../types/tag';

/**
 * 标签模型
 */
export class TagModel extends Realm.Object<TagModel> {
  id!: string;
  userId!: string;
  name!: string;
  color!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Tag',
    primaryKey: 'id',
    properties: {
      id: 'string',
      userId: 'string',
      name: 'string',
      color: 'string',
      createdAt: 'date',
      updatedAt: 'date',
    },
  };

  /**
   * 转换为标签类型
   */
  toTagType(): Tag {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      color: this.color as `#${string}`,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * 从标签类型创建Realm对象
   */
  static fromTagType(
    tag: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>
  ): Omit<Tag, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      userId: tag.userId,
      name: tag.name,
      color: tag.color,
    };
  }

  /**
   * 获取预设标签列表
   */
  static getDefaultTags(): Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>[] {
    return [
      {
        userId: 'default',
        name: '常用',
        color: '#FF9500',
      },
      {
        userId: 'default',
        name: '娱乐',
        color: '#AF52DE',
      },
      {
        userId: 'default',
        name: '工作',
        color: '#00C7BE',
      },
      {
        userId: 'default',
        name: '学习',
        color: '#FF3B30',
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
   * 验证标签名称
   */
  static isValidName(name: string): boolean {
    return name.length > 0 && name.length <= 50;
  }
}
