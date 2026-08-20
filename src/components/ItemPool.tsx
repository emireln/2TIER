import React, { useEffect, useRef } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { Image as ImageIcon } from 'lucide-react'
import {
  SparklesIcon,
  UploadIcon,
  XIcon,
  EyeOffIcon,
} from './icons'
import { useTierStore } from '../store/useTierStore'
import { TierItemCard } from './TierItemCard'
import { translations } from '../lib/i18n'

const createSampleSvg = (symbol: string, bg1: string, bg2: string, textCol = '#ffffff') =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bg1}"/>
          <stop offset="100%" stop-color="${bg2}"/>
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#g)"/>
      <circle cx="100" cy="100" r="60" fill="none" stroke="${textCol}" stroke-width="2" opacity="0.25"/>
      <text x="100" y="118" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="54" font-weight="900" fill="${textCol}" text-anchor="middle" dominant-baseline="middle">${symbol}</text>
    </svg>`
  )}`

const SAMPLE_ITEMS = [
  { name: 'Alpha', src: createSampleSvg('Α', '#18181b', '#27272a') },
  { name: 'Beta', src: createSampleSvg('Β', '#27272a', '#3f3f46') },
  { name: 'Gamma', src: createSampleSvg('Γ', '#09090b', '#18181b') },
  { name: 'Delta', src: createSampleSvg('Δ', '#1e293b', '#334155') },
  { name: 'Epsilon', src: createSampleSvg('Ε', '#171717', '#262626') },
  { name: 'Omega', src: createSampleSvg('Ω', '#1c1917', '#292524') },
]


export const ItemPool: React.FC = () => {
  const { unassignedItems, addItems, clearAllItems, isPoolVisible, togglePoolVisibility, language } = useTierStore()
  const t = translations[language] || translations.en
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { setNodeRef, isOver } = useDroppable({
    id: 'unassigned',
  })

  const itemIds = unassignedItems.map((i) => i.id)

  const handleSelectFiles = async () => {
    if (window.electronAPI) {
      const files = await window.electronAPI.openImageFiles()
      if (files && files.length > 0) {
        addItems(files)
      }
    } else {
      fileInputRef.current?.click()
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newItems: Array<{ name: string; src: string }> = []
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            newItems.push({
              name: file.name.replace(/\.[^/.]+$/, ''),
              src: event.target.result as string,
            })
            if (newItems.length === files.length) {
              addItems(newItems)
            }
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const newItems: Array<{ name: string; src: string }> = []
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (event) => {
            if (event.target?.result) {
              newItems.push({
                name: file.name.replace(/\.[^/.]+$/, ''),
                src: event.target.result as string,
              })
              if (newItems.length === files.length) {
                addItems(newItems)
              }
            }
          }
          reader.readAsDataURL(file)
        }
      })
    }
  }

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const blob = items[i].getAsFile()
          if (blob) {
            const reader = new FileReader()
            reader.onload = (event) => {
              if (event.target?.result) {
                addItems([
                  {
                    name: 'Pasted Image',
                    src: event.target.result as string,
                  },
                ])
              }
            }
            reader.readAsDataURL(blob)
          }
        }
      }
    }

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [addItems])

  if (!isPoolVisible) {
    return null
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="bg-surface border-t border-border p-3 flex flex-col space-y-2 shrink-0 z-20 transition-all animate-fade-in"
    >
      {/* Pool Header Toolbar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-foreground/90 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
            <span>{t.unassignedPool}</span>
          </span>
          <span className="bg-surface-elevated px-2 py-0.5 rounded-full text-[10px] text-zinc-400 border border-border/50">
            {unassignedItems.length} {t.itemsCount}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => addItems(SAMPLE_ITEMS)}
            className="px-2.5 py-1 rounded-md bg-surface-elevated hover:bg-surface-hover text-foreground/90 transition-colors flex items-center space-x-1.5 text-xs font-medium border border-border/60"
            title={t.loadDemoImages}
          >
            <SparklesIcon size={13} className="text-zinc-400" />
            <span>{t.loadDemoImages}</span>
          </button>

          <button
            onClick={handleSelectFiles}
            className="px-2.5 py-1 rounded-md bg-surface-elevated hover:bg-surface-hover text-foreground/90 transition-colors flex items-center space-x-1.5 text-xs font-medium border border-border/60"
            title={t.bulkUpload}
          >
            <UploadIcon size={13} />
            <span>{t.bulkUpload}</span>
          </button>

          {unassignedItems.length > 0 && (
            <button
              onClick={() => {
                if (confirm(t.confirmClearPool)) {
                  clearAllItems()
                }
              }}
              className="p-1 rounded hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors"
              title={t.clearPool}
            >
              <XIcon size={14} />
            </button>
          )}

          <button
            onClick={togglePoolVisibility}
            className="p-1 rounded hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors ml-1"
            title={t.hidePool}
          >
            <EyeOffIcon size={14} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Item Pool Drag & Drop Area */}
      <div
        ref={setNodeRef}
        className={`min-h-[110px] max-h-[160px] overflow-x-auto overflow-y-hidden bg-surface-elevated/40 rounded-xl border border-dashed border-border/80 p-2.5 flex items-center gap-3 transition-colors ${
          isOver ? 'bg-zinc-800/40 border-zinc-400 ring-2 ring-zinc-500/30' : ''
        }`}
      >
        <SortableContext items={itemIds} strategy={horizontalListSortingStrategy}>
          {unassignedItems.map((item) => (
            <TierItemCard key={item.id} item={item} />
          ))}
        </SortableContext>

        {unassignedItems.length === 0 && (
          <div className="w-full flex flex-col items-center justify-center text-center p-4 space-y-1.5 text-muted-foreground/60 select-none">
            <p className="text-xs font-medium text-muted-foreground">
              {t.dragDropHint}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
