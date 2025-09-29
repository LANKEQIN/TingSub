/**
 * 根堆栈导航参数列表
 * 
 * @typedef {Object} RootStackParamList
 * @property {undefined} Tabs - 主标签页屏幕，无参数
 * @property {undefined} Theme - 主题设置屏幕，无参数
 * 
 * @description
 * 定义应用根堆栈导航器(RootStackNavigator)的屏幕和参数类型。
 * 根堆栈包含两个屏幕：Tabs(主标签页)和Theme(主题设置)。
 */
export type RootStackParamList = {
  Tabs: undefined
  Theme: undefined
}

/**
 * 标签导航参数列表
 * 
 * @typedef {Object} TabParamList
 * @property {undefined} Home - 主页屏幕，无参数
 * @property {undefined} Statistics - 统计屏幕，无参数
 * @property {undefined} Notifications - 通知屏幕，无参数
 * @property {undefined} Profile - 个人资料屏幕，无参数
 * 
 * @description
 * 定义主标签导航器(MainTabs)的屏幕和参数类型。
 * 包含四个主要功能屏幕：主页、统计、通知和个人资料。
 */
export type TabParamList = {
  Home: undefined
  Statistics: undefined
  Notifications: undefined
  Profile: undefined
}