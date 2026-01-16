# 汀阅（TingSub）UI/UX设计文档

## 一、设计原则与理念

### 1.1 设计理念
汀阅（TingSub）的设计理念是"简洁、高效、安全"，通过清晰的视觉层次和直观的交互方式，帮助用户轻松管理订阅服务。

### 1.2 核心设计原则

#### 1.2.1 简洁优先
- **界面简洁**：去除不必要的装饰元素，突出核心功能
- **信息清晰**：重要信息一目了然，次要信息适当弱化
- **操作直观**：常用功能易于触达，减少操作步骤

#### 1.2.2 一致性
- **视觉一致**：统一的色彩、字体、间距和组件样式
- **交互一致**：相似的操作使用相同的交互方式
- **语言一致**：统一的文案风格和用词规范

#### 1.2.3 反馈及时
- **操作反馈**：每个操作都有明确的视觉或触觉反馈
- **状态提示**：清晰展示当前状态（加载中、成功、失败等）
- **错误提示**：友好的错误信息和解决建议

#### 1.2.4 可访问性
- **字体大小**：确保文字清晰可读
- **对比度**：保证足够的色彩对比度
- **触控区域**：按钮触击区域不小于44x44pt

#### 1.2.5 性能优先
- **流畅动画**：动画时长控制在300-500ms
- **快速响应**：页面切换和操作响应迅速
- **轻量设计**：减少不必要的视觉元素，提升性能

## 二、色彩系统

### 2.1 主色调
```typescript
// 主色调 - 淡蓝色系
const PRIMARY_COLORS = {
  // 主色
  primary: '#9ACFFF',           // 主色 - 淡蓝色
  primaryDark: '#7AB8E8',       // 主色深色 - 用于按下状态
  primaryLight: '#B8E0FF',      // 主色浅色 - 用于背景装饰
  
  // 主色变体
  primary50: '#F0F7FF',         // 5%透明度
  primary100: '#E0EFFD',        // 10%透明度
  primary200: '#C1E7FB',        // 20%透明度
  primary300: '#A2DFF9',        // 30%透明度
  primary400: '#83D7F7',        // 40%透明度
  primary500: '#9ACFFF',        // 50%透明度（主色）
  primary600: '#7AB8E8',        // 60%透明度
  primary700: '#5AA2D1',        // 70%透明度
  primary800: '#3A8CBA',        // 80%透明度
  primary900: '#1A76A3',        // 90%透明度
};
```

### 2.2 中性色
```typescript
// 中性色 - 用于文本、边框、背景
const NEUTRAL_COLORS = {
  // 文本颜色
  text: {
    primary: '#1A1A1A',         // 主要文本
    secondary: '#666666',        // 次要文本
    tertiary: '#999999',         // 辅助文本
    disabled: '#CCCCCC',         // 禁用文本
    inverse: '#FFFFFF',          // 反色文本
  },
  
  // 背景颜色
  background: {
    primary: '#FFFFFF',         // 主背景
    secondary: '#F5F5F5',        // 次要背景
    tertiary: '#E8E8E8',         // 三级背景
    overlay: 'rgba(0, 0, 0, 0.5)', // 遮罩层
  },
  
  // 边框颜色
  border: {
    light: '#E0E0E0',           // 浅边框
    medium: '#CCCCCC',          // 中边框
    dark: '#999999',            // 深边框
  },
  
  // 分割线
  divider: '#EEEEEE',
};
```

### 2.3 语义色
```typescript
// 语义色 - 用于状态提示
const SEMANTIC_COLORS = {
  // 成功色
  success: {
    primary: '#52C41A',         // 成功主色
    light: '#F6FFED',            // 成功浅色背景
    border: '#B7EB8F',          // 成功边框
  },
  
  // 警告色
  warning: {
    primary: '#FAAD14',         // 警告主色
    light: '#FFFBE6',            // 警告浅色背景
    border: '#FFE58F',          // 警告边框
  },
  
  // 错误色
  error: {
    primary: '#F5222D',         // 错误主色
    light: '#FFF1F0',            // 错误浅色背景
    border: '#FFA39E',          // 错误边框
  },
  
  // 信息色
  info: {
    primary: '#1890FF',         // 信息主色
    light: '#E6F7FF',            // 信息浅色背景
    border: '#91D5FF',          // 信息边框
  },
};
```

