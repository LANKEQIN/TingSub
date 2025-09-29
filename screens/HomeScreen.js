import React from 'react';
import { View, Button } from 'react-native';
import { Text } from 'tamagui';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text fontSize={24} marginBottom={20}>首页</Text>
      <Button
        title="前往详情页"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
};

export default HomeScreen;