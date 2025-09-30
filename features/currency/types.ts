/**
 * Currency 模块：类型与元数据
 * 
 * 目标：统一货币的符号、精度与区域设置
 * 支持多币种扩展，当前内置 CNY、USD、JPY
 */

/**
 * 货币代码（ISO 4217 简化）
 */
export type CurrencyCode = 'CNY' | 'USD' | 'JPY'

/**
 * 货币元数据
 * - symbol: 货币符号
 * - precision: 小数精度（JPY 常为 0）
 * - name: 本地化名称
 * - locale: 本地化格式化使用的 locale
 */
export interface CurrencyMeta {
  code: CurrencyCode
  symbol: string
  precision: number
  name: string
  locale: string
}

/**
 * 货币注册表（可扩展）
 */
export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  CNY: { code: 'CNY', symbol: '¥', precision: 2, name: '人民币', locale: 'zh-CN' },
  USD: { code: 'USD', symbol: '$', precision: 2, name: '美元', locale: 'en-US' },
  JPY: { code: 'JPY', symbol: '¥', precision: 0, name: '日元', locale: 'ja-JP' },
}

/**
 * 获取货币元数据
 */
export const getCurrencyMeta = (code: CurrencyCode): CurrencyMeta => CURRENCIES[code]

/**
 * 根据元数据格式化金额（不含换算）
 */
export const formatByCurrency = (
  amount: number,
  code: CurrencyCode,
  options?: { withSymbol?: boolean; useGrouping?: boolean }
): string => {
  const meta = getCurrencyMeta(code)
  const withSymbol = options?.withSymbol ?? true
  const useGrouping = options?.useGrouping ?? true
  const formatted = Number(amount).toLocaleString(meta.locale, {
    minimumFractionDigits: meta.precision,
    maximumFractionDigits: meta.precision,
    useGrouping,
  })
  return withSymbol ? `${meta.symbol}${formatted}` : formatted
}