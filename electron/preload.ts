import { contextBridge, ipcRenderer } from 'electron'

export interface ElectronAPI {
  minimizeWindow: () => Promise<void>
  maximizeWindow: () => Promise<boolean>
  closeWindow: () => Promise<void>
  isMaximized: () => Promise<boolean>
  onWindowStateChange: (callback: (isMaximized: boolean) => void) => () => void
  openImageFiles: () => Promise<Array<{ name: string; src: string }>>
  saveExportImage: (dataUrl: string, defaultName: string) => Promise<boolean>
  getAutoLaunch: () => Promise<boolean>
  setAutoLaunch: (enabled: boolean) => Promise<boolean>
  getAlwaysOnTop: () => Promise<boolean>
  setAlwaysOnTop: (enabled: boolean) => Promise<boolean>
}

const electronAPI: ElectronAPI = {
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  onWindowStateChange: (callback) => {
    const handler = (_: any, data: { isMaximized: boolean }) => callback(data.isMaximized)
    ipcRenderer.on('window:state-changed', handler)
    return () => {
      ipcRenderer.removeListener('window:state-changed', handler)
    }
  },
  openImageFiles: () => ipcRenderer.invoke('dialog:openImageFiles'),
  saveExportImage: (dataUrl, defaultName) => ipcRenderer.invoke('dialog:saveExportImage', { dataUrl, defaultName }),
  getAutoLaunch: () => ipcRenderer.invoke('app:get-auto-launch'),
  setAutoLaunch: (enabled) => ipcRenderer.invoke('app:set-auto-launch', enabled),
  getAlwaysOnTop: () => ipcRenderer.invoke('app:get-always-on-top'),
  setAlwaysOnTop: (enabled) => ipcRenderer.invoke('app:set-always-on-top', enabled),
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}
