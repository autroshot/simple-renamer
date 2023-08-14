declare global {
  interface Window {
    api: Api;
  }
}

export interface Api {
  getVersions: () => NodeJS.ProcessVersions;
}
