import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme, Appbar, Menu, Portal, Dialog, Button, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { initializeRealm } from '../config/realm';
import { CategoryRepository, SubscriptionRepository } from '../repositories';
import { useCategoryStore } from '../store/categoryStore';
import { useUserStore } from '../store/userStore';
import CategoryList from '../components/category/CategoryList';
import type { CategoryCardData } from '../types/category';
import type { Subscription } from '../types/subscription';

interface CategoryListScreenProps {
  navigation: any;
}

const CategoryListScreen: React.FC<CategoryListScreenProps> = ({ navigation }) => {
  const theme = useTheme() as any;

  const { categories, loadCategories, deleteCategory, isLoading } = useCategoryStore();
  const { currentUser } = useUserStore();

  const [categoryCards, setCategoryCards] = useState<CategoryCardData[]>([]);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryCardData | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      processCategories();
    }
  }, [categories]);

  const loadData = async () => {
    if (!currentUser) return;

    try {
      const realm = await initializeRealm();
      const categoryRepository = new CategoryRepository(realm);

      await loadCategories(categoryRepository, currentUser.id);
    } catch (error) {
      console.error('加载数据失败:', error);
      showSnackbar('加载分类失败');
    }
  };

  const processCategories = async () => {
    if (!currentUser) return;

    try {
      const realm = await initializeRealm();
      const subscriptionRepository = new SubscriptionRepository(realm);

      const subscriptions = await subscriptionRepository.getByUserId(currentUser.id);

      const cards = categories.map((cat) => {
        const categorySubscriptions = subscriptions.filter(
          (sub: Subscription) => sub.categoryId === cat.id
        );
        const subscriptionCount = categorySubscriptions.length;

        let monthlyCost = 0;
        let totalCost = 0;

        categorySubscriptions.forEach((sub: Subscription) => {
          const price = sub.price;
          const type = sub.type;

          switch (type) {
            case 'weekly':
              monthlyCost += price * 4.33;
              totalCost += price * 52;
              break;
            case 'monthly':
              monthlyCost += price;
              totalCost += price * 12;
              break;
            case 'quarterly':
              monthlyCost += price / 3;
              totalCost += price * 4;
              break;
            case 'yearly':
              monthlyCost += price / 12;
              totalCost += price;
              break;
            case 'one-time':
              totalCost += price;
              break;
          }
        });

        return {
          id: cat.id,
          name: cat.name,
          description: cat.description,
          color: cat.color,
          icon: cat.icon,
          subscriptionCount,
          monthlyCost,
          totalCost,
          isDefault: cat.isDefault,
        };
      });

      setCategoryCards(cards);
    } catch (error) {
      console.error('处理分类数据失败:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCategoryPress = (category: CategoryCardData) => {
    navigation.navigate('CategoryDetail', { id: category.id });
  };

  const handleCategoryLongPress = (category: CategoryCardData) => {
    if (!category.isDefault) {
      setCategoryToDelete(category);
      setDeleteDialogVisible(true);
    }
  };

  const handleAddCategory = () => {
    navigation.navigate('AddCategory');
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      const realm = await initializeRealm();
      const categoryRepository = new CategoryRepository(realm);

      await deleteCategory(categoryRepository, categoryToDelete.id);
      setDeleteDialogVisible(false);
      setCategoryToDelete(null);
      showSnackbar('分类已删除');
    } catch (error) {
      console.error('删除分类失败:', error);
      showSnackbar('删除分类失败');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogVisible(false);
    setCategoryToDelete(null);
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleSortOptionSelect = async (sortBy: string) => {
    if (!currentUser) return;

    try {
      const realm = await initializeRealm();
      const categoryRepository = new CategoryRepository(realm);

      switch (sortBy) {
        case 'name':
          await categoryRepository.sortByName(currentUser.id, 'asc');
          break;
        case 'name-desc':
          await categoryRepository.sortByName(currentUser.id, 'desc');
          break;
        case 'createdAt':
          await categoryRepository.sortByCreatedAt(currentUser.id, 'desc');
          break;
        case 'createdAt-asc':
          await categoryRepository.sortByCreatedAt(currentUser.id, 'asc');
          break;
        case 'updatedAt':
          await categoryRepository.sortByUpdatedAt(currentUser.id, 'desc');
          break;
        case 'updatedAt-asc':
          await categoryRepository.sortByUpdatedAt(currentUser.id, 'asc');
          break;
      }

      setShowSortMenu(false);
    } catch (error) {
      console.error('排序失败:', error);
      showSnackbar('排序失败');
    }
  };

  const renderStatsSection = () => {
    const totalCategories = categories.length;
    const totalSubscriptions = categoryCards.reduce((sum, cat) => sum + cat.subscriptionCount, 0);
    const totalMonthlyCost = categoryCards.reduce((sum, cat) => sum + cat.monthlyCost, 0);
    const totalYearlyCost = categoryCards.reduce((sum, cat) => sum + cat.totalCost, 0);

    return (
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <MaterialCommunityIcons name="folder-multiple" size={24} color={theme.colors.primary} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{totalCategories}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>分类数</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <MaterialCommunityIcons name="playlist-check" size={24} color={theme.colors.primary} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{totalSubscriptions}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>订阅数</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <MaterialCommunityIcons name="calendar-month" size={24} color={theme.colors.primary} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            ¥{totalMonthlyCost.toFixed(2)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>月支出</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <MaterialCommunityIcons name="calendar-heart" size={24} color={theme.colors.primary} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            ¥{totalYearlyCost.toFixed(2)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>年支出</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="分类管理" />
        <Menu
          visible={showSortMenu}
          onDismiss={() => setShowSortMenu(false)}
          anchor={<Appbar.Action icon="sort" onPress={() => setShowSortMenu(true)} />}
        >
          <Menu.Item
            leadingIcon="format-letter-case"
            onPress={() => handleSortOptionSelect('name')}
            title="按名称（升序）"
          />
          <Menu.Item
            leadingIcon="format-letter-case"
            onPress={() => handleSortOptionSelect('name-desc')}
            title="按名称（降序）"
          />
          <Menu.Item
            leadingIcon="clock-outline"
            onPress={() => handleSortOptionSelect('createdAt')}
            title="按创建时间（最新）"
          />
          <Menu.Item
            leadingIcon="clock-outline"
            onPress={() => handleSortOptionSelect('createdAt-asc')}
            title="按创建时间（最早）"
          />
          <Menu.Item
            leadingIcon="update"
            onPress={() => handleSortOptionSelect('updatedAt')}
            title="按更新时间（最新）"
          />
          <Menu.Item
            leadingIcon="update"
            onPress={() => handleSortOptionSelect('updatedAt-asc')}
            title="按更新时间（最早）"
          />
        </Menu>
        <Appbar.Action icon="plus" onPress={handleAddCategory} />
      </Appbar.Header>

      <View style={styles.content}>
        {renderStatsSection()}

        <CategoryList
          categories={categoryCards}
          loading={isLoading}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onPress={handleCategoryPress}
          onLongPress={handleCategoryLongPress}
          emptyMessage="暂无分类"
          emptyIconName="folder-outline"
        />
      </View>

      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={handleDeleteCancel}>
          <Dialog.Title>确认删除</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: theme.colors.text }}>
              确定要删除分类"{categoryToDelete?.name}"吗？
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleDeleteCancel}>取消</Button>
            <Button onPress={handleDeleteConfirm} textColor={theme.colors.error}>
              删除
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  statCard: {
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 12,
    marginRight: '4%',
    padding: 16,
    width: '48%',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    paddingBottom: 8,
  },
});

export default CategoryListScreen;
