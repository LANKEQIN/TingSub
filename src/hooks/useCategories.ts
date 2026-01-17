import { useCallback, useEffect, useState } from 'react';
import { Category } from '../types/category';
import { useCategoryStore } from '../store/categoryStore';

/**
 * 自定义Hook用于管理分类数据
 * 封装了分类的增删改查操作
 */
export const useCategories = () => {
  const { categories, addCategory, updateCategory, deleteCategory, loadCategories } = useCategoryStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化加载分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        await loadCategories();
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载分类失败');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [loadCategories]);

  // 添加分类
  const handleAddCategory = useCallback(
    async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
      setLoading(true);
      try {
        await addCategory(category);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '添加分类失败');
      } finally {
        setLoading(false);
      }
    },
    [addCategory]
  );

  // 更新分类
  const handleUpdateCategory = useCallback(
    async (category: Category) => {
      setLoading(true);
      try {
        await updateCategory(category);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '更新分类失败');
      } finally {
        setLoading(false);
      }
    },
    [updateCategory]
  );

  // 删除分类
  const handleDeleteCategory = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await deleteCategory(id);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '删除分类失败');
      } finally {
        setLoading(false);
      }
    },
    [deleteCategory]
  );

  // 根据ID获取分类
  const getCategoryById = useCallback(
    (id: string) => {
      return categories.find(category => category.id === id);
    },
    [categories]
  );

  // 获取分类的订阅数量
  const getCategorySubscriptionCount = useCallback(
    (categoryId: string, subscriptions: Array<{ categoryId: string }>) => {
      return subscriptions.filter(sub => sub.categoryId === categoryId).length;
    },
    []
  );

  return {
    categories,
    loading,
    error,
    addCategory: handleAddCategory,
    updateCategory: handleUpdateCategory,
    deleteCategory: handleDeleteCategory,
    getCategoryById,
    getCategorySubscriptionCount,
    clearError: () => setError(null),
  };
};