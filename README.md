# 汀阅 (TingSub)

这是一个基于 Expo React Native 的应用。

## 项目信息

- 中文名称：汀阅
- 英文名称：TingSub
- 框架：Expo React Native
- 包管理器：Yarn

## 快速开始

1. 安装依赖：
   ```
   yarn install
   ```

2. 启动开发服务器：
   ```
   yarn start
   ```

3. 在模拟器或真机上运行：
   ```
   yarn android
   yarn ios
   yarn web
   ```

## 项目结构

- `App.tsx` - 主应用组件
- `app.json` - Expo 配置文件
- `package.json` - 项目依赖和脚本配置
- `assets/` - 静态资源文件夹
- `screens/` - 屏幕组件文件夹
- `features/` - 功能模块文件夹
  - `currency` - 货币领域模型（符号/精度/汇率/格式化）
- `lib/` - 工具库文件夹
- `store.ts` - Redux 状态管理文件
- `tamagui.config.ts` - Tamagui 样式配置文件

## 功能模块

- `counter` - 计数器功能模块
- `subscriptions` - 订阅功能模块
 - `currency` - 统一多币种的符号、精度与本地汇率

## Currency 模块

- 代码位置：`features/currency/`
- 目标：统一管理货币的符号、精度与格式化，并提供本地固定汇率换算（无需联网）。
- 已支持：`CNY`（人民币，¥，2位小数）、`USD`（美元，$，2位小数）、`JPY`（日元，¥，0位小数）。

### 使用示例

```
import { CurrencyService } from './features/currency/services'

// 元数据与符号
CurrencyService.meta('CNY') // { code:'CNY', symbol:'¥', precision:2, name:'人民币', ... }
CurrencyService.symbol('USD') // '$'

// 金额格式化（不换算）
CurrencyService.format(1234.5, 'CNY') // "¥1,234.50"

// 汇率换算（本地固定：以 CNY 为锚）
CurrencyService.convert(10, 'USD', 'CNY') // 约 72
CurrencyService.convertAndFormat(1000, 'JPY', 'USD') // 约 "$6.94"

// 注意：汇率表写在本地，可按需更新
```

### 在订阅类型中的应用

- `features/subscriptions/types.ts` 的 `Currency` 类型已与 `CurrencyCode` 对齐，默认仍使用 `CNY`，未来可扩展为 `USD`/`JPY` 等。


## 开发指南

1. 安装依赖：
   ```
   yarn install
   ```

2. 启动开发服务器：
   ```
   yarn start
   ```

3. 在模拟器或真机上运行：
   ```
   yarn android
   yarn ios
   yarn web
   ```
