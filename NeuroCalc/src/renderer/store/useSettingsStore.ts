import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserSettings {
  showSafetyWarnings: boolean;
  hasAcknowledgedDisclaimer: boolean;
  enableDataCollection: boolean;
  enableCrashReporting: boolean;
  defaultRoute: string;
  defaultUnit: string;
  autoCalculate: boolean;
  chartType: 'line' | 'bar' | 'area';
  colorScheme: 'light' | 'dark' | 'system';
}

interface SettingsStore {
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: UserSettings = {
  showSafetyWarnings: true,
  hasAcknowledgedDisclaimer: false,
  enableDataCollection: false,
  enableCrashReporting: false,
  defaultRoute: 'oral',
  defaultUnit: 'mg',
  autoCalculate: false,
  chartType: 'line',
  colorScheme: 'light',
};

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    (set) => ({
      settings: defaultSettings,

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },

      resetSettings: () => {
        set({ settings: defaultSettings });
      },
    }),
    { name: 'neurocalc-settings' }
  )
);