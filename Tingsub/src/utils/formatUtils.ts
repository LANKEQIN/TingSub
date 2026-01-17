/**
 * 格式化工具
 * 提供各种数据格式化功能
 */

import type { Currency, SubscriptionType, SubscriptionStatus } from '../../types/common';

/**
 * 货币符号映射
 */
const CURRENCY_SYMBOLS: Record<Currency, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  JPY: '¥',
  GBP: '£',
};

/**
 * 订阅周期映射
 */
const SUBSCRIPTION_TYPE_LABELS: Record<SubscriptionType, string> = {
  monthly: '月付',
  yearly: '年付',
  quarterly: '季付',
  weekly: '周付',
  'one-time': '一次性',
};

/**
 * 订阅状态映射
 */
const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: '进行中',
  cancelled: '已取消',
  expired: '已过期',
};

/**
 * 订阅状态颜色映射
 */
const SUBSCRIPTION_STATUS_COLORS: Record<SubscriptionStatus, string> = {
  active: '#4CAF50',
  cancelled: '#FF9800',
  expired: '#F44336',
};

/**
 * 格式化货币金额
 * @param amount 金额
 * @param currency 货币类型
 * @param decimals 小数位数，默认为2
 * @returns 格式化后的货币字符串
 */
export function formatCurrency(
  amount: number,
  currency: Currency = 'CNY',
  decimals: number = 2
): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  const formattedAmount = amount.toFixed(decimals);
  return `${symbol}${formattedAmount}`;
}

/**
 * 格式化数字（添加千位分隔符）
 * @param number 数字
 * @param decimals 小数位数，默认为2
 * @returns 格式化后的数字字符串
 */
export function formatNumber(number: number, decimals: number = 2): string {
  return number.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * 格式化百分比
 * @param value 数值（0-1之间）
 * @param decimals 小数位数，默认为1
 * @returns 格式化后的百分比字符串
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 格式化订阅周期
 * @param type 订阅周期类型
 * @returns 订阅周期标签
 */
export function formatSubscriptionType(type: SubscriptionType): string {
  return SUBSCRIPTION_TYPE_LABELS[type] || type;
}

/**
 * 格式化订阅状态
 * @param status 订阅状态
 * @returns 订阅状态标签
 */
export function formatSubscriptionStatus(status: SubscriptionStatus): string {
  return SUBSCRIPTION_STATUS_LABELS[status] || status;
}

/**
 * 获取订阅状态颜色
 * @param status 订阅状态
 * @returns 订阅状态颜色
 */
export function getSubscriptionStatusColor(status: SubscriptionStatus): string {
  return SUBSCRIPTION_STATUS_COLORS[status] || '#999999';
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 格式化时长
 * @param seconds 秒数
 * @returns 格式化后的时长字符串（如"1小时30分钟"）
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}小时`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}分钟`);
  }
  if (remainingSeconds > 0 && hours === 0) {
    parts.push(`${remainingSeconds}秒`);
  }

  return parts.join('') || '0秒';
}

/**
 * 格式化天数
 * @param days 天数
 * @returns 格式化后的天数字符串（如"30天"）
 */
export function formatDays(days: number): string {
  if (days === 0) return '今天';
  if (days === 1) return '1天';
  if (days === -1) return '1天前';
  if (days > 0) return `${days}天后`;
  return `${Math.abs(days)}天前`;
}

/**
 * 格式化数量
 * @param count 数量
 * @returns 格式化后的数量字符串（如"10个"）
 */
export function formatCount(count: number, unit: string = '个'): string {
  return `${count}${unit}`;
}

/**
 * 格式化列表
 * @param items 列表项
 * @param separator 分隔符，默认为"、"
 * @returns 格式化后的列表字符串
 */
export function formatList(items: string[], separator: string = '、'): string {
  return items.join(separator);
}

/**
 * 格式化电话号码
 * @param phone 电话号码
 * @returns 格式化后的电话号码字符串（如"138-1234-5678"）
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * 格式化身份证号（隐藏中间部分）
 * @param idCard 身份证号
 * @returns 格式化后的身份证号字符串（如"110***********1234"）
 */
export function formatIdCard(idCard: string): string {
  if (idCard.length === 18) {
    return `${idCard.slice(0, 3)}***********${idCard.slice(-4)}`;
  }
  return idCard;
}

/**
 * 格式化银行卡号（隐藏中间部分）
 * @param cardNumber 银行卡号
 * @returns 格式化后的银行卡号字符串（如"**** **** **** 1234"）
 */
export function formatBankCard(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length >= 16) {
    const last4 = cleaned.slice(-4);
    return `**** **** **** ${last4}`;
  }
  return cardNumber;
}

/**
 * 格式化邮箱（隐藏部分内容）
 * @param email 邮箱地址
 * @returns 格式化后的邮箱字符串（如"u***@example.com"）
 */
export function formatEmail(email: string): string {
  const [username, domain] = email.split('@');
  if (username && domain) {
    const visiblePart = username.slice(0, 1);
    return `${visiblePart}***@${domain}`;
  }
  return email;
}

