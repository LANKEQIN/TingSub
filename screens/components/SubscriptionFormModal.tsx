import React from 'react'
import { View, TouchableOpacity, TextInput, Platform, ScrollView, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Text } from 'tamagui'
import { Check } from '@tamagui/lucide-icons'
import tamaguiConfig from '../../tamagui.config'
import { getVariableValue } from '@tamagui/core'
import type { CategoryGroup } from '../../features/subscriptions/types'
import type { Cycle, Subscription } from '../../features/subscriptions/slice'
import type { CurrencyCode } from '../../features/currency/types'

type Props = {
  visible: boolean
  editMode: boolean
  styles: any
  form: {
    name: string
    categoryGroup: CategoryGroup
    categoryId?: string
    categoryLabel: string
    price: string
    cycle: Cycle
    startISO: string
    nextDueISO: string
    autoRenew: boolean
    currency: CurrencyCode
    paymentMethodId?: string
  }
  setForm: (updater: (prev: Props['form']) => Props['form']) => void
  pricePlaceholder: string
  pricePreview: string
  preferredCurrency: CurrencyCode
  categoryGroupOptions: CategoryGroup[]
  getCategoriesByGroup: (g: CategoryGroup) => { id: string; label: string }[]
  years: number[]
  months: number[]
  days: number[]
  dateParts: { year: number; month: number; day: number }
  setDateParts: (next: { year: number; month: number; day: number }) => void
  showPicker: boolean
  setShowPicker: (b: boolean) => void
  onAndroidDateChange: (event: any, date?: Date) => void
  paymentMethods: { id: string; label: string }[]
  onSubmit: () => void
  onClose: () => void
}

