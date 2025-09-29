import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from './tamagui.config';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, BarChart3, Bell, User } from '@tamagui/lucide-icons';
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
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let IconComponent;
              
              if (route.name === 'Home') {
                IconComponent = Home;
              } else if (route.name === 'Statistics') {
                IconComponent = BarChart3;
              } else if (route.name === 'Notifications') {
                IconComponent = Bell;
              } else if (route.name === 'Profile') {
                IconComponent = User;
              }
              
              return <IconComponent size={size} color={color} />;
            },
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 0,
              elevation: 20,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              paddingBottom: 8,
              paddingTop: 8,
              height: 70,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
              marginTop: 4,
            },
            headerShown: false,
          })}
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