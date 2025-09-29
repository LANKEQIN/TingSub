import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';
import { Music, CalendarDays, CreditCard } from '@tamagui/lucide-icons';

const UpcomingCard = ({ item, onLongPress, styles }) => (
  <TouchableOpacity style={styles.upcomingCard} onLongPress={onLongPress}>
    <View style={styles.upcomingIconBox}>
      <Music size={20} color="#0ea5e9" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.upcomingName}>{item.name}</Text>
      <Text style={styles.upcomingCycle}>{item.cycle}</Text>
      <View style={styles.upcomingMetaRow}>
        <View style={styles.badgeInfo}>
          <CalendarDays size={14} color="#6b7280" />
          <Text style={styles.badgeText}>{item.next}</Text>
        </View>
        <View style={styles.badgeInfo}>
          <CreditCard size={14} color="#6b7280" />
          <Text style={styles.badgeText}>{item.price}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default UpcomingCard;