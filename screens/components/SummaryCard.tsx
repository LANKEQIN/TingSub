import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'tamagui';
import { TrendingUp, Wallet, Calendar, DollarSign } from '@tamagui/lucide-icons';
import tamaguiConfig from '../../tamagui.config';
import { getVariableValue } from '@tamagui/core';

type SummaryCardProps = {
  title: string
  value: string | number
  sub?: string
  styles: any
  index?: number
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, sub, styles, index = 0 }) => {
  const c = tamaguiConfig.tokens.color;
  const isDark = styles?.colors?.textPrimary === '#E5E7EB';
  
  const accentColors = [
    [getVariableValue(c.gradientCardStart), getVariableValue(c.gradientCardEnd)],
    [getVariableValue(c.cardAccent1), getVariableValue(c.cardAccent2)],
    [getVariableValue(c.cardAccent3), getVariableValue(c.cardAccent4)],
    [getVariableValue(c.cardAccent5), getVariableValue(c.cardAccent1)],
  ];
  
  const icons = [TrendingUp, Wallet, Calendar, DollarSign];
  const IconComponent = icons[index % icons.length];
  const gradientColors = accentColors[index % accentColors.length] as unknown as readonly [string, string];

  return (
    <View style={cardStyles.container}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={cardStyles.iconGradient}
      >
        <IconComponent size={20} color="#FFFFFF" />
      </LinearGradient>
      <View style={cardStyles.content}>
        <Text style={styles.summaryTitle}>{title}</Text>
        <Text style={styles.summaryValue}>{value}</Text>
        {sub ? <Text style={styles.summarySub}>{sub}</Text> : null}
      </View>
    </View>
  );
};

const cardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconGradient: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flex: 1,
  },
});

export default SummaryCard;
