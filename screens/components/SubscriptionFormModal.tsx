import * as React from 'react'
import { useState, useEffect } from 'react'
import { View, TouchableOpacity, TextInput, Platform, ScrollView, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Text } from 'tamagui'
import { X, ChevronLeft, ChevronRight, Check } from '@tamagui/lucide-icons'
import tamaguiConfig from '../../tamagui.config'
import { getVariableValue } from '@tamagui/core'
import type { CategoryGroup } from '../../features/subscriptions/types'
import type { Cycle, Subscription } from '../../features/subscriptions/slice'
import type { CurrencyCode } from '../../features/currency/types'

const STEPS = [
  { id: 1, title: '基本信息' },
  { id: 2, title: '价格与周期' },
  { id: 3, title: '日期设置' },
  { id: 4, title: '支付方式' },
]

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

const StepIndicator: React.FC<{ currentStep: number; styles: any }> = ({ currentStep, styles }) => {
  const c = tamaguiConfig.tokens.color
  const isDark = styles?.colors?.textPrimary === '#E5E7EB'

  return (
    <View style={stepIndicatorStyles.container}>
      {STEPS.map((step, index) => (
        <View key={step.id} style={stepIndicatorStyles.stepItem}>
          <View style={stepIndicatorStyles.stepLineContainer}>
            {index > 0 && (
              <View
                style={[
                  stepIndicatorStyles.stepLine,
                  index < currentStep && { backgroundColor: getVariableValue(c.gradientStart) },
                ]}
              />
            )}
            <LinearGradient
              colors={
                index + 1 <= currentStep
                  ? [getVariableValue(c.gradientStart), getVariableValue(c.gradientEnd)]
                  : [isDark ? '#374151' : '#E5E7EB', isDark ? '#374151' : '#E5E7EB']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={stepIndicatorStyles.stepCircle}
            >
              {index + 1 < currentStep ? (
                <Check size={16} color="#FFFFFF" />
              ) : (
                <Text style={stepIndicatorStyles.stepNumber}>{step.id}</Text>
              )}
            </LinearGradient>
          </View>
          <Text
            style={[
              stepIndicatorStyles.stepTitle,
              index + 1 <= currentStep ? stepIndicatorStyles.stepTitleActive : null,
            ]}
          >
            {step.title}
          </Text>
        </View>
      ))}
    </View>
  )
}

const stepIndicatorStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
  },
  stepLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  stepLine: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: 2,
    backgroundColor: '#E5E7EB',
    zIndex: -1,
    marginLeft: -20,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  stepTitle: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  stepTitleActive: {
    color: '#6366F1',
    fontWeight: '500',
  },
})

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
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    if (visible) {
      setCurrentStep(1)
    }
  }, [visible])

  if (!visible) return null
  const c = tamaguiConfig.tokens.color
  const isDark = styles?.colors?.textPrimary === '#E5E7EB'
  const pad2 = (n: number) => String(n).padStart(2, '0')
  const iso = `${dateParts.year}-${pad2(dateParts.month)}-${pad2(dateParts.day)}`

  const handleNext = () => {
    if (currentStep === 1) {
      if (!form.name.trim()) {
        return
      }
    }
    if (currentStep === 2) {
      if (!form.price.trim()) {
        return
      }
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      onSubmit()
    }
  }

  const isStepValid = () => {
    if (currentStep === 1) {
      return form.name.trim().length > 0
    }
    if (currentStep === 2) {
      return form.price.trim().length > 0
    }
    return true
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>订阅名称</Text>
              <TextInput
                style={[styles.formInput, modalStyles.input]}
                value={form.name}
                onChangeText={(t) => setForm((v) => ({ ...v, name: t }))}
                placeholder="例如：网易云音乐VIP"
                placeholderTextColor={styles.colors.muted}
                autoFocus
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
                    {getCategoriesByGroup(form.categoryGroup).map((cat) => (
                      <TouchableOpacity
                        key={cat.id}
                        style={[styles.selectItem, form.categoryId === cat.id ? styles.selectItemActive : null, modalStyles.selectItem]}
                        onPress={() => setForm((v) => ({ ...v, categoryId: cat.id, categoryLabel: '' }))}
                      >
                        <Text style={[styles.selectText, form.categoryId === cat.id ? styles.selectTextActive : null]}>{cat.label}</Text>
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
          </>
        )
      case 2:
        return (
          <>
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
          </>
        )
      case 3:
        return (
          <>
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
          </>
        )
      case 4:
        return (
          <>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>支付方式（可选）</Text>
              <View style={styles.selectRow}>
                {paymentMethods.map((pm) => (
                  <TouchableOpacity key={pm.id} style={[styles.selectItem, form.paymentMethodId === pm.id ? styles.selectItemActive : null, modalStyles.selectItem]} onPress={() => setForm((v) => ({ ...v, paymentMethodId: pm.id }))}>
                    <Text style={[styles.selectText, form.paymentMethodId === pm.id ? styles.selectTextActive : null]}>{pm.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>不选择则不记录支付方式</Text>
            </View>
          </>
        )
      default:
        return null
    }
  }

  return (
    <View style={styles.modalMask}>
      <View style={[styles.modalBox, modalStyles.box]}>
        <View style={modalStyles.header}>
          <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
            <X size={20} color={styles.colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{editMode ? '编辑订阅' : '添加新订阅'}</Text>
          <View style={{ width: 20 }} />
        </View>

        <StepIndicator currentStep={currentStep} styles={styles} />

        <ScrollView style={{ maxHeight: '100%' }} contentContainerStyle={{ paddingBottom: 8 }}>
          {renderStepContent()}
        </ScrollView>

        <View style={modalStyles.footer}>
          {currentStep > 1 ? (
            <TouchableOpacity style={[modalStyles.navButton, modalStyles.prevButton]} onPress={handlePrev} activeOpacity={0.7}>
              <ChevronLeft size={18} color={styles.colors.textPrimary} />
              <Text style={[modalStyles.navButtonText, modalStyles.prevButtonText]}>上一步</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[modalStyles.navButton, modalStyles.cancelButton]} onPress={onClose} activeOpacity={0.7}>
              <Text style={[modalStyles.navButtonText, modalStyles.cancelButtonText]}>取消</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleNext} activeOpacity={0.8} disabled={!isStepValid()}>
            <LinearGradient
              colors={isStepValid() ? [getVariableValue(c.gradientStart), getVariableValue(c.gradientEnd)] : ['#E5E7EB', '#E5E7EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[modalStyles.nextButton, !isStepValid() && modalStyles.nextButtonDisabled]}
            >
              {currentStep < 4 ? (
                <>
                  <Text style={[modalStyles.nextButtonText, !isStepValid() && modalStyles.nextButtonTextDisabled]}>下一步</Text>
                  <ChevronRight size={18} color={isStepValid() ? '#FFFFFF' : '#9CA3AF'} />
                </>
              ) : (
                <>
                  <Check size={18} color={isStepValid() ? '#FFFFFF' : '#9CA3AF'} />
                  <Text style={[modalStyles.nextButtonText, !isStepValid() && modalStyles.nextButtonTextDisabled]}>完成</Text>
                </>
              )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  closeButton: {
    padding: 4,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    borderWidth: 1.5,
  },
  prevButton: {
    backgroundColor: 'transparent',
  },
  prevButtonText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '600',
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  nextButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  nextButtonTextDisabled: {
    color: '#9CA3AF',
  },
})

export default SubscriptionFormModal
