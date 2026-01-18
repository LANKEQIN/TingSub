import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../common/Card';
import type { SubscriptionCardData } from '../../types/subscription';
import {
  formatCurrency,
  formatSubscriptionType,
  getSubscriptionStatusColor,
  formatSubscriptionStatus,
} from '../../utils/formatUtils';
import { getRelativeDateDescription } from '../../utils/dateUtils';

interface SubscriptionCardProps {
  subscription: SubscriptionCardData;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  style?: any;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onPress,
  onLongPress,
  style,
}) => {
  const theme = useTheme() as any;

  const getStatusColor = () => {
    if (subscription.isExpired) {
      return '#F44336';
    }
    if (subscription.isExpiringSoon) {
      return '#FF9800';
    }
    return getSubscriptionStatusColor(subscription.status);
  };

  const getStatusText = () => {
    if (subscription.isExpired) {
      return '已过期';
    }
    if (subscription.isExpiringSoon) {
      return '即将到期';
    }
    return formatSubscriptionStatus(subscription.status);
  };

  const renderTags = () => {
    if (!subscription.tags || subscription.tags.length === 0) {
      return null;
    }

    return (
      <View style={styles.tagsContainer}>
        {subscription.tags.slice(0, 3).map((tag, index) => (
          <View key={index} style={[styles.tag, { borderColor: subscription.categoryColor }]}>
            <Text style={[styles.tagText, { color: subscription.categoryColor }]}>{tag}</Text>
          </View>
        ))}
        {subscription.tags.length > 3 && (
          <Text style={styles.moreTagsText}>+{subscription.tags.length - 3}</Text>
        )}
      </View>
    );
  };

  const cardContent = (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View
          style={[styles.iconContainer, { backgroundColor: subscription.categoryColor + '20' }]}
        >
          <MaterialCommunityIcons
            name={subscription.categoryIcon as any}
            size={28}
            color={subscription.categoryColor}
          />
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
            {subscription.name}
          </Text>
          <Text style={[styles.category, { color: theme.colors.text.secondary }]}>
            {subscription.categoryName}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>{getStatusText()}</Text>
        </View>
      </View>

      {subscription.description && (
        <Text
          style={[styles.description, { color: theme.colors.text.secondary }]}
          numberOfLines={2}
        >
          {subscription.description}
        </Text>
      )}

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons
            name="currency-cny"
            size={16}
            color={theme.colors.text.tertiary}
          />
          <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
            {formatCurrency(subscription.price, subscription.currency)}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons
            name="calendar-clock"
            size={16}
            color={theme.colors.text.tertiary}
          />
          <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
            {formatSubscriptionType(subscription.type)}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons
            name="calendar"
            size={16}
            color={
              subscription.isExpiringSoon || subscription.isExpired
                ? '#FF9800'
                : theme.colors.text.tertiary
            }
          />
          <Text
            style={[
              styles.infoText,
              {
                color:
                  subscription.isExpiringSoon || subscription.isExpired
                    ? '#FF9800'
                    : theme.colors.text.secondary,
              },
            ]}
          >
            {getRelativeDateDescription(subscription.renewalDate)}
          </Text>
        </View>
      </View>

      {renderTags()}

      {subscription.autoRenew && (
        <View style={styles.autoRenewBadge}>
          <MaterialCommunityIcons name="autorenew" size={12} color={theme.colors.primary} />
          <Text style={[styles.autoRenewText, { color: theme.colors.primary }]}>自动续费</Text>
        </View>
      )}
    </View>
  );

  if (onPress || onLongPress) {
    return (
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress} activeOpacity={0.7}>
        <Card pressable={false}>{cardContent}</Card>
      </TouchableOpacity>
    );
  }

  return <Card pressable={false}>{cardContent}</Card>;
};

const styles = StyleSheet.create({
  autoRenewBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(154, 207, 255, 0.1)',
    borderRadius: 12,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  autoRenewText: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 4,
  },
  category: {
    fontSize: 12,
  },
  container: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    marginRight: 12,
    width: 48,
  },
  infoItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 4,
  },
  moreTagsText: {
    color: '#999',
    fontSize: 11,
    marginLeft: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  tag: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 4,
    marginRight: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  tagsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
});

export default SubscriptionCard;
