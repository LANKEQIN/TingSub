// 存储键名配置文件
// 统一管理AsyncStorage和其他存储机制的键名

// 用户相关存储键名
export const USER_STORAGE_KEYS = {
  // 用户基本信息
  USER_INFO: 'user_info',

  // 用户设置
  USER_SETTINGS: 'user_settings',

  // 主题设置
  THEME_SETTING: 'theme_setting',

  // 货币设置
  CURRENCY_SETTING: 'currency_setting',

  // 提醒设置
  REMINDER_SETTINGS: 'reminder_settings',

  // 登录状态
  LOGIN_STATUS: 'login_status',

  // 最后登录时间
  LAST_LOGIN_TIME: 'last_login_time',
} as const;

// 订阅相关存储键名
export const SUBSCRIPTION_STORAGE_KEYS = {
  // 订阅列表缓存
  SUBSCRIPTION_LIST: 'subscription_list',

  // 订阅筛选条件
  SUBSCRIPTION_FILTERS: 'subscription_filters',

  // 订阅排序设置
  SUBSCRIPTION_SORT: 'subscription_sort',

  // 最近查看的订阅
  RECENT_SUBSCRIPTIONS: 'recent_subscriptions',

  // 收藏的订阅
  FAVORITE_SUBSCRIPTIONS: 'favorite_subscriptions',
} as const;

// 分类相关存储键名
export const CATEGORY_STORAGE_KEYS = {
  // 分类列表缓存
  CATEGORY_LIST: 'category_list',

  // 分类排序设置
  CATEGORY_SORT: 'category_sort',
} as const;

// 标签相关存储键名
export const TAG_STORAGE_KEYS = {
  // 标签列表缓存
  TAG_LIST: 'tag_list',

  // 常用标签
  FREQUENT_TAGS: 'frequent_tags',
} as const;

// 通知相关存储键名
export const NOTIFICATION_STORAGE_KEYS = {
  // 通知权限状态
  NOTIFICATION_PERMISSION: 'notification_permission',

  // 通知设置
  NOTIFICATION_SETTINGS: 'notification_settings',

  // 已发送的通知记录
  NOTIFICATION_HISTORY: 'notification_history',

  // 提醒计划
  REMINDER_SCHEDULES: 'reminder_schedules',
} as const;

// 应用配置存储键名
export const APP_STORAGE_KEYS = {
  // 应用首次启动标记
  FIRST_LAUNCH: 'first_launch',

  // 应用引导完成标记
  ONBOARDING_COMPLETED: 'onboarding_completed',

  // 应用版本记录
  APP_VERSION_HISTORY: 'app_version_history',

  // 语言设置
  LANGUAGE_SETTING: 'language_setting',

  // 地区设置
  REGION_SETTING: 'region_setting',

  // 数据同步设置
  SYNC_SETTINGS: 'sync_settings',

  // 数据备份记录
  BACKUP_HISTORY: 'backup_history',
} as const;

// 搜索相关存储键名
export const SEARCH_STORAGE_KEYS = {
  // 搜索历史记录
  SEARCH_HISTORY: 'search_history',

  // 搜索建议缓存
  SEARCH_SUGGESTIONS: 'search_suggestions',

  // 热门搜索关键词
  TRENDING_SEARCHES: 'trending_searches',
} as const;

// 统计相关存储键名
export const ANALYTICS_STORAGE_KEYS = {
  // 用户行为统计
  USER_ACTIONS: 'user_actions',

  // 应用使用时长
  APP_USAGE_DURATION: 'app_usage_duration',

  // 功能使用频率
  FEATURE_USAGE: 'feature_usage',

  // 错误日志
  ERROR_LOGS: 'error_logs',
} as const;

// 云端相关存储键名
export const CLOUD_STORAGE_KEYS = {
  // 云端同步令牌
  SYNC_TOKEN: 'sync_token',

  // 云端用户信息
  CLOUD_USER_INFO: 'cloud_user_info',

  // 云端数据最后同步时间
  LAST_SYNC_TIME: 'last_sync_time',

  // 云端数据版本
  CLOUD_DATA_VERSION: 'cloud_data_version',
} as const;

// 生成带前缀的完整存储键名
export const getStorageKey = (key: string, prefix?: string): string => {
  const basePrefix = 'tingsub_';
  const customPrefix = prefix ? `${prefix}_` : '';
  return `${basePrefix}${customPrefix}${key}`;
};

// 生成用户特定的存储键名（包含用户ID）
export const getUserStorageKey = (key: string, userId: string): string => {
  return getStorageKey(key, `user_${userId}`);
};

// 清除所有存储键名的前缀
export const removeStorageKeyPrefix = (fullKey: string): string => {
  const basePrefix = 'tingsub_';
  if (fullKey.startsWith(basePrefix)) {
    return fullKey.slice(basePrefix.length);
  }
  return fullKey;
};
