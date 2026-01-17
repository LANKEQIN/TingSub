import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme, Appbar, Portal, Dialog, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { initializeRealm } from '../config/realm';
import { SubscriptionRepository, CategoryRepository } from '../repositories';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useCategoryStore } from '../store/categoryStore';
import type { Subscription } from '../types/subscription';
import type { Category } from '../types/category';
import { formatCurrency, formatSubscriptionType, formatSubscriptionStatus } from '../utils/formatUtils';
import { formatDate, isExpiringWithinDays, isExpired, daysBetween } from '../utils/dateUtils';

interface SubscriptionDetailScreenProps {
  navigation: any;
  route: {
    params: {
      id: string;
    };
  };
}

const SubscriptionDetailScreen: React.FC<SubscriptionDetailScreenProps> = ({ navigation, route }) => {
  const theme = useTheme() as any;

  const { id } = route.params;
  const subscriptionId = id;
  const { deleteSubscription, updateStatus, updateAutoRenew } = useSubscriptionStore();
  const { loadCategories } = useCategoryStore();

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, [subscriptionId]);

  const loadData = async () => {
    try {
      const realm = await initializeRealm();
      const subscriptionRepository = new SubscriptionRepository(realm);
      const categoryRepository = new CategoryRepository(realm);

      const sub = await subscriptionRepository.getById(subscriptionId);
      if (sub) {
        setSubscription(sub);
        const cat = await categoryRepository.getById(sub.categoryId);
        setCategory(cat);
      }

      const userId = sub?.userId || '';
      await loadCategories(categoryRepository, userId);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditSubscription', { id: subscriptionId });
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const realm = await initializeRealm();
      const subscriptionRepository = new SubscriptionRepository(realm);
      await deleteSubscription(subscriptionRepository, subscriptionId);
      setShowDeleteDialog(false);
      navigation.goBack();
    } catch (error) {
      Alert.alert('删除失败', '删除订阅时发生错误，请稍后重试');
    }
  };

  const handleCancelSubscription = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = async () => {
    try {
      const realm = await initializeRealm();
      const subscriptionRepository = new SubscriptionRepository(realm);
      await updateStatus(subscriptionRepository, subscriptionId, 'cancelled');
      setShowCancelDialog(false);
      await loadData();
    } catch (error) {
      Alert.alert('取消失败', '取消订阅时发生错误，请稍后重试');
    }
  };

  const handleToggleAutoRenew = async () => {
    if (!subscription) return;

    try {
      const realm = await initializeRealm();
      const subscriptionRepository = new SubscriptionRepository(realm);
      await updateAutoRenew(subscriptionRepository, subscriptionId, !subscription.autoRenew);
      await loadData();
    } catch (error) {
      Alert.alert('更新失败', '更新自动续费设置时发生错误，请稍后重试');
    }
  };

  const getStatusColor = () => {
    if (!subscription) return '#999999';
    if (isExpired(subscription.renewalDate)) return '#F44336';
    if (isExpiringWithinDays(subscription.renewalDate, 7)) return '#FF9800';
    return subscription.status === 'active' ? '#4CAF50' : '#999999';
  };

  const getStatusText = () => {
    if (!subscription) return '';
    if (isExpired(subscription.renewalDate)) return '已过期';
    if (isExpiringWithinDays(subscription.renewalDate, 7)) return '即将到期';
    return formatSubscriptionStatus(subscription.status);
  };

  const getDaysUntilRenewal = () => {
    if (!subscription) return 0;
    const days = daysBetween(new Date(), subscription.renewalDate);
    return days;
  };

  const renderInfoRow = (icon: string, label: string, value: string | number) => (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name={icon as any} size={20} color={theme.colors.text.secondary} style={styles.infoIcon} />
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

  if (!subscription) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <MaterialCommunityIcons name="alert-circle-outline" size={64} color={theme.colors.text.tertiary} />
        <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
          订阅不存在
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="订阅详情" />
        <Appbar.Action icon="pencil" onPress={handleEdit} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.headerCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.headerContent}>
            <View style={[styles.iconContainer, { backgroundColor: category?.color + '20' }]}>
              <MaterialCommunityIcons
                name={category?.icon as any}
                size={48}
                color={category?.color}
              />
            </View>
            <View style={styles.headerInfo}>
              <Text style={[styles.name, { color: theme.colors.text }]}>{subscription.name}</Text>
              <Text style={[styles.category, { color: theme.colors.text.secondary }]}>
                {category?.name || '未分类'}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor() }]}>
                  {getStatusText()}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.priceSection}>
            <Text style={[styles.price, { color: theme.colors.primary }]}>
              {formatCurrency(subscription.price, subscription.currency)}
            </Text>
            <Text style={[styles.priceLabel, { color: theme.colors.text.secondary }]}>
              {formatSubscriptionType(subscription.type)}
            </Text>
          </View>
        </View>

        {renderSection('基本信息', 'information', (
          <View style={styles.infoContainer}>
            {renderInfoRow('calendar-clock', '续费日期', formatDate(subscription.renewalDate))}
            {renderInfoRow('calendar', '开始日期', formatDate(subscription.startDate))}
            {subscription.endDate && renderInfoRow('calendar-check', '结束日期', formatDate(subscription.endDate))}
            {renderInfoRow('web', '订阅平台', subscription.platform)}
            {renderInfoRow('credit-card', '支付方式', subscription.paymentMethod)}
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="autorenew"
                size={20}
                color={theme.colors.text.secondary}
                style={styles.infoIcon}
              />
              <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>自动续费</Text>
              <TouchableOpacity onPress={handleToggleAutoRenew}>
                <Text style={[styles.infoValue, { color: theme.colors.primary }]}>
                  {subscription.autoRenew ? '是' : '否'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {renderSection('费用信息', 'currency-cny', (
          <View style={styles.infoContainer}>
            {renderInfoRow('calendar-month', '月度费用', formatCurrency(
              subscription.type === 'weekly' ? subscription.price * 4.33 :
              subscription.type === 'monthly' ? subscription.price :
              subscription.type === 'quarterly' ? subscription.price / 3 :
              subscription.type === 'yearly' ? subscription.price / 12 : 0,
              subscription.currency
            ))}
            {renderInfoRow('calendar-year', '年度费用', formatCurrency(
              subscription.type === 'weekly' ? subscription.price * 52 :
              subscription.type === 'monthly' ? subscription.price * 12 :
              subscription.type === 'quarterly' ? subscription.price * 4 :
              subscription.type === 'yearly' ? subscription.price : subscription.price,
              subscription.currency
            ))}
          </View>
        ))}

        {renderSection('时间信息', 'clock-outline', (
          <View style={styles.infoContainer}>
            {renderInfoRow('calendar-range', '距离续费', `${getDaysUntilRenewal()}天`)}
            {renderInfoRow('calendar-plus', '创建时间', formatDate(subscription.createdAt))}
            {renderInfoRow('calendar-edit', '更新时间', formatDate(subscription.updatedAt))}
          </View>
        ))}

        {subscription.tags && subscription.tags.length > 0 && renderSection('标签', 'tag', (
          <View style={styles.tagsContainer}>
            {subscription.tags.map((tag, index) => (
              <View key={index} style={[styles.tag, { borderColor: category?.color }]}>
                <Text style={[styles.tagText, { color: category?.color }]}>{tag}</Text>
              </View>
            ))}
          </View>
        ))}

        {subscription.description && renderSection('描述', 'text', (
          <View style={styles.descriptionContainer}>
            <Text style={[styles.description, { color: theme.colors.text }]}>
              {subscription.description}
            </Text>
          </View>
        ))}

        {subscription.notes && renderSection('备注', 'note', (
          <View style={styles.descriptionContainer}>
            <Text style={[styles.description, { color: theme.colors.text }]}>
              {subscription.notes}
            </Text>
          </View>
        ))}

        <View style={styles.actionsContainer}>
          {subscription.status === 'active' && (
            <Button
              mode="outlined"
              onPress={handleCancelSubscription}
              style={styles.actionButton}
              icon="cancel"
            >
              取消订阅
            </Button>
          )}
          <Button
            mode="contained"
            onPress={handleDelete}
            style={styles.actionButton}
            icon="delete"
            buttonColor={theme.colors.error}
          >
            删除订阅
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
          <Dialog.Title>确认删除</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: theme.colors.text }}>
              确定要删除这个订阅吗？此操作无法撤销。
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>取消</Button>
            <Button onPress={confirmDelete} textColor={theme.colors.error}>删除</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={showCancelDialog} onDismiss={() => setShowCancelDialog(false)}>
          <Dialog.Title>取消订阅</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: theme.colors.text }}>
              确定要取消这个订阅吗？订阅状态将变为"已取消"。
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCancelDialog(false)}>取消</Button>
            <Button onPress={confirmCancel} textColor={theme.colors.error}>确认</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(154, 207, 255, 0.3)',
    borderTopColor: '#9ACFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerCard: {
    padding: 20,
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
  },
  priceLabel: {
    fontSize: 14,
  },
  section: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoContainer: {
    backgroundColor: 'rgba(154, 207, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'rgba(154, 207, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionContainer: {
    backgroundColor: 'rgba(154, 207, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginHorizontal: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default SubscriptionDetailScreen;
