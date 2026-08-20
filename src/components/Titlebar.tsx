import React, { useState, useEffect } from 'react'
import {
  Minus,
  Square,
  Copy,
  X,
  FolderHeart,
} from 'lucide-react'
import {
  UndoIcon,
  RedoIcon,
  PlusIcon,
  LayoutGridIcon,
  DownloadIcon,
  SunIcon,
  MoonIcon,
  XIcon,
  EyeIcon,
  EyeOffIcon,
  SettingsIcon,
} from './icons'
import { Logo } from './Logo'
import { useTierStore } from '../store/useTierStore'
import { translations } from '../lib/i18n'

export const Titlebar: React.FC = () => {
  const {
    title,
    setTitle,
    undo,
    redo,
    canUndo,
    canRedo,
    activeDrawer,
    setActiveDrawer,
    theme,
    toggleTheme,
    resetBoard,
    addTierRow,
    isPoolVisible,
    togglePoolVisibility,
    language,
  } = useTierStore()

  const t = translations[language] || translations.en

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [tempTitle, setTempTitle] = useState(title)
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.isMaximized().then(setIsMaximized)
      const cleanup = window.electronAPI.onWindowStateChange(setIsMaximized)
      return cleanup
    }
  }, [])

  const handleTitleSubmit = () => {
    setIsEditingTitle(false)
    if (tempTitle.trim()) {
      setTitle(tempTitle.trim())
    } else {
      setTempTitle(title)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit()
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false)
      setTempTitle(title)
    }
  }

  return (
    <header className="app-drag select-none h-11 bg-background border-b border-border/80 flex items-center justify-between px-3 text-sm text-foreground font-medium z-30 shrink-0">
      {/* Left: 2TIER Logo & Active Project Name */}
      <div className="app-no-drag flex items-center space-x-2.5">
        <div className="flex items-center space-x-2 font-bold text-xs tracking-wider">
          <Logo className="w-5 h-5 text-black dark:text-white" />
          <span className="font-extrabold tracking-tight text-foreground text-sm">2TIER</span>
        </div>

        <span className="text-border/60 font-light">|</span>

        {isEditingTitle ? (
          <input
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={handleKeyDown}
            autoFocus
            className="bg-surface text-foreground px-2 py-0.5 rounded border border-border text-xs focus:outline-none focus:ring-1 focus:ring-foreground max-w-[180px]"
          />
        ) : (
          <button
            onClick={() => {
              setTempTitle(title)
              setIsEditingTitle(true)
            }}
            className="hover:bg-surface-hover px-2 py-0.5 rounded transition-colors text-xs text-muted-foreground hover:text-foreground truncate max-w-[180px]"
            title="Click to edit project title"
          >
            {title}
          </button>
        )}
      </div>

      {/* Center Toolbar: Direct Wired Buttons */}
      <div className="app-no-drag flex items-center space-x-1">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`p-1.5 rounded-md transition-all ${
            canUndo
              ? 'hover:bg-surface-hover text-foreground/90 hover:text-foreground'
              : 'text-muted-foreground/30 cursor-not-allowed'
          }`}
          title={`${t.undo} (Ctrl+Z)`}
        >
          <UndoIcon size={14} />
        </button>

        <button
          onClick={redo}
          disabled={!canRedo}
          className={`p-1.5 rounded-md transition-all ${
            canRedo
              ? 'hover:bg-surface-hover text-foreground/90 hover:text-foreground'
              : 'text-muted-foreground/30 cursor-not-allowed'
          }`}
          title={`${t.redo} (Ctrl+Shift+Z)`}
        >
          <RedoIcon size={14} />
        </button>

        <div className="w-[1px] h-3.5 bg-border/60 mx-1" />

        <button
          onClick={() => addTierRow()}
          className="px-2 py-1 rounded-md hover:bg-surface-hover text-foreground/90 hover:text-foreground transition-all flex items-center space-x-1.5 text-xs"
          title={t.addTier}
        >
          <PlusIcon size={14} />
          <span className="hidden md:inline font-normal">{t.addTier}</span>
        </button>

        <button
          onClick={() => setActiveDrawer(activeDrawer === 'templates' ? null : 'templates')}
          className={`px-2 py-1 rounded-md transition-all flex items-center space-x-1.5 text-xs ${
            activeDrawer === 'templates'
              ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black font-semibold'
              : 'hover:bg-surface-hover text-foreground/90 hover:text-foreground'
          }`}
          title={t.presets}
        >
          <LayoutGridIcon size={14} />
          <span className="hidden md:inline font-normal">{t.presets}</span>
        </button>

        <button
          onClick={() => setActiveDrawer(activeDrawer === 'export' ? null : 'export')}
          className={`px-2 py-1 rounded-md transition-all flex items-center space-x-1.5 text-xs ${
            activeDrawer === 'export'
              ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black font-semibold'
              : 'hover:bg-surface-hover text-foreground/90 hover:text-foreground'
          }`}
          title={`${t.export} (Ctrl+E)`}
        >
          <DownloadIcon size={14} />
          <span className="hidden md:inline font-normal">{t.export}</span>
        </button>

        <div className="w-[1px] h-3.5 bg-border/60 mx-1" />

        {/* Toggle Unassigned Pool Visibility */}
        <button
          onClick={togglePoolVisibility}
          className={`px-2 py-1 rounded-md transition-all flex items-center space-x-1.5 text-xs ${
            !isPoolVisible
              ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black font-semibold'
              : 'hover:bg-surface-hover text-muted-foreground hover:text-foreground'
          }`}
          title={isPoolVisible ? t.hidePool : t.showPool}
        >
          {isPoolVisible ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
          <span className="hidden md:inline font-normal">
            {isPoolVisible ? t.hidePool : t.showPool}
          </span>
        </button>

        {/* Reset Tier List Button next to Show/Hide Pool */}
        <button
          onClick={() => {
            if (confirm('Reset tier list and start new?')) {
              resetBoard()
            }
          }}
          className="p-1.5 rounded-md hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors"
          title={`${t.resetList} (Ctrl+N)`}
        >
          <XIcon size={14} />
        </button>
      </div>

      {/* Right Controls: Theme Toggle, Icon-Only My Tier Lists Button & Animated Settings Button */}
      <div className="app-no-drag flex items-center space-x-1">
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors"
          title={t.toggleTheme}
        >
          {theme === 'dark' ? <SunIcon size={14} /> : <MoonIcon size={14} />}
        </button>

        {/* Icon-Only My Tier Lists Button */}
        <button
          onClick={() => setActiveDrawer(activeDrawer === 'my-lists' ? null : 'my-lists')}
          className={`p-1.5 rounded-md transition-all ${
            activeDrawer === 'my-lists'
              ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black'
              : 'hover:bg-surface-hover text-muted-foreground hover:text-foreground'
          }`}
          title={t.myTierLists}
        >
          <FolderHeart className="w-4 h-4" />
        </button>

        {/* Animated Settings Button */}
        <button
          onClick={() => setActiveDrawer(activeDrawer === 'settings' ? null : 'settings')}
          className={`p-1.5 rounded-md transition-all ${
            activeDrawer === 'settings'
              ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black'
              : 'hover:bg-surface-hover text-muted-foreground hover:text-foreground'
          }`}
          title={t.settings}
        >
          <SettingsIcon size={16} />
        </button>

        {/* Custom Window Controls for Frameless Electron Window */}
        {typeof window !== 'undefined' && Boolean(window.electronAPI) && (
          <div className="flex items-center space-x-0.5 ml-1.5 border-l border-border/60 pl-1.5">
            <button
              onClick={() => window.electronAPI?.minimizeWindow()}
              className="p-1.5 rounded hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors"
              title="Minimize"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={async () => {
                if (window.electronAPI) {
                  const maximized = await window.electronAPI.maximizeWindow()
                  setIsMaximized(maximized)
                }
              }}
              className="p-1.5 rounded hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? <Copy className="w-3 h-3 rotate-180" /> : <Square className="w-3 h-3" />}
            </button>
            <button
              onClick={() => window.electronAPI?.closeWindow()}
              className="p-1.5 rounded hover:bg-red-600 text-muted-foreground hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
