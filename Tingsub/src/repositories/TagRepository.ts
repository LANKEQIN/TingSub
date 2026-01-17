/**
 * 标签仓储类
 * 提供标签数据访问操作
 */

import Realm from 'realm';
import { BaseRepository } from './BaseRepository';
import { TagModel } from '../models/Tag';
import { ValidationUtils } from '../utils/validationUtils';
import { Logger } from '../utils/loggerUtils';
import type { Tag, CreateTagParams, UpdateTagParams, TagQueryParams } from '../../types/tag';

/**
 * 标签仓储类
 */
export class TagRepository extends BaseRepository<Tag> {
  constructor(realm: Realm) {
    super(realm, 'Tag');
  }

  /**
   * 创建标签
   * @param params 创建标签参数
   * @returns 创建的标签
   */
  async createTag(params: CreateTagParams): Promise<Tag> {
    return this.executeOperation(async () => {
      const now = new Date();

      const tagData: Tag = {
        id: this.generateUUID(),
        userId: params.userId,
        name: params.name,
        color: params.color,
        createdAt: now,
        updatedAt: now,
      };

      ValidationUtils.validateTag(tagData);

      const realmData = TagModel.fromTagType(tagData);

      return this.realm.write(() => {
        const created = this.realm.create('Tag', realmData);
        return (created as any).toTagType();
      });
    }, '创建标签失败');
  }

