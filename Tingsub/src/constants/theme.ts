// 主题配置文件
// 统一管理应用的色彩、字体、间距等主题样式

import { DefaultTheme } from 'react-native-paper';

// 主色调 - 淡蓝色系
export const PRIMARY_COLORS = {
  // 主色
  primary: '#9ACFFF', // 主色 - 淡蓝色
  primaryDark: '#7AB8E8', // 主色深色 - 用于按下状态
  primaryLight: '#B8E0FF', // 主色浅色 - 用于背景装饰

  // 主色变体（透明度）
  primary50: '#F0F7FF', // 5%透明度
  primary100: '#E0EFFD', // 10%透明度
  primary200: '#C1E7FB', // 20%透明度
  primary300: '#A2DFF9', // 30%透明度
  primary400: '#83D7F7', // 40%透明度
  primary500: '#9ACFFF', // 50%透明度（主色）
  primary600: '#7AB8E8', // 60%透明度
  primary700: '#5AA2D1', // 70%透明度
  primary800: '#3A8CBA', // 80%透明度
  primary900: '#1A76A3', // 90%透明度
} as const;

// 中性色 - 用于文本、边框、背景
export const NEUTRAL_COLORS = {
  // 文本颜色
  text: {
    primary: '#1A1A1A', // 主要文本
    secondary: '#666666', // 次要文本
    tertiary: '#999999', // 辅助文本
    disabled: '#CCCCCC', // 禁用文本
    inverse: '#FFFFFF', // 反色文本
  },

  // 背景颜色
  background: {
    primary: '#FFFFFF', // 主背景
    secondary: '#F5F5F5', // 次要背景
    tertiary: '#E8E8E8', // 三级背景
    overlay: 'rgba(0, 0, 0, 0.5)', // 遮罩层
  },

  // 边框颜色
  border: {
    light: '#E0E0E0', // 浅边框
    medium: '#CCCCCC', // 中边框
    dark: '#999999', // 深边框
  },

  // 分割线
  divider: '#EEEEEE',
} as const;

// 语义色 - 用于状态提示
export const SEMANTIC_COLORS = {
  // 成功色
  success: {
    primary: '#52C41A', // 成功主色
    light: '#F6FFED', // 成功浅色背景
    border: '#B7EB8F', // 成功边框
  },

  // 警告色
  warning: {
    primary: '#FAAD14', // 警告主色
    light: '#FFFBE6', // 警告浅色背景
    border: '#FFE58F', // 警告边框
  },

  // 错误色
  error: {
    primary: '#F5222D', // 错误主色
    light: '#FFF1F0', // 错误浅色背景
    border: '#FFA39E', // 错误边框
  },

  // 信息色
  info: {
    primary: '#1890FF', // 信息主色
    light: '#E6F7FF', // 信息浅色背景
    border: '#91D5FF', // 信息边框
  },
} as const;

// 分类色 - 用于订阅分类
export const CATEGORY_COLORS = {
  video: '#FF0000', // 视频类 - 红色
  music: '#1DB954', // 音乐类 - 绿色
  tool: '#007AFF', // 工具类 - 蓝色
  education: '#5856D6', // 教育类 - 紫色
  life: '#34C759', // 生活类 - 青绿色
  cloud: '#FF9500', // 云存储类 - 橙色
  news: '#FF2D55', // 新闻类 - 粉红色
  finance: '#FFCC00', // 金融类 - 黄色
  health: '#00C7BE', // 健康类 - 青色
  other: '#8E8E93', // 其他类 - 灰色
} as const;

// 字体规范
export const TYPOGRAPHY = {
  // 字体家族
  fontFamily: {
    // iOS
    ios: {
      regular: 'SF Pro Text',
      medium: 'SF Pro Text Medium',
      semibold: 'SF Pro Text Semibold',
      bold: 'SF Pro Text Bold',
    },
    // Android
    android: {
      regular: 'Roboto',
      medium: 'Roboto Medium',
      semibold: 'Roboto Medium',
      bold: 'Roboto Bold',
    },
    // 通用
    default: 'System',
  },

  // 字号规范（单位：pt）
  fontSize: {
    // 标题字号
    h1: 32, // 大标题 - 页面主标题
    h2: 28, // 中标题 - 区块标题
    h3: 24, // 小标题 - 卡片标题
    h4: 20, // 副标题 - 列表标题

    // 正文字号
    body1: 16, // 正文1 - 主要内容
    body2: 14, // 正文2 - 次要内容
    body3: 12, // 正文3 - 辅助内容

    // 小字
    caption: 11, // 说明文字
    overline: 10, // 顶部说明文字
  },

  // 字体行高
  lineHeight: {
    h1: 40, // 大标题行高
    h2: 36, // 中标题行高
    h3: 32, // 小标题行高
    h4: 28, // 副标题行高
    body1: 24, // 正文1行高
    body2: 20, // 正文2行高
    body3: 16, // 正文3行高
    caption: 16, // 说明文字行高
    overline: 14, // 顶部说明文字行高
  },

  // 字体重量
  fontWeight: {
    regular: '400', // 常规
    medium: '500', // 中等
    semibold: '600', // 半粗
    bold: '700', // 粗体
  },
} as const;

// 间距规范（单位：pt）
export const SPACING = {
  xs: 4, // 超小间距
  sm: 8, // 小间距
  md: 16, // 中间距
  lg: 24, // 大间距
  xl: 32, // 超大间距
  xxl: 40, // 特大间距
} as const;

// 圆角规范（单位：pt）
export const BORDER_RADIUS = {
  none: 0, // 无圆角
  sm: 4, // 小圆角
  md: 8, // 中圆角
  lg: 12, // 大圆角
  xl: 16, // 超大圆角
  full: 9999, // 全圆角
} as const;

// 阴影规范
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6.27,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10.32,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 14.97,
    elevation: 12,
  },
} as const;

// 浅色主题配置
export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: PRIMARY_COLORS.primary,
    accent: PRIMARY_COLORS.primary,
    background: NEUTRAL_COLORS.background.primary,
    surface: NEUTRAL_COLORS.background.primary,
    text: NEUTRAL_COLORS.text.primary,
    disabled: NEUTRAL_COLORS.text.disabled,
    placeholder: NEUTRAL_COLORS.text.tertiary,
    backdrop: NEUTRAL_COLORS.background.overlay,
    error: SEMANTIC_COLORS.error.primary,
    notification: SEMANTIC_COLORS.info.primary,
  },
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
};

// 深色主题配置
export const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: PRIMARY_COLORS.primary,
    accent: PRIMARY_COLORS.primary,
    background: '#121212',
    surface: '#1E1E1E',
    text: NEUTRAL_COLORS.text.inverse,
    disabled: NEUTRAL_COLORS.text.disabled,
    placeholder: NEUTRAL_COLORS.text.tertiary,
    backdrop: 'rgba(0, 0, 0, 0.7)',
    error: SEMANTIC_COLORS.error.primary,
    notification: SEMANTIC_COLORS.info.primary,
  } as const,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
};

// 主题类型定义
export type ThemeType = typeof LightTheme | typeof DarkTheme;
export type ThemeMode = 'light' | 'dark' | 'system';

// 获取主题模式
export const getThemeMode = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'system') {
    // 根据系统主题自动切换
    // 注意：需要使用react-native-appearance库实现
    return 'light';
  }
  return mode;
};

// 获取当前主题
export const getCurrentTheme = (mode: ThemeMode): ThemeType => {
  const currentMode = getThemeMode(mode);
  return currentMode === 'dark' ? DarkTheme : LightTheme;
};
