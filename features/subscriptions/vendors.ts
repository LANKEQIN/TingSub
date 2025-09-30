import type { Vendor, CategoryGroup } from './types'

/**
 * 默认供应商字典
 * 
 * @description
 * 轻量的本地供应商列表，用于“添加订阅”流程的供应商选择与搜索。
 * 可在未来替换为远端数据源或与产品线联动。
 */
export const defaultVendors: Vendor[] = [
  { id: 'vendor_microsoft', name: 'Microsoft', group: '工作', aliases: ['MS', 'M365', 'Office'], keywords: ['office', 'teams', 'onedrive'] },
  { id: 'vendor_google', name: 'Google', group: '工作', aliases: ['G Suite', 'Google Workspace'], keywords: ['drive', 'gmail', 'docs'] },
  { id: 'vendor_adobe', name: 'Adobe', group: '工作', aliases: ['Adobe CC', 'Creative Cloud'], keywords: ['photoshop', 'premiere', 'illustrator'] },
  { id: 'vendor_github', name: 'GitHub', group: '工作', aliases: ['GH'], keywords: ['pro', 'copilot'] },
  { id: 'vendor_atlassian', name: 'Atlassian', group: '工作', aliases: ['Jira', 'Confluence'], keywords: ['jira', 'bitbucket', 'confluence'] },
  { id: 'vendor_notion', name: 'Notion', group: '工作', keywords: ['wiki', 'notes', 'docs'] },

  { id: 'vendor_apple', name: 'Apple', group: '生活', aliases: ['iCloud'], keywords: ['icloud', 'apple one'] },
  { id: 'vendor_dropbox', name: 'Dropbox', group: '生活', keywords: ['storage', 'cloud'] },
  { id: 'vendor_vpn', name: 'ExpressVPN', group: '生活', aliases: ['VPN'], keywords: ['privacy', 'vpn'] },

  { id: 'vendor_netflix', name: 'Netflix', group: '影音娱乐', keywords: ['stream', 'tv', 'movies'] },
  { id: 'vendor_spotify', name: 'Spotify', group: '影音娱乐', keywords: ['music', 'premium'] },
  { id: 'vendor_youtube', name: 'YouTube', group: '影音娱乐', aliases: ['YouTube Premium'], keywords: ['yt', 'premium'] },
]

/**
 * 根据分组获取供应商
 */
export const getVendorsByGroup = (group: CategoryGroup): Vendor[] =>
  defaultVendors.filter((v) => v.group === group)

/**
 * 供应商简单搜索（名称/别名/关键字）
 */
export const searchVendors = (query: string): Vendor[] => {
  const q = query.trim().toLowerCase()
  if (!q) return defaultVendors
  return defaultVendors.filter((v) => {
    const pool = [v.name, ...(v.aliases ?? []), ...(v.keywords ?? [])]
    return pool.some((t) => t.toLowerCase().includes(q))
  })
}