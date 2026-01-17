// 路由常量配置文件
// 统一管理应用所有页面路由名称和路径

// 路由名称常量
export const ROUTE_NAMES = {
  // 认证相关
  ONBOARDING: 'Onboarding', // 引导页
  LOGIN: 'Login', // 登录页
  REGISTER: 'Register', // 注册页
  FORGOT_PASSWORD: 'ForgotPassword', // 忘记密码页

  // 主标签页
  MAIN_TABS: 'MainTabs', // 主标签页容器
  HOME: 'Home', // 首页
  SUBSCRIPTIONS: 'Subscriptions', // 订阅列表页
  STATISTICS: 'Statistics', // 统计页
  PROFILE: 'Profile', // 个人资料页

  // 订阅相关
  SUBSCRIPTION_DETAIL: 'SubscriptionDetail', // 订阅详情页
  ADD_SUBSCRIPTION: 'AddSubscription', // 添加订阅页
  EDIT_SUBSCRIPTION: 'EditSubscription', // 编辑订阅页
  SUBSCRIPTION_FILTER: 'SubscriptionFilter', // 订阅筛选页

  // 分类相关
  CATEGORIES: 'Categories', // 分类列表页
  CATEGORY_DETAIL: 'CategoryDetail', // 分类详情页
  ADD_CATEGORY: 'AddCategory', // 添加分类页
  EDIT_CATEGORY: 'EditCategory', // 编辑分类页

  // 标签相关
  TAGS: 'Tags', // 标签列表页
  TAG_DETAIL: 'TagDetail', // 标签详情页
  ADD_TAG: 'AddTag', // 添加标签页
  EDIT_TAG: 'EditTag', // 编辑标签页

  // 设置相关
  SETTINGS: 'Settings', // 设置页
  ACCOUNT_SETTINGS: 'AccountSettings', // 账户设置页
  NOTIFICATION_SETTINGS: 'NotificationSettings', // 通知设置页
  THEME_SETTINGS: 'ThemeSettings', // 主题设置页
  DATA_SETTINGS: 'DataSettings', // 数据管理页

  // 其他页面
  SEARCH: 'Search', // 搜索页
  FAVORITES: 'Favorites', // 收藏页
  HISTORY: 'History', // 历史记录页
  ABOUT: 'About', // 关于页
  HELP: 'Help', // 帮助页
  FEEDBACK: 'Feedback', // 意见反馈页
} as const;

// 路由路径配置（用于Web端）
export const ROUTE_PATHS = {
  // 认证相关
  [ROUTE_NAMES.ONBOARDING]: '/onboarding',
  [ROUTE_NAMES.LOGIN]: '/login',
  [ROUTE_NAMES.REGISTER]: '/register',
  [ROUTE_NAMES.FORGOT_PASSWORD]: '/forgot-password',

  // 主标签页
  [ROUTE_NAMES.MAIN_TABS]: '/',
  [ROUTE_NAMES.HOME]: '/home',
  [ROUTE_NAMES.SUBSCRIPTIONS]: '/subscriptions',
  [ROUTE_NAMES.STATISTICS]: '/statistics',
  [ROUTE_NAMES.PROFILE]: '/profile',

  // 订阅相关
  [ROUTE_NAMES.SUBSCRIPTION_DETAIL]: '/subscription/:id',
  [ROUTE_NAMES.ADD_SUBSCRIPTION]: '/subscription/add',
  [ROUTE_NAMES.EDIT_SUBSCRIPTION]: '/subscription/:id/edit',
  [ROUTE_NAMES.SUBSCRIPTION_FILTER]: '/subscriptions/filter',

  // 分类相关
  [ROUTE_NAMES.CATEGORIES]: '/categories',
  [ROUTE_NAMES.CATEGORY_DETAIL]: '/category/:id',
  [ROUTE_NAMES.ADD_CATEGORY]: '/category/add',
  [ROUTE_NAMES.EDIT_CATEGORY]: '/category/:id/edit',

  // 标签相关
  [ROUTE_NAMES.TAGS]: '/tags',
  [ROUTE_NAMES.TAG_DETAIL]: '/tag/:id',
  [ROUTE_NAMES.ADD_TAG]: '/tag/add',
  [ROUTE_NAMES.EDIT_TAG]: '/tag/:id/edit',

  // 设置相关
  [ROUTE_NAMES.SETTINGS]: '/settings',
  [ROUTE_NAMES.ACCOUNT_SETTINGS]: '/settings/account',
  [ROUTE_NAMES.NOTIFICATION_SETTINGS]: '/settings/notifications',
  [ROUTE_NAMES.THEME_SETTINGS]: '/settings/theme',
  [ROUTE_NAMES.DATA_SETTINGS]: '/settings/data',

  // 其他页面
  [ROUTE_NAMES.SEARCH]: '/search',
  [ROUTE_NAMES.FAVORITES]: '/favorites',
  [ROUTE_NAMES.HISTORY]: '/history',
  [ROUTE_NAMES.ABOUT]: '/about',
  [ROUTE_NAMES.HELP]: '/help',
  [ROUTE_NAMES.FEEDBACK]: '/feedback',
} as const;

