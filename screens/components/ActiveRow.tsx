import React from 'react';
import { View, TouchableOpacity, StyleSheet, type ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'tamagui';
import { Apple as AppleIcon, Video, BarChart3, Zap, Globe, Gamepad2 } from '@tamagui/lucide-icons';
import tamaguiConfig from '../../tamagui.config';
import { getVariableValue } from '@tamagui/core';

type ActiveRowProps = {
  item: { id: string; name: string; price: string; next: string }
  index: number
  onLongPress?: () => void
  styles: any
}

const ActiveRow: React.FC<ActiveRowProps> = ({ item, index, onLongPress, styles }) => {
  const c = tamaguiConfig.tokens.color;
  const isDark = styles?.colors?.textPrimary === '#E5E7EB';
  
  const iconMap: Record<string, any> = {
    'am': AppleIcon,
    'ytp': Video,
    'netflix': Video,
    'spotify': Globe,
    'game': Gamepad2,
  };
  
  const IconComponent = iconMap[item.id] || BarChart3;
  
  const accentColors: readonly [ColorValue, ColorValue, ...ColorValue[]][] = [
    [getVariableValue(c.cardAccent1), getVariableValue(c.cardAccent2)],
    [getVariableValue(c.cardAccent3), getVariableValue(c.cardAccent4)],
    [getVariableValue(c.cardAccent5), getVariableValue(c.cardAccent1)],
    [getVariableValue(c.gradientCardStart), getVariableValue(c.gradientCardEnd)],
  ];
  
  const gradientColors = accentColors[index % accentColors.length];

  return (
    <TouchableOpacity 
      style={[styles.activeRow, rowStyles.row]} 
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={rowStyles.iconGradient}
      >
        <IconComponent size={20} color="#FFFFFF" />
      </LinearGradient>
      
      <View style={rowStyles.content}>
        <Text style={styles.activeName}>{item.name}</Text>
        <Text style={styles.activeHint}>{item.price}</Text>
      </View>
      
      <View style={[rowStyles.nextBadge, { backgroundColor: getVariableValue(isDark ? c.iconBgDark : c.iconBgLight) }]}>
        <Zap size={12} color={getVariableValue(isDark ? c.accentDark : c.accentLight)} />
        <Text style={[styles.activeNext, rowStyles.nextText]}>{item.next}</Text>
      </View>
    </TouchableOpacity>
  );
};

const rowStyles = StyleSheet.create({
  row: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconGradient: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  nextBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  nextText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default ActiveRow;
