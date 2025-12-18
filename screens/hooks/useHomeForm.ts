import { useState, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { addSubscription, updateSubscription } from '../../features/subscriptions/slice'
import { CurrencyService } from '../../features/currency/services'
import type { Subscription, Cycle } from '../../features/subscriptions/slice'
import type { CategoryGroup } from '../../features/subscriptions/types'
import type { CurrencyCode } from '../../features/currency/types'
import { getCategoriesByGroup } from '../../features/subscriptions/categories'
import { isCategoryGroup, toCategoryGroup } from '../utils/subscriptions'

const pad2 = (n: number) => String(n).padStart(2, '0')

export const useHomeForm = (preferredCurrency: CurrencyCode) => {
  const dispatch = useDispatch()
  const today = new Date()
  const [dateParts, setDateParts] = useState({ year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() })
  const [form, setForm] = useState({
    name: '',
    categoryGroup: '影音娱乐' as CategoryGroup,
    categoryId: undefined as string | undefined,
    categoryLabel: '',
    price: '',
    cycle: 'monthly' as Cycle,
    startISO: '',
    nextDueISO: `${dateParts.year}-${pad2(dateParts.month)}-${pad2(dateParts.day)}`,
    autoRenew: false,
    currency: 'CNY' as CurrencyCode,
    paymentMethodId: undefined as string | undefined,
  })

  const pricePlaceholder = useMemo(() => {
    const symbol = CurrencyService.symbol(form.currency)
    const example = form.currency === 'JPY' ? '1500' : '15'
    return `例如：${symbol} ${example}`
  }, [form.currency])

  const pricePreview = useMemo(() => {
    const num = Number(form.price)
    if (!Number.isFinite(num) || num <= 0) return ''
    const converted = CurrencyService.convert(num, form.currency, preferredCurrency)
    const base = CurrencyService.format(converted, preferredCurrency)
    const suffix = form.cycle === 'yearly' ? '/年' : form.cycle === 'quarterly' ? '/季' : form.cycle === 'lifetime' ? '/终身' : form.cycle === 'other' ? '' : '/月'
    return `${base}${suffix}`
  }, [form.price, form.cycle, form.currency, preferredCurrency])

  const submitForm = (editMode: boolean, selectedSub: Subscription | null) => {
    if (!form.name || !form.price) return
    const numPrice = Number(form.price)
    if (!Number.isFinite(numPrice) || numPrice <= 0) return

    const category = form.categoryGroup === '其他'
      ? (form.categoryLabel?.trim() || '其他')
      : (form.categoryId ? (getCategoriesByGroup(form.categoryGroup).find(c => c.id === form.categoryId)?.label || form.categoryGroup) : form.categoryGroup)

    const payload = {
      ...(editMode && selectedSub ? { id: selectedSub.id } : { id: `${Date.now()}` }),
      name: form.name,
      category,
      categoryGroup: form.categoryGroup,
      price: numPrice,
      cycle: form.cycle,
      startISO: form.startISO || undefined,
      nextDueISO: form.nextDueISO || undefined,
      autoRenew: form.autoRenew,
      currency: form.currency,
      paymentMethodId: form.paymentMethodId,
    } as Subscription

    if (editMode && selectedSub) {
      dispatch(updateSubscription(payload))
    } else {
      dispatch(addSubscription(payload))
    }

    resetForm()
  }

  const resetForm = () => {
    setForm({
      name: '',
      categoryGroup: '影音娱乐',
      categoryId: undefined,
      categoryLabel: '',
      price: '',
      cycle: 'monthly',
      startISO: '',
      nextDueISO: `${dateParts.year}-${pad2(dateParts.month)}-${pad2(dateParts.day)}`,
      autoRenew: false,
      currency: 'CNY',
      paymentMethodId: undefined,
    })
  }

  const startEdit = (sub: Subscription) => {
    const isGroupOption = sub.category ? isCategoryGroup(sub.category) : false
    const group = toCategoryGroup(sub.categoryGroup ?? (isGroupOption ? sub.category : undefined))
    const categoryId = getCategoriesByGroup(group).find(c => c.label === sub.category)?.id

    setForm({
      name: sub.name,
      categoryGroup: group,
      categoryId,
      categoryLabel: group === '其他' ? (sub.category ?? '') : '',
      price: String(sub.price),
      cycle: sub.cycle,
      startISO: sub.startISO ?? '',
      nextDueISO: sub.nextDueISO ?? `${dateParts.year}-${pad2(dateParts.month)}-${pad2(dateParts.day)}`,
      autoRenew: !!sub.autoRenew,
      currency: sub.currency ?? 'CNY',
      paymentMethodId: sub.paymentMethodId,
    })

    if (sub.nextDueISO) {
      const [y, m, d] = sub.nextDueISO.split('-').map(Number)
      setDateParts({ year: y, month: m, day: d })
    }
  }

  return {
    form,
    setForm,
    dateParts,
    setDateParts,
    pricePlaceholder,
    pricePreview,
    submitForm,
    resetForm,
    startEdit,
  }
}