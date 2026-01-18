/**
 * 分类类型定义
 * 定义分类相关的数据结构
 */

/**
 * 分类信息
 */
export interface Category {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 创建分类参数
 */
export type CreateCategoryParams = Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

/**
 * 更新分类参数
 */
export type UpdateCategoryParams = Partial<
  Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
>;

/**
 * 分类查询参数
 */
export interface CategoryQueryParams {
  userId: string;
  keyword?: string;
  sortBy?: 'name' | 'createdAt' | 'count';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * 分类统计信息
 */
export interface CategoryStats {
  categoryId: string;
  categoryName: string;
  subscriptionCount: number;
  totalCost: number;
  monthlyCost: number;
  yearlyCost: number;
}

/**
 * 分类卡片数据
 */
export interface CategoryCardData {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  subscriptionCount: number;
  totalCost: number;
  monthlyCost: number;
  isDefault: boolean;
}

/**
 * 分类选项
 */
export interface CategoryOption {
  id: string;
  name: string;
  color: string;
  icon: string;
}

/**
 * 分类表单数据
 */
export interface CategoryFormData {
  name: string;
  description?: string;
  color: string;
  icon: string;
}

/**
 * 分类表单验证错误
 */
export interface CategoryFormErrors {
  name?: string;
  color?: string;
  icon?: string;
}
