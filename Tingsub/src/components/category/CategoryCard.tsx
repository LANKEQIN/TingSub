import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../common/Card';
import type { CategoryCardData } from '../../types/category';
import { formatCurrency } from '../../utils/formatUtils';

interface CategoryCardProps {
  category: CategoryCardData;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  style?: any;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  onLongPress,
  style,
}) => {
  const theme = useTheme() as any;

  const cardContent = (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
          <MaterialCommunityIcons
            name={category.icon as any}
            size={32}
            color={category.color}
          />
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
            {category.name}
          </Text>
          {category.description && (
            <Text style={[styles.description, { color: theme.colors.text.secondary }]} numberOfLines={1}>
              {category.description}
            </Text>
          )}
        </View>
        {category.isDefault && (
          <View style={[styles.defaultBadge, { backgroundColor: theme.colors.primary + '20' }]}>
            <MaterialCommunityIcons name="star" size={12} color={theme.colors.primary} />
          </View>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons
            name="folder-multiple"
            size={16}
            color={theme.colors.text.tertiary}
          />
          <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>
            订阅数
          </Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {category.subscriptionCount}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <MaterialCommunityIcons
            name="currency-cny"
            size={16}
            color={theme.colors.text.tertiary}
          />
          <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>
            月支出
          </Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {formatCurrency(category.monthlyCost, 'CNY')}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <MaterialCommunityIcons
            name="trending-up"
            size={16}
            color={theme.colors.text.tertiary}
          />
          <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>
            总支出
          </Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {formatCurrency(category.totalCost, 'CNY')}
          </Text>
        </View>
      </View>
    </View>
  );

  if (onPress || onLongPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.7}
      >
        <Card pressable={false}>{cardContent}</Card>
      </TouchableOpacity>
    );
  }

  return <Card pressable={false}>{cardContent}</Card>;
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
  },
  defaultBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 11,
    marginLeft: 4,
    marginRight: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#E0E0E0',
  },
});

export default CategoryCard;
