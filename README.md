# 汀阅 (TingSub)

<div align="center">

![TingSub Logo](./Tingsub/assets/icon.png)

**一款专注隐私保护的订阅管理应用**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0-000000)](https://expo.dev/)

[English](#english) | [中文](#中文)

</div>

---

## 中文

### 项目简介

汀阅(TingSub)是一款专为订阅经济时代打造的一站式订阅管理应用,旨在帮助用户集中管理各类线上线下订阅服务,解决订阅分散、遗忘到期、难以统计等痛点问题。

### 核心特性

#### 🔒 隐私安全优先
- **本地加密存储**: 采用AES-256加密算法,所有数据存储在本地设备,不上传云端
- **数据主权**: 用户完全掌控自己的数据,无需担心隐私泄露
- **离线可用**: 无需网络连接即可使用核心功能

#### 📊 智能统计分析
- **多维统计**: 支持月度、年度支出统计,查看消费趋势
- **分类分析**: 按分类展示订阅支出占比,帮助优化订阅策略
- **可视化展示**: 直观的图表展示,让数据一目了然

#### 🔔 智能提醒系统
- **灵活提醒**: 支持提前1-7天自定义提醒时间
- **多渠道通知**: 支持本地推送、震动、声音等多种提醒方式
- **提醒历史**: 记录所有提醒历史,方便查看

#### 📦 完整的订阅管理
- **订阅管理**: 支持添加、编辑、删除、查看订阅信息
- **分类标签**: 自定义分类和标签,灵活管理订阅
- **搜索筛选**: 快速搜索和筛选订阅,提升管理效率

#### 📤 数据导出
- **多格式支持**: 支持导出为CSV/JSON格式
- **灵活选择**: 可选择导出全部或部分数据
- **数据备份**: 方便跨设备数据迁移

### 技术架构

#### 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **Expo React Native** | 54.0 | 跨平台移动应用框架 |
| **React Native Paper** | 5.14 | Material Design UI组件库 |
| **Zustand** | 5.0 | 轻量级状态管理 |
| **React Navigation** | 7.x | 应用导航路由 |
| **Realm** | 20.2 | 本地数据库 |
| **AsyncStorage** | 2.2 | 简单键值对存储 |
| **Expo Notifications** | 0.32 | 本地推送通知 |
| **Formik + Yup** | 2.4 / 1.7 | 表单处理与验证 |
| **date-fns** | 4.1 | 日期处理 |
| **crypto-js** | 4.2 | 数据加密 |
| **TypeScript** | 5.9 | 类型安全 |

#### 架构设计

汀阅采用分层架构设计,确保代码的可维护性和可扩展性:

```
┌─────────────────────────────────────┐
│           UI Layer                  │
│  (Screens + Components)             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Business Logic Layer           │
│  (Services + Hooks + Store)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Data Layer                  │
│  (Repositories + Models)           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Infrastructure Layer             │
│  (Utils + Config + Constants)       │
└─────────────────────────────────────┘
```

#### 核心模块

- **Repository层**: 封装数据访问逻辑,提供统一的数据操作接口
- **Service层**: 封装业务逻辑,如通知服务、导出服务等
- **Store层**: 使用Zustand进行全局状态管理
- **Utils层**: 提供工具函数,如日期处理、加密、验证等
- **Components层**: 可复用的UI组件,按功能模块分类

### 项目结构

```
Tingsub/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── common/          # 通用组件
│   │   ├── subscription/    # 订阅相关组件
│   │   ├── category/        # 分类相关组件
│   │   ├── statistics/      # 统计相关组件
│   │   └── settings/        # 设置相关组件
│   ├── screens/             # 页面组件
│   ├── navigation/          # 导航配置
│   ├── store/               # 状态管理
│   ├── services/            # 业务服务层
│   │   ├── notification/    # 通知服务
│   │   └── export/          # 数据导出服务
│   ├── repositories/        # 数据访问层
│   ├── models/              # 数据模型
│   ├── utils/               # 工具函数
│   ├── constants/           # 常量定义
│   ├── hooks/               # 自定义Hooks
│   ├── types/               # TypeScript类型定义
│   └── config/              # 配置文件
├── docs/                    # 项目文档
└── assets/                  # 静态资源
```

### 快速开始

#### 环境要求

- **Node.js**: 16.x LTS 或更高版本
- **npm**: 7.x 或更高版本
- **Expo CLI**: 最新稳定版
- **iOS**: Xcode 13.0+ (仅macOS)
- **Android**: Android Studio 最新稳定版

#### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/yourusername/TingSub.git
cd TingSub/Tingsub
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm start
```

4. **在模拟器或真机上运行**
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### 开发指南

#### 代码规范

项目采用严格的代码规范,确保代码质量和一致性:

- **TypeScript**: 严格模式,确保类型安全
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **命名规范**:
  - 组件: 帕斯卡命名法 (PascalCase)
  - 函数: 驼峰命名法 (camelCase)
  - 常量: 全大写下划线分隔 (UPPER_SNAKE_CASE)

#### 开发命令

```bash
# 启动开发服务器
npm start

# 运行iOS应用
npm run ios

# 运行Android应用
npm run android

# 运行Web应用
npm run web

# 代码检查
npm run lint

# 自动修复代码问题
npm run lint:fix

# 代码格式化
npm run format

# 类型检查
npm run typecheck
```

#### 核心功能实现

##### 1. 订阅管理

```typescript
// 创建订阅
const subscription = await subscriptionRepository.createSubscription({
  name: 'Netflix',
  price: 99,
  type: 'monthly',
  currency: 'CNY',
  startDate: new Date(),
  autoRenew: true,
});

// 查询订阅
const subscriptions = await subscriptionRepository.getByUserId(userId);

// 更新订阅
const updated = await subscriptionRepository.updateSubscription(id, {
  price: 129,
});
```

##### 2. 通知服务

```typescript
// 初始化通知服务
await notificationService.initialize(user);

// 安排到期提醒
await notificationService.scheduleExpirationReminder(subscription, 3);

// 发送即时通知
await notificationService.sendNotification({
  title: '订阅即将到期',
  body: '您的Netflix订阅将在3天后到期',
});
```

##### 3. 数据加密

```typescript
// 加密数据
const encrypted = EncryptionUtils.encrypt('sensitive data');

// 解密数据
const decrypted = EncryptionUtils.decrypt(encrypted);

// 加密对象
const encryptedObj = EncryptionUtils.encryptObject({
  username: 'user',
  password: 'pass',
});
```

### 数据安全

汀阅高度重视用户数据安全,采用多层安全保护措施:

#### 加密存储
- **数据库加密**: Realm数据库采用AES-256加密
- **敏感字段加密**: 使用crypto-js对敏感数据进行加密
- **密钥管理**: 支持环境变量配置加密密钥

#### 隐私保护
- **本地优先**: 所有数据存储在本地,不上传云端
- **最小权限**: 仅申请必要的系统权限
- **数据最小化**: 仅收集必要的用户数据

#### 安全特性
- **防时序攻击**: 使用安全的字符串比较方法
- **哈希验证**: 支持MD5、SHA-256、SHA-512哈希算法
- **HMAC**: 支持消息认证码验证

### 功能截图

<!-- 在这里添加应用截图 -->

### 贡献指南

我们欢迎所有形式的贡献!

#### 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

#### 贡献规范

- 遵循项目的代码规范
- 添加必要的注释和文档
- 确保所有测试通过
- 更新相关文档

### 开发计划

#### V1.0.0 (当前版本)
- ✅ 订阅信息管理
- ✅ 分类与标签
- ✅ 到期提醒
- ✅ 统计分析
- ✅ 数据导出
- ✅ 本地加密存储

#### V1.1.0 (计划中)
- 📝 订阅模板
- 📝 批量操作
- 📝 高级筛选
- 📝 数据导入

#### V2.0.0 (未来规划)
- 🚀 云端同步
- 🚀 多设备数据共享
- 🚀 AI自动识别订阅信息
- 🚀 订阅推荐

### 常见问题

<details>
<summary><b>如何备份数据?</b></summary>

您可以通过设置页面的"数据导出"功能,将订阅数据导出为CSV或JSON格式进行备份。
</details>

<details>
<summary><b>数据存储在哪里?</b></summary>

所有数据都存储在您的本地设备上,采用AES-256加密保护,不会上传到任何云端服务器。
</details>

<details>
<summary><b>支持哪些平台?</b></summary>

汀阅支持iOS和Android平台,未来计划支持Web平台。
</details>

<details>
<summary><b>如何设置提醒?</b></summary>

在添加或编辑订阅时,可以设置提前1-7天的到期提醒。您也可以在设置中全局管理提醒功能。
</details>

### 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

### 联系方式

- **作者**: [Your Name]
- **邮箱**: your.email@example.com
- **GitHub**: [yourusername](https://github.com/yourusername)
- **项目链接**: [https://github.com/yourusername/TingSub](https://github.com/yourusername/TingSub)

### 致谢

感谢以下开源项目:

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Realm](https://www.mongodb.com/realm)
- [date-fns](https://date-fns.org/)

---

## English

### Project Overview

TingSub is a comprehensive subscription management application designed for the subscription economy era. It helps users centrally manage various online and offline subscription services, solving pain points such as scattered subscriptions, forgotten renewals, and difficulty in tracking expenses.

### Key Features

#### 🔒 Privacy & Security First
- **Local Encrypted Storage**: Uses AES-256 encryption algorithm, all data is stored locally on the device, never uploaded to the cloud
- **Data Sovereignty**: Users have complete control over their data, no need to worry about privacy leaks
- **Offline Available**: Core features work without internet connection

#### 📊 Intelligent Statistics & Analytics
- **Multi-dimensional Statistics**: Support for monthly and yearly expense tracking, view spending trends
- **Category Analysis**: Display subscription expense breakdown by category to help optimize subscription strategy
- **Visual Display**: Intuitive charts make data clear at a glance

#### 🔔 Smart Reminder System
- **Flexible Reminders**: Support for custom reminder timing 1-7 days in advance
- **Multi-channel Notifications**: Support for local push notifications, vibration, sound, and more
- **Reminder History**: Record all reminder history for easy viewing

#### 📦 Complete Subscription Management
- **Subscription Management**: Support for adding, editing, deleting, and viewing subscription information
- **Categories & Tags**: Custom categories and tags for flexible subscription organization
- **Search & Filter**: Quickly search and filter subscriptions to improve management efficiency

#### 📤 Data Export
- **Multiple Formats**: Support for CSV/JSON export formats
- **Flexible Selection**: Choose to export all or partial data
- **Data Backup**: Easy cross-device data migration

### Tech Stack

| Technology | Version | Purpose |
|-------------|---------|---------|
| **Expo React Native** | 54.0 | Cross-platform mobile framework |
| **React Native Paper** | 5.14 | Material Design UI components |
| **Zustand** | 5.0 | Lightweight state management |
| **React Navigation** | 7.x | App navigation routing |
| **Realm** | 20.2 | Local database |
| **AsyncStorage** | 2.2 | Simple key-value storage |
| **Expo Notifications** | 0.32 | Local push notifications |
| **Formik + Yup** | 2.4 / 1.7 | Form handling and validation |
| **date-fns** | 4.1 | Date processing |
| **crypto-js** | 4.2 | Data encryption |
| **TypeScript** | 5.9 | Type safety |

### Quick Start

#### Prerequisites

- **Node.js**: 16.x LTS or higher
- **npm**: 7.x or higher
- **Expo CLI**: Latest stable version
- **iOS**: Xcode 13.0+ (macOS only)
- **Android**: Android Studio latest stable version

#### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/TingSub.git
cd TingSub/Tingsub
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Run on simulator or device**
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### Development Guide

#### Code Standards

The project follows strict code standards to ensure code quality and consistency:

- **TypeScript**: Strict mode for type safety
- **ESLint**: Code quality checking
- **Prettier**: Code formatting
- **Naming Conventions**:
  - Components: PascalCase
  - Functions: camelCase
  - Constants: UPPER_SNAKE_CASE

#### Development Commands

```bash
# Start development server
npm start

# Run iOS app
npm run ios

# Run Android app
npm run android

# Run Web app
npm run web

# Lint code
npm run lint

# Auto-fix code issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run typecheck
```

### Data Security

TingSub takes user data security seriously with multiple layers of protection:

#### Encryption
- **Database Encryption**: Realm database uses AES-256 encryption
- **Sensitive Field Encryption**: Uses crypto-js to encrypt sensitive data
- **Key Management**: Supports environment variable configuration for encryption keys

#### Privacy Protection
- **Local First**: All data is stored locally, never uploaded to the cloud
- **Minimum Permissions**: Only requests necessary system permissions
- **Data Minimization**: Only collects necessary user data

### Roadmap

#### V1.0.0 (Current Version)
- ✅ Subscription management
- ✅ Categories & tags
- ✅ Expiration reminders
- ✅ Statistics & analytics
- ✅ Data export
- ✅ Local encrypted storage

#### V1.1.0 (Planned)
- 📝 Subscription templates
- 📝 Batch operations
- 📝 Advanced filtering
- 📝 Data import

#### V2.0.0 (Future)
- 🚀 Cloud sync
- 🚀 Multi-device data sharing
- 🚀 AI-powered subscription recognition
- 🚀 Subscription recommendations

### Contributing

We welcome all forms of contribution!

#### How to Contribute

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### License

This project is licensed under the [MIT License](LICENSE).

### Contact

- **Author**: [Your Name]
- **Email**: your.email@example.com
- **GitHub**: [yourusername](https://github.com/yourusername)
- **Project Link**: [https://github.com/yourusername/TingSub](https://github.com/yourusername/TingSub)

### Acknowledgments

Thanks to the following open source projects:

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Realm](https://www.mongodb.com/realm)
- [date-fns](https://date-fns.org/)

---

<div align="center">

**如果这个项目对你有帮助,请给个 ⭐️ Star 支持一下!**

**If this project helps you, please give it a ⭐️ Star!**

Made with ❤️ by [Your Name]

</div>
