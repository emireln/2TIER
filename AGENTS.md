# AGENTS.md - Developer & AI Assistant Guidelines for 2TIER

This document provides essential instructions, architectural guidelines, and design principles for AI coding agents working on the **2TIER** codebase.

---

## 🎯 Repository Overview

- **GitHub Repository**: [https://github.com/emireln/2tier](https://github.com/emireln/2tier)
- **Application Type**: Minimalist Tier List Application (Web SPA & Desktop Electron App)
- **Core Stack**: React 18 + Vite 5 + TypeScript + Tailwind CSS + Electron 32 + Zustand + `@dnd-kit`

---

## 📐 Core Architecture & Conventions

### 1. Drag & Drop (`@dnd-kit`) Rule
- **Single Top-Level `DndContext`**: `App.tsx` wraps the workspace in a single `<DndContext>` provider.
- **Never create secondary `DndContext` wrappers** inside subcomponents (`TierBoard.tsx` or `ItemPool.tsx`). Both `TierRow` droppables and `ItemPool` droppables MUST share the same top-level context so items can be moved seamlessly between any container.

### 2. Design Aesthetic & Color Tokens
- **Monochrome Theme**: Strictly enforce a sleek black, gray, and white monochrome aesthetic (`bg-background`, `bg-surface`, `bg-surface-elevated`, `text-foreground`, `text-muted-foreground`).
- **No Random Accent Colors**: Avoid using arbitrary blue/indigo accent colors for checkboxes, buttons, active states, or drawers. Always use monochrome dark/light tokens (`bg-zinc-800`, `text-white`, `dark:bg-zinc-200`, `dark:text-black`, `accent-zinc-900`, `dark:accent-zinc-100`).

### 3. Animated Icons (`lucide-animated.com`)
- Icon definitions reside in `src/components/icons/`.
- Icons use `motion/react` keyframes, `forwardRef` with `<IconHandle>`, `size` prop (default 28), and `cn()` utility from `@/lib/utils`.
- Export all newly created icons through `src/components/icons/index.ts`.

### 4. Internationalization (i18n)
- Language dictionaries are maintained in `src/lib/i18n.ts` supporting English (`en`) and natural Português do Brasil (`pt-BR`).
- `detectDeviceLanguage()` automatically checks `navigator.language` on first launch, defaulting to `'pt-BR'` for Portuguese locales and `'en'` for all others.
- All user-facing strings in UI components MUST reference `translations[language]`.

### 5. Electron Desktop & Web Host Fallbacks
- All IPC calls (`window.electronAPI`) MUST check for window existence and gracefully fall back when running as a web SPA.
- Electron settings (`openAtLogin`, `alwaysOnTop`) are bound via IPC handlers in `electron/preload.ts` and `electron/main.ts`.

### 6. Image Exporting (`html-to-image`)
- Export target `#tier-board-export-area` is captured using un-scrolled styles (`width: 1200px`, `overflow: visible`, `maxHeight: none`, `height: auto`) to prevent viewport scrollbar artifacts or responsive clipping on small screens.

---

## 🛠️ Essential Verification Commands

Before declaring any task completed, always execute:

1. **Type Checking**:
   ```bash
   npx tsc --noEmit
   ```

2. **Production Compilation**:
   ```bash
   npx vite build
   ```
