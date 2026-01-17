/**
 * 分类相关类型定义
 * 包含分类信息、分类统计等类型
 */

import type { HexColor, UUID } from './common';

/**
 * 分类信息接口
 */
export interface Category {
  id: UUID;
  userId: UUID;
  name: string;
  description?: string;
  color: HexColor;
  icon: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 创建分类参数接口（不包含自动生成的字段）
 */
export interface CreateCategoryParams {
  userId: UUID;
  name: string;
  description?: string;
  color: HexColor;
  icon: string;
  isDefault?: boolean;
}

/**
 * 更新分类参数接口
 */
export interface UpdateCategoryParams {
  name?: string;
  description?: string;
  color?: HexColor;
  icon?: string;
}

/**
 * 分类查询参数接口
 */
export interface CategoryQueryParams {
  userId?: UUID;
  name?: string;
  isDefault?: boolean;
}

/**
 * 分类统计信息接口
 */
export interface CategoryStats {
  categoryId: UUID;
  categoryName: string;
  expense: number;
  count: number;
  color: HexColor;
  icon: string;
}
