import { IpcRenderer } from 'electron';

declare global {
  interface Window {
    api: Api;
  }
}

export interface Api {
  getVersions: () => NodeJS.ProcessVersions;
  openFile: () => Promise<string[]>;
  openFileMenu: (callback: OpenFileCallback) => IpcRenderer;
  removeAllListeners: (channel: string) => void;
  renameFile: (fullPathPairs: FullPathPair[]) => Promise<boolean[]>;
}

interface FullPathPair {
  from: string;
  to: string;
}

type OpenFileCallback = (event: Electron.IpcRendererEvent, fullPaths: string[]) => void;
