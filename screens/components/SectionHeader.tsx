import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';

type SectionHeaderProps = {
  title: string
  actionText?: string
  onPress?: () => void
  styles: any
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionText, onPress, styles }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {actionText ? (
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.link}>{actionText}</Text>
      </TouchableOpacity>
    ) : (
      <View />
    )}
  </View>
);

export default SectionHeader;