### 2.4 分类色
```typescript
// 分类色 - 用于订阅分类
const CATEGORY_COLORS = {
  video: '#FF0000',             // 视频类 - 红色
  music: '#1DB954',             // 音乐类 - 绿色
  tool: '#007AFF',              // 工具类 - 蓝色
  education: '#5856D6',         // 教育类 - 紫色
  life: '#34C759',              // 生活类 - 青绿色
  cloud: '#FF9500',             // 云存储类 - 橙色
  news: '#FF2D55',              // 新闻类 - 粉红色
  finance: '#FFCC00',          // 金融类 - 黄色
  health: '#00C7BE',            // 健康类 - 青色
  other: '#8E8E93',             // 其他类 - 灰色
};
```

### 2.5 色彩使用规范

#### 2.5.1 主色使用场景
- **主色（#9ACFFF）**：主要按钮、选中状态、重要图标
- **主色深色（#7AB8E8）**：按钮按下状态、选中状态深色
- **主色浅色（#B8E0FF）**：背景装饰、进度条背景

#### 2.5.2 中性色使用场景
- **主要文本（#1A1A1A）**：标题、重要信息
- **次要文本（#666666）**：正文、描述信息
- **辅助文本（#999999）**：提示信息、次要说明
- **禁用文本（#CCCCCC）**：禁用状态的文本

#### 2.5.3 语义色使用场景
- **成功色**：操作成功、完成状态
- **警告色**：即将到期、需要注意的状态
- **错误色**：操作失败、错误提示
- **信息色**：一般提示、信息说明

## 三、字体规范

### 3.1 字体家族
```typescript
const TYPOGRAPHY = {
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
};
```

### 3.2 字号规范
```typescript
const FONT_SIZES = {
  // 标题字号
  h1: 32,                       // 大标题 - 页面主标题
  h2: 28,                       // 中标题 - 区块标题
  h3: 24,                       // 小标题 - 卡片标题
  h4: 20,                       // 副标题 - 列表标题
  
  // 正文字号
  body1: 16,                    // 大正文 - 主要内容
  body2: 14,                    // 中正文 - 次要内容
  body3: 12,                    // 小正文 - 辅助内容
  
  // 特殊字号
  caption: 11,                  // 说明文字 - 标签、注释
  overline: 10,                 // 超小文字 - 版权、页脚
};
```

### 3.3 字重规范
```typescript
const FONT_WEIGHTS = {
  regular: '400',               // 常规 - 正文
  medium: '500',                // 中等 - 次要标题
  semibold: '600',              // 半粗 - 主要标题
  bold: '700',                  // 粗体 - 强调文字
};
```

### 3.4 行高规范
```typescript
const LINE_HEIGHTS = {
  tight: 1.2,                   // 紧凑 - 标题
  normal: 1.5,                   // 正常 - 正文
  relaxed: 1.8,                 // 宽松 - 长文本
};
```

### 3.5 字体使用示例
```typescript
// 标题样式
const headingStyles = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
    color: '#1A1A1A',
  },
  h2: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 34,
    color: '#1A1A1A',
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
    color: '#1A1A1A',
  },
};

// 正文样式
const bodyStyles = {
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: '#1A1A1A',
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: '#666666',
  },
  body3: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: '#999999',
  },
};
```

## 四、间距与布局规范

