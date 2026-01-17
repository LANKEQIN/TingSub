// 应用常量配置文件
// 统一管理应用中所有固定常量值

// 应用基础信息
export const APP_INFO = {
  NAME: '汀阅',
  VERSION: '1.0.0',
  DESCRIPTION: '专业的订阅管理工具',
  AUTHOR: 'TingSub Team',
  COPYRIGHT: `© ${new Date().getFullYear()} TingSub. All rights reserved.`,
};

// 日期时间格式
export const DATE_FORMATS = {
  FULL_DATE: 'yyyy-MM-dd HH:mm:ss',
  DATE_ONLY: 'yyyy-MM-dd',
  TIME_ONLY: 'HH:mm:ss',
  MONTH_DAY: 'MM-dd',
  YEAR_MONTH: 'yyyy-MM',
  RELATIVE: 'relative', // 相对时间格式
} as const;

// 货币配置
export const CURRENCY = {
  DEFAULT: 'CNY',
  SYMBOLS: {
    CNY: '¥',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
  },
  FORMATS: {
    CNY: '¥#,##0.00',
    USD: '$#,##0.00',
    EUR: '€#,##0.00',
    GBP: '£#,##0.00',
    JPY: '¥#,##0',
  },
} as const;

// 订阅相关常量
export const SUBSCRIPTION = {
  // 订阅周期类型
  INTERVAL_TYPES: [
    { value: 'monthly', label: '月度' },
    { value: 'yearly', label: '年度' },
    { value: 'quarterly', label: '季度' },
    { value: 'weekly', label: '周度' },
    { value: 'one-time', label: '一次性' },
  ] as const,

  // 订阅状态
  STATUS_TYPES: [
    { value: 'active', label: '活跃', color: 'green' },
    { value: 'cancelled', label: '已取消', color: 'red' },
    { value: 'expired', label: '已过期', color: 'gray' },
  ] as const,

  // 默认提前提醒天数
  DEFAULT_REMINDER_DAYS: 3,

  // 提醒提前时间选项
  REMINDER_DAY_OPTIONS: [
    { value: 1, label: '提前1天' },
    { value: 3, label: '提前3天' },
    { value: 7, label: '提前1周' },
    { value: 15, label: '提前15天' },
    { value: 30, label: '提前1个月' },
  ] as const,
} as const;

// 分类相关常量
export const CATEGORY = {
  // 默认分类列表
  DEFAULT_CATEGORIES: [
    { id: '1', name: '视频', color: '#FF6B6B', icon: 'play-circle' },
    { id: '2', name: '音乐', color: '#4ECDC4', icon: 'music' },
    { id: '3', name: '云服务', color: '#45B7D1', icon: 'cloud' },
    { id: '4', name: '办公软件', color: '#96CEB4', icon: 'briefcase' },
    { id: '5', name: '教育学习', color: '#FFEAA7', icon: 'book' },
    { id: '6', name: '游戏娱乐', color: '#DDA0DD', icon: 'gamepad-variant' },
    { id: '7', name: '其他', color: '#95A5A6', icon: 'folder' },
  ] as const,
} as const;

// 通知相关常量
export const NOTIFICATION = {
  // 通知渠道
  CHANNELS: [{ value: 'local', label: '本地通知', enabled: true }] as const,

  // 通知重复间隔
  REPEAT_INTERVALS: [
    { value: 'none', label: '不重复' },
    { value: 'daily', label: '每天' },
    { value: 'weekly', label: '每周' },
  ] as const,

  // 默认通知标题
  DEFAULT_TITLE: '汀阅订阅提醒',

  // 通知声音设置
  SOUND_ENABLED: true,

  // 通知震动设置
  VIBRATION_ENABLED: true,
} as const;

// 存储相关常量
export const STORAGE = {
  // 存储键名前缀
  KEY_PREFIX: 'tingsub_',

  // 存储过期时间（30天）
  EXPIRY_DAYS: 30,
} as const;

// UI相关常量
export const UI = {
  // 页面布局
  PADDING: 16,
  MARGIN: 16,
  BORDER_RADIUS: 8,

  // 字体大小
  FONT_SIZES: {
    SMALL: 12,
    NORMAL: 14,
    MEDIUM: 16,
    LARGE: 18,
    XLARGE: 20,
    XXLARGE: 24,
  } as const,

  // 字体重量
  FONT_WEIGHTS: {
    LIGHT: '300',
    NORMAL: '400',
    MEDIUM: '500',
    BOLD: '700',
  } as const,

  // 动画时长
  ANIMATION_DURATIONS: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  } as const,

  // 列表分页
  PAGE_SIZE: 20,
} as const;

// 正则表达式常量
export const REGEX = {
  // 邮箱验证
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // URL验证
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,

  // 手机号码验证（中国大陆）
  PHONE: /^1[3-9]\d{9}$/,

  // 金额验证（正数，支持两位小数）
  AMOUNT: /^\d+(\.\d{1,2})?$/,

  // 整数验证
  INTEGER: /^-?\d+$/,
} as const;

// 错误消息常量
export const ERROR_MESSAGES = {
  // 通用错误
  NETWORK_ERROR: '网络连接异常，请检查网络设置',
  SERVER_ERROR: '服务器异常，请稍后重试',
  UNKNOWN_ERROR: '未知错误，请稍后重试',

  // 表单验证错误
  REQUIRED_FIELD: '此字段为必填项',
  INVALID_EMAIL: '请输入有效的邮箱地址',
  INVALID_PHONE: '请输入有效的手机号码',
  INVALID_AMOUNT: '请输入有效的金额（正数，最多两位小数）',
  MIN_LENGTH: (length: number) => `最少需要${length}个字符`,
  MAX_LENGTH: (length: number) => `最多允许${length}个字符`,

  // 数据库错误
  DB_CONNECT_ERROR: '数据库连接失败',
  DB_QUERY_ERROR: '数据查询失败',
  DB_SAVE_ERROR: '数据保存失败',
  DB_DELETE_ERROR: '数据删除失败',

  // 权限错误
  PERMISSION_DENIED: '权限不足，无法执行此操作',
  NOT_LOGGED_IN: '请先登录',
} as const;
