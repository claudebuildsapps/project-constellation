import { contextBridge, ipcRenderer } from 'electron';

// Define the API that will be exposed to the renderer
const electronAPI = {
  // App info
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  getAppName: () => ipcRenderer.invoke('app-name'),
  
  // Database operations (to be implemented)
  database: {
    getSubstances: () => ipcRenderer.invoke('db-get-substances'),
    getSubstance: (id: number) => ipcRenderer.invoke('db-get-substance', id),
    searchSubstances: (query: string) => ipcRenderer.invoke('db-search-substances', query),
  },
  
  // LLM operations (to be implemented)
  llm: {
    calculateEffects: (substance: string, dosage: number) => 
      ipcRenderer.invoke('llm-calculate-effects', substance, dosage),
    getConfiguration: () => ipcRenderer.invoke('llm-get-config'),
    setConfiguration: (config: any) => ipcRenderer.invoke('llm-set-config', config),
  },
  
  // Settings operations
  settings: {
    get: (key: string) => ipcRenderer.invoke('settings-get', key),
    set: (key: string, value: any) => ipcRenderer.invoke('settings-set', key, value),
    getAll: () => ipcRenderer.invoke('settings-get-all'),
  },
  
  // Development helpers
  ...(process.env.NODE_ENV === 'development' && {
    dev: {
      openDevTools: () => ipcRenderer.invoke('dev-open-devtools'),
      reload: () => ipcRenderer.invoke('dev-reload'),
    }
  })
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Type definitions for the renderer
export type ElectronAPI = typeof electronAPI;