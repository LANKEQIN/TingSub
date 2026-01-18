import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTE_NAMES } from '../constants/routes';
import type { RootStackParamList } from './types';
import StackNavigator from './StackNavigator';
import OnboardingScreen from '../screens/OnboardingScreen';

const AppStack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        initialRouteName={ROUTE_NAMES.ONBOARDING}
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <AppStack.Screen name={ROUTE_NAMES.ONBOARDING} component={OnboardingScreen} />
        <AppStack.Screen name={ROUTE_NAMES.MAIN_TABS} component={StackNavigator} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
