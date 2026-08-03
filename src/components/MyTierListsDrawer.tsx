import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Plus,
  FolderHeart,
  Trash2,
  Edit2,
  ExternalLink,
  Upload,
  Check,
  Clock,
} from 'lucide-react'
import { useTierStore } from '../store/useTierStore'
import { SavedTierList } from '../types/tier'
import { translations } from '../lib/i18n'

export const MyTierListsDrawer: React.FC = () => {
  const {
    savedTierLists,
    saveCurrentTierList,
    loadSavedTierList,
    updateSavedTierList,
    deleteSavedTierList,
    setActiveDrawer,
    title,
    language,
  } = useTierStore()

  const t = translations[language] || translations.en

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [saveMessage, setSaveMessage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSaveCurrent = () => {
    saveCurrentTierList()
    setSaveMessage(true)
    setTimeout(() => setSaveMessage(false), 2500)
  }

  const handleStartEdit = (list: SavedTierList) => {
    setEditingId(list.id)
    setEditTitle(list.title)
    setEditDesc(list.description || '')
  }

  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim()) return
    updateSavedTierList(id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
    })
    setEditingId(null)
  }

  const handleCoverUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        updateSavedTierList(id, { coverImage: event.target.result as string })
      }
    }
    reader.readAsDataURL(file)
  }

  const getTotalItemCount = (list: SavedTierList) => {
    const rowItemsCount = list.rows.reduce((acc, r) => acc + r.items.length, 0)
    return rowItemsCount + list.unassignedItems.length
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex justify-end select-none">
        {/* Backdrop Fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setActiveDrawer(null)}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Drawer Panel Slide */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-sm bg-surface h-full border-l border-border flex flex-col justify-between p-5 shadow-2xl overflow-y-auto z-50"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <FolderHeart className="w-4 h-4 text-foreground" />
                <h3 className="font-semibold text-foreground text-sm">{t.mySavedTierLists}</h3>
              </div>
              <button
                onClick={() => setActiveDrawer(null)}
                className="p-1 rounded hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Save Current Board Action */}
            <div className="py-3 border-b border-border/60 space-y-2">
              <button
                onClick={handleSaveCurrent}
                className="w-full py-2 px-3 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>{t.saveCurrentListToCollection.replace('{title}', title)}</span>
              </button>

              {saveMessage && (
                <div className="p-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] flex items-center justify-center space-x-1.5 animate-fade-in">
                  <Check className="w-3.5 h-3.5" />
                  <span>{t.listSavedSuccess}</span>
                </div>
              )}
            </div>

            {/* List of Saved Projects */}
            <div className="py-4 space-y-3">
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t.mySavedTierLists} ({savedTierLists.length})
              </h4>

              {savedTierLists.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground italic">
                  {t.noSavedLists}
                </div>
              ) : (
                savedTierLists.map((list) => {
                  const isEditing = editingId === list.id

                  return (
                    <div
                      key={list.id}
                      className="p-3 bg-surface-elevated hover:bg-surface-hover rounded-xl border border-border/80 transition-all hover:border-zinc-500 group relative flex flex-col space-y-2"
                    >
                      {/* Top Row: Cover Thumbnail + Info */}
                      <div className="flex items-start space-x-3">
                        {/* Cover Image / Thumbnail */}
                        <div className="relative w-12 h-12 rounded-lg bg-zinc-800 border border-border shrink-0 overflow-hidden group/img">
                          {list.coverImage ? (
                            <img src={list.coverImage} alt={list.title} className="w-full h-full object-cover" />
                          ) : list.rows[0]?.items[0]?.src ? (
                            <img src={list.rows[0].items[0].src} alt={list.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground font-bold uppercase">
                              2T
                            </div>
                          )}

                          <label
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white"
                            title="Upload cover image"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleCoverUpload(list.id, e)}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Text Info or Edit Input */}
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <div className="space-y-1">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full px-2 py-1 rounded bg-background text-foreground border border-border text-xs focus:outline-none"
                                autoFocus
                              />
                              <input
                                type="text"
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                placeholder="Description"
                                className="w-full px-2 py-0.5 rounded bg-background text-foreground border border-border text-[11px] focus:outline-none"
                              />
                              <div className="flex items-center space-x-2 pt-1">
                                <button
                                  onClick={() => handleSaveEdit(list.id)}
                                  className="px-2 py-0.5 rounded bg-zinc-200 text-black text-[10px] font-semibold"
                                >
                                  {t.saveTemplateBtn}
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="text-[10px] text-muted-foreground"
                                >
                                  {t.cancelBtn}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <h4 className="font-semibold text-foreground text-xs truncate">
                                {list.title}
                              </h4>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {list.description || 'Saved Tier List'}
                              </p>
                              <div className="flex items-center space-x-2 text-[10px] text-muted-foreground/80 mt-1">
                                <span>{getTotalItemCount(list)} {t.itemsCount}</span>
                                <span>•</span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{new Date(list.updatedAt).toLocaleDateString()}</span>
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Row Color Badges Preview */}
                      <div className="flex items-center space-x-1">
                        {list.rows.slice(0, 5).map((row, idx) => (
                          <div
                            key={idx}
                            style={{ backgroundColor: row.color }}
                            className="px-1.5 py-0.5 rounded text-[8px] font-extrabold text-zinc-950 truncate max-w-[45px]"
                          >
                            {row.label}
                          </div>
                        ))}
                      </div>

                      {/* Action Bar (Go Into, Edit, Delete) */}
                      <div className="flex items-center justify-between pt-1 border-t border-border/40">
                        <button
                          onClick={() => loadSavedTierList(list.id)}
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-medium flex items-center space-x-1 transition-colors"
                          title={t.openProject}
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{t.openProject}</span>
                        </button>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleStartEdit(list)}
                            className="p-1 rounded hover:bg-surface-hover text-muted-foreground hover:text-foreground"
                            title={t.editDetails}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(t.confirmDeleteProject.replace('{title}', list.title))) {
                                deleteSavedTierList(list.id)
                              }
                            }}
                            className="p-1 rounded hover:bg-red-500/20 text-muted-foreground hover:text-red-400"
                            title={t.deleteProject}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
