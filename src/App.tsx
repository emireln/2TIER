import React, { useState, useEffect, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  pointerWithin,
  rectIntersection,
  MeasuringStrategy,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Titlebar } from './components/Titlebar'
import { TierBoard } from './components/TierBoard'
import { ItemPool } from './components/ItemPool'
import { ExportModal } from './components/ExportModal'
import { TemplateDrawer } from './components/TemplateDrawer'
import { MyTierListsDrawer } from './components/MyTierListsDrawer'
import { SettingsDrawer } from './components/SettingsDrawer'
import { Logo } from './components/Logo'
import { useTierStore } from './store/useTierStore'
import { TierItem } from './types/tier'

export const App: React.FC = () => {
  const {
    title,
    theme,
    activeDrawer,
    setActiveDrawer,
    undo,
    redo,
    resetBoard,
    exportSettings,
    hideHeaderTitle,
    rows,
    unassignedItems,
    moveItem,
    reorderItemsInContainer,
  } = useTierStore()

  const [activeItem, setActiveItem] = useState<TierItem | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const findContainer = useCallback((id: string) => {
    if (id === 'unassigned' || unassignedItems.some((i) => i.id === id)) {
      return 'unassigned'
    }
    const matchingRow = rows.find((r) => r.id === id || r.items.some((i) => i.id === id))
    return matchingRow ? matchingRow.id : null
  }, [unassignedItems, rows])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeId = active.id as string

    let item: TierItem | undefined = unassignedItems.find((i) => i.id === activeId)
    if (!item) {
      for (const row of rows) {
        const found = row.items.find((i) => i.id === activeId)
        if (found) {
          item = found
          break
        }
      }
    }

    if (item) {
      setActiveItem(item)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId)

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return
    }

    const overItems =
      overContainer === 'unassigned'
        ? unassignedItems
        : rows.find((r) => r.id === overContainer)?.items || []

    const overIndex = overItems.findIndex((i) => i.id === overId)
    const newIndex = overIndex >= 0 ? overIndex : overItems.length

    moveItem(activeId, overContainer, newIndex)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveItem(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId)

    if (activeContainer && overContainer) {
      const overItems =
        overContainer === 'unassigned'
          ? unassignedItems
          : rows.find((r) => r.id === overContainer)?.items || []

      const activeItems =
        activeContainer === 'unassigned'
          ? unassignedItems
          : rows.find((r) => r.id === activeContainer)?.items || []

      const oldIndex = activeItems.findIndex((i) => i.id === activeId)
      const newIndex = overItems.findIndex((i) => i.id === overId)

      if (activeContainer === overContainer) {
        if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
          reorderItemsInContainer(activeContainer, oldIndex, newIndex)
        }
      } else {
        const targetIndex = newIndex >= 0 ? newIndex : overItems.length
        moveItem(activeId, overContainer, targetIndex)
      }
    }
  }

  // Dynamic Theme Class Handler
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }, [theme])

  // Global Keyboard Shortcuts (Cmd/Ctrl + Z, Shift+Z, E, N)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modifier = isMac ? e.metaKey : e.ctrlKey

      if (modifier && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        undo()
      } else if (
        (modifier && e.shiftKey && e.key.toLowerCase() === 'z') ||
        (modifier && e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault()
        redo()
      } else if (modifier && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        setActiveDrawer(activeDrawer === 'export' ? null : 'export')
      } else if (modifier && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        if (confirm('Reset tier list and start new?')) {
          resetBoard()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, setActiveDrawer, activeDrawer, resetBoard])

  return (
    <DndContext
      sensors={sensors}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      collisionDetection={(args) => {
        const pointerCollisions = pointerWithin(args)
        if (pointerCollisions.length > 0) return pointerCollisions
        return rectIntersection(args)
      }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden font-sans select-none">
        {/* Custom Electron Frameless Titlebar */}
        <Titlebar />

        {/* Main Workspace Layout */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Scrollable Workspace Container */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 custom-scrollbar">
            {/* Target Element for Image Export (Unconstrained Width & Height) */}
            <div id="tier-board-export-area" className="w-full bg-background rounded-2xl p-2 sm:p-4">
              {/* Live Board UI Title Header Banner (controlled by Settings preference: hideHeaderTitle) */}
              {!hideHeaderTitle && (
                <div id="board-title-header-banner" className="px-3 py-2 flex items-center justify-between border-b border-border/60 mb-3 select-none">
                  <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">{title}</h1>
                  {exportSettings.watermark && (
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground/70 font-extrabold tracking-widest uppercase">
                      <Logo size={16} className="text-foreground" />
                      <span>2TIER</span>
                    </div>
                  )}
                </div>
              )}

              {/* Interactive Drag & Drop Tier Board */}
              <TierBoard />
            </div>
          </div>

          {/* Bottom Sandbox / Item Pool */}
          <ItemPool />
        </main>

        {/* Side Drawers / Modals */}
        {activeDrawer === 'export' && <ExportModal />}
        {activeDrawer === 'templates' && <TemplateDrawer />}
        {activeDrawer === 'my-lists' && <MyTierListsDrawer />}
        {activeDrawer === 'settings' && <SettingsDrawer />}
      </div>

      <DragOverlay dropAnimation={{ duration: 150, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeItem ? (
          <div className="w-20 h-20 bg-surface-elevated rounded-lg border-2 border-white overflow-hidden shadow-2xl scale-110 flex items-center justify-center pointer-events-none opacity-90 will-change-transform">
            <img
              src={activeItem.src}
              alt={activeItem.label || 'Dragging item'}
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default App
