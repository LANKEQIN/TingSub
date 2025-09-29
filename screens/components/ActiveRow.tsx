import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';
import { Apple as AppleIcon, Video, BarChart3 } from '@tamagui/lucide-icons';

type ActiveRowProps = {
  item: { id: string; name: string; price: string; next: string }
  index: number
  onLongPress?: () => void
  styles: any
}

const ActiveRow: React.FC<ActiveRowProps> = ({ item, index, onLongPress, styles }) => (
  <TouchableOpacity style={styles.activeRow} onLongPress={onLongPress}>
    <View style={styles.activeIconBox}>
      {item.id === 'am' ? (
        <AppleIcon size={18} color={styles.colors?.textPrimary || '#111827'} />
      ) : item.id === 'ytp' ? (
        <Video size={18} color={styles.colors?.textPrimary || '#111827'} />
      ) : (
        <BarChart3 size={18} color={styles.colors?.textPrimary || '#111827'} />
      )}
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.activeName}>{item.name}</Text>
      <Text style={styles.activeHint}>{item.price}</Text>
    </View>
    <Text style={styles.activeNext}>{item.next}</Text>
  </TouchableOpacity>
);

export default ActiveRow;