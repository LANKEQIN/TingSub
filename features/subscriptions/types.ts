/**
 * 订阅周期类型
 * 
 * @typedef {'monthly' | 'quarterly' | 'yearly' | 'lifetime' | 'other'} Cycle
 * @description
 * 定义订阅的计费周期选项：
 * - 'monthly': 每月
 * - 'quarterly': 每季度
 * - 'yearly': 每年
 * - 'lifetime': 终身
 * - 'other': 其他
 */
export type Cycle = 'monthly' | 'quarterly' | 'yearly' | 'lifetime' | 'other'

/**
 * 货币类型（引用 Currency 模块）
 * 
 * 支持的货币代码，使用 ISO 4217 标准：
 * - 'CNY': 人民币
 * - 'USD': 美元
 * - 'JPY': 日元
 */
import type { CurrencyCode } from '../currency/types'
export type Currency = CurrencyCode

/**
 * 分类组类型
 * 
 * @typedef {'影音娱乐' | '工作' | '生活' | '其他'} CategoryGroup
 * @description
 * 订阅的高级分类组，用于组织和筛选订阅：
 * - '影音娱乐': 影音娱乐
 * - '工作': 工作
 * - '生活': 生活
 * - '其他': 其他
 */
export type CategoryGroup = '影音娱乐' | '工作' | '生活' | '其他'

/**
 * 分类接口
 * 
 * @typedef {Object} Category
 * @property {string} id - 分类唯一标识符
 * @property {string} label - 分类显示名称
 * @property {CategoryGroup} group - 所属分类组
 * 
 * @description
 * 表示一个具体的订阅分类，包含标识、标签和所属分组
 */
export interface Category {
  id: string
  label: string
  group: CategoryGroup
}

/**
 * 订阅接口
 * 
 * @typedef {Object} Subscription
 * @property {string} id - 订阅唯一标识符
 * @property {string} name - 订阅名称
 * @property {string} [category] - 细分标签，如“剪映专业版”等；当 group 为“其他”时可自由填写
 * @property {CategoryGroup} [categoryGroup] - 分组，限定为四类之一
 * @property {number} price - 订阅价格
 * @property {Cycle} cycle - 订阅周期
 * @property {string} [startISO] - 购入/开始日期 (ISO 8601 格式)
 * @property {string} [nextDueISO] - 下次到期日期 (ISO 8601 格式)
 * @property {boolean} [autoRenew] - 是否自动续订
 * @property {Currency} [currency] - 货币类型
 * @property {string} [paymentMethodId] - 关联的支付方式ID，用于追踪扣款来源
 * 
 * @description
 * 表示单个订阅的完整数据结构，包含所有必要信息
 * 用于在应用中存储、显示和管理用户订阅
 */
export interface Subscription {
  id: string
  name: string
  // 细分标签，如“剪映专业版”等；当 group 为“其他”时可自由填写
  category?: string
  // 分组，限定为四类之一
  categoryGroup?: CategoryGroup
  price: number
  cycle: Cycle
  // 购入/开始日期 (ISO 8601 格式)
  startISO?: string
  nextDueISO?: string
  autoRenew?: boolean
  currency?: Currency
  // 关联的支付方式ID，用于追踪扣款来源
  paymentMethodId?: string
}

/**
 * 供应商（Vendor）接口
 *
 * @typedef {Object} Vendor
 * @property {string} id - 供应商唯一标识符
 * @property {string} name - 供应商名称（如 Microsoft、Adobe、Netflix）
 * @property {CategoryGroup} group - 主要归属分组（工作/生活/影音娱乐/其他）
 * @property {string[]} [aliases] - 别名/常见写法（如 MS、M365、Adobe CC）
 * @property {string[]} [keywords] - 搜索关键字（品牌、产品线、缩写）
 * @property {string} [icon] - 可选图标资源的键或 URL
 *
 * @description
 * 将供应商与分组解耦，用于在“添加订阅”流程中先选分组、再选供应商、最后选具体产品。
 */
export interface Vendor {
  id: string
  name: string
  group: CategoryGroup
  aliases?: string[]
  keywords?: string[]
  icon?: string
}

export type { Vendor as VendorType }