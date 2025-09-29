import React, { useMemo, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from './tamagui.config';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { Home, BarChart3, Bell, User } from '@tamagui/lucide-icons';
import HomeScreen from './screens/HomeScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import ThemeScreen from './screens/ThemeScreen';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'

export const ThemeContext = React.createContext({
  themeMode: 'auto',
  setThemeMode: (m) => {},
  effectiveScheme: 'light',
});

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs({ effectiveScheme }) {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
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
        tabBarActiveTintColor: effectiveScheme === 'dark' ? '#4DB6FF' : '#007AFF',
        tabBarInactiveTintColor: effectiveScheme === 'dark' ? '#B0B0B8' : '#8E8E93',
        tabBarStyle: {
          backgroundColor: effectiveScheme === 'dark' ? '#121212' : '#FFFFFF',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: effectiveScheme === 'dark' ? '#000' : '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          paddingBottom: Math.max(8, insets.bottom),
          paddingTop: 8,
          height: 70 + insets.bottom,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500', marginTop: 4 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '主页', tabBarLabel: '主页' }} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} options={{ title: '统计', tabBarLabel: '统计' }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ title: '通知', tabBarLabel: '通知' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: '我的', tabBarLabel: '我的' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('auto'); // 'auto' | 'light' | 'dark'
  const effectiveScheme = useMemo(() => (themeMode === 'auto' ? (systemScheme ?? 'light') : themeMode), [themeMode, systemScheme]);

  const navigationTheme = effectiveScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, effectiveScheme }}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={effectiveScheme}>
        <SafeAreaProvider>
          <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator>
              <Stack.Screen name="Tabs" options={{ headerShown: false }}>
                {() => <MainTabs effectiveScheme={effectiveScheme} />}
              </Stack.Screen>
              <Stack.Screen name="Theme" component={ThemeScreen} options={{ title: '主题' }} />
            </Stack.Navigator>
            <StatusBar style="auto" />
          </NavigationContainer>
        </SafeAreaProvider>
      </TamaguiProvider>
    </ThemeContext.Provider>
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