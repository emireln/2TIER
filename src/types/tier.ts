export interface TierItem {
  id: string
  label?: string
  src: string
  createdAt: number
}

export interface TierRow {
  id: string
  label: string
  color: string // Hex or Tailwind color string
  items: TierItem[]
}

export interface TierListState {
  id: string
  title: string
  rows: TierRow[]
  unassignedItems: TierItem[]
  theme: 'dark' | 'light'
}

export interface SavedTierList {
  id: string
  title: string
  description?: string
  coverImage?: string
  rows: TierRow[]
  unassignedItems: TierItem[]
  updatedAt: number
}

export interface ExportSettings {
  format: 'png' | 'jpeg' | 'webp'
  scale: 1 | 2 | 4
  includeTitle: boolean
  borderPadding: number
  watermark: boolean
  roundedCorners: boolean
  backgroundColor: string
}

export interface Template {
  id: string
  name: string
  description: string
  rows: Array<{ label: string; color: string }>
  presetItems?: Array<{ label: string; src: string }>
}
