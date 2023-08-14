import { NodeProcess } from '@electron-toolkit/preload';

declare global {
  interface Window {
    api: Api;
  }
}

export interface Api {
  getVersions: () => NodeProcess['versions'];
}
