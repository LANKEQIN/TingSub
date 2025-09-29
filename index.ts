/**
 * 应用程序入口点
 * 
 * 此文件是 React Native 应用的入口，负责注册根组件并设置必要的 polyfill。
 */

import { registerRootComponent } from 'expo'

import App from './App'

/**
 * 为 window 对象声明 matchMedia 方法的类型
 * 
 * 这是为了在 Web 环境中解决某些库（如 Tamagui）对 matchMedia API 的依赖问题。
 */
declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList
  }
}

/**
 * 为 Web 环境添加 matchMedia API 的 polyfill
 * 
 * 在非 Web 环境（如 iOS/Android）中，window 对象可能不存在或没有 matchMedia 方法。
 * 此 polyfill 提供一个空实现以避免运行时错误。
 */
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  } as MediaQueryList)
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App)
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App)