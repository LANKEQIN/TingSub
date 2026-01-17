import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTE_NAMES, getRouteTitle } from '../constants/routes';
import type { RootStackParamList } from './types';
import TabNavigator from './TabNavigator';
import SubscriptionDetailScreen from '../screens/SubscriptionDetailScreen';
import AddSubscriptionScreen from '../screens/AddSubscriptionScreen';
import EditSubscriptionScreen from '../screens/EditSubscriptionScreen';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';
import AddCategoryScreen from '../screens/AddCategoryScreen';
import EditCategoryScreen from '../screens/EditCategoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTE_NAMES.MAIN_TABS}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#1A1A1A',
        },
        headerTintColor: '#1A1A1A',
      }}
    >
      <Stack.Screen
        name={ROUTE_NAMES.MAIN_TABS}
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.SUBSCRIPTION_DETAIL}
        component={SubscriptionDetailScreen}
        options={{ title: getRouteTitle(ROUTE_NAMES.SUBSCRIPTION_DETAIL) }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.ADD_SUBSCRIPTION}
        component={AddSubscriptionScreen}
        options={{ title: getRouteTitle(ROUTE_NAMES.ADD_SUBSCRIPTION) }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.EDIT_SUBSCRIPTION}
        component={EditSubscriptionScreen}
        options={{ title: getRouteTitle(ROUTE_NAMES.EDIT_SUBSCRIPTION) }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.CATEGORY_DETAIL}
        component={CategoryDetailScreen}
        options={{ title: getRouteTitle(ROUTE_NAMES.CATEGORY_DETAIL) }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.ADD_CATEGORY}
        component={AddCategoryScreen}
        options={{ title: getRouteTitle(ROUTE_NAMES.ADD_CATEGORY) }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.EDIT_CATEGORY}
        component={EditCategoryScreen}
        options={{ title: getRouteTitle(ROUTE_NAMES.EDIT_CATEGORY) }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.SETTINGS}
        component={SettingsScreen}
        options={{ title: getRouteTitle(ROUTE_NAMES.SETTINGS) }}
      />
      <Stack.Screen
        name={ROUTE_NAMES.SEARCH}
        component={SearchScreen}
        options={{ title: getRouteTitle(ROUTE_NAMES.SEARCH) }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
