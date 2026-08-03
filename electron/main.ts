import { app, BrowserWindow, ipcMain, dialog, nativeTheme, Tray, Menu } from 'electron'
import path from 'node:path'
import fs from 'node:fs'

try {
  if (require('electron-squirrel-startup')) {
    app.quit()
  }
} catch (e) {
  // Ignored in standard dev environment
}

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#09090b',
    icon: path.join(__dirname, '../public/icon.png'),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  })

  // Smooth appearance when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  // Window state IPC updates
  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('window:state-changed', { isMaximized: true })
  })

  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('window:state-changed', { isMaximized: false })
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

let tray: Tray | null = null

function createTray() {
  const trayIconPath = path.join(__dirname, '../public/tray-icon.png')
  if (fs.existsSync(trayIconPath)) {
    tray = new Tray(trayIconPath)
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show 2TIER',
        click: () => {
          if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.show()
            mainWindow.focus()
          }
        },
      },
      { type: 'separator' },
      {
        label: 'Quit 2TIER',
        click: () => {
          app.quit()
        },
      },
    ])
    tray.setToolTip('2TIER - Minimalist Tier List')
    tray.setContextMenu(contextMenu)
    tray.on('double-click', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.show()
        mainWindow.focus()
      }
    })
  }
}

// App lifecycle
app.whenReady().then(() => {
  createWindow()
  createTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC Handlers for Custom Titlebar Window Controls
ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize()
})

ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
  return mainWindow?.isMaximized() ?? false
})

ipcMain.handle('window:close', () => {
  mainWindow?.close()
})

ipcMain.handle('window:isMaximized', () => {
  return mainWindow?.isMaximized() ?? false
})

// IPC Handlers for Image Import/Export & Dialogs
ipcMain.handle('dialog:openImageFiles', async () => {
  if (!mainWindow) return []
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'] },
    ],
  })

  if (result.canceled || result.filePaths.length === 0) {
    return []
  }

  // Convert files to base64 data URLs for seamless rendering in renderer
  const images = result.filePaths.map((filePath) => {
    const fileData = fs.readFileSync(filePath)
    const ext = path.extname(filePath).toLowerCase().replace('.', '')
    const mimeType = ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`
    const base64 = fileData.toString('base64')
    const fileName = path.basename(filePath, path.extname(filePath))
    return {
      name: fileName,
      src: `data:${mimeType};base64,${base64}`,
    }
  })

  return images
})

ipcMain.handle('dialog:saveExportImage', async (_, { dataUrl, defaultName }) => {
  if (!mainWindow) return false
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Export Tier List Image',
    defaultPath: defaultName || 'tier-list.png',
    filters: [
      { name: 'PNG Image', extensions: ['png'] },
      { name: 'JPEG Image', extensions: ['jpg', 'jpeg'] },
      { name: 'WebP Image', extensions: ['webp'] },
    ],
  })

  if (result.canceled || !result.filePath) {
    return false
  }

  // Extract raw base64 buffer and write file to local disk
  const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64Data, 'base64')
  fs.writeFileSync(result.filePath, buffer)
  return true
})

// IPC Handlers for Desktop Settings (Auto-launch, Always-on-top)
ipcMain.handle('app:get-auto-launch', () => {
  return app.getLoginItemSettings().openAtLogin
})

ipcMain.handle('app:set-auto-launch', (_, enabled: boolean) => {
  app.setLoginItemSettings({ openAtLogin: enabled })
  return app.getLoginItemSettings().openAtLogin
})

ipcMain.handle('app:get-always-on-top', () => {
  return mainWindow?.isAlwaysOnTop() ?? false
})

ipcMain.handle('app:set-always-on-top', (_, enabled: boolean) => {
  mainWindow?.setAlwaysOnTop(enabled)
  return mainWindow?.isAlwaysOnTop() ?? false
})
