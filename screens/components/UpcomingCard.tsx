import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'tamagui';
import { Music, CalendarDays, CreditCard, AlertCircle } from '@tamagui/lucide-icons';
import tamaguiConfig from '../../tamagui.config';
import { getVariableValue } from '@tamagui/core';

type UpcomingCardProps = {
  item: { id: string; name: string; cycle: string; next: string; price: string; dueDays?: number }
  onLongPress?: () => void
  styles: any
}

const UpcomingCard: React.FC<UpcomingCardProps> = ({ item, onLongPress, styles }) => {
  const c = tamaguiConfig.tokens.color;
  const isDark = styles?.colors?.textPrimary === '#E5E7EB';
  
  const isUrgent = item.dueDays !== undefined && item.dueDays <= 1;
  const isWarning = item.dueDays !== undefined && item.dueDays <= 3 && item.dueDays > 1;
  
  const urgencyColor = isUrgent 
    ? getVariableValue(c.danger) 
    : isWarning 
      ? getVariableValue(c.warning) 
      : getVariableValue(c.success);

  return (
    <TouchableOpacity 
      style={[styles.upcomingCard, cardStyles.card]} 
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[getVariableValue(c.gradientCardStart), getVariableValue(c.gradientCardEnd)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={cardStyles.iconGradient}
      >
        <Music size={22} color="#FFFFFF" />
      </LinearGradient>
      
      <View style={cardStyles.content}>
        <View style={cardStyles.headerRow}>
          <Text style={styles.upcomingName}>{item.name}</Text>
          {isUrgent && (
            <View style={[cardStyles.urgentBadge, { backgroundColor: getVariableValue(c.danger) }]}>
              <AlertCircle size={12} color="#FFFFFF" />
            </View>
          )}
        </View>
        <Text style={styles.upcomingCycle}>{item.cycle}</Text>
        <View style={styles.upcomingMetaRow}>
          <View style={[cardStyles.metaBadge, { borderColor: urgencyColor }]}>
            <CalendarDays size={14} color={urgencyColor} />
            <Text style={[styles.badgeText, { color: urgencyColor }]}>{item.next}</Text>
          </View>
          <View style={[cardStyles.metaBadge, { borderColor: getVariableValue(isDark ? c.accentDark : c.accentLight) }]}>
            <CreditCard size={14} color={getVariableValue(isDark ? c.accentDark : c.accentLight)} />
            <Text style={[styles.badgeText, { color: getVariableValue(isDark ? c.accentDark : c.accentLight) }]}>{item.price}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  urgentBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'transparent',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
});

export default UpcomingCard;