// 路由参数类型定义
export type RouteParams = {
  // 认证相关
  [ROUTE_NAMES.ONBOARDING]: undefined;
  [ROUTE_NAMES.LOGIN]: undefined;
  [ROUTE_NAMES.REGISTER]: undefined;
  [ROUTE_NAMES.FORGOT_PASSWORD]: undefined;

  // 主标签页
  [ROUTE_NAMES.MAIN_TABS]: undefined;
  [ROUTE_NAMES.HOME]: undefined;
  [ROUTE_NAMES.SUBSCRIPTIONS]: undefined;
  [ROUTE_NAMES.STATISTICS]: undefined;
  [ROUTE_NAMES.PROFILE]: undefined;

  // 订阅相关
  [ROUTE_NAMES.SUBSCRIPTION_DETAIL]: { id: string };
  [ROUTE_NAMES.ADD_SUBSCRIPTION]: undefined;
  [ROUTE_NAMES.EDIT_SUBSCRIPTION]: { id: string };
  [ROUTE_NAMES.SUBSCRIPTION_FILTER]: { filters?: any };

  // 分类相关
  [ROUTE_NAMES.CATEGORIES]: undefined;
  [ROUTE_NAMES.CATEGORY_DETAIL]: { id: string };
  [ROUTE_NAMES.ADD_CATEGORY]: undefined;
  [ROUTE_NAMES.EDIT_CATEGORY]: { id: string };

  // 标签相关
  [ROUTE_NAMES.TAGS]: undefined;
  [ROUTE_NAMES.TAG_DETAIL]: { id: string };
  [ROUTE_NAMES.ADD_TAG]: undefined;
  [ROUTE_NAMES.EDIT_TAG]: { id: string };

  // 设置相关
  [ROUTE_NAMES.SETTINGS]: undefined;
  [ROUTE_NAMES.ACCOUNT_SETTINGS]: undefined;
  [ROUTE_NAMES.NOTIFICATION_SETTINGS]: undefined;
  [ROUTE_NAMES.THEME_SETTINGS]: undefined;
  [ROUTE_NAMES.DATA_SETTINGS]: undefined;

  // 其他页面
  [ROUTE_NAMES.SEARCH]: { query?: string };
  [ROUTE_NAMES.FAVORITES]: undefined;
  [ROUTE_NAMES.HISTORY]: undefined;
  [ROUTE_NAMES.ABOUT]: undefined;
  [ROUTE_NAMES.HELP]: undefined;
  [ROUTE_NAMES.FEEDBACK]: undefined;
};

