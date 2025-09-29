import type { Category, CategoryGroup } from './types'

/**
 * 默认的订阅分类列表
 * 
 * 此数组包含了预定义的常用订阅分类，按组（影音娱乐、工作、生活）组织。
 * 每个分类包含唯一 ID、显示标签和所属分组。
 * 
 * @type {Category[]}
 */
export const defaultCategories: Category[] = [
  { id: 'ent_netflix', label: 'Netflix', group: '影音娱乐' },
  { id: 'ent_spotify', label: 'Spotify', group: '影音娱乐' },
  { id: 'ent_youtube', label: 'YouTube Premium', group: '影音娱乐' },

  { id: 'work_adobe', label: 'Adobe Creative Cloud', group: '工作' },
  { id: 'work_ms365', label: 'Microsoft 365', group: '工作' },
  { id: 'work_github', label: 'GitHub Pro', group: '工作' },

  { id: 'life_icloud', label: 'iCloud+', group: '生活' },
  { id: 'life_dropbox', label: 'Dropbox', group: '生活' },
  { id: 'life_vpn', label: 'VPN', group: '生活' },
]

/**
 * 根据分组获取分类列表
 * 
 * 此函数从默认分类列表中筛选出指定分组的所有分类。
 * 
 * @param {CategoryGroup} group - 要筛选的分类分组名称
 * @returns {Category[]} 指定分组的分类数组
 */
export const getCategoriesByGroup = (group: CategoryGroup): Category[] =>
  defaultCategories.filter((c) => c.group === group)