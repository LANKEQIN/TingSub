/**
 * 日期处理工具
 * 提供日期格式化、计算、比较等功能
 */

import {
  format,
  parseISO,
  isValid,
  addMonths,
  addYears,
  addWeeks,
  addQuarters,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  isBefore,
  isSameDay,
  isToday,
  isTomorrow,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { zhCN, type Locale } from 'date-fns/locale';
import type { SubscriptionType } from '../../types/common';

/**
 * 日期格式常量
 */
export const DATE_FORMATS = {
  ISO: 'yyyy-MM-dd',
  ISO_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss",
  DISPLAY: 'yyyy年MM月dd日',
  DISPLAY_WITH_TIME: 'yyyy年MM月dd日 HH:mm',
  DISPLAY_SHORT: 'MM/dd',
  DISPLAY_MONTH: 'yyyy年MM月',
  DISPLAY_YEAR: 'yyyy年',
} as const;

/**
 * 格式化日期为显示格式
 * @param date 日期对象或ISO字符串
 * @param formatStr 格式字符串，默认为DISPLAY
 * @param locale 语言环境，默认为中文
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: Date | string,
  formatStr: string = DATE_FORMATS.DISPLAY,
  locale: Locale = zhCN
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) {
    return '';
  }
  return format(dateObj, formatStr, { locale });
}

/**
 * 格式化日期为ISO格式
 * @param date 日期对象或ISO字符串
 * @returns ISO格式日期字符串
 */
export function toISODate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) {
    return '';
  }
  return format(dateObj, DATE_FORMATS.ISO);
}

/**
 * 格式化日期为ISO格式（带时间）
 * @param date 日期对象或ISO字符串
 * @returns ISO格式日期时间字符串
 */
export function toISODateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) {
    return '';
  }
  return format(dateObj, DATE_FORMATS.ISO_WITH_TIME);
}

/**
 * 解析ISO字符串为Date对象
 * @param isoString ISO格式日期字符串
 * @returns Date对象
 */
export function parseDate(isoString: string): Date {
  return parseISO(isoString);
}

/**
 * 计算下次续费日期
 * @param startDate 开始日期
 * @param type 订阅周期类型
 * @returns 下次续费日期
 */
export function calculateNextRenewalDate(startDate: Date | string, type: SubscriptionType): Date {
  const dateObj = typeof startDate === 'string' ? parseISO(startDate) : startDate;

  switch (type) {
    case 'weekly':
      return addWeeks(dateObj, 1);
    case 'monthly':
      return addMonths(dateObj, 1);
    case 'quarterly':
      return addQuarters(dateObj, 1);
    case 'yearly':
      return addYears(dateObj, 1);
    case 'one-time':
      return dateObj;
    default:
      return addMonths(dateObj, 1);
  }
}

/**
 * 计算续费日期
 * @param billingDate 计费日期
 * @param type 订阅周期类型
 * @param cycles 续费周期数，默认为1
 * @returns 续费日期
 */
export function calculateRenewalDate(
  billingDate: Date | string,
  type: SubscriptionType,
  cycles: number = 1
): Date {
  const dateObj = typeof billingDate === 'string' ? parseISO(billingDate) : billingDate;

  switch (type) {
    case 'weekly':
      return addWeeks(dateObj, cycles);
    case 'monthly':
      return addMonths(dateObj, cycles);
    case 'quarterly':
      return addQuarters(dateObj, cycles);
    case 'yearly':
      return addYears(dateObj, cycles);
    case 'one-time':
      return dateObj;
    default:
      return addMonths(dateObj, cycles);
  }
}

/**
 * 计算两个日期之间的天数差
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 天数差
 */
export function daysBetween(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return differenceInDays(end, start);
}

/**
 * 计算两个日期之间的月数差
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 月数差
 */
export function monthsBetween(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return differenceInMonths(end, start);
}

/**
 * 计算两个日期之间的年数差
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 年数差
 */
export function yearsBetween(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return differenceInYears(end, start);
}

/**
 * 判断日期是否在指定天数内到期
 * @param targetDate 目标日期
 * @param days 天数
 * @returns 是否在指定天数内到期
 */
