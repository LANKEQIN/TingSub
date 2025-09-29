import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';
import { ThemeContext } from '../App';

const Option = ({ active, label, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.option, active ? styles.optionActive : null]}
  >
    <Text style={[styles.optionText, active ? styles.optionTextActive : null]}>{label}</Text>
  </TouchableOpacity>
);

const ThemeScreen = () => {
  const { themeMode, setThemeMode, effectiveScheme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, effectiveScheme === 'dark' ? styles.containerDark : styles.containerLight]}>
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
  row: { flexDirection: 'row', gap: 12 },
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