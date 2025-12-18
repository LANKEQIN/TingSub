import { Platform, Share } from 'react-native'
import type { CurrencyCode } from '../features/currency/types'
import type { Subscription } from '../features/subscriptions/types'
import type { PaymentMethod } from '../features/paymentMethods/types'

export type ExportPayload = {
  version: 1
  exportedAt: string
  currency?: CurrencyCode
  subscriptions: Subscription[]
  paymentMethods?: PaymentMethod[]
}

// 导出：在 Web 端下载文本，在原生端走 Share
export const exportText = async (filename: string, text: string) => {
  if (Platform.OS === 'web') {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    return true
  }
  try {
    await Share.share({ message: text, title: filename })
    return true
  } catch (e) {
    return false
  }
}

export const buildJSONPayload = (
  params: { subscriptions: Subscription[]; paymentMethods?: PaymentMethod[]; currency?: CurrencyCode }
): ExportPayload => ({
  version: 1,
  exportedAt: new Date().toISOString(),
  currency: params.currency,
  subscriptions: params.subscriptions ?? [],
  paymentMethods: params.paymentMethods ?? [],
})

export const exportJSON = async (payload: ExportPayload) => {
  const text = JSON.stringify(payload, null, 2)
  return exportText('tingsub-data.json', text)
}

// 简易 CSV（只导出订阅）。注意：Excel 可直接打开 CSV。
export const exportSubscriptionsCSV = async (subs: Subscription[]) => {
  const header = [
    'id','name','group','categoryId','price','currency','cycle','startISO','nextDueISO','autoRenew','paymentMethodId'
  ]
  const esc = (v: any) => {
    const s = v === undefined || v === null ? '' : String(v)
    const needsQuote = /[",\n]/.test(s)
    const q = s.replace(/"/g, '""')
    return needsQuote ? `"${q}"` : q
  }
  const rows = subs.map(s => [
    esc(s.id), esc(s.name), esc((s as any).group), esc((s as any).categoryId), esc(s.price), esc((s as any).currency), esc(s.cycle), esc((s as any).startISO), esc((s as any).nextDueISO), esc((s as any).autoRenew), esc((s as any).paymentMethodId)
  ].join(','))
  const csv = [header.join(','), ...rows].join('\n')
  return exportText('subscriptions.csv', csv)
}

// 解析导入的 JSON，做最小校验
export const parseImportJSON = (text: string): Partial<ExportPayload> | null => {
  try {
    const obj = JSON.parse(text)
    if (obj && typeof obj === 'object') {
      const subscriptions = Array.isArray(obj.subscriptions) ? obj.subscriptions : []
      const paymentMethods = Array.isArray(obj.paymentMethods) ? obj.paymentMethods : []
      const currency = typeof obj.currency === 'string' ? obj.currency as CurrencyCode : undefined
      return { subscriptions, paymentMethods, currency }
    }
  } catch (e) {
    return null
  }
  return null
}