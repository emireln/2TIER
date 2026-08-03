import React, { useState, useRef, useEffect } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import {
  Eraser,
  MoreVertical,
} from 'lucide-react'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  SprayCanIcon,
  PlusIcon,
  XIcon,
} from './icons'
import { TierRow as TierRowType } from '../types/tier'
import { useTierStore, DEFAULT_PRESET_COLORS } from '../store/useTierStore'
import { TierItemCard } from './TierItemCard'
import { translations } from '../lib/i18n'

interface Props {
  row: TierRowType
  index: number
  totalRows: number
}

export const TierRow: React.FC<Props> = ({ row, index, totalRows }) => {
  const {
    updateRowLabel,
    updateRowColor,
    addTierRow,
    deleteTierRow,
    clearTierRow,
    moveTierRow,
    language,
  } = useTierStore()

  const t = translations[language] || translations.en

  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [tempLabel, setTempLabel] = useState(row.label)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)
  const colorPickerRef = useRef<HTMLDivElement>(null)

  // Click outside listener for popover menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const { setNodeRef, isOver } = useDroppable({
    id: row.id,
  })

  const itemIds = row.items.map((i) => i.id)

  const handleLabelSubmit = () => {
    setIsEditingLabel(false)
    if (tempLabel.trim()) {
      updateRowLabel(row.id, tempLabel.trim())
    } else {
      setTempLabel(row.label)
    }
  }

  return (
    <div className="relative flex w-full min-h-[96px] bg-surface rounded-xl border border-border/70 shadow-sm hover:border-border transition-all">
      {/* Row Header Tag (Label + Color) */}
      <div
        style={{ backgroundColor: row.color }}
        className="w-28 sm:w-36 shrink-0 flex flex-col items-center justify-center p-3 relative group transition-colors select-none text-zinc-950 font-bold rounded-l-xl"
      >
        {isEditingLabel ? (
          <input
            type="text"
            value={tempLabel}
            onChange={(e) => setTempLabel(e.target.value)}
            onBlur={handleLabelSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLabelSubmit()
              if (e.key === 'Escape') {
                setIsEditingLabel(false)
                setTempLabel(row.label)
              }
            }}
            autoFocus
            className="bg-black/20 text-center text-zinc-950 font-extrabold w-full px-1 py-0.5 rounded text-sm sm:text-base border border-black/40 focus:outline-none uppercase"
          />
        ) : (
          <button
            onClick={() => {
              setTempLabel(row.label)
              setIsEditingLabel(true)
            }}
            className="text-center w-full truncate px-1 text-sm sm:text-base tracking-wide font-extrabold uppercase hover:opacity-80 transition-opacity"
            title={t.clickToEditLabel}
          >
            {row.label}
          </button>
        )}

        {/* Clean SprayCan Color Trigger Button */}
        <div ref={colorPickerRef} className="absolute bottom-1.5 right-1.5 z-20">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              setShowColorPicker(!showColorPicker)
            }}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-black/10 hover:bg-black/20 text-zinc-950 transition-all opacity-0 group-hover:opacity-100 active:scale-95 shadow-xs"
            title={t.changeRowColor}
          >
            <SprayCanIcon size={16} />
          </button>

          {/* Color Palette Popover */}
          {showColorPicker && (
            <div
              className="absolute top-full left-0 mt-2 z-50 bg-surface-elevated p-2.5 rounded-xl border border-border shadow-2xl grid grid-cols-5 gap-2 w-40 animate-fade-in"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {DEFAULT_PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    updateRowColor(row.id, color)
                    setShowColorPicker(false)
                  }}
                  style={{ backgroundColor: color }}
                  className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 active:scale-95 transition-all shadow-xs"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row Items Drop Container */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-2.5 flex flex-wrap items-center gap-2.5 min-h-[96px] transition-colors ${
          isOver ? 'bg-zinc-800/40 ring-2 ring-zinc-500/50' : 'bg-surface-elevated/30'
        }`}
      >
        <SortableContext items={itemIds} strategy={horizontalListSortingStrategy}>
          {row.items.map((item) => (
            <TierItemCard key={item.id} item={item} />
          ))}
        </SortableContext>

        {row.items.length === 0 && !isOver && (
          <div className="w-full text-center text-xs text-muted-foreground/40 italic pointer-events-none select-none">
            {t.dragDropRowHint}
          </div>
        )}
      </div>

      {/* Row Actions Column */}
      <div className="w-10 bg-surface-elevated/80 border-l border-border/60 flex flex-col items-center justify-center space-y-1 p-1 shrink-0 rounded-r-xl">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => moveTierRow(index, index - 1)}
          disabled={index === 0}
          className="p-1 rounded hover:bg-surface-hover text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          title={t.moveRowUp}
        >
          <ChevronUpIcon size={14} />
        </button>

        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => moveTierRow(index, index + 1)}
          disabled={index === totalRows - 1}
          className="p-1 rounded hover:bg-surface-hover text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          title={t.moveRowDown}
        >
          <ChevronDownIcon size={14} />
        </button>

        {/* Row Options Dropdown Toggle */}
        <div ref={menuRef} className="relative z-30">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-1 rounded hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors"
            title={t.rowOptions}
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-full mt-1.5 z-50 w-44 bg-surface-elevated rounded-xl border border-border shadow-2xl p-1 text-xs text-foreground animate-fade-in"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  addTierRow(index)
                  setShowMenu(false)
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-hover flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <PlusIcon size={14} />
                <span>{t.addRowAbove}</span>
              </button>
              <button
                onClick={() => {
                  addTierRow(index + 1)
                  setShowMenu(false)
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-hover flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <PlusIcon size={14} />
                <span>{t.addRowBelow}</span>
              </button>
              <div className="my-1 h-[1px] bg-border/60" />
              <button
                onClick={() => {
                  clearTierRow(row.id)
                  setShowMenu(false)
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-hover flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>{t.clearRow}</span>
              </button>
              <button
                onClick={() => {
                  deleteTierRow(row.id)
                  setShowMenu(false)
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-500/20 flex items-center space-x-2 text-red-400 transition-colors"
              >
                <XIcon size={14} />
                <span>{t.deleteRow}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
