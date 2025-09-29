import React from 'react';
import { View } from 'react-native';
import { Text } from 'tamagui';

const SummaryCard = ({ title, value, sub, styles }) => (
  <View style={styles.summaryCard}>
    <Text style={styles.summaryTitle}>{title}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
    {sub ? <Text style={styles.summarySub}>{sub}</Text> : null}
  </View>
);

export default SummaryCard;