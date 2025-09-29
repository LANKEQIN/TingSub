export type Cycle = 'monthly' | 'quarterly' | 'yearly' | 'lifetime' | 'other'

export type Currency = 'CNY'

export type CategoryGroup = '影音娱乐' | '工作' | '生活' | '其他'

export interface Category {
  id: string
  label: string
  group: CategoryGroup
}

export interface Subscription {
  id: string
  name: string
  // 细分标签，如“剪映专业版”等；当 group 为“其他”时可自由填写
  category?: string
  // 分组，限定为四类之一
  categoryGroup?: CategoryGroup
  price: number
  cycle: Cycle
  nextDueISO?: string
  autoRenew?: boolean
  currency?: Currency
}