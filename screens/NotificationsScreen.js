import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeContext } from '../App';

const NotificationsScreen = () => {
  const insets = useSafeAreaInsets();
  const { effectiveScheme } = useContext(ThemeContext);
  const styles = createStyles(effectiveScheme);
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>通知</Text>
      <Text style={styles.text}>这是通知页面内容</Text>
    </View>
  );
};

function createStyles(scheme){
  const isDark = scheme === 'dark';
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#0F1416' : '#FFFFFF',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: isDark ? '#E5E7EB' : '#111827',
    },
    text: {
      color: isDark ? '#A7B0B8' : '#111827',
    }
  })
}

export default NotificationsScreen;