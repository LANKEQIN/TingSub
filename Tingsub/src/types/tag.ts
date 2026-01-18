/**
 * 标签类型定义
 * 定义标签相关的数据结构
 */

/**
 * 标签信息
 */
export interface Tag {
  id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 创建标签参数
 */
export type CreateTagParams = Omit<Tag, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

/**
 * 更新标签参数
 */
export type UpdateTagParams = Partial<Omit<Tag, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;

/**
 * 标签查询参数
 */
export interface TagQueryParams {
  userId: string;
  keyword?: string;
  sortBy?: 'name' | 'createdAt' | 'usage';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * 标签统计信息
 */
export interface TagStats {
  tagId: string;
  tagName: string;
  subscriptionCount: number;
  color: string;
}

/**
 * 标签选项
 */
export interface TagOption {
  id: string;
  name: string;
  color: string;
}

/**
 * 标签表单数据
 */
export interface TagFormData {
  name: string;
  color: string;
}

/**
 * 标签表单验证错误
 */
export interface TagFormErrors {
  name?: string;
  color?: string;
}