export function isExpiringWithinDays(targetDate: Date | string, days: number): boolean {
  const dateObj = typeof targetDate === 'string' ? parseISO(targetDate) : targetDate;
  const now = new Date();
  const daysDiff = differenceInDays(dateObj, now);
  return daysDiff >= 0 && daysDiff <= days;
}

/**
 * 判断日期是否已过期
 * @param targetDate 目标日期
 * @returns 是否已过期
 */
export function isExpired(targetDate: Date | string): boolean {
  const dateObj = typeof targetDate === 'string' ? parseISO(targetDate) : targetDate;
  return isBefore(dateObj, new Date());
}

/**
 * 判断日期是否在今天
 * @param date 日期
 * @returns 是否在今天
 */
export function isDateToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isToday(dateObj);
}

/**
 * 判断日期是否在明天
 * @param date 日期
 * @returns 是否在明天
 */
export function isDateTomorrow(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isTomorrow(dateObj);
}

/**
 * 判断两个日期是否是同一天
 * @param date1 日期1
 * @param date2 日期2
 * @returns 是否是同一天
 */
export function isSameDate(date1: Date | string, date2: Date | string): boolean {
  const dateObj1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const dateObj2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isSameDay(dateObj1, dateObj2);
}

/**
 * 获取日期的开始时间（00:00:00）
 * @param date 日期
 * @returns 日期的开始时间
 */
export function getStartOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return startOfDay(dateObj);
}

/**
 * 获取日期的结束时间（23:59:59）
 * @param date 日期
 * @returns 日期的结束时间
 */
export function getEndOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return endOfDay(dateObj);
}

/**
 * 获取月份的开始日期
 * @param date 日期
 * @returns 月份的开始日期
 */
export function getStartOfMonth(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return startOfMonth(dateObj);
}

/**
 * 获取月份的结束日期
 * @param date 日期
 * @returns 月份的结束日期
 */
export function getEndOfMonth(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return endOfMonth(dateObj);
}

/**
 * 获取年份的开始日期
 * @param date 日期
 * @returns 年份的开始日期
 */
export function getStartOfYear(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return startOfYear(dateObj);
}

/**
 * 获取年份的结束日期
 * @param date 日期
 * @returns 年份的结束日期
 */
export function getEndOfYear(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return endOfYear(dateObj);
}

/**
 * 获取周的开始日期
 * @param date 日期
 * @returns 周的开始日期
 */
export function getStartOfWeek(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return startOfWeek(dateObj, { locale: zhCN });
}

/**
 * 获取周的结束日期
 * @param date 日期
 * @returns 周的结束日期
 */
export function getEndOfWeek(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return endOfWeek(dateObj, { locale: zhCN });
}

/**
 * 获取相对日期描述
 * @param date 日期
 * @returns 相对日期描述（如"今天"、"明天"、"3天后"等）
 */
export function getRelativeDateDescription(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const daysDiff = differenceInDays(dateObj, now);

  if (daysDiff === 0) {
    return '今天';
  } else if (daysDiff === 1) {
    return '明天';
  } else if (daysDiff === -1) {
    return '昨天';
  } else if (daysDiff > 0 && daysDiff <= 7) {
    return `${daysDiff}天后`;
  } else if (daysDiff < 0 && daysDiff >= -7) {
    return `${Math.abs(daysDiff)}天前`;
  } else {
    return formatDate(dateObj, DATE_FORMATS.DISPLAY_SHORT);
  }
}

/**
 * 验证日期是否有效
 * @param date 日期对象或ISO字符串
 * @returns 是否有效
 */
export function isValidDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj);
}

/**
 * 获取当前日期的ISO格式字符串
 * @returns 当前日期的ISO格式字符串
 */
export function getCurrentISODate(): string {
  return toISODate(new Date());
}

/**
 * 获取当前日期时间的ISO格式字符串
 * @returns 当前日期时间的ISO格式字符串
 */
export function getCurrentISODateTime(): string {
  return toISODateTime(new Date());
}