### 4.1 间距系统
```typescript
const SPACING = {
  // 基础间距单位（4px）
  xs: 4,                        // 超小间距 - 图标与文字间距
  sm: 8,                        // 小间距 - 相关元素间距
  md: 16,                       // 中间距 - 区块内间距
  lg: 24,                       // 大间距 - 区块间间距
  xl: 32,                       // 超大间距 - 页面级间距
  xxl: 48,                      // 特大间距 - 章节间距
};
```

### 4.2 布局规范

#### 4.2.1 页面边距
```typescript
const PAGE_PADDING = {
  horizontal: 16,               // 水平边距
  vertical: 16,                 // 垂直边距
};
```

#### 4.2.2 卡片间距
```typescript
const CARD_SPACING = {
  padding: 16,                  // 卡片内边距
  margin: 12,                   // 卡片外边距
  borderRadius: 12,            // 圆角半径
};
```

#### 4.2.3 列表项间距
```typescript
const LIST_ITEM_SPACING = {
  padding: 16,                  // 列表项内边距
  margin: 8,                    // 列表项外边距
  height: 72,                  // 列表项高度
};
```

#### 4.2.4 按钮间距
```typescript
const BUTTON_SPACING = {
  padding: {
    horizontal: 24,             // 水平内边距
    vertical: 12,               // 垂直内边距
  },
  margin: 8,                    // 按钮外边距
  minWidth: 88,                 // 最小宽度
  minHeight: 44,                // 最小高度
};
verflow: 'hidden',
  },
  
  // 按钮样式
  button: {
    backgroundColor: '#9ACFFF',
    color: '#FFFFFF',
    padding: '12px 24px',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: '500',
    minHeight: 44,
    minWidth: 88,
  },
  
  // 输入框样式
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    padding: '12px 16px',
    fontSize: 16,
    color: '#1A1A1A',
  },
  
  // 卡片样式
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // 列表项样式
  listItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    minHeight: 72,
  },
  
  // 标签样式
  tag: {
    backgroundColor: '#F0F7FF',
    color: '#9ACFFF',
    padding: '4px 12px',
    borderRadius: 16,
    fontSize: 12,
    fontWeight: '500',
  },
  
  // 徽章样式
  badge: {
    backgroundColor: '#F5222D',
    color: '#FFFFFF',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // 分割线样式
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 8,
  },
  
  // 头像样式
  avatar: {
    small: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    medium: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    large: {
      width: 64,
      height: 64,
      borderRadius: 32,
    },
  },
  
  // 图标样式
  icon: {
    small: {
      size: 16,
    },
    medium: {
      size: 24,
    },
    large: {
      size: 32,
    },
  },
};
```

### 5.2 组件状态规范

#### 5.2.1 按钮状态
```typescript
const BUTTON_STATES = {
  // 正常状态
  normal: {
    backgroundColor: '#9ACFFF',
    color: '#FFFFFF',
  },
  
  // 按下状态
  pressed: {
    backgroundColor: '#7AB8E8',
    color: '#FFFFFF',
  },
  
  // 禁用状态
  disabled: {
    backgroundColor: '#E0E0E0',
    color: '#CCCCCC',
  },
  
  // 加载状态
  loading: {
    backgroundColor: '#9ACFFF',
    color: '#FFFFFF',
    opacity: 0.7,
  },
};
```

#### 5.2.2 输入框状态
```typescript
const INPUT_STATES = {
  // 正常状态
  normal: {
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  
  // 聚焦状态
  focused: {
    borderColor: '#9ACFFF',
    backgroundColor: '#FFFFFF',
  },
  
  // 错误状态
  error: {
    borderColor: '#F5222D',
    backgroundColor: '#FFF1F0',
  },
  
  // 禁用状态
  disabled: {
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
};
```

## 六、页面布局设计

