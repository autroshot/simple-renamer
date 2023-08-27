import { IpcRenderer } from 'electron';
import { FullPathPair } from '../types';

declare global {
  interface Window {
    api: Api;
  }
}

export interface Api {
  openFile: () => Promise<string[]>;
  removeAllListeners: (channel: string) => void;
  renameFile: (fullPathPairs: FullPathPair[]) => Promise<boolean[]>;
  changeMenuItemEnabled: (enabled: boolean) => Promise<void>;
  menu: {
    openFile: (callback: OpenFileCallback) => IpcRenderer;
    clearList: (callback: () => void) => IpcRenderer;
  };
}

type OpenFileCallback = (event: Electron.IpcRendererEvent, fullPaths: string[]) => void;
