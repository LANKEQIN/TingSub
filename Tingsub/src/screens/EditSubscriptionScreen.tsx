import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useTheme, Appbar } from 'react-native-paper';
import { initializeRealm } from '../config/realm';
import { SubscriptionRepository, CategoryRepository, TagRepository } from '../repositories';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useCategoryStore } from '../store/categoryStore';
import { useTagStore } from '../store/tagStore';
import { useUserStore } from '../store/userStore';
import SubscriptionForm from '../components/subscription/SubscriptionForm';
import type { SubscriptionFormData } from '../types/subscription';
import type { CategoryOption } from '../types/category';
import type { TagOption } from '../types/tag';
import type { Subscription } from '../types/subscription';

interface EditSubscriptionScreenProps {
  navigation: any;
  route: {
    params: {
      id: string;
    };
  };
}

const EditSubscriptionScreen: React.FC<EditSubscriptionScreenProps> = ({ navigation, route }) => {
  const theme = useTheme() as any;

  const { id: subscriptionId } = route.params;
  const { updateSubscription } = useSubscriptionStore();
  const { currentUser } = useUserStore();
  const { categories, loadCategories } = useCategoryStore();
  const { tags, loadTags } = useTagStore();

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [tagOptions, setTagOptions] = useState<TagOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [subscriptionId]);

  const loadData = async () => {
    if (!currentUser) return;

    try {
      const realm = await initializeRealm();
      const subscriptionRepository = new SubscriptionRepository(realm);
      const categoryRepository = new CategoryRepository(realm);
      const tagRepository = new TagRepository(realm);

      const sub = await subscriptionRepository.getById(subscriptionId);
      if (sub) {
        setSubscription(sub);
      }

      await loadCategories(categoryRepository, currentUser.id);
      await loadTags(tagRepository, currentUser.id);
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  };

  useEffect(() => {
    const cats: CategoryOption[] = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      color: cat.color,
      icon: cat.icon,
    }));
    setCategoryOptions(cats);

    const tagsList: TagOption[] = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
    }));
    setTagOptions(tagsList);
  }, [categories, tags]);

  const handleSubmit = async (formData: SubscriptionFormData) => {
    if (!currentUser || !subscription) {
      Alert.alert('错误', '请先登录');
      return;
    }

    setLoading(true);
    try {
      const realm = await initializeRealm();
      const subscriptionRepository = new SubscriptionRepository(realm);

      const subscriptionData = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        tags: formData.tags,
        type: formData.type,
        price: formData.price,
        currency: formData.currency,
        billingDate: formData.billingDate,
        startDate: formData.startDate,
        endDate: formData.endDate,
        autoRenew: formData.autoRenew,
        platform: formData.platform,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      };

      await updateSubscription(subscriptionRepository, subscriptionId, subscriptionData);
      Alert.alert('成功', '订阅更新成功', [
        {
          text: '确定',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('更新失败', error instanceof Error ? error.message : '更新订阅时发生错误');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const getInitialValues = (): Partial<SubscriptionFormData> => {
    if (!subscription) return {};

    return {
      name: subscription.name,
      description: subscription.description,
      categoryId: subscription.categoryId,
      tags: subscription.tags,
      type: subscription.type,
      price: subscription.price,
      currency: subscription.currency,
      billingDate: new Date(subscription.billingDate),
      startDate: new Date(subscription.startDate),
      endDate: subscription.endDate ? new Date(subscription.endDate) : undefined,
      autoRenew: subscription.autoRenew,
      platform: subscription.platform,
      paymentMethod: subscription.paymentMethod,
      notes: subscription.notes,
    };
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleCancel} />
        <Appbar.Content title="编辑订阅" />
      </Appbar.Header>

      <SubscriptionForm
        initialValues={getInitialValues()}
        categories={categoryOptions}
        tags={tagOptions}
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
});

export default EditSubscriptionScreen;
