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
import { getVariableValue } from '@tamagui/core';
import tamaguiConfig from '../tamagui.config';
import { UI } from '../lib/ui';

type SettingsScreenProps = {
  route: RouteProp<RootStackParamList, 'Settings'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

type OptionProps = {
  active: boolean;
  label: string;
  onPress: () => void;
  styles: any;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { effectiveScheme } = useContext(ThemeContext);
  const { t, setLocale, locale } = useContext(I18nContext);
  const isDark = effectiveScheme === 'dark';
  const dispatch = useAppDispatch();
  const preferredCurrency = useAppSelector(selectPreferredCurrency);
  const styles = createStyles(effectiveScheme);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 32 }]}> 
      <Text style={styles.title}>{t('settings.title')}</Text>

      <Text style={styles.sectionTitle}>{t('theme.currencyPref')}</Text>
      <View style={styles.row as any}>
        <Option styles={styles} label="人民币（CNY）" active={preferredCurrency === 'CNY'} onPress={() => dispatch(setPreferredCurrency('CNY'))} />
        <Option styles={styles} label="美元（USD）" active={preferredCurrency === 'USD'} onPress={() => dispatch(setPreferredCurrency('USD'))} />
        <Option styles={styles} label="日元（JPY）" active={preferredCurrency === 'JPY'} onPress={() => dispatch(setPreferredCurrency('JPY'))} />
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>语言</Text>
      <View style={styles.row as any}>
        <Option styles={styles} label={t('settings.lang.zh')} active={locale === 'zh'} onPress={() => setLocale('zh')} />
        <Option styles={styles} label={t('settings.lang.en')} active={locale === 'en'} onPress={() => setLocale('en')} />
      </View>

      <TouchableOpacity
        style={[styles.navItem, { borderColor: isDark ? '#1f2937' : '#E5E7EB', backgroundColor: isDark ? '#111827' : '#FFFFFF', borderRadius: UI.radius.lg }]}
        onPress={() => navigation.navigate('PaymentMethods')}
      >
        <Text style={{ fontSize: 16, fontWeight: '600', color: isDark ? '#E5E7EB' : '#111827' }}>{t('nav.paymentMethods')}</Text>
        <Text style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#6b7280', marginTop: 4 }}>{t('paymentMethods.list')}</Text>
      </TouchableOpacity>
    </View>
  );
};

function createStyles(scheme: 'light' | 'dark'){
  const isDark = scheme === 'dark'
  const c = tamaguiConfig.tokens.color
  const gv = getVariableValue
  const colors = {
    pageBg: gv(isDark ? c.bgPageDark : c.bgPageLight),
    cardBg: gv(isDark ? c.cardBgDark : c.cardBgLight),
    border: gv(isDark ? c.borderDark : c.borderLight),
    textPrimary: gv(isDark ? c.textPrimaryDark : c.textPrimaryLight),
    textSecondary: gv(isDark ? c.textSecondaryDark : c.textSecondaryLight),
    muted: gv(isDark ? c.mutedDark : c.mutedLight),
    accent: gv(isDark ? c.accentDark : c.accentLight),
  }
  return StyleSheet.create({
    container: { flex: 1, alignItems: 'center', backgroundColor: colors.pageBg as string },
    title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: colors.textPrimary as string },
    sectionTitle: { fontSize: 18, fontWeight: '700', alignSelf: 'flex-start', marginLeft: '5%', marginBottom: 12, color: colors.textPrimary as string },
    row: { flexDirection: 'row', gap: UI.space.sm },
    option: { paddingVertical: UI.space.md, paddingHorizontal: 22, borderRadius: UI.radius.xl, backgroundColor: gv(c.gray3) as string, borderWidth: 1, borderColor: colors.border as string },
    optionActive: { backgroundColor: isDark ? gv(c.iconBgDark) as string : gv(c.iconBgLight) as string, borderWidth: 1, borderColor: colors.accent as string },
    optionText: { fontSize: 16, color: colors.textSecondary as string },
    optionTextActive: { color: colors.accent as string, fontWeight: '700' },
    navItem: { marginTop: 24, width: '90%', alignSelf: 'center', borderWidth: 1, borderRadius: UI.radius.md, paddingHorizontal: UI.space.md, paddingVertical: UI.space.md },
  })
}

const Option: React.FC<OptionProps> = ({ active, label, onPress, styles }) => (
  <TouchableOpacity onPress={onPress} style={[styles.option, active ? styles.optionActive : null]}>
    <Text style={[styles.optionText, active ? styles.optionTextActive : null]}>{label}</Text>
  </TouchableOpacity>
);

export default SettingsScreen;