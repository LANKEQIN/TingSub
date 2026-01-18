import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { SubscriptionCardData } from '../../types/subscription';
import {
  formatCurrency,
  formatSubscriptionType,
  getSubscriptionStatusColor,
  formatSubscriptionStatus,
} from '../../utils/formatUtils';
import { getRelativeDateDescription } from '../../utils/dateUtils';

interface SubscriptionItemProps {
  subscription: SubscriptionCardData;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  showDivider?: boolean;
  style?: any;
}

const SubscriptionItem: React.FC<SubscriptionItemProps> = ({
  subscription,
  onPress,
  onLongPress,
  showDivider = true,
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

  const itemContent = (
    <View style={[styles.container, style]}>
      <View style={styles.leftSection}>
        <View
          style={[styles.iconContainer, { backgroundColor: subscription.categoryColor + '20' }]}
        >
          <MaterialCommunityIcons
            name={subscription.categoryIcon as any}
            size={24}
            color={subscription.categoryColor}
          />
        </View>
        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
              {subscription.name}
            </Text>
            {subscription.autoRenew && (
              <MaterialCommunityIcons
                name="autorenew"
                size={14}
                color={theme.colors.primary}
                style={styles.autoRenewIcon}
              />
            )}
          </View>
          <Text style={[styles.category, { color: theme.colors.text.secondary }]} numberOfLines={1}>
            {subscription.categoryName}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.metaText, { color: theme.colors.text.tertiary }]}>
              {formatCurrency(subscription.price, subscription.currency)}
            </Text>
            <Text style={[styles.metaSeparator, { color: theme.colors.text.tertiary }]}>·</Text>
            <Text style={[styles.metaText, { color: theme.colors.text.tertiary }]}>
              {formatSubscriptionType(subscription.type)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>{getStatusText()}</Text>
        </View>
        <Text
          style={[
            styles.renewalDate,
            {
              color:
                subscription.isExpiringSoon || subscription.isExpired
                  ? '#FF9800'
                  : theme.colors.text.tertiary,
            },
          ]}
          numberOfLines={1}
        >
          {getRelativeDateDescription(subscription.renewalDate)}
        </Text>
      </View>
    </View>
  );

  const container = (
    <>
      {onPress || onLongPress ? (
        <TouchableOpacity onPress={onPress} onLongPress={onLongPress} activeOpacity={0.7}>
          {itemContent}
        </TouchableOpacity>
      ) : (
        itemContent
      )}
      {showDivider && (
        <View style={[styles.divider, { backgroundColor: theme.colors.border.light }]} />
      )}
    </>
  );

  return container;
};

const styles = StyleSheet.create({
  autoRenewIcon: {
    marginLeft: 4,
  },
  category: {
    fontSize: 12,
    marginBottom: 4,
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    marginLeft: 68,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    marginRight: 12,
    width: 40,
  },
  infoSection: {
    flex: 1,
  },
  leftSection: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  metaSeparator: {
    fontSize: 12,
    marginHorizontal: 4,
  },
  metaText: {
    fontSize: 12,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 2,
  },
  renewalDate: {
    fontSize: 11,
  },
  rightSection: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  statusBadge: {
    borderRadius: 10,
    marginBottom: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
});

export default SubscriptionItem;
