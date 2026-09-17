const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('promptOptimizer', {
  loadSettings: () => ipcRenderer.invoke('prompt:load-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('prompt:save-settings', settings),
  testConnection: (settings) => ipcRenderer.invoke('prompt:test-connection', settings),
  optimize: (payload) => ipcRenderer.invoke('prompt:optimize', payload),
});
