import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';

const SectionHeader = ({ title, actionText, onPress, styles }) => (
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