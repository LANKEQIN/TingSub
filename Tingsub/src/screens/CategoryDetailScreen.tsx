import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Alert } from 'react-native';
import { useTheme, Appbar, Portal, Dialog, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { initializeRealm } from '../config/realm';
import { CategoryRepository, SubscriptionRepository } from '../repositories';
import { useCategoryStore } from '../store/categoryStore';
import type { Category } from '../types/category';
import type { Subscription } from '../types/subscription';
import { formatDate } from '../utils/dateUtils';
import SubscriptionCard from '../components/subscription/SubscriptionCard';

interface CategoryDetailScreenProps {
  navigation: any;
  route: {
    params: {
      id: string;
    };
  };
}

const CategoryDetailScreen: React.FC<CategoryDetailScreenProps> = ({ navigation, route }) => {
  const theme = useTheme() as any;

  const { id } = route.params;
  const categoryId = id;
  const { deleteCategory } = useCategoryStore();

  const [category, setCategory] = useState<Category | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, [categoryId]);

  const loadData = async () => {
    try {
      const realm = await initializeRealm();
      const categoryRepository = new CategoryRepository(realm);
      const subscriptionRepository = new SubscriptionRepository(realm);

      const cat = await categoryRepository.getById(categoryId);
      if (cat) {
        setCategory(cat);
        const subs = await subscriptionRepository.getByCategoryId(categoryId);
        setSubscriptions(subs);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditCategory', { id: categoryId });
  };

  const handleDelete = () => {
    if (category?.isDefault) {
      Alert.alert('无法删除', '默认分类不能删除');
      return;
    }
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const realm = await initializeRealm();
      const categoryRepository = new CategoryRepository(realm);
      await deleteCategory(categoryRepository, categoryId);
      setShowDeleteDialog(false);
      navigation.goBack();
    } catch (error) {
      Alert.alert('删除失败', '删除分类时发生错误，请稍后重试');
    }
  };

  const handleSubscriptionPress = (subscription: Subscription) => {
    navigation.navigate('SubscriptionDetail', { id: subscription.id });
  };

  const calculateStats = () => {
    let monthlyCost = 0;
    let yearlyCost = 0;
    let totalCost = 0;

    subscriptions.forEach((sub) => {
      const price = sub.price;
      const type = sub.type;

      switch (type) {
        case 'weekly':
          monthlyCost += price * 4.33;
          yearlyCost += price * 52;
          totalCost += price * 52;
          break;
        case 'monthly':
          monthlyCost += price;
          yearlyCost += price * 12;
          totalCost += price * 12;
          break;
        case 'quarterly':
          monthlyCost += price / 3;
          yearlyCost += price * 4;
          totalCost += price * 4;
          break;
        case 'yearly':
          monthlyCost += price / 12;
          yearlyCost += price;
          totalCost += price;
          break;
        case 'one-time':
          totalCost += price;
          break;
      }
    });

    return { monthlyCost, yearlyCost, totalCost };
  };

  const stats = calculateStats();

  const renderInfoRow = (icon: string, label: string, value: string | number) => (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons
        name={icon as any}
        size={20}
        color={theme.colors.text.secondary}
        style={styles.infoIcon}
      />
      <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.colors.text }]}>{value}</Text>
    </View>
  );

  const renderSection = (title: string, icon: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name={icon as any} size={20} color={theme.colors.primary} />
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
      </View>
      {children}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <View style={styles.loadingIndicator} />
      </View>
    );
  }

  if (!category) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={64}
          color={theme.colors.text.tertiary}
        />
        <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>分类不存在</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="分类详情" />
        <Appbar.Action icon="pencil" onPress={handleEdit} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.headerCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.headerContent}>
            <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
              <MaterialCommunityIcons
                name={category.icon as any}
                size={48}
                color={category.color}
              />
            </View>
            <View style={styles.headerInfo}>
              <Text style={[styles.name, { color: theme.colors.text }]}>{category.name}</Text>
              {category.description && (
                <Text
                  style={[styles.description, { color: theme.colors.text.secondary }]}
                  numberOfLines={2}
                >
                  {category.description}
                </Text>
              )}
              {category.isDefault && (
                <View
                  style={[styles.defaultBadge, { backgroundColor: theme.colors.primary + '20' }]}
                >
                  <MaterialCommunityIcons name="star" size={12} color={theme.colors.primary} />
                  <Text style={[styles.defaultBadgeText, { color: theme.colors.primary }]}>
                    默认分类
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {renderSection(
          '统计信息',
          'chart-bar',
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
              <MaterialCommunityIcons
                name="playlist-check"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {subscriptions.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>订阅数</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
              <MaterialCommunityIcons
                name="calendar-month"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                ¥{stats.monthlyCost.toFixed(2)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>月支出</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
              <MaterialCommunityIcons
                name="calendar-heart"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                ¥{stats.yearlyCost.toFixed(2)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>年支出</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
              <MaterialCommunityIcons name="currency-cny" size={24} color={theme.colors.primary} />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                ¥{stats.totalCost.toFixed(2)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>总支出</Text>
            </View>
          </View>
        )}

        {renderSection(
          '分类信息',
          'information',
          <View style={styles.infoContainer}>
            {renderInfoRow('palette', '分类颜色', category.color)}
            {renderInfoRow('shape', '分类图标', category.icon)}
            {renderInfoRow('calendar-plus', '创建时间', formatDate(category.createdAt))}
            {renderInfoRow('calendar-edit', '更新时间', formatDate(category.updatedAt))}
          </View>
        )}

        {subscriptions.length > 0 &&
          renderSection(
            '分类订阅',
            'playlist-check',
            <View style={styles.subscriptionsContainer}>
              {subscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={{
                    id: subscription.id,
                    name: subscription.name,
                    description: subscription.description,
                    price: subscription.price,
                    currency: subscription.currency,
                    type: subscription.type,
                    status: subscription.status,
                    renewalDate: new Date(subscription.renewalDate),
                    categoryName: category.name,
                    categoryColor: category.color,
                    categoryIcon: category.icon,
                    tags: subscription.tags,
                    autoRenew: subscription.autoRenew,
                    isExpiringSoon: false,
                    isExpired: false,
                  }}
                  onPress={() => handleSubscriptionPress(subscription)}
                  style={styles.subscriptionCard}
                />
              ))}
            </View>
          )}

        {!category.isDefault && (
          <View style={styles.actionsContainer}>
            <Button
              mode="contained"
              onPress={handleDelete}
              style={styles.actionButton}
              icon="delete"
              buttonColor={theme.colors.error}
            >
              删除分类
            </Button>
          </View>
        )}
      </ScrollView>

      <Portal>
        <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
          <Dialog.Title>确认删除</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: theme.colors.text }}>
              确定要删除分类"{category?.name}"吗？此操作无法撤销。
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>取消</Button>
            <Button onPress={confirmDelete} textColor={theme.colors.error}>
              删除
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    width: '100%',
  },
  actionsContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  container: {
    flex: 1,
  },
  defaultBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 12,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  headerCard: {
    borderRadius: 12,
    elevation: 2,
    margin: 16,
    padding: 20,
  },
  headerContent: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  headerInfo: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 16,
    height: 64,
    justifyContent: 'center',
    marginRight: 16,
    width: 64,
  },
  infoContainer: {
    backgroundColor: 'rgba(154, 207, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoLabel: {
    flex: 1,
    fontSize: 14,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
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
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subscriptionCard: {
    marginBottom: 8,
  },
  subscriptionsContainer: {
    backgroundColor: 'rgba(154, 207, 255, 0.05)',
    borderRadius: 12,
    padding: 8,
  },
});

export default CategoryDetailScreen;
