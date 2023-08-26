import { IpcRenderer } from 'electron';
import { FullPathPair } from '../types';

declare global {
  interface Window {
    api: Api;
  }
}

export interface Api {
  openFile: () => Promise<string[]>;
  openFileMenu: (callback: OpenFileCallback) => IpcRenderer;
  removeAllListeners: (channel: string) => void;
  renameFile: (fullPathPairs: FullPathPair[]) => Promise<boolean[]>;
}

type OpenFileCallback = (event: Electron.IpcRendererEvent, fullPaths: string[]) => void;
