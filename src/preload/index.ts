import { contextBridge, ipcRenderer } from 'electron';
import { CHANNELS } from '../constants';
import { Api } from './types';

// Custom APIs for renderer
const api: Api = {
  getVersions: () => process.versions,
  openFile: (callback) => ipcRenderer.on(CHANNELS.openFileMenu, callback),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
try {
  contextBridge.exposeInMainWorld('api', api);
} catch (error) {
  console.error(error);
}
