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
  applyChange: (fullPathPairs: FullPathPair[]) => Promise<boolean[]>;
  changeMenuItemEnabled: (enabled: boolean) => Promise<void>;
  menu: {
    openFile: (callback: OpenFileCallback) => IpcRenderer;
    clearList: (callback: () => void) => IpcRenderer;
    addText: (callback: () => void) => IpcRenderer;
    removeName: (callback: () => void) => IpcRenderer;
    revertName: (callback: () => void) => IpcRenderer;
    applyChange: (callback: () => void) => IpcRenderer;
  };
}

type OpenFileCallback = (event: Electron.IpcRendererEvent, fullPaths: string[]) => void;
