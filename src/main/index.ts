import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { BrowserWindow, IpcMainInvokeEvent, Menu, app, dialog, ipcMain, shell } from 'electron';
import { rename } from 'fs/promises';
import { join } from 'path';
import icon from '../../resources/icon.png?asset';
import { CHANNELS } from '../constants';

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
    },
  });

  const menu = Menu.buildFromTemplate([
    {
      label: '파일',
      submenu: [
        { label: '파일 추가', click: handleFileOpenMenu },
        { type: 'separator' },
        { label: '종료', role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: '도움말',
      role: 'help',
      submenu: [
        {
          label: 'Github',
          click: async (): Promise<void> => {
            await shell.openExternal('https://github.com/autroshot/simple-renamer');
          },
        },
        {
          label: 'Electron',
          click: async (): Promise<void> => {
            await shell.openExternal('https://electronjs.org');
          },
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  async function handleFileOpenMenu(): Promise<void> {
    const { canceled, filePaths: fullPaths } = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
    });
    if (!canceled) {
      mainWindow.webContents.send(CHANNELS.openFileMenu, fullPaths);
    }
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  ipcMain.handle(CHANNELS.openFile, handleFileOpen);
  ipcMain.handle(CHANNELS.removeFile, handleFileRename);

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
async function handleFileOpen(): Promise<string[]> {
  const { canceled, filePaths: fullPaths } = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
  });
  if (!canceled) {
    return fullPaths;
  }
  return [];
}

async function handleFileRename(
  e: IpcMainInvokeEvent,
  fullPathPairs: FullPathPair[]
): Promise<boolean[]> {
  const results = await Promise.allSettled(
    fullPathPairs.map(async (fullPathPair) => {
      await rename(fullPathPair.from, fullPathPair.to);
    })
  );
  return results.map((result) => {
    if (result.status === 'fulfilled') {
      return true;
    }
    console.error(result.reason);
    return false;
  });
}

interface FullPathPair {
  from: string;
  to: string;
}
