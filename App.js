import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from './tamagui.config';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: {
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            }
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ 
              title: '主页',
              tabBarLabel: '主页'
            }} 
          />
          <Tab.Screen 
            name="Statistics" 
            component={StatisticsScreen} 
            options={{ 
              title: '统计',
              tabBarLabel: '统计'
            }} 
          />
          <Tab.Screen 
            name="Notifications" 
            component={NotificationsScreen} 
            options={{ 
              title: '通知',
              tabBarLabel: '通知'
            }} 
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{ 
              title: '我的',
              tabBarLabel: '我的'
            }} 
          />
        </Tab.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </TamaguiProvider>
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