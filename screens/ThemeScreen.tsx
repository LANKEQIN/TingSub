import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';
import { ThemeContext } from '../lib/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../lib/navigation';

type OptionProps = {
  active: boolean;
  label: string;
  onPress: () => void;
};

const Option: React.FC<OptionProps> = ({ active, label, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.option, active ? styles.optionActive : null]}
  >
    <Text style={[styles.optionText, active ? styles.optionTextActive : null]}>{label}</Text>
  </TouchableOpacity>
);

type ThemeScreenProps = {
  route: RouteProp<RootStackParamList, 'Theme'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Theme'>;
};

const ThemeScreen: React.FC<ThemeScreenProps> = ({}) => {
  const { themeMode, setThemeMode, effectiveScheme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      effectiveScheme === 'dark' ? styles.containerDark : styles.containerLight,
      { paddingTop: insets.top + 32 }
    ]}>
      <Text style={styles.title}>主题模式</Text>
      <View style={styles.row}>
        <Option label="自动" active={themeMode === 'auto'} onPress={() => setThemeMode('auto')} />
        <Option label="浅色" active={themeMode === 'light'} onPress={() => setThemeMode('light')} />
        <Option label="深色" active={themeMode === 'dark'} onPress={() => setThemeMode('dark')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 32 },
  containerLight: { backgroundColor: '#F7FAFA' },
  containerDark: { backgroundColor: '#0F1416' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 24 },
  // gap 在 RN 类型中不一定存在，这里做类型断言避免 TS 报错
  row: { flexDirection: 'row', gap: 12 } as any,
  option: {
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: 16,
    backgroundColor: '#EAEAEA',
  },
  optionActive: { backgroundColor: '#CFE8E8', borderWidth: 1, borderColor: '#227A7A' },
  optionText: { fontSize: 16, color: '#374151' },
  optionTextActive: { color: '#0f766e', fontWeight: '700' },
});

export default ThemeScreen;