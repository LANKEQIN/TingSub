import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: NavigatorScreenParams<TabParamList>;
  SubscriptionDetail: { id: string };
  AddSubscription: undefined;
  EditSubscription: { id: string };
  Categories: undefined;
  CategoryDetail: { id: string };
  AddCategory: undefined;
  EditCategory: { id: string };
  Settings: undefined;
  Search: { query?: string };
};

export type TabParamList = {
  Home: undefined;
  Subscriptions: undefined;
  Statistics: undefined;
  Profile: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type TabScreenProps<T extends keyof TabParamList> = BottomTabScreenProps<TabParamList, T>;
