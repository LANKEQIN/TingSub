import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../lib/navigation';
import { ThemeContext } from '../lib/theme';
import { I18nContext } from '../lib/i18n';
import { useAppDispatch, useAppSelector } from '../store';
import { selectPreferredCurrency, setPreferredCurrency } from '../features/currency/slice';

type SettingsScreenProps = {
  route: RouteProp<RootStackParamList, 'Settings'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

type OptionProps = {
  active: boolean;
  label: string;
  onPress: () => void;
};

const Option: React.FC<OptionProps> = ({ active, label, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.option, active ? styles.optionActive : null]}>
    <Text style={[styles.optionText, active ? styles.optionTextActive : null]}>{label}</Text>
  </TouchableOpacity>
);

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { effectiveScheme } = useContext(ThemeContext);
  const { t, setLocale, locale } = useContext(I18nContext);
  const isDark = effectiveScheme === 'dark';
  const dispatch = useAppDispatch();
  const preferredCurrency = useAppSelector(selectPreferredCurrency);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 32, backgroundColor: isDark ? '#0F1416' : '#F8FAFC' }]}> 
      <Text style={[styles.title, { color: isDark ? '#E5E7EB' : '#111827' }]}>{t('settings.title')}</Text>

      <Text style={[styles.sectionTitle, { color: isDark ? '#E5E7EB' : '#111827' }]}>{t('theme.currencyPref')}</Text>
      <View style={styles.row as any}>
        <Option label="人民币（CNY）" active={preferredCurrency === 'CNY'} onPress={() => dispatch(setPreferredCurrency('CNY'))} />
        <Option label="美元（USD）" active={preferredCurrency === 'USD'} onPress={() => dispatch(setPreferredCurrency('USD'))} />
        <Option label="日元（JPY）" active={preferredCurrency === 'JPY'} onPress={() => dispatch(setPreferredCurrency('JPY'))} />
      </View>

      <Text style={[styles.sectionTitle, { color: isDark ? '#E5E7EB' : '#111827', marginTop: 24 }]}>语言</Text>
      <View style={styles.row as any}>
        <Option label={t('settings.lang.zh')} active={locale === 'zh'} onPress={() => setLocale('zh')} />
        <Option label={t('settings.lang.en')} active={locale === 'en'} onPress={() => setLocale('en')} />
      </View>

      <TouchableOpacity
        style={[styles.navItem, { borderColor: isDark ? '#1f2937' : '#E5E7EB', backgroundColor: isDark ? '#111827' : '#FFFFFF', borderRadius: 14 }]}
        onPress={() => navigation.navigate('PaymentMethods')}
      >
        <Text style={{ fontSize: 16, fontWeight: '600', color: isDark ? '#E5E7EB' : '#111827' }}>{t('nav.paymentMethods')}</Text>
        <Text style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#6b7280', marginTop: 4 }}>{t('paymentMethods.list')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', alignSelf: 'flex-start', marginLeft: '5%', marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12 },
  option: { paddingVertical: 16, paddingHorizontal: 22, borderRadius: 16, backgroundColor: '#EAEAEA', borderWidth: 1, borderColor: '#E5E7EB' },
  optionActive: { backgroundColor: '#CFE8E8', borderWidth: 1, borderColor: '#227A7A' },
  optionText: { fontSize: 16, color: '#374151' },
  optionTextActive: { color: '#0f766e', fontWeight: '700' },
  navItem: { marginTop: 24, width: '90%', alignSelf: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 },
});

export default SettingsScreen;