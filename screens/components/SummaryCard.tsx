import React from 'react';
import { View } from 'react-native';
import { Text } from 'tamagui';

type SummaryCardProps = {
  title: string
  value: string | number
  sub?: string
  styles: any
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, sub, styles }) => (
  <View style={styles.summaryCard}>
    <Text style={styles.summaryTitle}>{title}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
    {sub ? <Text style={styles.summarySub}>{sub}</Text> : null}
  </View>
);

export default SummaryCard;