import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTheme, FAB, Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { initializeRealm } from '../config/realm';
import { SubscriptionRepository, UserRepository, CategoryRepository } from '../repositories';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useUserStore } from '../store/userStore';
import { useCategoryStore } from '../store/categoryStore';
import SubscriptionList from '../components/subscription/SubscriptionList';
import StatCard from '../components/statistics/StatCard';
import type { SubscriptionCardData } from '../types/subscription';
import { isExpiringWithinDays, isExpired } from '../utils/dateUtils';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const theme = useTheme() as any;

  const { subscriptions, loadSubscriptions, isLoading: subLoading } = useSubscriptionStore();
  const { currentUser, initializeUser, isLoading: userLoading } = useUserStore();
  const { categories, loadCategories } = useCategoryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [expiringSoon, setExpiringSoon] = useState<SubscriptionCardData[]>([]);
  const [recentSubscriptions, setRecentSubscriptions] = useState<SubscriptionCardData[]>([]);
  const [stats, setStats] = useState({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    monthlyExpense: 0,
    yearlyExpense: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    if (initialized && currentUser) {
      loadData();
    }
  }, [initialized, currentUser]);

  useEffect(() => {
    if (subscriptions.length > 0 && categories.length > 0) {
      processSubscriptions();
    }
  }, [subscriptions, categories]);

  const initializeData = async () => {
    try {
      const realm = await initializeRealm();

      const userRepository = new UserRepository(realm);
      const subscriptionRepository = new SubscriptionRepository(realm);
      const categoryRepository = new CategoryRepository(realm);

      await initializeUser(userRepository);

      if (currentUser) {
        await loadCategories(categoryRepository, currentUser.id);
        await loadSubscriptions(subscriptionRepository, currentUser.id);
      }

      setInitialized(true);
    } catch (error) {
      console.error('初始化数据失败:', error);
    }
  };

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

  const processSubscriptions = () => {
    const cardData = subscriptions.map((sub) => {
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

    const expiring = cardData.filter((sub) => sub.isExpiringSoon || sub.isExpired);
    const recent = [...cardData]
      .sort((a, b) => {
        const dateA = new Date(a.renewalDate).getTime();
        const dateB = new Date(b.renewalDate).getTime();
        return dateA - dateB;
      })
      .slice(0, 5);

    setExpiringSoon(expiring);
    setRecentSubscriptions(recent);

    const activeSubs = subscriptions.filter((sub) => sub.status === 'active');
    let monthlyExpense = 0;
    let yearlyExpense = 0;

    activeSubs.forEach((sub) => {
      switch (sub.type) {
        case 'weekly':
          monthlyExpense += sub.price * 4.33;
          yearlyExpense += sub.price * 52;
          break;
        case 'monthly':
          monthlyExpense += sub.price;
          yearlyExpense += sub.price * 12;
          break;
        case 'quarterly':
          monthlyExpense += sub.price / 3;
          yearlyExpense += sub.price * 4;
          break;
        case 'yearly':
          monthlyExpense += sub.price / 12;
          yearlyExpense += sub.price;
          break;
        case 'one-time':
          yearlyExpense += sub.price;
          break;
      }
    });

    setStats({
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: activeSubs.length,
      monthlyExpense,
      yearlyExpense,
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSearch = () => {
    navigation.navigate('Search', { query: searchQuery });
  };

  const handleSubscriptionPress = (subscription: SubscriptionCardData) => {
    navigation.navigate('SubscriptionDetail', { id: subscription.id });
  };

  const renderStatsSection = () => (
    <View style={styles.statsContainer}>
      <StatCard
        title="月度支出"
        value={stats.monthlyExpense}
        unit="元"
        icon={
          <MaterialCommunityIcons name="calendar-month" size={24} color={theme.colors.primary} />
        }
        compact
        style={styles.statCard}
      />
      <StatCard
        title="年度支出"
        value={stats.yearlyExpense}
        unit="元"
        icon={
          <MaterialCommunityIcons name="calendar-heart" size={24} color={theme.colors.primary} />
        }
        compact
        style={styles.statCard}
      />
      <StatCard
        title="订阅数量"
        value={stats.totalSubscriptions}
        unit="个"
        icon={
          <MaterialCommunityIcons name="playlist-check" size={24} color={theme.colors.primary} />
        }
        compact
        style={styles.statCard}
      />
      <StatCard
        title="活跃订阅"
        value={stats.activeSubscriptions}
        unit="个"
        icon={<MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />}
        compact
        style={styles.statCard}
      />
    </View>
  );

  const renderSectionHeader = (title: string, icon: string, onPress?: () => void) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderLeft}>
        <MaterialCommunityIcons name={icon as any} size={20} color={theme.colors.primary} />
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
      </View>
      {onPress && (
        <TouchableOpacity onPress={onPress} style={styles.seeMoreButton}>
          <Text style={[styles.seeMoreText, { color: theme.colors.primary }]}>查看更多</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );

  if (userLoading || subLoading || !initialized) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="搜索订阅..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={handleSearch}
        style={styles.searchBar}
        icon={() => (
          <MaterialCommunityIcons name="magnify" size={24} color={theme.colors.text.secondary} />
        )}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <View>
            <SubscriptionList
              subscriptions={recentSubscriptions}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          </View>
        }
      >
        {renderStatsSection()}

        {expiringSoon.length > 0 && (
          <>
            {renderSectionHeader('即将到期', 'alert-circle', () =>
              navigation.navigate('Subscriptions')
            )}
            <SubscriptionList
              subscriptions={expiringSoon}
              onPress={handleSubscriptionPress}
              emptyMessage="暂无即将到期的订阅"
              emptyIconName="check-circle"
            />
          </>
        )}

        {recentSubscriptions.length > 0 && (
          <>
            {renderSectionHeader('最近订阅', 'clock-outline', () =>
              navigation.navigate('Subscriptions')
            )}
            <SubscriptionList
              subscriptions={recentSubscriptions}
              onPress={handleSubscriptionPress}
              emptyMessage="暂无订阅"
              emptyIconName="inbox-outline"
            />
          </>
        )}

        {subscriptions.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="inbox-outline"
              size={64}
              color={theme.colors.text.tertiary}
            />
            <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
              还没有订阅，点击右下角按钮添加
            </Text>
          </View>
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('AddSubscription')}
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
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  fab: {
    bottom: 16,
    position: 'absolute',
    right: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  scrollView: {
    flex: 1,
  },
  searchBar: {
    elevation: 2,
    margin: 16,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeaderLeft: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  seeMoreButton: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  seeMoreText: {
    fontSize: 14,
    marginRight: 4,
  },
  statCard: {
    marginBottom: 12,
    marginRight: '4%',
    width: '48%',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
});

export default HomeScreen;
