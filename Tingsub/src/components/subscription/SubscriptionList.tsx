import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  ListRenderItemInfo,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import SubscriptionCard from './SubscriptionCard';
import Empty from '../common/Empty';
import type { SubscriptionCardData } from '../../types/subscription';

interface SubscriptionListProps {
  subscriptions: SubscriptionCardData[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onPress?: (subscription: SubscriptionCardData) => void;
  onLongPress?: (subscription: SubscriptionCardData) => void;
  onEndReached?: () => void;
  ListHeaderComponent?: React.ReactNode;
  ListFooterComponent?: React.ReactNode;
  emptyMessage?: string;
  emptyIconName?: string;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({
  subscriptions,
  loading = false,
  refreshing = false,
  onRefresh,
  onPress,
  onLongPress,
  onEndReached,
  ListHeaderComponent,
  ListFooterComponent,
  emptyMessage = '暂无订阅',
  emptyIconName = 'inbox-outline',
}) => {
  const theme = useTheme() as any;

  const renderItem = ({ item }: ListRenderItemInfo<SubscriptionCardData>) => {
    return (
      <SubscriptionCard
        subscription={item}
        onPress={onPress ? () => onPress(item) : undefined}
        onLongPress={onLongPress ? () => onLongPress(item) : undefined}
        style={styles.card}
      />
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }

    return (
      <Empty
        iconName={emptyIconName}
        description={emptyMessage}
      />
    );
  };

  const renderListFooter = () => {
    if (loading && subscriptions.length > 0) {
      return (
        <View style={styles.footerLoading}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      );
    }

    return ListFooterComponent;
  };

  const renderListHeader = () => {
    if (!ListHeaderComponent) {
      return null;
    }

    return <View style={styles.header}>{ListHeaderComponent}</View>;
  };

  const keyExtractor = (item: SubscriptionCardData) => item.id;

  return (
    <FlatList
      data={subscriptions}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={renderEmpty}
      ListHeaderComponent={renderListHeader}
      ListFooterComponent={renderListFooter}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        ) : undefined
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      contentContainerStyle={[
        styles.listContent,
        subscriptions.length === 0 && styles.emptyContent,
      ]}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 8,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 8,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerLoading: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default SubscriptionList;
