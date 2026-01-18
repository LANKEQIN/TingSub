import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider, useThemeContext } from './src/contexts/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { useCustomFonts } from './src/hooks/useFonts';
import Loading from './src/components/common/Loading';

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
  const { fontsLoaded, fontError } = useCustomFonts();

  if (!fontsLoaded && !fontError) {
    return <Loading visible={true} type="screen" text="加载中..." />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
