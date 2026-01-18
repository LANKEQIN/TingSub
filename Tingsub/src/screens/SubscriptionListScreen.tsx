import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, Appbar, Menu, Divider } from 'react-native-paper';
import { initializeRealm } from '../config/realm';
import { SubscriptionRepository, CategoryRepository } from '../repositories';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useCategoryStore } from '../store/categoryStore';
import { useUserStore } from '../store/userStore';
import SubscriptionList from '../components/subscription/SubscriptionList';
import SubscriptionFilterComponent from '../components/subscription/SubscriptionFilter';
import type { SubscriptionCardData } from '../types/subscription';
import type { CategoryOption } from '../types/category';
import type { SubscriptionFilter } from '../types/subscription';
import { isExpiringWithinDays, isExpired } from '../utils/dateUtils';

interface SubscriptionListScreenProps {
  navigation: any;
}

const SubscriptionListScreen: React.FC<SubscriptionListScreenProps> = ({ navigation }) => {
  const theme = useTheme() as any;

  const { subscriptions, loadSubscriptions, isLoading } = useSubscriptionStore();
  const { currentUser } = useUserStore();
  const { categories, loadCategories } = useCategoryStore();

  const [filteredSubscriptions, setFilteredSubscriptions] = useState<SubscriptionCardData[]>([]);
  const [filter, setFilter] = useState<SubscriptionFilter>({});
  const [showFilter, setShowFilter] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (subscriptions.length > 0 && categories.length > 0) {
      applyFilter();
    }
  }, [subscriptions, categories, filter]);

  const loadData = async () => {
    if (!currentUser) return;

    try {
      const realm = await initializeRealm();
      const subscriptionRepository = new SubscriptionRepository(realm);
      const categoryRepository = new CategoryRepository(realm);

      await loadCategories(categoryRepository, currentUser.id);
      await loadSubscriptions(subscriptionRepository, currentUser.id);
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  };

  const applyFilter = () => {
    let filtered = subscriptions.map((sub) => {
      const category = categories.find((cat) => cat.id === sub.categoryId);
      return {
        id: sub.id,
        name: sub.name,
        description: sub.description,
        price: sub.price,
        currency: sub.currency,
        type: sub.type,
        status: sub.status,
        renewalDate: new Date(sub.renewalDate),
        categoryName: category?.name || '未分类',
        categoryColor: category?.color || '#999999',
        categoryIcon: category?.icon || 'folder',
        tags: sub.tags,
        autoRenew: sub.autoRenew,
        isExpiringSoon: isExpiringWithinDays(sub.renewalDate, 7),
        isExpired: isExpired(sub.renewalDate),
      };
    });

    if (filter.categoryId) {
      filtered = filtered.filter(
        (sub) => sub.categoryName === categories.find((cat) => cat.id === filter.categoryId)?.name
      );
    }

    if (filter.status) {
      filtered = filtered.filter((sub) => sub.status === filter.status);
    }

    if (filter.type) {
      filtered = filtered.filter((sub) => sub.type === filter.type);
    }

    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase();
      filtered = filtered.filter(
        (sub) =>
          sub.name.toLowerCase().includes(keyword) ||
          (sub.description && sub.description.toLowerCase().includes(keyword))
      );
    }

    const sortBy = filter.sortBy || 'renewalDate';
    const sortOrder = filter.sortOrder || 'asc';

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'renewalDate':
          comparison = new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime();
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'createdAt':
          comparison = 0;
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredSubscriptions(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleFilterChange = (newFilter: SubscriptionFilter) => {
    setFilter(newFilter);
  };

  const handleResetFilter = () => {
    setFilter({});
  };

  const handleSubscriptionPress = (subscription: SubscriptionCardData) => {
    navigation.navigate('SubscriptionDetail', { id: subscription.id });
  };

  const handleAddSubscription = () => {
    navigation.navigate('AddSubscription');
  };

  const handleSortOptionSelect = (sortBy: string) => {
    setFilter({ ...filter, sortBy: sortBy as any });
    setShowSortMenu(false);
  };

  const toggleSortOrder = () => {
    setFilter({ ...filter, sortOrder: filter.sortOrder === 'asc' ? 'desc' : 'asc' });
  };

  const categoryOptions: CategoryOption[] = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    color: cat.color,
    icon: cat.icon,
  }));

  const hasActiveFilters = filter.categoryId || filter.status || filter.type || filter.keyword;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="我的订阅" />
        <Menu
          visible={showSortMenu}
          onDismiss={() => setShowSortMenu(false)}
          anchor={<Appbar.Action icon="sort" onPress={() => setShowSortMenu(true)} />}
        >
          <Menu.Item
            leadingIcon="calendar"
            onPress={() => handleSortOptionSelect('renewalDate')}
            title="按续费日期"
          />
          <Menu.Item
            leadingIcon="currency-cny"
            onPress={() => handleSortOptionSelect('price')}
            title="按价格"
          />
          <Menu.Item
            leadingIcon="clock-outline"
            onPress={() => handleSortOptionSelect('createdAt')}
            title="按创建时间"
          />
          <Menu.Item
            leadingIcon="format-letter-case"
            onPress={() => handleSortOptionSelect('name')}
            title="按名称"
          />
          <Divider />
          <Menu.Item
            leadingIcon={filter.sortOrder === 'asc' ? 'sort-ascending' : 'sort-descending'}
            onPress={toggleSortOrder}
            title={filter.sortOrder === 'asc' ? '升序' : '降序'}
          />
        </Menu>
        <Appbar.Action
          icon="filter-variant"
          onPress={() => setShowFilter(!showFilter)}
          color={hasActiveFilters ? theme.colors.primary : undefined}
        />
        <Appbar.Action icon="plus" onPress={handleAddSubscription} />
      </Appbar.Header>

      {showFilter && (
        <View style={[styles.filterContainer, { backgroundColor: theme.colors.surface }]}>
          <SubscriptionFilterComponent
            categories={categoryOptions}
            filter={filter}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilter}
          />
        </View>
      )}

      <View style={styles.listContainer}>
        <SubscriptionList
          subscriptions={filteredSubscriptions}
          loading={isLoading}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onPress={handleSubscriptionPress}
          emptyMessage="暂无订阅"
          emptyIconName="inbox-outline"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
  },
  listContainer: {
    flex: 1,
  },
});

export default SubscriptionListScreen;
