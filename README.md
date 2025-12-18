# 汀阅 (TingSub)

<div align="center">
  <img src="./assets/icon.png" width="100" height="100" alt="TingSub Logo" />
  <h3>您的私人订阅管理助手</h3>
  <p>基于 Expo React Native 构建的现代化移动应用</p>
</div>

<div align="center">

[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-52-black.svg?style=flat-square&logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76-blue.svg?style=flat-square&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.0-764ABC.svg?style=flat-square&logo=redux)](https://redux-toolkit.js.org/)
[![Tamagui](https://img.shields.io/badge/UI-Tamagui-pink.svg?style=flat-square)](https://tamagui.dev/)

</div>

---

## 📖 项目简介

**TingSub (汀阅)** 是一款设计优雅的订阅管理应用，旨在帮助用户解决数字化时代订阅服务日益增多带来的管理难题。通过直观的界面和强大的统计功能，用户可以轻松追踪 Netflix, Spotify, AWS 等各类周期性支出，清晰掌握财务状况。

本项目不仅是一个实用的工具应用，更是一个展示现代 React Native 开发最佳实践的示例项目。它采用了 **Feature-based** 架构设计，结合 **TypeScript** 的强类型约束和 **Redux Toolkit** 的高效状态管理，构建了一个高内聚、易扩展的代码库。

## ✨ 核心特性

- **📊 全周期订阅管理**：支持自定义计费周期（月/季/年）、首次扣费日期及提醒设置。
- **💱 多币种智能换算**：内置货币处理引擎 (`features/currency`)，支持 CNY、USD、JPY 等主流货币，提供本地汇率转换与格式化，无需联网即可处理跨币种支出。
- **📈 可视化统计分析**：提供直观的图表分析，按月度、年度维度展示支出趋势，帮助用户优化消费结构。
- **🎨 现代化 UI/UX**：基于 Tamagui 构建的高性能、响应式界面，支持深色/浅色模式无缝切换，提供流畅的交互体验。
- **🛡️ 本地优先与隐私**：采用 Redux Persist + Async Storage 实现数据本地持久化，所有数据仅存储在用户设备上，充分保障隐私安全。

## 🛠 技术栈

本项目精选了 React Native 生态中成熟且先进的技术栈：

### 核心架构
- **Framework**: [Expo SDK 52](https://expo.dev/) (Managed Workflow)
- **Core**: React Native 0.76
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode Enabled)

### 状态管理与数据流
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) (Slices, Selectors)
- **Persistence**: Redux Persist (Async Storage backend)

### UI 与交互
- **UI System**: [Tamagui](https://tamagui.dev/) (Headless + Styled System, 优化性能)
- **Navigation**: [React Navigation 7](https://reactnavigation.org/) (Native Stack)
- **Icons**: Lucide React Native
- **Animations**: React Native Reanimated

### 工程化与规范
- **Package Manager**: Yarn
- **Code Structure**: Feature-based Architecture

## 📂 项目结构

项目采用基于功能的目录结构（Feature-based），将业务逻辑与 UI 组件解耦，便于长期维护与扩展：

```bash
d:\TingSub\
├── assets/                 # 静态资源文件
├── features/               # 业务功能模块 (核心架构)
│   ├── currency/           # 货币服务：处理符号、精度、汇率逻辑
│   ├── paymentMethods/     # 支付方式管理：状态与选择器
│   ├── subscriptions/      # 订阅核心业务：CRUD、计算逻辑
│   └── ui/                 # 全局 UI 状态：主题、交互反馈
├── lib/                    # 基础设施库 (Theme, Navigation, Storage)
├── screens/                # 页面视图层
│   ├── components/         # 页面级复用组件 (Smart Components)
│   ├── hooks/              # 自定义 Hooks (useHomeData, etc.)
│   └── ...                 # 各个业务屏幕 (Home, Settings, Statistics)
├── types/                  # 全局 TypeScript 类型定义
├── App.tsx                 # 应用入口与 Provider 配置
└── tamagui.config.ts       # Tamagui 设计系统配置
```

## 🚀 快速开始

### 前置要求
- Node.js >= 18
- Yarn 或 npm
- Expo Go App (用于真机调试) 或 Android/iOS 模拟器

### 安装步骤

1. 克隆项目到本地：
   ```bash
   git clone https://github.com/yourusername/tingsub.git
   cd tingsub
   ```

2. 安装依赖：
   ```bash
   yarn install
   ```

### 运行项目

启动开发服务器：

```bash
yarn start
```

- **iOS**: 按 `i` 在 iOS 模拟器中打开。
- **Android**: 按 `a` 在 Android 模拟器中打开。
- **Web**: 按 `w` 在浏览器中预览。

## 💡 开发亮点展示

### 1. 健壮的货币处理系统
在 `features/currency` 中实现了独立的货币服务，解耦了显示逻辑与计算逻辑：
```typescript
// 示例：货币格式化与转换
CurrencyService.format(1234.5, 'CNY'); // "¥1,234.50"
CurrencyService.convertAndFormat(1000, 'JPY', 'USD'); // "$6.94"
```

### 2. 模块化的 Redux 状态管理
每个 Feature 拥有独立的 Slice 和 Selectors，避免了状态管理的混乱：
```typescript
// features/subscriptions/selectors.ts
export const selectTotalMonthlyExpenses = createSelector(...)
```

## 📝 许可证

MIT License

---
*本项目仅供学习与交流使用。*