/**
 * 截断文本
 * @param text 文本
 * @param maxLength 最大长度
 * @param suffix 后缀，默认为"..."
 * @returns 截断后的文本
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 格式化URL（移除协议和www）
 * @param url URL
 * @returns 格式化后的URL字符串
 */
export function formatURL(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, '');
}

/**
 * 格式化标签（添加#前缀）
 * @param tag 标签
 * @returns 格式化后的标签字符串
 */
export function formatTag(tag: string): string {
  if (tag.startsWith('#')) {
    return tag;
  }
  return `#${tag}`;
}

/**
 * 格式化标签列表
 * @param tags 标签列表
 * @returns 格式化后的标签列表字符串
 */
export function formatTags(tags: string[]): string {
  return tags.map(formatTag).join(' ');
}

/**
 * 格式化备注（换行处理）
 * @param notes 备注文本
 * @returns 格式化后的备注文本
 */
export function formatNotes(notes: string): string {
  return notes.trim();
}

/**
 * 格式化平台名称
 * @param platform 平台名称
 * @returns 格式化后的平台名称
 */
export function formatPlatform(platform: string): string {
  return platform.trim();
}

/**
 * 格式化支付方式
 * @param paymentMethod 支付方式
 * @returns 格式化后的支付方式
 */
export function formatPaymentMethod(paymentMethod: string): string {
  return paymentMethod.trim();
}

/**
 * 格式化描述文本（首字母大写）
 * @param text 文本
 * @returns 格式化后的文本
 */
export function capitalizeFirstLetter(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * 格式化描述文本（每个单词首字母大写）
 * @param text 文本
 * @returns 格式化后的文本
 */
export function capitalizeWords(text: string): string {
  return text
    .split(' ')
    .map((word) => capitalizeFirstLetter(word))
    .join(' ');
}

/**
 * 格式化空值
 * @param value 值
 * @param placeholder 占位符，默认为"-"
 * @returns 格式化后的值
 */
export function formatEmptyValue<T>(
  value: T | null | undefined,
  placeholder: string = '-'
): string {
  if (value === null || value === undefined || value === '') {
    return placeholder;
  }
  return String(value);
}

/**
 * 格式化布尔值
 * @param value 布尔值
 * @param trueText 真值文本，默认为"是"
 * @param falseText 假值文本，默认为"否"
 * @returns 格式化后的文本
 */
export function formatBoolean(
  value: boolean,
  trueText: string = '是',
  falseText: string = '否'
): string {
  return value ? trueText : falseText;
}

/**
 * 格式化数组为字符串
 * @param array 数组
 * @param separator 分隔符，默认为"、"
 * @param maxItems 最大显示项数，默认为全部
 * @returns 格式化后的字符串
 */
export function formatArrayToString<T>(
  array: T[],
  separator: string = '、',
  maxItems?: number
): string {
  if (array.length === 0) return '';

  const itemsToDisplay = maxItems ? array.slice(0, maxItems) : array;
  const result = itemsToDisplay.map(String).join(separator);

  if (maxItems && array.length > maxItems) {
    return `${result}等${array.length}项`;
  }

  return result;
}

/**
 * 格式化对象为字符串
 * @param obj 对象
 * @param separator 分隔符，默认为", "
 * @returns 格式化后的字符串
 */
export function formatObjectToString(obj: Record<string, any>, separator: string = ', '): string {
  return Object.entries(obj)
    .map(([key, value]) => `${key}: ${value}`)
    .join(separator);
}

/**
 * 格式化错误消息
 * @param error 错误对象
 * @returns 格式化后的错误消息
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return '发生未知错误';
}

/**
 * 格式化JSON字符串
 * @param json JSON对象或字符串
 * @param indent 缩进空格数，默认为2
 * @returns 格式化后的JSON字符串
 */
export function formatJSON(json: object | string, indent: number = 2): string {
  const obj = typeof json === 'string' ? JSON.parse(json) : json;
  return JSON.stringify(obj, null, indent);
}

/**
 * 格式化日期范围
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 格式化后的日期范围字符串
 */
export function formatDateRange(startDate: Date | string, endDate: Date | string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  const startMonth = start.getMonth() + 1;
  const endMonth = end.getMonth() + 1;

  const startDay = start.getDate();
  const endDay = end.getDate();

  if (startYear === endYear) {
    if (startMonth === endMonth) {
      return `${startYear}年${startMonth}月${startDay}日 - ${endDay}日`;
    }
    return `${startYear}年${startMonth}月${startDay}日 - ${endMonth}月${endDay}日`;
  }

  return `${startYear}年${startMonth}月${startDay}日 - ${endYear}年${endMonth}月${endDay}日`;
}

/**
 * 格式化价格区间
 * @param minPrice 最低价格
 * @param maxPrice 最高价格
 * @param currency 货币类型
 * @returns 格式化后的价格区间字符串
 */
export function formatPriceRange(
  minPrice: number,
  maxPrice: number,
  currency: Currency = 'CNY'
): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  return `${symbol}${minPrice} - ${symbol}${maxPrice}`;
}
