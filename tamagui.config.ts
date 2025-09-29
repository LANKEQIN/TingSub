/**
 * Tamagui UI 库的配置文件
 * 
 * 此文件负责创建和导出 Tamagui 的配置对象，该对象定义了应用的主题、字体、
 * 空间、尺寸、动画等 UI 基础设置。配置基于 `@tamagui/config` 提供的默认配置。
 */

import { createTamagui } from '@tamagui/core'
import { config } from '@tamagui/config'

/**
 * Tamagui 配置实例
 * 
 * 使用 `createTamagui` 函数和默认配置创建的 Tamagui 核心配置对象。
 * 
 * @type {TamaguiConfig}
 */
const tamaguiConfig = createTamagui(config)

export default tamaguiConfig

/**
 * Tamagui 配置的 TypeScript 类型
 * 
 * 此类型用于在应用的其他部分引用 Tamagui 配置的类型定义。
 * 
 * @typedef {typeof tamaguiConfig} Conf
 */
export type Conf = typeof tamaguiConfig