  /**
   * 更新标签
   * @param id 标签ID
   * @param params 更新标签参数
   * @returns 更新后的标签
   */
  async updateTag(id: string, params: UpdateTagParams): Promise<Tag> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('标签不存在');
      }

      const mergedData: Tag = {
        ...existing,
        ...params,
        updatedAt: new Date(),
      };

      ValidationUtils.validateTag(mergedData);

      const realmData = TagModel.fromTagType(mergedData);

      return this.realm.write(() => {
        const updated = this.realm.create('Tag', { ...realmData, id }, true);
        return (updated as any).toTagType();
      });
    }, '更新标签失败');
  }

  /**
   * 根据用户ID获取标签列表
   * @param userId 用户ID
   * @returns 标签数组
   */
  async getByUserId(userId: string): Promise<Tag[]> {
    return this.executeOperation(() => {
      const objects = this.realm.objects('Tag').filtered('userId == $0', userId);
      return objects.map((obj: any) => obj.toTagType());
    }, '根据用户ID获取标签列表失败');
  }

  /**
   * 根据名称查找标签
   * @param userId 用户ID
   * @param name 标签名称
   * @returns 标签对象或null
   */
  async findByName(userId: string, name: string): Promise<Tag | null> {
    return this.executeOperation(() => {
      const objects = this.realm.objects('Tag').filtered('userId == $0 AND name == $1', userId, name);
      if (objects.length === 0) {
        return null;
      }
      return (objects[0] as any).toTagType();
    }, '根据名称查找标签失败');
  }

  /**
   * 查询标签
   * @param params 查询参数
   * @returns 标签数组
   */
  async queryTags(params: TagQueryParams): Promise<Tag[]> {
    return this.executeOperation(() => {
      let objects = this.realm.objects('Tag');

      if (params.userId) {
        objects = objects.filtered('userId == $0', params.userId);
      }
      if (params.name) {
        objects = objects.filtered('name CONTAINS[c] $0', params.name);
      }

      return objects.map((obj: any) => obj.toTagType());
    }, '查询标签失败');
  }

  /**
   * 搜索标签
   * @param userId 用户ID
   * @param keyword 搜索关键词
   * @returns 匹配的标签数组
   */
  async searchTags(userId: string, keyword: string): Promise<Tag[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('Tag')
        .filtered('userId == $0 AND name CONTAINS[c] $1', userId, keyword);
      return objects.map((obj: any) => obj.toTagType());
    }, '搜索标签失败');
  }

  /**
   * 按名称排序标签
   * @param userId 用户ID
   * @param order 排序顺序
   * @returns 标签数组
   */
  async sortByName(userId: string, order: 'asc' | 'desc' = 'asc'): Promise<Tag[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('Tag')
        .filtered('userId == $0', userId)
        .sorted('name', order === 'desc');
      return objects.map((obj: any) => obj.toTagType());
    }, '按名称排序标签失败');
  }

  /**
   * 按创建时间排序标签
   * @param userId 用户ID
   * @param order 排序顺序
   * @returns 标签数组
   */
  async sortByCreatedAt(userId: string, order: 'asc' | 'desc' = 'desc'): Promise<Tag[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('Tag')
        .filtered('userId == $0', userId)
        .sorted('createdAt', order === 'desc');
      return objects.map((obj: any) => obj.toTagType());
    }, '按创建时间排序标签失败');
  }

  /**
   * 按更新时间排序标签
   * @param userId 用户ID
   * @param order 排序顺序
   * @returns 标签数组
   */
  async sortByUpdatedAt(userId: string, order: 'asc' | 'desc' = 'desc'): Promise<Tag[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('Tag')
        .filtered('userId == $0', userId)
        .sorted('updatedAt', order === 'desc');
      return objects.map((obj: any) => obj.toTagType());
    }, '按更新时间排序标签失败');
  }

  /**
   * 按颜色排序标签
   * @param userId 用户ID
   * @param order 排序顺序
   * @returns 标签数组
   */
  async sortByColor(userId: string, order: 'asc' | 'desc' = 'asc'): Promise<Tag[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('Tag')
        .filtered('userId == $0', userId)
        .sorted('color', order === 'desc');
      return objects.map((obj: any) => obj.toTagType());
    }, '按颜色排序标签失败');
  }

  /**
   * 检查标签名称是否已存在
   * @param userId 用户ID
   * @param name 标签名称
   * @param excludeId 排除的标签ID（用于更新时检查）
   * @returns 是否已存在
   */
  async isNameExists(userId: string, name: string, excludeId?: string): Promise<boolean> {
    return this.executeOperation(() => {
      let objects = this.realm.objects('Tag').filtered('userId == $0 AND name == $1', userId, name);
      if (excludeId) {
        objects = objects.filtered('id != $0', excludeId);
      }
      return objects.length > 0;
    }, '检查标签名称是否存在失败');
  }

  /**
   * 初始化默认标签
   * @param userId 用户ID
   * @returns 创建的默认标签数组
   */
  async initializeDefaultTags(userId: string): Promise<Tag[]> {
    return this.executeOperation(async () => {
      const existing = await this.getByUserId(userId);
      if (existing.length > 0) {
        return existing;
      }

      const defaultTags = TagModel.getDefaultTags();
      const now = new Date();

      const created: Tag[] = [];

      return this.realm.write(() => {
        for (const tagData of defaultTags) {
          const tag: Tag = {
            id: this.generateUUID(),
            userId,
            name: tagData.name,
            color: tagData.color,
            createdAt: now,
            updatedAt: now,
          };

          const createdObj = this.realm.create('Tag', tag);
          created.push((createdObj as any).toTagType());
        }

        Logger.info(`已为用户 ${userId} 初始化默认标签`);
        return created;
      });
    }, '初始化默认标签失败');
  }

  /**
   * 更新标签名称
   * @param id 标签ID
   * @param name 新名称
   * @returns 更新后的标签
   */
  async updateName(id: string, name: string): Promise<Tag> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('标签不存在');
      }

      return this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('Tag', id);
        if (object) {
          (object as any).name = name;
          (object as any).updatedAt = new Date();
          return (object as any).toTagType();
        }
        throw new Error('标签不存在');
      });
    }, '更新标签名称失败');
  }

  /**
   * 更新标签颜色
   * @param id 标签ID
   * @param color 新颜色
   * @returns 更新后的标签
   */
  async updateColor(id: string, color: string): Promise<Tag> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('标签不存在');
      }

      if (!TagModel.isValidColor(color)) {
        throw new Error('颜色格式不正确');
      }

      return this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('Tag', id);
        if (object) {
          (object as any).color = color;
          (object as any).updatedAt = new Date();
          return (object as any).toTagType();
        }
        throw new Error('标签不存在');
      });
    }, '更新标签颜色失败');
  }

  /**
   * 获取标签数量
   * @param userId 用户ID
   * @returns 标签数量
   */
  async getTagCount(userId: string): Promise<number> {
    return this.executeOperation(() => {
      return this.realm.objects('Tag').filtered('userId == $0', userId).length;
    }, '获取标签数量失败');
  }

  /**
   * 检查是否有标签
   * @param userId 用户ID
   * @returns 是否有标签
   */
  async hasTags(userId: string): Promise<boolean> {
    return this.executeOperation(() => {
      return this.realm.objects('Tag').filtered('userId == $0', userId).length > 0;
    }, '检查是否有标签失败');
  }

  /**
   * 获取最近更新的标签
   * @param userId 用户ID
   * @param limit 数量限制
   * @returns 标签数组
   */
  async getRecentlyUpdated(userId: string, limit: number = 10): Promise<Tag[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('Tag')
        .filtered('userId == $0', userId)
        .sorted('updatedAt', true)
        .slice(0, limit);
      return objects.map((obj: any) => obj.toTagType());
    }, '获取最近更新的标签失败');
  }

  /**
   * 获取最常用的标签
   * @param userId 用户ID
   * @param limit 数量限制
   * @returns 标签数组
   */
  async getMostUsedTags(userId: string, limit: number = 10): Promise<Tag[]> {
    return this.executeOperation(() => {
      const tags = this.realm.objects('Tag').filtered('userId == $0', userId);
      const subscriptions = this.realm.objects('Subscription').filtered('userId == $0', userId);

      const tagUsage = new Map<string, number>();

      for (const tag of tags) {
        tagUsage.set(tag.id, 0);
      }

      for (const subscription of subscriptions) {
        const subscriptionTags = (subscription as any).tags;
        for (const tagId of subscriptionTags) {
          const count = tagUsage.get(tagId) || 0;
          tagUsage.set(tagId, count + 1);
        }
      }

      const sortedTags = Array.from(tags)
        .sort((a, b) => {
          const countA = tagUsage.get(a.id) || 0;
          const countB = tagUsage.get(b.id) || 0;
          return countB - countA;
        })
        .slice(0, limit);

      return sortedTags.map((obj: any) => obj.toTagType());
    }, '获取最常用的标签失败');
  }

  /**
   * 获取未使用的标签
   * @param userId 用户ID
   * @returns 标签数组
   */
  async getUnusedTags(userId: string): Promise<Tag[]> {
    return this.executeOperation(() => {
      const tags = this.realm.objects('Tag').filtered('userId == $0', userId);
      const subscriptions = this.realm.objects('Subscription').filtered('userId == $0', userId);

      const usedTagIds = new Set<string>();

      for (const subscription of subscriptions) {
        const subscriptionTags = (subscription as any).tags;
        for (const tagId of subscriptionTags) {
          usedTagIds.add(tagId);
        }
      }

      const unusedTags = tags.filter((tag) => !usedTagIds.has(tag.id));

      return unusedTags.map((obj: any) => obj.toTagType());
    }, '获取未使用的标签失败');
  }

  /**
   * 批量创建标签
   * @param userId 用户ID
   * @param tags 标签数组
   * @returns 创建的标签数组
   */
  async createTags(userId: string, tags: Array<{ name: string; color: string }>): Promise<Tag[]> {
    return this.executeOperation(async () => {
      const now = new Date();
      const created: Tag[] = [];

      return this.realm.write(() => {
        for (const tagData of tags) {
          const tag: Tag = {
            id: this.generateUUID(),
            userId,
            name: tagData.name,
            color: tagData.color,
            createdAt: now,
            updatedAt: now,
          };

          ValidationUtils.validateTag(tag);

          const createdObj = this.realm.create('Tag', tag);
          created.push((createdObj as any).toTagType());
        }

        return created;
      });
    }, '批量创建标签失败');
  }

  /**
   * 删除标签
   * @param id 标签ID
   */
  async deleteTag(id: string): Promise<void> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('标签不存在');
      }

      this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('Tag', id);
        if (object) {
          this.realm.delete(object);
        }
      });

      Logger.info(`标签已删除: ${id}`);
    }, '删除标签失败');
  }

  /**
   * 清空用户的所有标签
   * @param userId 用户ID
   */
  async clearUserTags(userId: string): Promise<void> {
    return this.executeOperation(() => {
      this.realm.write(() => {
        const objects = this.realm.objects('Tag').filtered('userId == $0', userId);
        this.realm.delete(objects);
      });
      Logger.info(`用户 ${userId} 的所有标签已清空`);
    }, '清空用户标签失败');
  }

  /**
   * 合并标签
   * @param sourceTagId 源标签ID
   * @param targetTagId 目标标签ID
   */
  async mergeTags(sourceTagId: string, targetTagId: string): Promise<void> {
    return this.executeOperation(async () => {
      const sourceTag = await this.getById(sourceTagId);
      const targetTag = await this.getById(targetTagId);

      if (!sourceTag || !targetTag) {
        throw new Error('标签不存在');
      }

      if (sourceTagId === targetTagId) {
        throw new Error('不能合并相同的标签');
      }

      this.realm.write(() => {
        const subscriptions = this.realm.objects('Subscription').filtered('tags CONTAINS $0', sourceTagId);

        for (const subscription of subscriptions) {
          const tags = (subscription as any).tags;
          const index = tags.indexOf(sourceTagId);

          if (index > -1) {
            tags.splice(index, 1);
            if (!tags.includes(targetTagId)) {
              tags.push(targetTagId);
            }
          }
        }

        this.realm.delete(this.realm.objectForPrimaryKey('Tag', sourceTagId));
      });

      Logger.info(`标签 ${sourceTagId} 已合并到 ${targetTagId}`);
    }, '合并标签失败');
  }
}