### 6.1 首页布局
```
┌─────────────────────────────────┐
│  顶部导航栏                      │
│  [搜索框] [筛选] [排序]         │
├─────────────────────────────────┤
│  统计卡片                        │
│  [月度支出] [订阅数量]          │
├─────────────────────────────────┤
│  即将到期                        │
│  [订阅卡片1] [订阅卡片2]        │
├─────────────────────────────────┤
│  最近添加                        │
│  [订阅卡片3] [订阅卡片4]        │
├─────────────────────────────────┤
│  底部导航栏                      │
│  [首页] [分类] [统计] [设置]    │
└─────────────────────────────────┘
```

### 6.2 订阅列表页布局
```
┌─────────────────────────────────┐
│  顶部导航栏                      │
│  [返回] 订阅列表 [添加]         │
├─────────────────────────────────┤
│  筛选栏                          │
│  [分类] [状态] [排序]           │
├─────────────────────────────────┤
│  订阅列表                        │
│  ┌───────────────────────────┐  │
│  │ 订阅卡片1                 │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ 订阅卡片2                 │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ 订阅卡片3                 │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### 6.3 订阅详情页布局
```
┌─────────────────────────────────┐
│  顶部导航栏                      │
│  [返回] 订阅详情 [编辑]         │
├─────────────────────────────────┤
│  订阅信息卡片                    │
│  [图标] 订阅名称                │
│  费用 | 周期 | 状态              │
├─────────────────────────────────┤
│  详细信息                        │
│  开始日期: 2024-01-01           │
│  到期日期: 2024-12-31           │
│  下次续费: 2024-02-01           │
│  支付方式: 支付宝                │
├─────────────────────────────────┤
│  分类与标签                      │
│  [分类标签] [标签1] [标签2]     │
├─────────────────────────────────┤
│  备注信息                        │
│  这是订阅的备注信息...           │
├─────────────────────────────────┤
│  操作按钮                        │
│  [编辑] [取消订阅] [删除]       │
└─────────────────────────────────┘
```

### 6.4 添加/编辑订阅页布局
```
┌─────────────────────────────────┐
│  顶部导航栏                      │
│  [返回] 添加订阅 [保存]         │
├─────────────────────────────────┤
│  表单区域                        │
│  ┌───────────────────────────┐  │
│  │ 订阅名称 *                 │  │
│  │ [输入框]                   │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ 订阅费用 *                 │  │
│  │ [输入框]                   │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ 订阅周期 *                 │  │
│  │ [下拉选择]                 │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ 开始日期 *                 │  │
│  │ [日期选择器]               │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ 分类 *                     │  │
│  │ [分类选择器]               │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ 标签                       │  │
│  │ [标签选择器]               │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ 备注                       │  │
│  │ [多行输入框]               │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### 6.5 分类列表页布局
```
┌─────────────────────────────────┐
│  顶部导航栏                      │
│  [返回] 分类管理 [添加]         │
├─────────────────────────────────┤
│  分类列表                        │
│  ┌───────────────────────────┐  │
│  │ [图标] 视频类 (5个订阅)    │  │
│  │ 支出: ¥298/月              │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ [图标] 音乐类 (3个订阅)    │  │
│  │ 支出: ¥45/月               │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ [图标] 工具类 (8个订阅)    │  │
│  │ 支出: ¥156/月              │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### 6.6 统计页布局
```
┌─────────────────────────────────┐
│  顶部导航栏                      │
│  [返回] 统计分析 [导出]         │
├─────────────────────────────────┤
│  时间选择器                      │
│  [本月] [本季度] [本年] [自定义]│
├─────────────────────────────────┤
│  总支出卡片                      │
│  本月总支出: ¥499               │
├─────────────────────────────────┤
│  分类占比图                      │
│  [饼图]                         │
│  视频 60% | 音乐 25% | 工具 15% │
├─────────────────────────────────┤
│  支出趋势图                      │
│  [折线图]                       │
│  显示最近6个月的支出趋势         │
├─────────────────────────────────┤
│  订阅排行                        │
│  1. Netflix - ¥98/月            │
│  2. Adobe CC - ¥298/月          │
│  3. Spotify - ¥15/月            │
└─────────────────────────────────┘
```

### 6.7 设置页布局
```
┌─────────────────────────────────┐
│  顶部导航栏                      │
│  [返回] 设置                     │
├─────────────────────────────────┤
│  用户信息                        │
│  [头像] 用户名                  │
├─────────────────────────────────┤
│  通用设置                        │
│  主题设置 [浅色/深色/跟随系统]  │
│  语言设置 [中文/英文]           │
│  货币设置 [CNY/USD/EUR]         │
├─────────────────────────────────┤
│  提醒设置                        │
│  提醒开关 [开/关]               │
│  提前天数 [1-7天]               │
│  通知渠道 [本地推送]            │
├─────────────────────────────────┤
│  数据管理                        │
│  数据导出 [CSV/JSON]            │
│  数据导入                       │
│  清除缓存                       │
├─────────────────────────────────┤
│  关于                            │
│  版本信息                        │
│  用户协议                        │
│  隐私政策                        │
└─────────────────────────────────┘
```

## 七、交互设计规范

### 7.1 手势交互

#### 7.1.1 点击交互
- **触控区域**：最小44x44pt
- **点击反馈**：按下时颜色变深或透明度降低
- **点击时长**：快速点击，响应时间<100ms

#### 7.1.2 长按交互
- **长按时长**：500ms
- **长按反馈**：震动反馈 + 视觉反馈
- **长按操作**：显示上下文菜单或快捷操作

#### 7.1.3 滑动交互
- **滑动阈值**：水平滑动>50px触发
- **滑动反馈**：实时跟随手指移动
- **滑动阻尼**：超出边界时阻尼效果

#### 7.1.4 下拉刷新
- **触发距离**：下拉80距离触发
- **刷新动画**：显示加载指示器
- **刷新完成**：显示成功提示

1.2.2 页面切换动画
```typescript
const PAGE_TRANSITIONS = {
  // 推入动画
  push: {
    type: 'slide',
    duration: 300,
    easing: 'ease-in-out',
  },
  
  // 弹出动画
  pop: {
    type: 'slide',
    duration: 300,
    easing: 'ease-in-out',
  },
  
  // 模态动画
  modal: {
    type: 'fade',
    duration: 250,
    easing: 'ease-out',
  },
};
```

#### 7.2.3 元素动画
```typescript
const ELEMENT_ANIMATIONS = {
  // 淡入动画
  fadeIn: {
    duration: 300,
    easing: 'ease-in',
  },
  
  // 淡出动画
  fadeOut: {
    duration: 300,
    easing: 'ease-out',
  },
  
  // 缩放动画
  scale: {
    duration: 200,
    easing: 'ease-in-out',
  },
  
  // 滑动动画
  slide: {
    duration: 300,
    easing: 'ease-in-out',
  },
};
```

### 7.3 反馈设计

#### 7.3.1 视觉反馈
- **按钮按下**：颜色变深或透明度降低
- **输入聚焦**：边框颜色变为主色
- **加载状态**：显示加载指示器
- **成功状态**：显示成功图标或提示
- **错误状态**：显示错误图标或提示

#### 7.3.2 触觉反馈
```typescript
const HAPTIC_FEEDBACK = {
  // 轻微震动 - 用于按钮点击
  light: 'light',
  
  // 中等震动 - 用于重要操作
  medium: 'medium',
  
  // 强烈震动 - 用于错误提示
  heavy: 'heavy',
  
  // 选择震动 - 用于选择操作
  selection: 'selection',
};
```

#### 7.3.3 声音反馈
- **点击音效**：按钮点击时播放
- **成功音效**：操作成功时播放
- **错误音效**：操作失败时播放
- **提醒音效**：到期提醒时播放

### 7.4 加载状态设计

#### 7.4.1 全局加载
- **加载指示器**：居中显示圆形加载动画
- **加载文字**：显示"加载中..."提示
- **背景遮罩**：半透明黑色遮罩

#### 7.4.2 局部加载
- **骨架屏**：显示内容占位符
- **加载指示器**：在加载位置显示小型加载动画
- **渐进加载**：内容逐步显示

#### 7.4.3 下拉刷新
- **[下拉刷新]**：显示刷新指示器
- **刷新中**：显示加载动画
- **刷新完成**：显示成功提示

## 八、响应式设计规范

### 8.1 屏幕尺寸适配
```typescript
const SCREEN_SIZES = {
  // 小屏幕 - iPhone SE
  small: {
    width: 375,
    height: 667,
  },
  
  // 中屏幕 - iPhone 12/13/14
  medium: {
    width: 390,
    height: 844,
  },
  
  // 大屏幕 - iPhone 14 Pro Max
  large: {
    width: 430,
    height: 932,
  },
  
  // 平板 - iPad
  tablet: {
    width: 768,
    height: 1024,
  },
    // 横屏适配
  landscape: {
    padding: 24,
    fontSize: 18,
  },
  
  // 竖屏适配
  portrait: {
    padding: 16,
    fontSize: 16,
  },
};
```

### 8.2 字体响应式
```typescript
const RESPONSIVE_FONT = {
  // 标题字号
  h1: {
    small: 28,
    medium: 32,
    large: 36,
  },
  
  // 正文字号
  body: {
    small: 14,
    medium: 16,
    large: 18,
  },
};
```

### 8.3 间距响应式
```typescript
const RESPONSIVE_SPACING = {
  // 页面边距
  pagePadding: {
    small: 12,
    medium: 16,
    large: 20,
  },
  
  // 卡片间距
  cardPadding: {
    small: 12,
    medium: 16,
    large: 20,
  },
};
```

## 九、无障碍设计规范

### 9.1 色彩对比度
- **正常文本**：对比度≥4.5:1
- **大文本**：对比度≥3:1
- **UI组件**：对比度≥3:1

### 9.2 字体大小
- **最小字号**：不小于11pt
- **推荐字号**：正文14-16pt
- **标题字号**：24-32pt

### 9.3 触控区域
- **最小触控区域**：44x44pt
- **推荐触控区域**：48x48pt
- **按钮间距**：不小于8pt

### 9.4 屏幕阅读器支持
```typescript
// 为组件添加无障碍属性
const accessibilityProps = {
  // 可访问性标签
  accessibilityLabel: '添加订阅按钮',
  
  // 可访问性提示
  accessibilityHint: '点击添加新的订阅',
  
  // 可访问性角色
  accessibilityRole: 'button',
  
  // 可访问性状态
  accessibilityState: {
    disabled: false,
    selected: false,
  },
};
```

### 9.5 动态字体支持
```typescript
// 支持系统字体大小设置
const FONT_SCALING = {
  // 启用字体缩放
  allowFontScaling: true,
  
  // 字体缩放比例
  maxFontSizeMultiplier: 1.3,
};
```

## 十、图标使用规范

### 10.1 图标库
- **图标库**：React Native Vector Icons
- **图标集**：Material Icons
- **图标风格**：线性图标

### 10.2 图标尺寸
```typescript
const ICON_SIZES = {
  // 超小图标
  xs: 16,
  
  // 小图标
  sm: 20,
  
  // 中图标
  md: 24,
  
  // 大图标
  lg: 32,
  
  // 超大图标
  xl: 48,
};
```

### 10.3 常用图标
```typescript
const COMMON_ICONS = {
  // 导航图标
  home: 'home',
  category: 'category',
  statistics: 'bar-chart',
  settings: 'settings',
  
  // 操作图标
  add: 'add',
  edit: 'edit',
  delete: 'delete',
  search: 'search',
  filter: 'filter',
  sort: 'sort',
  more: 'more-vert',
  
  // 状态图标
  check: 'check-circle',
  warning: 'warning',
  error: 'error',
  info: 'info',
  
  // 订阅图标
  subscription: 'subscriptions',
  renewal: 'autorenew',
  expired: 'event-busy',
  
  // 分类图标
  video: 'movie',
  music: 'music-note',
  tool: 'build',
  education: 'school',
  life: 'favorite',
  
  // 其他图标
  arrowBack: 'arrow-back',
  arrowForward: 'arrow-forward',
  close: 'close',
  menu: 'menu',
  share: 'share',
  download: 'download',
  upload: 'upload',
};
```

### 10.4 图标使用规范
- **图标颜色**：使用语义色或中性色
- **图标间距**：图标与文字间距8px
- **图标对齐**：图标垂直居中对齐
- **图标状态**：禁用状态使用灰色

### 10.5 图标组合
```typescript
// 图标与文字组合
const IconWithText = ({ icon, text }) => (
  <View style={styles.container}>
    <Icon name={icon} size={24} color="#9ACFFF" />
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 16,
    color: '#1A1A1A',
  },
});
```

## 十一、主题配置

### 11.1 浅色主题
```typescript
const lightTheme = {
  colors: {
    primary: '#9ACFFF',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#1A1A1A',
    textSecondary: '#666666',
    border: '#E0E0E0',
    success: '#52C41A',
    warning: '#FAAD14',
    error: '#F5222D',
  },
  typography: {
    fontFamily: 'System',
    fontSize: 16,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};
```

### 11.2 深色主题
```typescript
const darkTheme = {
  colors: {
    primary: '#9ACFFF',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    success: '#52C41A',
    warning: '#FAAD14',
    error: '#F5222D',
  },
  typography: {
    fontFamily: 'System',
    fontSize: 16,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};
```

## 十二、设计资源

### 12.1 设计工具
- **设计软件**：Figma
- **图标库**：Material Icons
- **字体**：SF Pro Text / Roboto

### 12.2 设计文件
- **UI设计稿**：`/design/ui-design.fig`
- **图标资源**：`/assets/icons/`
- **字体文件**：`/assets/fonts/`

### 12.3 设计交付
- **切图规范**：提供@1x、@2x、@3x三倍图
- **颜色代码**：提供HEX和RGB格式
- **字体文件**：提供TTF和OTF格式

## 十三、附录

### 13.1 色彩速查表
| 用途 | 颜色代码 | 说明 |
| --- | --- | --- |
| 主色 | #9ACFFF | 主要按钮、选中状态 |
| 主色深色 | #7AB8E8 | 按钮按下状态 |
| 主要文本 | #1A1A1A | 标题、重要信息 |
| 次要文本 | #666666 | 正文、描述信息 |
| 辅助文本 | #999999 | 提示信息 |
| 成功色 | #52C41A | 操作成功 |
| 警告色 | #FAAD14 | 即将到期 |
| 错误色 | #F5222D | 操作失败 |
| 信息色 | #1890FF | 一般提示 |

### 13.2 字号速查表
| 用途 | 字号 | 字重 | 行高 |
| --- | --- | --- | --- |
| 大标题 | 32 | Bold | 38 |
| 中标题 | 28 | Semibold | 34 |
| 小标题 | 24 | Semibold | 30 |
| 大正文 | 16 | Regular | 24 |
| 中正文 | 14 | Regular | 21 |
| 小正文 | 12 | Regular | 18 |

### 13.3 间距速查表
| 用途 | 间距值 |
| --- | --- |
| 超小间距 | 4px |
| 小间距 | 8px |
| 中间距 | 16px |
| 大间距 | 24px |
| 超大间距 | 32px |

### 13.4 参考资料
- 《Material Design 设计规范》
- 《iOS Human Interface Guidelines》
- 《Android Design Guidelines》
- 《Web Content Accessibility Guidelines (WCAG)》
