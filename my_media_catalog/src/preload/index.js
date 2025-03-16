import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  ping: () => ipcRenderer.send('ping'),
  addUser: (username) => ipcRenderer.invoke('add_user', username),
  getAllUsers: () => ipcRenderer.invoke('get_all_users'),
  closeWindow: () => ipcRenderer.send('close-app'),
  receive: (channel, callback) => {
    ipcRenderer.on(channel, (_, data) => callback(data))
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