// 路由屏幕选项配置
export const ROUTE_SCREEN_OPTIONS = {
  // 默认屏幕选项
  default: {
    headerStyle: {
      backgroundColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTitleStyle: {
      fontSize: 18,
      fontWeight: '600',
    },
    headerTintColor: '#1A1A1A',
    headerBackTitleVisible: false,
  },

  // 无头部的屏幕选项
  noHeader: {
    headerShown: false,
  },

  // 全屏屏幕选项
  fullScreen: {
    headerShown: false,
    presentation: 'fullScreenModal',
  },

  // 模态框屏幕选项
  modal: {
    presentation: 'modal',
    headerStyle: {
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
  },
} as const;

// 标签页配置
export const TAB_BAR_OPTIONS = {
  // 标签栏样式
  style: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },

  // 标签图标样式
  iconStyle: {
    width: 24,
    height: 24,
  },

  // 标签文字样式
  labelStyle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },

  // 活跃状态样式
  activeTintColor: '#9ACFFF',
  inactiveTintColor: '#999999',

  // 隐藏标签文字（仅显示图标）
  showLabel: true,

  // 隐藏标签栏
  showIcon: true,
} as const;

// 路由权限配置
export const ROUTE_PERMISSIONS = {
  // 公开页面（无需登录）
  PUBLIC_ROUTES: [
    ROUTE_NAMES.ONBOARDING,
    ROUTE_NAMES.LOGIN,
    ROUTE_NAMES.REGISTER,
    ROUTE_NAMES.FORGOT_PASSWORD,
  ] as const,

  // 需要登录的页面
  PROTECTED_ROUTES: [
    ROUTE_NAMES.MAIN_TABS,
    ROUTE_NAMES.HOME,
    ROUTE_NAMES.SUBSCRIPTIONS,
    ROUTE_NAMES.STATISTICS,
    ROUTE_NAMES.PROFILE,
    ROUTE_NAMES.SUBSCRIPTION_DETAIL,
    ROUTE_NAMES.ADD_SUBSCRIPTION,
    ROUTE_NAMES.EDIT_SUBSCRIPTION,
    ROUTE_NAMES.CATEGORIES,
    ROUTE_NAMES.CATEGORY_DETAIL,
    ROUTE_NAMES.ADD_CATEGORY,
    ROUTE_NAMES.EDIT_CATEGORY,
    ROUTE_NAMES.SETTINGS,
    ROUTE_NAMES.SEARCH,
    ROUTE_NAMES.FAVORITES,
  ] as const,

  // 需要管理员权限的页面
  ADMIN_ROUTES: [] as const,
} as const;

// 检查路由是否需要登录
export const isProtectedRoute = (routeName: string): boolean => {
  return ROUTE_PERMISSIONS.PROTECTED_ROUTES.includes(routeName as any);
};

// 检查路由是否为公开页面
export const isPublicRoute = (routeName: string): boolean => {
  return ROUTE_PERMISSIONS.PUBLIC_ROUTES.includes(routeName as any);
};

// 检查路由是否需要管理员权限
export const isAdminRoute = (): boolean => {
  return false;
};

// 获取路由标题
export const getRouteTitle = (routeName: string): string => {
  const titleMap: Record<string, string> = {
    [ROUTE_NAMES.HOME]: '首页',
    [ROUTE_NAMES.SUBSCRIPTIONS]: '我的订阅',
    [ROUTE_NAMES.STATISTICS]: '统计分析',
    [ROUTE_NAMES.PROFILE]: '个人中心',
    [ROUTE_NAMES.SUBSCRIPTION_DETAIL]: '订阅详情',
    [ROUTE_NAMES.ADD_SUBSCRIPTION]: '添加订阅',
    [ROUTE_NAMES.EDIT_SUBSCRIPTION]: '编辑订阅',
    [ROUTE_NAMES.CATEGORIES]: '分类管理',
    [ROUTE_NAMES.CATEGORY_DETAIL]: '分类详情',
    [ROUTE_NAMES.ADD_CATEGORY]: '添加分类',
    [ROUTE_NAMES.EDIT_CATEGORY]: '编辑分类',
    [ROUTE_NAMES.SETTINGS]: '设置',
    [ROUTE_NAMES.SEARCH]: '搜索',
    [ROUTE_NAMES.FAVORITES]: '我的收藏',
    [ROUTE_NAMES.ONBOARDING]: '欢迎使用汀阅',
    [ROUTE_NAMES.LOGIN]: '登录',
    [ROUTE_NAMES.REGISTER]: '注册',
  };

  return titleMap[routeName] || routeName;
};
