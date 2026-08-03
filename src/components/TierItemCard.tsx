import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Maximize2, X } from 'lucide-react'
import { XIcon } from './icons'
import { TierItem } from '../types/tier'
import { useTierStore } from '../store/useTierStore'
import { translations } from '../lib/i18n'

interface Props {
  item: TierItem
}

export const TierItemCard: React.FC<Props> = ({ item }) => {
  const { deleteItem, language } = useTierStore()
  const t = translations[language] || translations.en
  const [showPreview, setShowPreview] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    touchAction: 'none',
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="group relative w-20 h-20 bg-surface-elevated rounded-lg border border-border/80 overflow-hidden cursor-grab active:cursor-grabbing hover:border-zinc-400 hover:shadow-lg transition-all duration-150 shrink-0 select-none flex flex-col items-center justify-center touch-none"
      >
        <img
          src={item.src}
          alt={item.label || 'Tier item'}
          className="w-full h-full object-cover pointer-events-none"
        />

        {item.label && (
          <div className="absolute bottom-0 inset-x-0 bg-black/75 backdrop-blur-xs px-1 py-0.5 text-[10px] text-zinc-200 truncate text-center font-medium pointer-events-none">
            {item.label}
          </div>
        )}

        {/* Hover Overlay Action Controls */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1.5 p-1 z-10 pointer-events-auto">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              setShowPreview(true)
            }}
            className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 hover:text-white transition-colors"
            title={t.previewImage}
          >
            <Maximize2 className="w-3 h-3" />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              deleteItem(item.id)
            }}
            className="p-1 rounded bg-red-900/80 hover:bg-red-700 text-red-200 hover:text-white transition-colors"
            title={t.deleteItem}
          >
            <XIcon size={12} />
          </button>
        </div>
      </div>

      {/* Image Preview Lightbox */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="relative max-w-2xl max-h-[85vh] bg-surface rounded-xl border border-border overflow-hidden p-2 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={item.src}
              alt={item.label || 'Preview'}
              className="max-h-[70vh] object-contain rounded-lg"
            />
            {item.label && (
              <p className="mt-3 text-sm text-foreground/90 font-medium">{item.label}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
