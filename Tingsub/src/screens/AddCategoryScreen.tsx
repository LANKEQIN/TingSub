import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import { useTheme, Appbar } from 'react-native-paper';
import { initializeRealm } from '../config/realm';
import { CategoryRepository } from '../repositories';
import { useCategoryStore } from '../store/categoryStore';
import { useUserStore } from '../store/userStore';
import CategoryForm from '../components/category/CategoryForm';
import type { CategoryFormData } from '../types/category';

interface AddCategoryScreenProps {
  navigation: any;
}

const AddCategoryScreen: React.FC<AddCategoryScreenProps> = ({ navigation }) => {
  const theme = useTheme() as any;

  const { createCategory } = useCategoryStore();
  const { currentUser } = useUserStore();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: CategoryFormData) => {
    if (!currentUser) {
      Alert.alert('错误', '请先登录');
      return;
    }

    setLoading(true);
    try {
      const realm = await initializeRealm();
      const categoryRepository = new CategoryRepository(realm);

      const categoryData = {
        userId: currentUser.id,
        name: formData.name,
        description: formData.description,
        color: formData.color as `#${string}`,
        icon: formData.icon,
        isDefault: false,
      };

      await createCategory(categoryRepository, categoryData);
      Alert.alert('成功', '分类添加成功', [
        {
          text: '确定',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('添加失败', error instanceof Error ? error.message : '添加分类时发生错误');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleCancel} />
        <Appbar.Content title="添加分类" />
      </Appbar.Header>

      <CategoryForm
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitText="添加"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AddCategoryScreen;
