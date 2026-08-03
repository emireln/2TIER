import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Bookmark, Trash2 } from 'lucide-react'
import { LayoutGridIcon, SparklesIcon } from './icons'
import { useTierStore, PRESET_TEMPLATES } from '../store/useTierStore'
import { translations } from '../lib/i18n'

export const TemplateDrawer: React.FC = () => {
  const {
    loadTemplate,
    setActiveDrawer,
    resetBoard,
    customTemplates,
    saveCurrentAsTemplate,
    deleteCustomTemplate,
    language,
  } = useTierStore()

  const t = translations[language] || translations.en

  const [showSaveForm, setShowSaveForm] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templateDesc, setTemplateDesc] = useState('')

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!templateName.trim()) return
    saveCurrentAsTemplate(templateName, templateDesc)
    setTemplateName('')
    setTemplateDesc('')
    setShowSaveForm(false)
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
                <LayoutGridIcon size={16} className="text-foreground" />
                <h3 className="font-semibold text-foreground text-sm">{t.presets}</h3>
              </div>
              <button
                onClick={() => setActiveDrawer(null)}
                className="p-1 rounded hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Custom Template Creator Form Toggle */}
            <div className="py-3 border-b border-border/60">
              {!showSaveForm ? (
                <button
                  onClick={() => setShowSaveForm(true)}
                  className="w-full py-2 px-3 rounded-lg bg-surface-elevated hover:bg-surface-hover text-foreground text-xs font-medium border border-border/80 flex items-center justify-center space-x-2 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.saveBoardAsTemplate}</span>
                </button>
              ) : (
                <form onSubmit={handleSaveSubmit} className="space-y-2.5 bg-surface-elevated p-3 rounded-xl border border-border/80 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground flex items-center space-x-1.5">
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{t.newCustomTemplate}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSaveForm(false)}
                      className="text-muted-foreground hover:text-foreground text-xs"
                    >
                      {t.cancelBtn}
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder={t.templateNamePlaceholder}
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 rounded-md bg-background text-foreground border border-border/80 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                  <input
                    type="text"
                    placeholder={t.templateDescPlaceholder}
                    value={templateDesc}
                    onChange={(e) => setTemplateDesc(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md bg-background text-foreground border border-border/80 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium text-xs hover:opacity-90 transition-opacity"
                  >
                    {t.saveTemplateBtn}
                  </button>
                </form>
              )}
            </div>

            {/* Custom Saved Templates Section */}
            {customTemplates.length > 0 && (
              <div className="py-3 border-b border-border/60">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {t.myCustomTemplates}
                </h4>
                <div className="space-y-2">
                  {customTemplates.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      onClick={() => loadTemplate(tmpl)}
                      className="p-3 bg-surface-elevated hover:bg-surface-hover rounded-xl border border-border/80 cursor-pointer transition-all hover:border-zinc-500 group relative"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground text-xs group-hover:text-white transition-colors">
                          {tmpl.name}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteCustomTemplate(tmpl.id)
                          }}
                          className="p-1 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          title={t.deleteTemplate}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">{tmpl.description}</p>
                      <div className="flex items-center space-x-1.5 mt-2.5">
                        {tmpl.rows.map((row, idx) => (
                          <div
                            key={idx}
                            style={{ backgroundColor: row.color }}
                            className="px-1.5 py-0.5 rounded text-[9px] font-bold text-zinc-950 truncate max-w-[50px]"
                          >
                            {row.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Presets Section */}
            <div className="py-3 space-y-3">
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t.defaultPresets}
              </h4>
              {PRESET_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => loadTemplate(tmpl)}
                  className="p-3 bg-surface-elevated hover:bg-surface-hover rounded-xl border border-border/80 cursor-pointer transition-all hover:border-zinc-500 group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground text-xs group-hover:text-white transition-colors">
                      {tmpl.name}
                    </h4>
                    <SparklesIcon size={14} className="text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{tmpl.description}</p>

                  <div className="flex items-center space-x-1.5 mt-2.5">
                    {tmpl.rows.map((row, idx) => (
                      <div
                        key={idx}
                        style={{ backgroundColor: row.color }}
                        className="px-1.5 py-0.5 rounded text-[9px] font-bold text-zinc-950 truncate max-w-[50px]"
                      >
                        {row.label}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-border">
            <button
              onClick={() => {
                if (confirm(t.confirmReset)) {
                  resetBoard()
                }
              }}
              className="w-full py-2 rounded-lg bg-surface-elevated hover:bg-surface-hover text-foreground text-xs font-medium border border-border/60 transition-colors"
            >
              {t.resetToDefaultTemplate}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
