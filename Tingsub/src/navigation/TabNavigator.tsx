import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { ROUTE_NAMES, getRouteTitle } from '../constants/routes';
import type { TabParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import SubscriptionListScreen from '../screens/SubscriptionListScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap;

          switch (route.name) {
            case ROUTE_NAMES.HOME:
              iconName = 'home';
              break;
            case ROUTE_NAMES.SUBSCRIPTIONS:
              iconName = 'subscriptions';
              break;
            case ROUTE_NAMES.STATISTICS:
              iconName = 'bar-chart';
              break;
            case ROUTE_NAMES.PROFILE:
              iconName = 'person';
              break;
            default:
              iconName = 'home';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#9ACFFF',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name={ROUTE_NAMES.HOME}
        component={HomeScreen}
        options={{ title: getRouteTitle(ROUTE_NAMES.HOME) }}
      />
      <Tab.Screen
        name={ROUTE_NAMES.SUBSCRIPTIONS}
        component={SubscriptionListScreen}
        options={{ title: getRouteTitle(ROUTE_NAMES.SUBSCRIPTIONS) }}
      />
      <Tab.Screen
        name={ROUTE_NAMES.STATISTICS}
        component={StatisticsScreen}
        options={{ title: getRouteTitle(ROUTE_NAMES.STATISTICS) }}
      />
      <Tab.Screen
        name={ROUTE_NAMES.PROFILE}
        component={ProfileScreen}
        options={{ title: getRouteTitle(ROUTE_NAMES.PROFILE) }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
