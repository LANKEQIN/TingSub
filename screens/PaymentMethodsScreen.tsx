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
import { getVariableValue } from '@tamagui/core'
import tamaguiConfig from '../tamagui.config'

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
                <Text style={{ color: getVariableValue(tamaguiConfig.tokens.color.danger) }}>{t('common.delete')}</Text>
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
  const isDark = scheme === 'dark'
  const c = tamaguiConfig.tokens.color
  const s = tamaguiConfig.tokens.space
  const r = tamaguiConfig.tokens.radius
  const v = getVariableValue
  const colors = {
    background: v(isDark ? c.bgPageDark : c.bgPageLight),
    card: v(isDark ? c.cardBgDark : c.cardBgLight),
    textPrimary: v(isDark ? c.textPrimaryDark : c.textPrimaryLight),
    muted: v(isDark ? c.mutedDark : c.mutedLight),
    border: v(isDark ? c.borderDark : c.borderLight),
    accent: v(isDark ? c.accentDark : c.accentLight),
    inputBg: v(isDark ? c.modalBgDark : c.modalBgLight),
    white: v(c.white),
  }
  const sheet = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background as string },
    scroll: { paddingHorizontal: v(s[4]) as number, paddingVertical: v(s[4]) as number },
    title: { fontSize: 20, fontWeight: '600', color: colors.textPrimary as string, marginBottom: v(s[3]) as number },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary as string, marginBottom: v(s[2]) as number },
    card: { backgroundColor: colors.card as string, borderColor: colors.border as string, borderWidth: 1, borderRadius: v(r[3]) as number, padding: v(s[3]) as number },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: v(s[2]) as number } as any,
    inputRow: { marginTop: v(s[2]) as number },
    label: { fontSize: 14, color: colors.textPrimary as string, marginBottom: v(s[2]) as number },
    input: { backgroundColor: colors.inputBg as string, borderColor: colors.border as string, borderWidth: 1, borderRadius: v(r[2]) as number, paddingHorizontal: v(s[3]) as number, paddingVertical: v(s[3]) as number },
    selectItem: { borderColor: colors.border as string, borderWidth: 1, borderRadius: v(r[7]) as number, paddingHorizontal: v(s[3]) as number, paddingVertical: v(s[2]) as number },
    selectItemActive: { backgroundColor: colors.accent as string },
    selectText: { fontSize: 12, color: colors.textPrimary as string },
    selectTextActive: { color: colors.white as string },
    btn: { marginTop: v(s[3]) as number, backgroundColor: colors.accent as string, borderRadius: v(r[2]) as number, paddingVertical: v(s[3]) as number, alignItems: 'center' },
    btnText: { color: colors.white as string, fontWeight: '600' },
    methodRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card as string, borderColor: colors.border as string, borderWidth: 1, borderRadius: v(r[3]) as number, paddingHorizontal: v(s[3]) as number, paddingVertical: v(s[3]) as number },
    methodTitle: { fontSize: 14, color: colors.textPrimary as string },
    methodSub: { fontSize: 12, color: colors.muted as string },
  })
  return { ...sheet, colors }
}

export default PaymentMethodsScreen