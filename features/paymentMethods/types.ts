/**
 * 支付方式类型枚举
 *
 * @typedef {'credit_card' | 'debit_card' | 'bank_account' | 'e_wallet' | 'alipay' | 'wechat'} PaymentMethodType
 * @description
 * 定义支持的支付方式类型：
 * - 'credit_card': 信用卡
 * - 'debit_card': 借记卡/银行卡
 * - 'bank_account': 银行账户（直接扣款）
 * - 'e_wallet': 电子钱包（如 PayPal 等通用钱包）
 * - 'alipay': 支付宝
 * - 'wechat': 微信支付
 */
export type PaymentMethodType = 'credit_card' | 'debit_card' | 'bank_account' | 'e_wallet' | 'alipay' | 'wechat'

/**
 * 支付方式接口
 *
 * @typedef {Object} PaymentMethod
 * @property {string} id - 支付方式唯一标识符
 * @property {PaymentMethodType} type - 支付方式类型
 * @property {string} [label] - 展示标签（如“张三 招商信用卡 ****1234”）
 * @property {string} [issuer] - 发卡行/开户行（如 招商银行、建设银行）
 * @property {string} [holder] - 持卡人/账户名
 * @property {string} [last4] - 账号后四位（卡号/钱包账户）
 * @property {number} [expiryMonth] - 到期月份（卡类）
 * @property {number} [expiryYear] - 到期年份（卡类）
 * @property {string} [provider] - 钱包提供方（e-wallet，如 Alipay/WeChat/PayPal）
 *
 * @description
 * 统一抽象支付方式实体，支持信用卡、借记卡、银行账户与电子钱包。
 * 可用于在订阅实体中进行关联，追踪每笔订阅从哪个卡或账户扣款。
 */
export interface PaymentMethod {
  id: string
  type: PaymentMethodType
  label?: string
  issuer?: string
  holder?: string
  last4?: string
  expiryMonth?: number
  expiryYear?: number
  provider?: string
}

export type { PaymentMethod as PaymentMethodEntity }