import React, { useContext, useMemo, useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { Text } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../lib/navigation'
import { ThemeContext } from '../lib/theme'
import { I18nContext } from '../lib/i18n'
import { useAppSelector, useAppDispatch } from '../store'
import { selectPaymentMethods } from '../features/payment_methods/selectors'
import { addPaymentMethod, removePaymentMethod, updatePaymentMethod } from '../features/payment_methods/slice'
import type { PaymentMethod } from '../features/payment_methods/types'

type PaymentMethodsScreenProps = {
  route: RouteProp<RootStackParamList, 'PaymentMethods'>
  navigation: NativeStackNavigationProp<RootStackParamList, 'PaymentMethods'>
}

const PaymentMethodsScreen: React.FC<PaymentMethodsScreenProps> = () => {
  const insets = useSafeAreaInsets()
  const { effectiveScheme } = useContext(ThemeContext)
  const { t } = useContext(I18nContext)
  const styles = createStyles(effectiveScheme)
  const dispatch = useAppDispatch()
  const methods = useAppSelector(selectPaymentMethods)

  const [form, setForm] = useState<Partial<PaymentMethod>>({ type: 'credit_card', label: '', issuer: '', holder: '', last4: '' })
  const canSubmit = useMemo(() => form.type && (form.label || form.issuer || form.holder), [form])

  const submit = () => {
    if (!canSubmit) return
    const payload: PaymentMethod = {
      id: `${Date.now()}`,
      type: form.type!,
      label: form.label?.trim() || undefined,
      issuer: form.issuer?.trim() || undefined,
      holder: form.holder?.trim() || undefined,
      last4: form.last4?.trim() || undefined,
      expiryMonth: form.expiryMonth,
      expiryYear: form.expiryYear,
      provider: form.provider?.trim() || undefined,
    }
    dispatch(addPaymentMethod(payload))
    setForm({ type: 'credit_card', label: '', issuer: '', holder: '', last4: '' })
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{t('paymentMethods.title')}</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('paymentMethods.add')}</Text>
          <View style={styles.row}>
            {(['credit_card','debit_card','bank_account','e_wallet','alipay','wechat'] as const).map((tp)=> (
              <TouchableOpacity key={tp} style={[styles.selectItem, form.type===tp?styles.selectItemActive:null]} onPress={()=>setForm(v=>({ ...v, type: tp }))}>
                <Text style={[styles.selectText, form.type===tp?styles.selectTextActive:null]}>{t(`paymentMethods.types.${tp}`)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>{t('paymentMethods.label')}</Text>
            <TextInput style={styles.input} value={form.label ?? ''} onChangeText={(tx)=>setForm(v=>({ ...v, label: tx }))} placeholder={t('paymentMethods.labelPh')} placeholderTextColor={styles.colors.muted} />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>{t('paymentMethods.issuer')}</Text>
            <TextInput style={styles.input} value={form.issuer ?? ''} onChangeText={(tx)=>setForm(v=>({ ...v, issuer: tx }))} placeholder="招商银行 / 建设银行" placeholderTextColor={styles.colors.muted} />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>{t('paymentMethods.holder')}</Text>
            <TextInput style={styles.input} value={form.holder ?? ''} onChangeText={(tx)=>setForm(v=>({ ...v, holder: tx }))} placeholder="张三 / Li Lei" placeholderTextColor={styles.colors.muted} />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>{t('paymentMethods.last4')}</Text>
            <TextInput style={styles.input} value={form.last4 ?? ''} onChangeText={(tx)=>setForm(v=>({ ...v, last4: tx }))} placeholder="1234" placeholderTextColor={styles.colors.muted} keyboardType="numeric" />
          </View>
          {form.type==='credit_card' || form.type==='debit_card' ? (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={[styles.inputRow, { flex: 1 }]}> 
                <Text style={styles.label}>{t('paymentMethods.expiryMonth')}</Text>
                <TextInput style={styles.input} value={String(form.expiryMonth ?? '')} onChangeText={(tx)=>setForm(v=>({ ...v, expiryMonth: Number(tx) || undefined }))} placeholder="12" placeholderTextColor={styles.colors.muted} keyboardType="numeric" />
              </View>
              <View style={[styles.inputRow, { flex: 1 }]}> 
                <Text style={styles.label}>{t('paymentMethods.expiryYear')}</Text>
                <TextInput style={styles.input} value={String(form.expiryYear ?? '')} onChangeText={(tx)=>setForm(v=>({ ...v, expiryYear: Number(tx) || undefined }))} placeholder="2028" placeholderTextColor={styles.colors.muted} keyboardType="numeric" />
              </View>
            </View>
          ) : null}
          {form.type==='e_wallet' ? (
            <View style={styles.inputRow}>
              <Text style={styles.label}>{t('paymentMethods.provider')}</Text>
              <TextInput style={styles.input} value={form.provider ?? ''} onChangeText={(tx)=>setForm(v=>({ ...v, provider: tx }))} placeholder="Alipay / WeChat / PayPal" placeholderTextColor={styles.colors.muted} />
            </View>
          ) : null}
          <TouchableOpacity style={[styles.btn, !canSubmit && { opacity: 0.6 }]} disabled={!canSubmit} onPress={submit}>
            <Text style={styles.btnText}>{t('paymentMethods.save')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>{t('paymentMethods.list')}</Text>
        <View style={{ gap: 8 }}>
          {methods.length === 0 ? (
            <Text style={{ color: styles.colors.muted }}>{t('paymentMethods.empty')}</Text>
          ) : methods.map((m)=> (
            <View key={m.id} style={styles.methodRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.methodTitle}>{m.label ?? `${t(`paymentMethods.types.${m.type}`)}${m.last4 ? ` ****${m.last4}` : ''}`}</Text>
                <Text style={styles.methodSub}>{[m.issuer, m.holder, m.provider].filter(Boolean).join(' · ')}</Text>
              </View>
              <TouchableOpacity onPress={()=>dispatch(removePaymentMethod(m.id))}>
                <Text style={{ color: '#ef4444' }}>{t('common.delete')}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  )
}

const createStyles = (scheme: 'light' | 'dark') => {
  const colors = scheme==='dark' ? {
    background: '#0f172a',
    card: '#111827',
    textPrimary: '#f8fafc',
    muted: '#94a3b8',
    border: '#1f2937',
    accent: '#2563eb',
  } : {
    background: '#f8fafc',
    card: '#ffffff',
    textPrimary: '#111827',
    muted: '#6b7280',
    border: '#e5e7eb',
    accent: '#2563eb',
  }
  const sheet = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingHorizontal: 16, paddingVertical: 16 },
    title: { fontSize: 20, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
    card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10, padding: 12 },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    inputRow: { marginTop: 8 },
    label: { fontSize: 14, color: colors.textPrimary, marginBottom: 6 },
    input: { backgroundColor: '#fff', borderColor: colors.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
    selectItem: { borderColor: colors.border, borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
    selectItemActive: { backgroundColor: colors.accent },
    selectText: { fontSize: 12, color: colors.textPrimary },
    selectTextActive: { color: '#fff' },
    btn: { marginTop: 12, backgroundColor: colors.accent, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: '600' },
    methodRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
    methodTitle: { fontSize: 14, color: colors.textPrimary },
    methodSub: { fontSize: 12, color: colors.muted },
  })
  return { ...sheet, colors }
}

export default PaymentMethodsScreen