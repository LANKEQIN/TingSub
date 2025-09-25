import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import SplashScreen from '../components/SplashScreen';

// 创建一个简单的主页组件
function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>欢迎来到汀阅(TingSub)!</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ title: '汀阅 - TingSub', headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: '汀阅' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}