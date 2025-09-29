import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from './tamagui.config';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreenWithRedux';
import DetailsScreen from './screens/DetailsScreenWithRedux';
import { Provider } from 'react-redux';
import { store } from './store'; // 注意：TypeScript 文件可以直接导入而无需指定扩展名

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <TamaguiProvider config={tamaguiConfig}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: '首页' }} 
            />
            <Stack.Screen 
              name="Details" 
              component={DetailsScreen} 
              options={{ title: '详情' }} 
            />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </TamaguiProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});