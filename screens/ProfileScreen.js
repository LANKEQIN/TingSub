import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';

const ProfileScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>我的</Text>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Theme')}>
        <Text style={styles.itemText}>主题</Text>
        <Text style={styles.itemSub}>设置深色模式，调整色彩</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    width: '90%',
    backgroundColor: '#F5F5F7',
    padding: 16,
    borderRadius: 12,
  },
  itemText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  itemSub: {
    color: '#6b7280',
  },
});

export default ProfileScreen;