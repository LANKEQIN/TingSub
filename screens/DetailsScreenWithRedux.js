import React from 'react';
import { View, Button } from 'react-native';
import { Text } from 'tamagui';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';

const DetailsScreenWithRedux = ({ navigation }) => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text fontSize={24} marginBottom={20}>详情页</Text>
      <Text fontSize={18} marginBottom={20}>计数器: {count}</Text>
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <Button
          title="增加"
          onPress={() => dispatch({ type: 'counter/increment' })}
        />
        <Button
          title="减少"
          onPress={() => dispatch({ type: 'counter/decrement' })}
        />
      </View>
      <Button
        title="返回首页"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default DetailsScreenWithRedux;