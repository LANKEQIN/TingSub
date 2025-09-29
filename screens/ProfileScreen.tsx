import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootStackParamList, TabParamList } from '../lib/navigation';
import { ThemeContext } from '../lib/theme';

type ProfileScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Profile'>,
    NativeStackNavigationProp<RootStackParamList>
  >
}

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const insets = useSafeAreaInsets();
  const { effectiveScheme } = useContext(ThemeContext);
  const styles = createStyles(effectiveScheme);
  return (
    <View style={[styles.container, { paddingTop: insets.top + 32 }]}>
      <Text style={styles.title}>我的</Text>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Theme')}>
        <Text style={styles.itemText}>主题</Text>
        <Text style={styles.itemSub}>设置深色模式，调整色彩</Text>
      </TouchableOpacity>
    </View>
  );
};

function createStyles(scheme: 'light' | 'dark'){
  const isDark = scheme === 'dark';
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 32,
      backgroundColor: isDark ? '#0F1416' : '#FFFFFF',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: isDark ? '#E5E7EB' : '#111827',
    },
    item: {
      width: '90%',
      backgroundColor: isDark ? '#1C1F24' : '#F5F5F7',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#2A2E33' : 'transparent',
    },
    itemText: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 6,
      color: isDark ? '#E5E7EB' : '#111827',
    },
    itemSub: {
      color: isDark ? '#A7B0B8' : '#6b7280',
    },
  });
}

export default ProfileScreen;