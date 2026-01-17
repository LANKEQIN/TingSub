import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider, useThemeContext } from './src/contexts/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

const AppContent: React.FC = () => {
  const { currentTheme, isDark } = useThemeContext();

  return (
    <PaperProvider theme={currentTheme}>
      <AppNavigator />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </PaperProvider>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
