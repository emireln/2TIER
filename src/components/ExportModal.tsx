import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toPng, toJpeg } from 'html-to-image'
import { X, Check, Loader2 } from 'lucide-react'
import { SlidersHorizontalIcon, DownloadIcon } from './icons'
import { useTierStore } from '../store/useTierStore'
import { translations } from '../lib/i18n'

export const ExportModal: React.FC = () => {
  const { title, exportSettings, updateExportSettings, setActiveDrawer, language } = useTierStore()
  const t = translations[language] || translations.en

  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const handleExport = async () => {
    const exportArea = document.getElementById('tier-board-export-area')
    if (!exportArea) return

    setIsExporting(true)
    setExportSuccess(false)

    // Handle Title Header element temporarily for export generation without touching live React state
    let tempHeader: HTMLDivElement | null = null
    const existingHeader = document.getElementById('board-title-header-banner')

    if (exportSettings.includeTitle) {
      if (!existingHeader) {
        tempHeader = document.createElement('div')
        tempHeader.id = 'temp-export-header'
        tempHeader.className = 'px-3 py-2 flex items-center justify-between border-b border-border/60 mb-3 select-none'
        tempHeader.innerHTML = `
          <h1 class="text-xl font-bold tracking-tight text-foreground uppercase">${title}</h1>
          ${
            exportSettings.watermark
              ? `<div class="flex items-center space-x-2 text-xs text-muted-foreground/70 font-extrabold tracking-widest uppercase">
                  <span>2TIER</span>
                </div>`
              : ''
          }
        `
        exportArea.prepend(tempHeader)
      }
    } else {
      if (existingHeader) {
        existingHeader.style.display = 'none'
      }
    }

    try {
      const pixelRatio = exportSettings.scale
      const options = {
        pixelRatio,
        backgroundColor: exportSettings.backgroundColor,
        quality: 0.95,
        cacheBust: true,
        style: {
          overflow: 'visible',
          overflowX: 'visible',
          overflowY: 'visible',
          maxHeight: 'none',
          height: 'auto',
          width: '1200px',
          minWidth: '1200px',
          padding: `${exportSettings.borderPadding}px`,
        },
        filter: (domNode: HTMLElement) => {
          if (domNode.classList && (domNode.classList.contains('dnd-overlay') || domNode.getAttribute?.('role') === 'dialog')) {
            return false
          }
          return true
        },
      }

      let dataUrl = ''
      if (exportSettings.format === 'jpeg') {
        dataUrl = await toJpeg(exportArea, options)
      } else {
        dataUrl = await toPng(exportArea, options)
      }

      const defaultFileName = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-tierlist.${exportSettings.format}`

      if (window.electronAPI) {
        const saved = await window.electronAPI.saveExportImage(dataUrl, defaultFileName)
        if (saved) {
          setExportSuccess(true)
          setTimeout(() => setExportSuccess(false), 3000)
        }
      } else {
        const link = document.createElement('a')
        link.download = defaultFileName
        link.href = dataUrl
        link.click()
        setExportSuccess(true)
        setTimeout(() => setExportSuccess(false), 3000)
      }
    } catch (err) {
      console.error('Export failed:', err)
      alert('Failed to generate export image. Please try again.')
    } finally {
      // Clean up temporary DOM adjustments
      if (tempHeader) {
        tempHeader.remove()
      }
      if (existingHeader) {
        existingHeader.style.display = ''
      }
      setIsExporting(false)
    }
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
                <SlidersHorizontalIcon size={16} className="text-foreground" />
                <h3 className="font-semibold text-foreground text-sm">{t.exportSettingsTitle}</h3>
              </div>
              <button
                onClick={() => setActiveDrawer(null)}
                className="p-1 rounded hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Options */}
            <div className="py-4 space-y-4 text-xs">
              {/* Format Selection */}
              <div className="space-y-1.5">
                <label className="text-muted-foreground font-medium">{t.imageFormat}</label>
                <div className="grid grid-cols-3 gap-1.5 bg-surface-elevated p-1 rounded-lg border border-border/60">
                  {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => updateExportSettings({ format: fmt })}
                      className={`py-1.5 rounded-md font-semibold uppercase transition-all ${
                        exportSettings.format === fmt
                          ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution Scale */}
              <div className="space-y-1.5">
                <label className="text-muted-foreground font-medium">{t.renderResolution}</label>
                <div className="grid grid-cols-3 gap-1.5 bg-surface-elevated p-1 rounded-lg border border-border/60">
                  {([1, 2, 4] as const).map((scale) => (
                    <button
                      key={scale}
                      onClick={() => updateExportSettings({ scale })}
                      className={`py-1.5 rounded-md font-semibold transition-all ${
                        exportSettings.scale === scale
                          ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {scale === 1 ? '1x (Standard)' : scale === 2 ? '2x (HD)' : '4x (Ultra HD)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Watermark Toggles */}
              <div className="space-y-2 pt-2 border-t border-border">
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <span className="text-foreground/90 font-medium">{t.includeTitleHeader}</span>
                  <input
                    type="checkbox"
                    checked={exportSettings.includeTitle}
                    onChange={(e) => updateExportSettings({ includeTitle: e.target.checked })}
                    className="rounded border-border bg-surface-elevated accent-zinc-900 dark:accent-zinc-100 h-4 w-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1">
                  <span className="text-foreground/90 font-medium">Include 2TIER Watermark</span>
                  <input
                    type="checkbox"
                    checked={exportSettings.watermark}
                    onChange={(e) => updateExportSettings({ watermark: e.target.checked })}
                    className="rounded border-border bg-surface-elevated accent-zinc-900 dark:accent-zinc-100 h-4 w-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="pt-4 border-t border-border space-y-2">
            {exportSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{t.exportSuccess}</span>
              </div>
            )}

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full py-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 font-medium text-xs flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Image...</span>
                </>
              ) : (
                <>
                  <DownloadIcon size={16} />
                  <span>{t.saveHighResImage}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
