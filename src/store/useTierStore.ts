import { create } from 'zustand'
import { TierRow, TierItem, Template, ExportSettings, SavedTierList } from '../types/tier'
import { Language, detectDeviceLanguage } from '../lib/i18n'

export const DEFAULT_PRESET_COLORS = [
  '#ff7f7f', // S - Soft Red
  '#ffbf7f', // A - Orange
  '#ffdf7f', // B - Yellow
  '#ffff7f', // C - Light Yellow
  '#7fff7f', // D - Mint Green
  '#7fbfff', // F - Soft Cyan/Blue
  '#c084fc', // Purple
  '#f472b6', // Pink
  '#94a3b8', // Gray/Slate
  '#334155', // Slate Dark
]

const DEFAULT_ROWS: TierRow[] = [
  { id: 'row-s', label: 'S', color: '#ff7f7f', items: [] },
  { id: 'row-a', label: 'A', color: '#ffbf7f', items: [] },
  { id: 'row-b', label: 'B', color: '#ffdf7f', items: [] },
  { id: 'row-c', label: 'C', color: '#ffff7f', items: [] },
  { id: 'row-d', label: 'D', color: '#7fff7f', items: [] },
  { id: 'row-f', label: 'F', color: '#7fbfff', items: [] },
]

export const PRESET_TEMPLATES: Template[] = [
  {
    id: 'standard-s-f',
    name: 'Standard S to F',
    description: 'Classic 6-tier ranking structure from S down to F.',
    rows: [
      { label: 'S', color: '#ff7f7f' },
      { label: 'A', color: '#ffbf7f' },
      { label: 'B', color: '#ffdf7f' },
      { label: 'C', color: '#ffff7f' },
      { label: 'D', color: '#7fff7f' },
      { label: 'F', color: '#7fbfff' },
    ],
  },
  {
    id: 'gaming-meta',
    name: 'Gaming Meta Tier',
    description: 'GOD TIER, META, VIABLE, NICHE, UNPLAYABLE.',
    rows: [
      { label: 'GOD TIER', color: '#ff7f7f' },
      { label: 'META', color: '#ffbf7f' },
      { label: 'VIABLE', color: '#7fff7f' },
      { label: 'NICHE', color: '#7fbfff' },
      { label: 'UNPLAYABLE', color: '#94a3b8' },
    ],
  },
  {
    id: 'simple-top-3',
    name: 'Top 3 Podiums',
    description: 'Gold, Silver, Bronze & Honorable Mentions.',
    rows: [
      { label: '🥇 GOLD', color: '#ffdf7f' },
      { label: '🥈 SILVER', color: '#cbd5e1' },
      { label: '🥉 BRONZE', color: '#b45309' },
      { label: 'HONORABLE', color: '#c084fc' },
    ],
  },
]

