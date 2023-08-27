import { contextBridge, ipcRenderer } from 'electron';
import { CHANNELS } from '../constants';
import { Api } from './types';

// Custom APIs for renderer
const api: Api = {
  openFile: () => ipcRenderer.invoke(CHANNELS.openFile),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  renameFile: (fullPathPairs) => ipcRenderer.invoke(CHANNELS.removeFile, fullPathPairs),
  changeMenuItemEnabled: (enabled) => ipcRenderer.invoke(CHANNELS.changeMenuItemEnabled, enabled),
  menu: {
    openFile: (callback) => ipcRenderer.on(CHANNELS.openFileMenu, callback),
    clearList: (callback) => ipcRenderer.on(CHANNELS.clearListMenu, callback),
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
try {
  contextBridge.exposeInMainWorld('api', api);
} catch (error) {
  console.error(error);
}
