/**
 * src/services/storage/settingsStorage.ts
 * Settings persistence layer
 */

import { StorageManager } from './asyncStorage';
import { UserSettings } from '@/src/types';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '@/src/constants';

/**
 * Get default settings
 */
export function getDefaultSettings(): UserSettings {
  return { ...DEFAULT_SETTINGS };
}

/**
 * Load settings from storage
 */
export async function loadSettings(): Promise<UserSettings> {
  const settings = await StorageManager.getItem<UserSettings>(
    STORAGE_KEYS.SETTINGS
  );
  
  if (settings === null) {
    return getDefaultSettings();
  }
  
  // Merge with defaults to ensure all fields exist
  return {
    ...getDefaultSettings(),
    ...settings,
  };
}

/**
 * Save settings to storage
 */
export async function saveSettings(settings: UserSettings): Promise<boolean> {
  return await StorageManager.setItem(STORAGE_KEYS.SETTINGS, settings);
}

/**
 * Update server endpoint
 */
export async function updateEndpoint(endpoint: string): Promise<boolean> {
  const settings = await loadSettings();
  settings.serverEndpoint = endpoint;
  return await saveSettings(settings);
}

/**
 * Update theme preference
 */
export async function updateTheme(
  theme: UserSettings['theme']
): Promise<boolean> {
  const settings = await loadSettings();
  settings.theme = theme;
  return await saveSettings(settings);
}

/**
 * Update haptics preference
 */
export async function updateHaptics(enabled: boolean): Promise<boolean> {
  const settings = await loadSettings();
  settings.hapticsEnabled = enabled;
  return await saveSettings(settings);
}

/**
 * Update selected model
 */
export async function updateSelectedModel(
  modelId: string | undefined
): Promise<boolean> {
  const settings = await loadSettings();
  settings.selectedModel = modelId;
  return await saveSettings(settings);
}

/**
 * Reset settings to defaults
 */
export async function resetSettings(): Promise<boolean> {
  return await saveSettings(getDefaultSettings());
}