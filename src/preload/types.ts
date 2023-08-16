import { IpcRenderer } from 'electron';

declare global {
  interface Window {
    api: Api;
  }
}

export interface Api {
  getVersions: () => NodeJS.ProcessVersions;
  openFile: (callback: OpenFileCallback) => IpcRenderer;
}

type OpenFileCallback = (event: Electron.IpcRendererEvent, files: Files[]) => void;

interface Files {
  oldName: string;
  newName: string;
  path: string;
}
