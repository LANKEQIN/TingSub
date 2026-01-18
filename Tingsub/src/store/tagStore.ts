/**
 * 标签状态管理
 * 使用Zustand管理标签相关的全局状态
 */

import { create } from 'zustand';
import { TagRepository } from '../repositories/TagRepository';
import type { Tag, CreateTagParams, UpdateTagParams } from '../../types/tag';

/**
 * 标签状态接口
 */
interface TagState {
  // 状态数据
  tags: Tag[];
  currentTag: Tag | null;
  isLoading: boolean;
  error: string | null;

  // 标签操作方法
  loadTags: (repository: TagRepository, userId: string) => Promise<void>;
  loadTag: (repository: TagRepository, id: string) => Promise<void>;
  createTag: (repository: TagRepository, params: CreateTagParams) => Promise<Tag>;
  updateTag: (repository: TagRepository, id: string, params: UpdateTagParams) => Promise<Tag>;
  deleteTag: (repository: TagRepository, id: string) => Promise<void>;
  clearError: () => void;
}

/**
 * 标签状态管理Store
 */
export const useTagStore = create<TagState>((set, get) => ({
  // 初始状态
  tags: [],
  currentTag: null,
  isLoading: false,
  error: null,

  /**
   * 加载标签列表
   */
  loadTags: async (repository: TagRepository, userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const tags = await repository.getByUserId(userId);
      set({ tags, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载标签列表失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 加载单个标签
   */
  loadTag: async (repository: TagRepository, id: string) => {
    set({ isLoading: true, error: null });

    try {
      const tag = await repository.getById(id);
      set({ currentTag: tag || null, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载标签失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 创建标签
   */
  createTag: async (repository: TagRepository, params: CreateTagParams) => {
    set({ isLoading: true, error: null });

    try {
      const tag = await repository.createTag(params);

      const { tags } = get();
      set({
        tags: [...tags, tag],
        currentTag: tag,
        isLoading: false,
      });

      return tag;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建标签失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 更新标签
   */
  updateTag: async (repository: TagRepository, id: string, params: UpdateTagParams) => {
    set({ isLoading: true, error: null });

    try {
      const updatedTag = await repository.updateTag(id, params);

      const { tags, currentTag } = get();
      const newTags = tags.map((tag) => (tag.id === id ? updatedTag : tag));

      set({
        tags: newTags,
        currentTag: currentTag?.id === id ? updatedTag : currentTag,
        isLoading: false,
      });

      return updatedTag;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新标签失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * 删除标签
   */
  deleteTag: async (repository: TagRepository, id: string) => {
    set({ isLoading: true, error: null });

    try {
      await repository.deleteTag(id);

      const { tags, currentTag } = get();
      const newTags = tags.filter((tag) => tag.id !== id);

      set({
        tags: newTags,
        currentTag: currentTag?.id === id ? null : currentTag,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除标签失败';
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