const SubscriptionFormModal: React.FC<Props> = ({
  visible,
  editMode,
  styles,
  form,
  setForm,
  pricePlaceholder,
  pricePreview,
  preferredCurrency,
  categoryGroupOptions,
  getCategoriesByGroup,
  years,
  months,
  days,
  dateParts,
  setDateParts,
  showPicker,
  setShowPicker,
  onAndroidDateChange,
  paymentMethods,
  onSubmit,
  onClose,
}) => {
  if (!visible) return null
  const c = tamaguiConfig.tokens.color
  const isDark = styles?.colors?.textPrimary === '#E5E7EB'
  const pad2 = (n: number) => String(n).padStart(2, '0')
  const iso = `${dateParts.year}-${pad2(dateParts.month)}-${pad2(dateParts.day)}`

  return (
    <View style={styles.modalMask}>
      <View style={[styles.modalBox, modalStyles.box]}>
        <Text style={styles.modalTitle}>{editMode ? '编辑订阅' : '添加新订阅'}</Text>

        <ScrollView style={{ maxHeight: '100%' }} contentContainerStyle={{ paddingBottom: 8 }}>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>订阅名称</Text>
          <TextInput
            style={[styles.formInput, modalStyles.input]}
            value={form.name}
            onChangeText={(t) => setForm((v) => ({ ...v, name: t }))}
            placeholder="例如：网易云音乐VIP"
            placeholderTextColor={styles.colors.muted}
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>订阅类型</Text>
          <View style={styles.selectRow}>
            {categoryGroupOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.selectItem, form.categoryGroup === opt ? styles.selectItemActive : null, modalStyles.selectItem]}
                onPress={() => setForm((v) => ({ ...v, categoryGroup: opt, categoryId: undefined, categoryLabel: '' }))}
              >
                <Text style={[styles.selectText, form.categoryGroup === opt ? styles.selectTextActive : null]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {form.categoryGroup !== '其他' && (
            <View style={{ marginTop: 8 }}>
              <Text style={styles.formLabel}>分类标签</Text>
              <View style={styles.selectRow}>
                {getCategoriesByGroup(form.categoryGroup).map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.selectItem, form.categoryId === c.id ? styles.selectItemActive : null, modalStyles.selectItem]}
                    onPress={() => setForm((v) => ({ ...v, categoryId: c.id, categoryLabel: '' }))}
                  >
                    <Text style={[styles.selectText, form.categoryId === c.id ? styles.selectTextActive : null]}>{c.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          {form.categoryGroup === '其他' ? (
            <View style={{ marginTop: 8 }}>
              <TextInput
                style={[styles.formInput, modalStyles.input]}
                value={form.categoryLabel}
                onChangeText={(t) => setForm((v) => ({ ...v, categoryLabel: t }))}
                placeholder="自定义类型名称（例如：视频会员/健身会员等）"
                placeholderTextColor={styles.colors.muted}
              />
              <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>提示：保存时底层分类依然归为"其他"</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>价格</Text>
          <TextInput
            style={[styles.formInput, modalStyles.input]}
            keyboardType="numeric"
            value={form.price}
            onChangeText={(t) => setForm((v) => ({ ...v, price: t }))}
            placeholder={pricePlaceholder}
            placeholderTextColor={styles.colors.muted}
          />
          <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            按所选币种输入原价（{form.currency}）。当前偏好币种为 {preferredCurrency}，将自动换算展示。
          </Text>
          {!!pricePreview && <Text style={{ fontSize: 12, color: styles.colors.muted }}>预览：{pricePreview}</Text>}
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>计费周期</Text>
          <View style={styles.selectRow}>
            {(['monthly', 'quarterly', 'yearly', 'lifetime', 'other'] as Cycle[]).map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.selectItem, form.cycle === opt ? styles.selectItemActive : null, modalStyles.selectItem]}
                onPress={() => setForm((v) => ({ ...v, cycle: opt }))}
              >
                <Text style={[styles.selectText, form.cycle === opt ? styles.selectTextActive : null]}>
                  {opt === 'monthly' ? '月付' : opt === 'quarterly' ? '季付' : opt === 'yearly' ? '年付' : opt === 'lifetime' ? '终身' : '其他'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>币种</Text>
          <View style={styles.selectRow}>
            {(['CNY', 'USD', 'JPY'] as CurrencyCode[]).map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.selectItem, form.currency === opt ? styles.selectItemActive : null, modalStyles.selectItem]}
                onPress={() => setForm((v) => ({ ...v, currency: opt }))}
              >
                <Text style={[styles.selectText, form.currency === opt ? styles.selectTextActive : null]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>购入/开始日期</Text>
          {Platform.OS === 'web' && (
            <View style={{ marginTop: 8 }}>
              <input
                type="date"
                value={form.startISO || ''}
                onChange={(e: any) => {
                  const v = e.target?.value
                  if (!v) return
                  setForm((prev: any) => ({ ...prev, startISO: v }))
                }}
              />
            </View>
          )}
          {Platform.OS !== 'web' && (
            <View style={{ marginTop: 8 }}>
              <TextInput
                style={[styles.formInput, modalStyles.input]}
                value={form.startISO}
                onChangeText={(t) => setForm((v) => ({ ...v, startISO: t }))}
                placeholder="例如：2025-02-15"
                placeholderTextColor={styles.colors.muted}
              />
              <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>格式：YYYY-MM-DD</Text>
            </View>
          )}
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>下次扣费日期</Text>
          {Platform.OS === 'web' && (
            <View style={{ marginTop: 8 }}>
              <input
                type="date"
                value={iso}
                onChange={(e: any) => {
                  const v = e.target?.value
                  if (!v) return
                  setForm((prev: any) => ({ ...prev, nextDueISO: v }))
                  const d = new Date(v)
                  setDateParts({ year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() })
                }}
              />
            </View>
          )}
          {Platform.OS !== 'web' && (
            <View style={{ marginTop: 8 }}>
              <TouchableOpacity onPress={() => setShowPicker(true)} activeOpacity={0.8}>
                <LinearGradient
                  colors={[getVariableValue(c.gradientStart), getVariableValue(c.gradientEnd)]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={modalStyles.dateButton}
                >
                  <Text style={modalStyles.dateButtonText}>选择日期</Text>
                </LinearGradient>
              </TouchableOpacity>
              {showPicker && <DateTimePicker value={new Date(iso)} mode="date" display="default" onChange={onAndroidDateChange} />}
            </View>
          )}
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>自动续费</Text>
          <View style={styles.selectRow}>
            {(
              [
                { val: true, label: '是' },
                { val: false, label: '否' },
              ] as const
            ).map((opt) => (
              <TouchableOpacity key={String(opt.val)} style={[styles.selectItem, form.autoRenew === opt.val ? styles.selectItemActive : null, modalStyles.selectItem]} onPress={() => setForm((v) => ({ ...v, autoRenew: opt.val }))}>
                <Text style={[styles.selectText, form.autoRenew === opt.val ? styles.selectTextActive : null]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>支付方式</Text>
          <View style={styles.selectRow}>
            {paymentMethods.map((pm) => (
              <TouchableOpacity key={pm.id} style={[styles.selectItem, form.paymentMethodId === pm.id ? styles.selectItemActive : null, modalStyles.selectItem]} onPress={() => setForm((v) => ({ ...v, paymentMethodId: pm.id }))}>
                <Text style={[styles.selectText, form.paymentMethodId === pm.id ? styles.selectTextActive : null]}>{pm.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        </ScrollView>

        <View style={styles.modalActions}>
          <TouchableOpacity style={[styles.btnGhost, modalStyles.btnGhost]} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.btnGhostText}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSubmit} activeOpacity={0.8}>
            <LinearGradient
              colors={[getVariableValue(c.gradientStart), getVariableValue(c.gradientEnd)]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={modalStyles.btnPrimary}
            >
              <Text style={modalStyles.btnPrimaryText}>保存</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const modalStyles = StyleSheet.create({
  box: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  input: {
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  selectItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1.5,
  },
  dateButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  btnGhost: {
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  btnPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
})

export default SubscriptionFormModal
