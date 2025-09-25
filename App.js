import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './store';
import Navigation from './navigation';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from './tamagui.config';
import { useFonts } from 'expo-font';

export default function App() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(() => {
    if (loaded) {
      setAppLoaded(true);
    }
  }, [loaded]);

  if (!appLoaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <Provider store={store}>
        <Navigation />
        <StatusBar style="auto" />
      </Provider>
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