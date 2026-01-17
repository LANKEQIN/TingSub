/**
 * 标签相关类型定义
 * 包含标签信息等类型
 */

import type { HexColor, UUID } from './common';

/**
 * 标签信息接口
 */
export interface Tag {
  id: UUID;
  userId: UUID;
  name: string;
  color: HexColor;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 创建标签参数接口（不包含自动生成的字段）
 */
export interface CreateTagParams {
  userId: UUID;
  name: string;
  color: HexColor;
}

/**
 * 更新标签参数接口
 */
export interface UpdateTagParams {
  name?: string;
  color?: HexColor;
}

/**
 * 标签查询参数接口
 */
export interface TagQueryParams {
  userId?: UUID;
  name?: string;
}
