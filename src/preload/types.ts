import { IpcRenderer } from 'electron';

declare global {
  interface Window {
    api: Api;
  }
}

export interface Api {
  getVersions: () => NodeJS.ProcessVersions;
  openFile: (callback: OpenFileCallback) => IpcRenderer;
  removeAllListeners: (channel: string) => void;
}

type OpenFileCallback = (event: Electron.IpcRendererEvent, paths: string[]) => void;
