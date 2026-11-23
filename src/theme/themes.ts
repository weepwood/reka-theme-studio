export const themes = [
  {
    id: 'porcelain',
    name: 'Porcelain',
    zhName: '瓷白极简',
    description: '克制、轻盈、精确的现代工具界面',
    caption: 'CONTEMPORARY / LIGHT',
    accent: '#5366d9',
    category: 'Light',
    dark: false,
  },
  {
    id: 'midnight',
    name: 'Midnight',
    zhName: '午夜深色',
    description: '低眩光、静谧与专注的深色工作台',
    caption: 'EDITORIAL / DARK',
    accent: '#baaaff',
    category: 'Dark',
    dark: true,
  },
  {
    id: 'lavender',
    name: 'Lavender',
    zhName: '柔雾薰衣草',
    description: '柔和色彩、半透明层次与细腻光感',
    caption: 'SOFT / PASTEL',
    accent: '#8369cc',
    category: 'Light',
    dark: false,
  },
  {
    id: 'parchment',
    name: 'Parchment',
    zhName: '暖纸编辑',
    description: '书刊般的暖色纸张与典雅排版',
    caption: 'EDITORIAL / WARM',
    accent: '#99633e',
    category: 'Light',
    dark: false,
  },
  {
    id: 'evergreen',
    name: 'Evergreen',
    zhName: '常青森林',
    description: '暗绿色调、自然质感与沉稳层次',
    caption: 'NATURE / DARK',
    accent: '#a9d6a5',
    category: 'Dark',
    dark: true,
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    zhName: '新粗野主义',
    description: '强烈对比、硬边框和活泼的几何结构',
    caption: 'BOLD / GRAPHIC',
    accent: '#e6fc59',
    category: 'Light',
    dark: false,
  },
] as const

export type ThemeId = (typeof themes)[number]['id']
export const DEFAULT_THEME: ThemeId = 'porcelain'
export const STORAGE_KEY = 'reka-theme-studio-theme'

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && themes.some(t => t.id === value)
}

export const tokens = [
  { name: '--page-bg', meaning: '页面背景', swatch: true },
  { name: '--sidebar-bg', meaning: '侧边栏底色', swatch: true },
  { name: '--surface', meaning: '容器背景', swatch: true },
  { name: '--surface-alt', meaning: '次级容器', swatch: true },
  { name: '--text', meaning: '主要文字', swatch: true },
  { name: '--muted', meaning: '次要文字', swatch: true },
  { name: '--accent', meaning: '品牌强调色', swatch: true },
  { name: '--accent-soft', meaning: '强调色浅色容器', swatch: true },
  { name: '--border', meaning: '边界与分割', swatch: true },
  { name: '--radius', meaning: '常规圆角', swatch: false },
  { name: '--radius-lg', meaning: '大型容器圆角', swatch: false },
  { name: '--shadow-card', meaning: '卡片阴影', swatch: false },
] as const