const loadSavedCustomTemplates = (): Template[] => {
  try {
    const raw = localStorage.getItem('2tier_custom_templates')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const loadSavedTierListsFromStorage = (): SavedTierList[] => {
  try {
    const raw = localStorage.getItem('2tier_saved_tierlists')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const loadSavedLanguage = (): Language => {
  return detectDeviceLanguage()
}

const loadSavedHideHeaderTitle = (): boolean => {
  try {
    return localStorage.getItem('2tier_hide_header_title') === 'true'
  } catch {
    return false
  }
}

interface StoreState {
  title: string
  rows: TierRow[]
  unassignedItems: TierItem[]
  theme: 'dark' | 'light'
  language: Language
  hideHeaderTitle: boolean
  
  // History for Undo / Redo
  history: Array<{ title: string; rows: TierRow[]; unassignedItems: TierItem[] }>
  historyIndex: number

  // UI state
  activeDrawer: 'templates' | 'export' | 'my-lists' | 'settings' | null
  isPoolVisible: boolean
  exportSettings: ExportSettings
  customTemplates: Template[]
  savedTierLists: SavedTierList[]

  // Actions
  setTitle: (title: string) => void
  setTheme: (theme: 'dark' | 'light') => void
  toggleTheme: () => void
  setLanguage: (lang: Language) => void
  setHideHeaderTitle: (hide: boolean) => void
  toggleHideHeaderTitle: () => void
  togglePoolVisibility: () => void
  setActiveDrawer: (drawer: 'templates' | 'export' | 'my-lists' | 'settings' | null) => void
  updateExportSettings: (settings: Partial<ExportSettings>) => void

  // Tier Row Actions
  updateRowLabel: (rowId: string, newLabel: string) => void
  updateRowColor: (rowId: string, newColor: string) => void
  addTierRow: (insertIndex?: number) => void
  deleteTierRow: (rowId: string) => void
  clearTierRow: (rowId: string) => void
  moveTierRow: (fromIndex: number, toIndex: number) => void

  // Item Actions
  addItems: (items: Array<{ name?: string; src: string }>) => void
  deleteItem: (itemId: string) => void
  moveItem: (itemId: string, targetContainerId: string, targetIndex?: number) => void
  reorderItemsInContainer: (containerId: string, oldIndex: number, newIndex: number) => void
  clearAllItems: () => void

  // Template Actions
  loadTemplate: (template: Template) => void
  saveCurrentAsTemplate: (name: string, description: string) => void
  deleteCustomTemplate: (templateId: string) => void
  resetBoard: () => void

  // Saved Tier Lists Actions
  saveCurrentTierList: (description?: string, coverImage?: string) => void
  loadSavedTierList: (id: string) => void
  updateSavedTierList: (id: string, updates: Partial<SavedTierList>) => void
  deleteSavedTierList: (id: string) => void

  // Undo / Redo
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

const generateId = () => Math.random().toString(36).substring(2, 9)

export const useTierStore = create<StoreState>((set, get) => {
  const pushStateToHistory = (newTitle: string, newRows: TierRow[], newUnassigned: TierItem[]) => {
    const { history, historyIndex } = get()
    const newSnapshot = JSON.parse(JSON.stringify({ title: newTitle, rows: newRows, unassignedItems: newUnassigned }))
    
    const updatedHistory = history.slice(0, historyIndex + 1)
    updatedHistory.push(newSnapshot)

    if (updatedHistory.length > 30) {
      updatedHistory.shift()
    }

    set({
      history: updatedHistory,
      historyIndex: updatedHistory.length - 1,
      canUndo: updatedHistory.length > 1,
      canRedo: false,
    })
  }

  const initialRows = DEFAULT_ROWS.map((r) => ({ ...r, items: [] }))
  const initialHistory = [{ title: 'Untitled Tier List', rows: initialRows, unassignedItems: [] }]

  return {
    title: 'Untitled Tier List',
    rows: initialRows,
    unassignedItems: [],
    theme: 'dark',
    language: loadSavedLanguage(),
    hideHeaderTitle: loadSavedHideHeaderTitle(),

    history: initialHistory,
    historyIndex: 0,
    canUndo: false,
    canRedo: false,

    activeDrawer: null,
    isPoolVisible: true,
    customTemplates: loadSavedCustomTemplates(),
    savedTierLists: loadSavedTierListsFromStorage(),

    exportSettings: {
      format: 'png',
      scale: 2,
      includeTitle: true,
      borderPadding: 24,
      watermark: true,
      roundedCorners: true,
      backgroundColor: '#09090b',
    },

    setTitle: (title) => {
      const { rows, unassignedItems } = get()
      set({ title })
      pushStateToHistory(title, rows, unassignedItems)
    },

    setTheme: (theme) => set({ theme }),
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    
    setLanguage: (language) => {
      set({ language })
      try {
        localStorage.setItem('2tier_language', language)
      } catch (e) {}
    },

    setHideHeaderTitle: (hideHeaderTitle) => {
      set({ hideHeaderTitle })
      try {
        localStorage.setItem('2tier_hide_header_title', String(hideHeaderTitle))
      } catch (e) {}
    },

    toggleHideHeaderTitle: () => {
      const next = !get().hideHeaderTitle
      set({ hideHeaderTitle: next })
      try {
        localStorage.setItem('2tier_hide_header_title', String(next))
      } catch (e) {}
    },

    togglePoolVisibility: () => set((state) => ({ isPoolVisible: !state.isPoolVisible })),
    setActiveDrawer: (drawer) => set({ activeDrawer: drawer }),

    updateExportSettings: (settings) =>
      set((state) => ({
        exportSettings: { ...state.exportSettings, ...settings },
      })),

    // Tier Row Operations
    updateRowLabel: (rowId, newLabel) => {
      const { title, rows, unassignedItems } = get()
      const newRows = rows.map((r) => (r.id === rowId ? { ...r, label: newLabel } : r))
      set({ rows: newRows })
      pushStateToHistory(title, newRows, unassignedItems)
    },

    updateRowColor: (rowId, newColor) => {
      const { title, rows, unassignedItems } = get()
      const newRows = rows.map((r) => (r.id === rowId ? { ...r, color: newColor } : r))
      set({ rows: newRows })
      pushStateToHistory(title, newRows, unassignedItems)
    },

    addTierRow: (insertIndex) => {
      const { title, rows, unassignedItems } = get()
      const randomColor = DEFAULT_PRESET_COLORS[rows.length % DEFAULT_PRESET_COLORS.length]
      const newRow: TierRow = {
        id: `row-${generateId()}`,
        label: `NEW TIER`,
        color: randomColor,
        items: [],
      }

      const newRows = [...rows]
      if (typeof insertIndex === 'number') {
        newRows.splice(insertIndex, 0, newRow)
      } else {
        newRows.push(newRow)
      }

      set({ rows: newRows })
      pushStateToHistory(title, newRows, unassignedItems)
    },

    deleteTierRow: (rowId) => {
      const { title, rows, unassignedItems } = get()
      const targetRow = rows.find((r) => r.id === rowId)
      if (!targetRow) return

      const itemsToEvict = targetRow.items
      const newRows = rows.filter((r) => r.id !== rowId)
      const newUnassigned = [...unassignedItems, ...itemsToEvict]

      set({ rows: newRows, unassignedItems: newUnassigned })
      pushStateToHistory(title, newRows, newUnassigned)
    },

    clearTierRow: (rowId) => {
      const { title, rows, unassignedItems } = get()
      const targetRow = rows.find((r) => r.id === rowId)
      if (!targetRow || targetRow.items.length === 0) return

      const evictedItems = targetRow.items
      const newRows = rows.map((r) => (r.id === rowId ? { ...r, items: [] } : r))
      const newUnassigned = [...unassignedItems, ...evictedItems]

      set({ rows: newRows, unassignedItems: newUnassigned })
      pushStateToHistory(title, newRows, newUnassigned)
    },

    moveTierRow: (fromIndex, toIndex) => {
      const { title, rows, unassignedItems } = get()
      if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= rows.length || toIndex >= rows.length) return

      const newRows = [...rows]
      const [movedRow] = newRows.splice(fromIndex, 1)
      newRows.splice(toIndex, 0, movedRow)

      set({ rows: newRows })
      pushStateToHistory(title, newRows, unassignedItems)
    },

    // Item Operations
    addItems: (itemsData) => {
      const { title, rows, unassignedItems } = get()
      const newItems: TierItem[] = itemsData.map((item) => ({
        id: `item-${generateId()}`,
        label: item.name || '',
        src: item.src,
        createdAt: Date.now(),
      }))

      const newUnassigned = [...unassignedItems, ...newItems]
      set({ unassignedItems: newUnassigned })
      pushStateToHistory(title, rows, newUnassigned)
    },

    deleteItem: (itemId) => {
      const { title, rows, unassignedItems } = get()
      let itemFound = false

      const newUnassigned = unassignedItems.filter((i) => {
        if (i.id === itemId) {
          itemFound = true
          return false
        }
        return true
      })

      const newRows = rows.map((r) => {
        const filtered = r.items.filter((i) => i.id !== itemId)
        if (filtered.length !== r.items.length) itemFound = true
        return { ...r, items: filtered }
      })

      if (itemFound) {
        set({ rows: newRows, unassignedItems: newUnassigned })
        pushStateToHistory(title, newRows, newUnassigned)
      }
    },

    moveItem: (itemId, targetContainerId, targetIndex) => {
      const { title, rows, unassignedItems } = get()
      let movedItem: TierItem | null = null

      const filteredUnassigned = unassignedItems.filter((i) => {
        if (i.id === itemId) {
          movedItem = i
          return false
        }
        return true
      })

      const filteredRows = rows.map((r) => {
        const matching = r.items.find((i) => i.id === itemId)
        if (matching) {
          movedItem = matching
          return { ...r, items: r.items.filter((i) => i.id !== itemId) }
        }
        return r
      })

      if (!movedItem) return

      let finalRows = filteredRows
      let finalUnassigned = filteredUnassigned

      if (targetContainerId === 'unassigned') {
        if (typeof targetIndex === 'number') {
          finalUnassigned.splice(targetIndex, 0, movedItem)
        } else {
          finalUnassigned.push(movedItem)
        }
      } else {
        finalRows = filteredRows.map((r) => {
          if (r.id === targetContainerId) {
            const updatedItems = [...r.items]
            if (typeof targetIndex === 'number') {
              updatedItems.splice(targetIndex, 0, movedItem!)
            } else {
              updatedItems.push(movedItem!)
            }
            return { ...r, items: updatedItems }
          }
          return r
        })
      }

      set({ rows: finalRows, unassignedItems: finalUnassigned })
      pushStateToHistory(title, finalRows, finalUnassigned)
    },

    reorderItemsInContainer: (containerId, oldIndex, newIndex) => {
      const { title, rows, unassignedItems } = get()
      if (oldIndex === newIndex) return

      if (containerId === 'unassigned') {
        const items = [...unassignedItems]
        const [moved] = items.splice(oldIndex, 1)
        items.splice(newIndex, 0, moved)
        set({ unassignedItems: items })
        pushStateToHistory(title, rows, items)
      } else {
        const newRows = rows.map((r) => {
          if (r.id === containerId) {
            const items = [...r.items]
            const [moved] = items.splice(oldIndex, 1)
            items.splice(newIndex, 0, moved)
            return { ...r, items }
          }
          return r
        })
        set({ rows: newRows })
        pushStateToHistory(title, newRows, unassignedItems)
      }
    },

    clearAllItems: () => {
      const { title, rows } = get()
      const clearedRows = rows.map((r) => ({ ...r, items: [] }))
      set({ rows: clearedRows, unassignedItems: [] })
      pushStateToHistory(title, clearedRows, [])
    },

    loadTemplate: (template) => {
      const { title, unassignedItems } = get()
      const newRows: TierRow[] = template.rows.map((r) => ({
        id: `row-${generateId()}`,
        label: r.label,
        color: r.color,
        items: [],
      }))

      set({ rows: newRows, activeDrawer: null })
      pushStateToHistory(title, newRows, unassignedItems)
    },

    saveCurrentAsTemplate: (name, description) => {
      const { rows, customTemplates } = get()
      const newTemplate: Template = {
        id: `custom-${generateId()}`,
        name: name.trim() || 'Custom Template',
        description: description.trim() || 'User created tier list template',
        rows: rows.map((r) => ({ label: r.label, color: r.color })),
      }

      const updated = [newTemplate, ...customTemplates]
      set({ customTemplates: updated })

      try {
        localStorage.setItem('2tier_custom_templates', JSON.stringify(updated))
      } catch (err) {
        console.error('Failed to save template to localStorage:', err)
      }
    },

    deleteCustomTemplate: (templateId) => {
      const { customTemplates } = get()
      const updated = customTemplates.filter((t) => t.id !== templateId)
      set({ customTemplates: updated })

      try {
        localStorage.setItem('2tier_custom_templates', JSON.stringify(updated))
      } catch (err) {
        console.error('Failed to delete template from localStorage:', err)
      }
    },

    resetBoard: () => {
      const newRows = DEFAULT_ROWS.map((r) => ({ ...r, items: [] }))
      set({
        title: 'Untitled Tier List',
        rows: newRows,
        unassignedItems: [],
        activeDrawer: null,
      })
      pushStateToHistory('Untitled Tier List', newRows, [])
    },

    // Saved Tier Lists Operations
    saveCurrentTierList: (description, coverImage) => {
      const { title, rows, unassignedItems, savedTierLists } = get()
      const existingIndex = savedTierLists.findIndex((t) => t.title.toLowerCase() === title.toLowerCase())

      const snapshot: SavedTierList = {
        id: existingIndex >= 0 ? savedTierLists[existingIndex].id : `list-${generateId()}`,
        title,
        description: description || (existingIndex >= 0 ? savedTierLists[existingIndex].description : 'Saved Tier List project'),
        coverImage: coverImage || (existingIndex >= 0 ? savedTierLists[existingIndex].coverImage : undefined),
        rows: JSON.parse(JSON.stringify(rows)),
        unassignedItems: JSON.parse(JSON.stringify(unassignedItems)),
        updatedAt: Date.now(),
      }

      let updated: SavedTierList[]
      if (existingIndex >= 0) {
        updated = [...savedTierLists]
        updated[existingIndex] = snapshot
      } else {
        updated = [snapshot, ...savedTierLists]
      }

      set({ savedTierLists: updated })
      try {
        localStorage.setItem('2tier_saved_tierlists', JSON.stringify(updated))
      } catch (err) {
        console.error('Failed to save tier list:', err)
      }
    },

    loadSavedTierList: (id) => {
      const { savedTierLists } = get()
      const found = savedTierLists.find((t) => t.id === id)
      if (!found) return

      const snapshotRows = JSON.parse(JSON.stringify(found.rows))
      const snapshotUnassigned = JSON.parse(JSON.stringify(found.unassignedItems))

      set({
        title: found.title,
        rows: snapshotRows,
        unassignedItems: snapshotUnassigned,
        activeDrawer: null,
      })
      pushStateToHistory(found.title, snapshotRows, snapshotUnassigned)
    },

    updateSavedTierList: (id, updates) => {
      const { savedTierLists } = get()
      const updated = savedTierLists.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t))
      set({ savedTierLists: updated })
      try {
        localStorage.setItem('2tier_saved_tierlists', JSON.stringify(updated))
      } catch (err) {
        console.error('Failed to update tier list:', err)
      }
    },

    deleteSavedTierList: (id) => {
      const { savedTierLists } = get()
      const updated = savedTierLists.filter((t) => t.id !== id)
      set({ savedTierLists: updated })
      try {
        localStorage.setItem('2tier_saved_tierlists', JSON.stringify(updated))
      } catch (err) {
        console.error('Failed to delete tier list:', err)
      }
    },

    // Undo / Redo
    undo: () => {
      const { history, historyIndex } = get()
      if (historyIndex <= 0) return

      const prevIndex = historyIndex - 1
      const snapshot = JSON.parse(JSON.stringify(history[prevIndex]))

      set({
        title: snapshot.title,
        rows: snapshot.rows,
        unassignedItems: snapshot.unassignedItems,
        historyIndex: prevIndex,
        canUndo: prevIndex > 0,
        canRedo: true,
      })
    },

    redo: () => {
      const { history, historyIndex } = get()
      if (historyIndex >= history.length - 1) return

      const nextIndex = historyIndex + 1
      const snapshot = JSON.parse(JSON.stringify(history[nextIndex]))

      set({
        title: snapshot.title,
        rows: snapshot.rows,
        unassignedItems: snapshot.unassignedItems,
        historyIndex: nextIndex,
        canUndo: true,
        canRedo: nextIndex < history.length - 1,
      })
    },
  }
})
