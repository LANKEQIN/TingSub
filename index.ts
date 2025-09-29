import { registerRootComponent } from 'expo'

import App from './App'

// 添加 matchMedia polyfill 解决警告问题，并进行类型声明
declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList
  }
}

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