import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useTheme, Appbar } from 'react-native-paper';
import { initializeRealm } from '../config/realm';
import { CategoryRepository } from '../repositories';
import { useCategoryStore } from '../store/categoryStore';
import CategoryForm from '../components/category/CategoryForm';
import type { CategoryFormData } from '../types/category';
import type { Category } from '../types/category';

interface EditCategoryScreenProps {
  navigation: any;
  route: {
    params: {
      id: string;
    };
  };
}

const EditCategoryScreen: React.FC<EditCategoryScreenProps> = ({ navigation, route }) => {
  const theme = useTheme() as any;

  const { id } = route.params;
  const categoryId = id;
  const { updateCategory } = useCategoryStore();

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadCategory();
  }, [categoryId]);

  const loadCategory = async () => {
    try {
      const realm = await initializeRealm();
      const categoryRepository = new CategoryRepository(realm);

      const cat = await categoryRepository.getById(categoryId);
      setCategory(cat);
    } catch (error) {
      console.error('加载分类失败:', error);
      Alert.alert('加载失败', '加载分类信息时发生错误');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (formData: CategoryFormData) => {
    if (!category) return;

    setLoading(true);
    try {
      const realm = await initializeRealm();
      const categoryRepository = new CategoryRepository(realm);

      const categoryData = {
        name: formData.name,
        description: formData.description,
        color: formData.color as `#${string}`,
        icon: formData.icon,
      };

      await updateCategory(categoryRepository, categoryId, categoryData);
      Alert.alert('成功', '分类更新成功', [
        {
          text: '确定',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('更新失败', error instanceof Error ? error.message : '更新分类时发生错误');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (initialLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <View style={styles.loadingIndicator} />
      </View>
    );
  }

  if (!category) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <View style={styles.emptyIcon} />
      </View>
    );
  }

  const initialValues: Partial<CategoryFormData> = {
    name: category.name,
    description: category.description,
    color: category.color,
    icon: category.icon,
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleCancel} />
        <Appbar.Content title="编辑分类" />
      </Appbar.Header>

      <CategoryForm
        initialValues={initialValues}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitText="保存"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  emptyIcon: {
    borderColor: 'rgba(154, 207, 255, 0.3)',
    borderRadius: 20,
    borderTopColor: '#9ACFFF',
    borderWidth: 3,
    height: 40,
    width: 40,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    borderColor: 'rgba(154, 207, 255, 0.3)',
    borderRadius: 20,
    borderTopColor: '#9ACFFF',
    borderWidth: 3,
    height: 40,
    width: 40,
  },
});

export default EditCategoryScreen;
