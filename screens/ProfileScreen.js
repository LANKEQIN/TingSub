import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'tamagui';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>我的</Text>
      <Text>这是个人资料页面内容</Text>
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

export default ProfileScreen;