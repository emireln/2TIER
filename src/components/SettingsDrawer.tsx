import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Globe,
  Monitor,
  Sliders,
  Laptop,
} from 'lucide-react'
import { SettingsIcon } from './icons'
import { useTierStore } from '../store/useTierStore'
import { translations } from '../lib/i18n'

export const SettingsDrawer: React.FC = () => {
  const {
    language,
    setLanguage,
    hideHeaderTitle,
    setHideHeaderTitle,
    exportSettings,
    updateExportSettings,
    setActiveDrawer,
  } = useTierStore()

  const t = translations[language] || translations.en

  // Electron Desktop Settings State
  const isElectron = typeof window !== 'undefined' && Boolean(window.electronAPI)
  const [autoLaunch, setAutoLaunchState] = useState(false)
  const [alwaysOnTop, setAlwaysOnTopState] = useState(false)

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getAutoLaunch().then(setAutoLaunchState)
      window.electronAPI.getAlwaysOnTop().then(setAlwaysOnTopState)
    }
  }, [])

  const handleToggleAutoLaunch = async (enabled: boolean) => {
    setAutoLaunchState(enabled)
    if (window.electronAPI) {
      const res = await window.electronAPI.setAutoLaunch(enabled)
      setAutoLaunchState(res)
    }
  }

  const handleToggleAlwaysOnTop = async (enabled: boolean) => {
    setAlwaysOnTopState(enabled)
    if (window.electronAPI) {
      const res = await window.electronAPI.setAlwaysOnTop(enabled)
      setAlwaysOnTopState(res)
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
                <SettingsIcon size={16} className="text-foreground" />
                <h3 className="font-semibold text-foreground text-sm">{t.settingsTitle}</h3>
              </div>
              <button
                onClick={() => setActiveDrawer(null)}
                className="p-1 rounded hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language Switcher Section with SVG Flags */}
            <div className="py-4 border-b border-border/60 space-y-2 text-xs">
              <div className="flex items-center space-x-2 font-semibold text-foreground">
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span>{t.languageLabel}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 bg-surface-elevated p-1 rounded-lg border border-border/60">
                <button
                  onClick={() => setLanguage('en')}
                  className={`py-1.5 px-2 rounded-md font-medium text-xs flex items-center justify-center space-x-2 transition-all ${
                    language === 'en'
                      ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <img src="/flags/us.svg" alt="English" className="w-4 h-3 rounded-xs object-cover shadow-xs" />
                  <span>English</span>
                </button>
                <button
                  onClick={() => setLanguage('pt-BR')}
                  className={`py-1.5 px-2 rounded-md font-medium text-xs flex items-center justify-center space-x-2 transition-all ${
                    language === 'pt-BR'
                      ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <img src="/flags/br.svg" alt="Português" className="w-4 h-3 rounded-xs object-cover shadow-xs" />
                  <span>PT-BR</span>
                </button>
              </div>
            </div>

            {/* Display & Interface Preferences */}
            <div className="py-4 border-b border-border/60 space-y-3 text-xs">
              <div className="flex items-center space-x-2 font-semibold text-foreground">
                <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                <span>{t.interfacePreferences}</span>
              </div>

              <label className="flex items-start justify-between cursor-pointer p-2.5 rounded-xl bg-surface-elevated border border-border/60 hover:border-zinc-500 transition-colors">
                <div className="space-y-0.5 pr-2">
                  <span className="font-medium text-foreground block">{t.hideHeaderTitle}</span>
                  <span className="text-[11px] text-muted-foreground block">{t.hideHeaderTitleDesc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={hideHeaderTitle}
                  onChange={(e) => setHideHeaderTitle(e.target.checked)}
                  className="rounded border-border bg-background accent-zinc-900 dark:accent-zinc-100 h-4 w-4 cursor-pointer mt-0.5"
                />
              </label>
            </div>

            {/* Electron Desktop App Settings (With Web Fallback) */}
            <div className="py-4 border-b border-border/60 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-semibold text-foreground">
                  <Laptop className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{t.desktopSettings}</span>
                </div>
                {!isElectron && (
                  <span className="text-[10px] bg-surface-elevated px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                    Web Host
                  </span>
                )}
              </div>

              <label className={`flex items-start justify-between p-2.5 rounded-xl bg-surface-elevated border border-border/60 transition-colors ${
                isElectron ? 'cursor-pointer hover:border-zinc-500' : 'opacity-50 cursor-not-allowed'
              }`}>
                <div className="space-y-0.5 pr-2">
                  <span className="font-medium text-foreground block">{t.startWithWindows}</span>
                  <span className="text-[11px] text-muted-foreground block">{t.startWithWindowsDesc}</span>
                </div>
                <input
                  type="checkbox"
                  disabled={!isElectron}
                  checked={autoLaunch}
                  onChange={(e) => handleToggleAutoLaunch(e.target.checked)}
                  className="rounded border-border bg-background accent-zinc-900 dark:accent-zinc-100 h-4 w-4 cursor-pointer mt-0.5"
                />
              </label>

              <label className={`flex items-start justify-between p-2.5 rounded-xl bg-surface-elevated border border-border/60 transition-colors ${
                isElectron ? 'cursor-pointer hover:border-zinc-500' : 'opacity-50 cursor-not-allowed'
              }`}>
                <div className="space-y-0.5 pr-2">
                  <span className="font-medium text-foreground block">{t.alwaysOnTop}</span>
                  <span className="text-[11px] text-muted-foreground block">{t.alwaysOnTopDesc}</span>
                </div>
                <input
                  type="checkbox"
                  disabled={!isElectron}
                  checked={alwaysOnTop}
                  onChange={(e) => handleToggleAlwaysOnTop(e.target.checked)}
                  className="rounded border-border bg-background accent-zinc-900 dark:accent-zinc-100 h-4 w-4 cursor-pointer mt-0.5"
                />
              </label>
            </div>

            {/* Export Defaults */}
            <div className="py-4 space-y-3 text-xs">
              <div className="flex items-center space-x-2 font-semibold text-foreground">
                <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                <span>{t.defaultExportSettings}</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground font-medium">{t.defaultScale}</label>
                <div className="grid grid-cols-3 gap-1.5 bg-surface-elevated p-1 rounded-lg border border-border/60">
                  {([1, 2, 4] as const).map((scale) => (
                    <button
                      key={scale}
                      onClick={() => updateExportSettings({ scale })}
                      className={`py-1 rounded font-semibold transition-all ${
                        exportSettings.scale === scale
                          ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {scale}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
