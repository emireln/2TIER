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
    opacity: isDragging ? 0.25 : 1,
    touchAction: 'none',
    willChange: 'transform',
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

        {/* Compact Bottom Action Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-black/85 backdrop-blur-xs py-0.5 px-1.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
          <span className="text-[10px] text-zinc-300 font-medium truncate max-w-[42px] pointer-events-none">
            {item.label || ''}
          </span>
          <div className="flex items-center space-x-1 pointer-events-auto">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                setShowPreview(true)
              }}
              className="p-0.5 rounded hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
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
              className="p-0.5 rounded hover:bg-red-800 text-red-300 hover:text-white transition-colors"
              title={t.deleteItem}
            >
              <XIcon size={11} />
            </button>
          </div>
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
