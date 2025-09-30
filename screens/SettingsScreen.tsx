import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, Platform } from 'react-native';
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
import { buildJSONPayload, exportJSON, exportSubscriptionsCSV, parseImportJSON } from '../lib/dataTransfer'
import { selectSubscriptions } from '../features/subscriptions/selectors'
import { selectPaymentMethods } from '../features/payment_methods/selectors'
import { setSubscriptions } from '../features/subscriptions/slice'
import { setPaymentMethods } from '../features/payment_methods/slice'
import { selectDisplaySize, selectDisplayScale } from '../features/ui/selectors'
import { setDisplaySize } from '../features/ui/slice'

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
  const subscriptions = useAppSelector(selectSubscriptions)
  const paymentMethods = useAppSelector(selectPaymentMethods)
  const displaySize = useAppSelector(selectDisplaySize)
  const scale = useAppSelector(selectDisplayScale)
  const styles = createStyles(effectiveScheme, scale);
  const [importOpen, setImportOpen] = useState(false)
  const [importText, setImportText] = useState('')

  return (
    <View style={[styles.container, { paddingTop: insets.top + 32 }]}> 
      <Text style={styles.title}>{t('settings.title')}</Text>

      <Text style={styles.sectionTitle}>{t('theme.currencyPref')}</Text>
      <View style={styles.row as any}>
        <Option styles={styles} label="人民币（CNY）" active={preferredCurrency === 'CNY'} onPress={() => dispatch(setPreferredCurrency('CNY'))} />
        <Option styles={styles} label="美元（USD）" active={preferredCurrency === 'USD'} onPress={() => dispatch(setPreferredCurrency('USD'))} />
        <Option styles={styles} label="日元（JPY）" active={preferredCurrency === 'JPY'} onPress={() => dispatch(setPreferredCurrency('JPY'))} />
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 24 * scale }]}>语言</Text>
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

      <Text style={[styles.sectionTitle, { marginTop: 24 * scale }]}>{t('settings_data.title', { defaultValue: '数据导出与导入' })}</Text>
      <View style={styles.row as any}>
        <Option
          styles={styles}
          label={t('settings_data.exportJson', { defaultValue: '导出 JSON' })}
          active={false}
          onPress={async () => {
            const payload = buildJSONPayload({ subscriptions, paymentMethods, currency: preferredCurrency as any })
            const ok = await exportJSON(payload)
            if (Platform.OS !== 'web') Alert.alert(ok ? '已共享' : '失败', ok ? '已唤起系统分享' : '分享失败')
          }}
        />
        <Option
          styles={styles}
          label={t('settings_data.exportCsv', { defaultValue: '导出 CSV' })}
          active={false}
          onPress={async () => {
            const ok = await exportSubscriptionsCSV(subscriptions)
            if (Platform.OS !== 'web') Alert.alert(ok ? '已共享' : '失败', ok ? '已唤起系统分享' : '分享失败')
          }}
        />
        <Option
          styles={styles}
          label={t('settings_data.importJson', { defaultValue: '导入 JSON' })}
          active={false}
          onPress={() => setImportOpen(true)}
        />
      </View>

      <Modal visible={importOpen} animationType="slide" onRequestClose={() => setImportOpen(false)}>
        <View style={[styles.container, { paddingTop: insets.top + 16 }]}> 
          <Text style={styles.sectionTitle}>{t('settings_data.importJson', { defaultValue: '导入 JSON' })}</Text>
          <TextInput
            style={{ width: '90%', minHeight: 160, borderWidth: 1, borderColor: isDark ? '#374151' : '#D1D5DB', borderRadius: UI.radius.md, padding: UI.space.md, color: isDark ? '#E5E7EB' : '#111827' }}
            multiline
            placeholder="粘贴 JSON 数据"
            placeholderTextColor={isDark ? '#6b7280' : '#9CA3AF'}
            value={importText}
            onChangeText={setImportText}
          />
          <View style={[styles.row as any, { marginTop: 16 * scale }]}> 
            <Option styles={styles} label={t('settings_data.cancel', { defaultValue: '取消' })} active={false} onPress={() => setImportOpen(false)} />
            <Option styles={styles} label={t('settings_data.confirmImport', { defaultValue: '确认导入' })} active={false} onPress={() => {
              const parsed = parseImportJSON(importText)
              if (!parsed) { Alert.alert('格式错误', '请检查 JSON 格式'); return }
              if (parsed.subscriptions) dispatch(setSubscriptions(parsed.subscriptions as any))
              if (parsed.paymentMethods) dispatch(setPaymentMethods(parsed.paymentMethods as any))
              if (parsed.currency) dispatch(setPreferredCurrency(parsed.currency as any))
              setImportOpen(false)
              setImportText('')
              Alert.alert('已导入', '数据已写入本地存储')
            }} />
          </View>
        </View>
      </Modal>

      <Text style={[styles.sectionTitle, { marginTop: 24 * scale }]}>显示大小</Text>
      <View style={styles.row as any}>
        <Option styles={styles} label="普通" active={displaySize === 'normal'} onPress={() => dispatch(setDisplaySize('normal'))} />
        <Option styles={styles} label="大号" active={displaySize === 'large'} onPress={() => dispatch(setDisplaySize('large'))} />
      </View>
    </View>
  );
};

function createStyles(scheme: 'light' | 'dark', scale: number){
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
    title: { fontSize: 24 * scale, fontWeight: '700', marginBottom: 20 * scale, color: colors.textPrimary as string },
    sectionTitle: { fontSize: 18 * scale, fontWeight: '700', alignSelf: 'flex-start', marginLeft: '5%', marginBottom: 12 * scale, color: colors.textPrimary as string },
    row: { flexDirection: 'row', gap: UI.space.sm * scale },
    option: { paddingVertical: UI.space.md * scale, paddingHorizontal: 22 * scale, borderRadius: UI.radius.xl, backgroundColor: gv(c.gray3) as string, borderWidth: 1, borderColor: colors.border as string },
    optionActive: { backgroundColor: isDark ? gv(c.iconBgDark) as string : gv(c.iconBgLight) as string, borderWidth: 1, borderColor: colors.accent as string },
    optionText: { fontSize: 16 * scale, color: colors.textSecondary as string },
    optionTextActive: { color: colors.accent as string, fontWeight: '700' },
    navItem: { marginTop: 24 * scale, width: '90%', alignSelf: 'center', borderWidth: 1, borderRadius: UI.radius.md, paddingHorizontal: UI.space.md * scale, paddingVertical: UI.space.md * scale },
  })
}

const Option: React.FC<OptionProps> = ({ active, label, onPress, styles }) => (
  <TouchableOpacity onPress={onPress} style={[styles.option, active ? styles.optionActive : null]}>
    <Text style={[styles.optionText, active ? styles.optionTextActive : null]}>{label}</Text>
  </TouchableOpacity>
);

export default SettingsScreen;