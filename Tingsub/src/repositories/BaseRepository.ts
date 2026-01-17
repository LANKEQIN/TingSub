/**
 * 基础仓储类
 * 提供通用的数据访问操作，所有具体仓储类都继承此类
 */

import Realm from 'realm';
import { Logger } from '../utils/loggerUtils';
import { ValidationError } from '../utils/validationUtils';
import { EncryptionUtils } from '../utils/encryptionUtils';

/**
 * 仓储操作结果接口
 */
export interface RepositoryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 基础仓储类
 * @template T 数据类型
 */
export abstract class BaseRepository<T extends { id: string }> {
  protected realm: Realm;
  protected schemaName: string;

  /**
   * 构造函数
   * @param realm Realm实例
   * @param schemaName 模型名称
   */
  constructor(realm: Realm, schemaName: string) {
    this.realm = realm;
    this.schemaName = schemaName;
  }

  /**
   * 执行数据库操作，统一错误处理
   * @param operation 数据库操作
   * @param errorMessage 错误消息
   * @returns 操作结果
   */
  protected async executeOperation<R>(
    operation: () => R,
    errorMessage: string = '操作失败'
  ): Promise<R> {
    try {
      return operation();
    } catch (error) {
      Logger.error(errorMessage, error instanceof Error ? error : String(error));
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error(`${errorMessage}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 生成UUID
   * @returns UUID字符串
   */
  protected generateUUID(): string {
    return EncryptionUtils.generateUUID();
  }

  /**
   * 查找记录或抛出错误
   * @param id 记录ID
   * @param entityName 实体名称（用于错误消息）
   * @returns Realm对象
   * @throws {Error} 记录不存在时抛出错误
   */
  protected findOrThrow(id: string, entityName: string = '记录'): any {
    const object = this.realm.objectForPrimaryKey(this.schemaName, id);
    if (!object) {
      throw new Error(`${entityName}不存在`);
    }
    return object;
  }

  /**
   * 根据ID获取记录
   * @param id 记录ID
   * @returns 记录对象或null
   */
  async getById(id: string): Promise<T | null> {
    return this.executeOperation(() => {
      const object = this.realm.objectForPrimaryKey(this.schemaName, id);
      return object ? (object as any).toType?.() || object : null;
    }, '获取记录失败');
  }

  /**
   * 获取所有记录
   * @returns 记录数组
   */
  async getAll(): Promise<T[]> {
    return this.executeOperation(() => {
      const objects = this.realm.objects(this.schemaName);
      return objects.map((obj: any) => obj.toType?.() || obj);
    }, '获取所有记录失败');
  }

  /**
   * 根据条件查询记录
   * @param filter 查询条件
   * @returns 记录数组
   */
  async query(filter: string, args?: any[]): Promise<T[]> {
    return this.executeOperation(() => {
      const objects = this.realm.objects(this.schemaName).filtered(filter, ...(args || []));
      return objects.map((obj: any) => obj.toType?.() || obj);
    }, '查询记录失败');
  }

  /**
   * 创建记录
   * @param data 数据对象
   * @returns 创建的记录
   */
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    return this.executeOperation(() => {
      const now = new Date();
      const newData = {
        ...data,
        id: this.generateUUID(),
        createdAt: now,
        updatedAt: now,
      };
      return this.realm.write(() => {
        return this.realm.create(this.schemaName, newData) as unknown as T;
      });
    }, '创建记录失败');
  }

  /**
   * 更新记录
   * @param id 记录ID
   * @param data 更新数据
   * @returns 更新后的记录
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    return this.executeOperation(() => {
      const existing = this.findOrThrow(id);
      const mergedData = { ...existing, ...data, updatedAt: new Date() };
      return this.realm.write(() => {
        return this.realm.create(this.schemaName, mergedData, true);
      });
    }, '更新记录失败');
  }

  /**
   * 删除记录
   * @param id 记录ID
   */
  async delete(id: string): Promise<void> {
    return this.executeOperation(() => {
      const object = this.findOrThrow(id);
      this.realm.write(() => {
        this.realm.delete(object);
      });
    }, '删除记录失败');
  }

  /**
   * 批量删除记录
   * @param ids 记录ID数组
   */
  async deleteMany(ids: string[]): Promise<void> {
    return this.executeOperation(() => {
      this.realm.write(() => {
        for (const id of ids) {
          const object = this.realm.objectForPrimaryKey(this.schemaName, id);
          if (object) {
            this.realm.delete(object);
          }
        }
      });
    }, '批量删除记录失败');
  }

  /**
   * 检查记录是否存在
   * @param id 记录ID
   * @returns 是否存在
   */
  async exists(id: string): Promise<boolean> {
    return this.executeOperation(() => {
      const object = this.realm.objectForPrimaryKey(this.schemaName, id);
      return object !== null;
    }, '检查记录存在性失败');
  }

  /**
   * 获取记录总数
   * @returns 记录总数
   */
  async count(): Promise<number> {
    return this.executeOperation(() => {
      return this.realm.objects(this.schemaName).length;
    }, '获取记录总数失败');
  }

  /**
   * 清空所有记录
   */
  async clear(): Promise<void> {
    return this.executeOperation(() => {
      this.realm.write(() => {
        this.realm.delete(this.realm.objects(this.schemaName));
      });
    }, '清空记录失败');
  }

  /**
   * 分页查询
   * @param page 页码（从1开始）
   * @param pageSize 每页大小
   * @returns 分页结果
   */
  async paginate(page: number, pageSize: number): Promise<{
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    return this.executeOperation(() => {
      const allObjects = this.realm.objects(this.schemaName);
      const total = allObjects.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const pageData = allObjects.slice(startIndex, endIndex).map((obj: any) => obj.toType?.() || obj);

      return {
        data: pageData,
        total,
        page,
        pageSize,
        totalPages,
      };
    }, '分页查询失败');
  }

  /**
   * 排序查询
   * @param sortField 排序字段
   * @param sortOrder 排序顺序
   * @returns 排序后的记录数组
   */
  async sort(sortField: string, sortOrder: 'asc' | 'desc' = 'asc'): Promise<T[]> {
    return this.executeOperation(() => {
      const objects = this.realm.objects(this.schemaName).sorted(sortField, sortOrder === 'desc');
      return objects.map((obj: any) => obj.toType?.() || obj);
    }, '排序查询失败');
  }

  /**
   * 查询并排序
   * @param filter 查询条件
   * @param sortField 排序字段
   * @param sortOrder 排序顺序
   * @param args 查询参数
   * @returns 查询并排序后的记录数组
   */
  async queryAndSort(
    filter: string,
    sortField: string,
    sortOrder: 'asc' | 'desc' = 'asc',
    args?: any[]
  ): Promise<T[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects(this.schemaName)
        .filtered(filter, ...(args || []))
        .sorted(sortField, sortOrder === 'desc');
      return objects.map((obj: any) => obj.toType?.() || obj);
    }, '查询并排序失败');
  }

  /**
   * 批量创建记录
   * @param dataArray 数据对象数组
   * @returns 创建的记录数组
   */
  async createMany(dataArray: Omit<T, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<T[]> {
    return this.executeOperation(() => {
      const now = new Date();
      const newDataArray = dataArray.map((data) => ({
        ...data,
        id: this.generateUUID(),
        createdAt: now,
        updatedAt: now,
      }));
      return this.realm.write(() => {
        return newDataArray.map((data) => this.realm.create(this.schemaName, data) as unknown as T);
      });
    }, '批量创建记录失败');
  }

  /**
   * 批量更新记录
   * @param updates 更新对象数组（包含id和更新数据）
   * @returns 更新后的记录数组
   */
  async updateMany(updates: Array<{ id: string; data: Partial<T> }>): Promise<T[]> {
    return this.executeOperation(() => {
      return this.realm.write(() => {
        return updates.map(({ id, data }) => {
          const existing = this.findOrThrow(id);
          const mergedData = { ...existing, ...data, updatedAt: new Date() };
          return this.realm.create(this.schemaName, mergedData, true);
        });
      });
    }, '批量更新记录失败');
  }

  /**
   * 获取第一条记录
   * @returns 第一条记录或null
   */
  async first(): Promise<T | null> {
    return this.executeOperation(() => {
      const objects = this.realm.objects(this.schemaName);
      if (objects.length === 0) {
        return null;
      }
      const first = objects[0];
      return (first as any).toType?.() || first;
    }, '获取第一条记录失败');
  }

  /**
   * 获取最后一条记录
   * @returns 最后一条记录或null
   */
  async last(): Promise<T | null> {
    return this.executeOperation(() => {
      const objects = this.realm.objects(this.schemaName);
      if (objects.length === 0) {
        return null;
      }
      const last = objects[objects.length - 1];
      return (last as any).toType?.() || last;
    }, '获取最后一条记录失败');
  }

  /**
   * 根据条件查找第一条记录
   * @param filter 查询条件
   * @param args 查询参数
   * @returns 第一条匹配的记录或null
   */
  async findFirst(filter: string, args?: any[]): Promise<T | null> {
    return this.executeOperation(() => {
      const objects = this.realm.objects(this.schemaName).filtered(filter, ...(args || []));
      if (objects.length === 0) {
        return null;
      }
      const first = objects[0];
      return (first as any).toType?.() || first;
    }, '查找第一条记录失败');
  }

  /**
   * 检查是否有记录
   * @returns 是否有记录
   */
  async isEmpty(): Promise<boolean> {
    return this.executeOperation(() => {
      return this.realm.objects(this.schemaName).length === 0;
    }, '检查记录是否为空失败');
  }
}
