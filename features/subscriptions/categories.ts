import type { Category, CategoryGroup } from './types'

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

export const getCategoriesByGroup = (group: CategoryGroup): Category[] =>
  defaultCategories.filter((c) => c.group === group)