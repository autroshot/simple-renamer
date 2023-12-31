import { contextBridge, ipcRenderer } from 'electron';
import { CHANNELS } from '../constants';
import { Api } from './types';

// Custom APIs for renderer
const api: Api = {
  openFile: () => ipcRenderer.invoke(CHANNELS.openFile),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  applyChange: (fullPathPairs) => ipcRenderer.invoke(CHANNELS.removeFile, fullPathPairs),
  changeMenuItemEnabled: (enabled) => ipcRenderer.invoke(CHANNELS.changeMenuItemEnabled, enabled),
  menu: {
    openFile: (callback) => ipcRenderer.on(CHANNELS.menu.openFile, callback),
    clearList: (callback) => ipcRenderer.on(CHANNELS.menu.clearList, callback),
    addText: (callback) => ipcRenderer.on(CHANNELS.menu.addText, callback),
    removeName: (callback) => ipcRenderer.on(CHANNELS.menu.removeName, callback),
    revertName: (callback) => ipcRenderer.on(CHANNELS.menu.revertName, callback),
    applyChange: (callback) => ipcRenderer.on(CHANNELS.menu.applyChange, callback),
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
