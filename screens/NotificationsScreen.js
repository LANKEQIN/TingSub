import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'tamagui';

const NotificationsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>通知</Text>
      <Text>这是通知页面内容</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default NotificationsScreen;