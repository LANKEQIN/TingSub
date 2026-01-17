import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EditCategoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>编辑分类</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

export default EditCategoryScreen;
