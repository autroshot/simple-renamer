import { contextBridge, ipcRenderer } from 'electron';
import { CHANNELS } from '../constants';
import { Api } from './types';

// Custom APIs for renderer
const api: Api = {
  openFile: () => ipcRenderer.invoke(CHANNELS.openFile),
  openFileMenu: (callback) => ipcRenderer.on(CHANNELS.openFileMenu, callback),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  renameFile: (fullPathPairs) => ipcRenderer.invoke(CHANNELS.removeFile, fullPathPairs),
  clearListMenu: (callback) => ipcRenderer.on(CHANNELS.clearListMenu, callback),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
try {
  contextBridge.exposeInMainWorld('api', api);
} catch (error) {
  console.error(error);
}
