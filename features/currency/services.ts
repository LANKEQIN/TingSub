import { CURRENCIES, CurrencyCode, getCurrencyMeta, formatByCurrency } from './types'

/**
 * 本地固定汇率表（以 CNY 为中间锚定）
 * rateToCNY[x] 表示 1 x 货币等于多少 CNY
 * 注意：仅用于演示，可根据需要更新
 */
export const rateToCNY: Record<CurrencyCode, number> = {
  CNY: 1,
  USD: 7.2,  // 1 USD ≈ 7.2 CNY
  JPY: 0.05, // 1 JPY ≈ 0.05 CNY
}

/**
 * 将金额从一种货币转换为另一种货币
 * - 通过 CNY 作为中间货币进行换算
 * - 自动按目标货币精度进行四舍五入
 */
export const convertCurrency = (amount: number, from: CurrencyCode, to: CurrencyCode): number => {
  if (!Number.isFinite(amount)) return 0
  if (from === to) return roundWithPrecision(amount, to)
  const cny = amount * rateToCNY[from]
  const toAmount = cny / rateToCNY[to]
  return roundWithPrecision(toAmount, to)
}

/**
 * 按货币精度进行四舍五入
 */
export const roundWithPrecision = (amount: number, code: CurrencyCode): number => {
  const p = getCurrencyMeta(code).precision
  const factor = Math.pow(10, p)
  return Math.round(amount * factor) / factor
}

/**
 * 先转换后格式化的便捷函数
 */
export const convertAndFormat = (
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  options?: { withSymbol?: boolean; useGrouping?: boolean }
): string => {
  const val = convertCurrency(amount, from, to)
  return formatByCurrency(val, to, options)
}

/**
 * 获取某货币的符号
 */
export const getSymbol = (code: CurrencyCode): string => getCurrencyMeta(code).symbol

/**
 * 暴露主入口（如有需要可在 index.ts 聚合导出）
 */
export const CurrencyService = {
  meta: getCurrencyMeta,
  format: formatByCurrency,
  convert: convertCurrency,
  convertAndFormat,
  symbol: getSymbol,
  registry: CURRENCIES,
  rateToCNY,
}