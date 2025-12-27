/**
 * src/contexts/SettingsContext.tsx
 * Settings management context provider
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { UserSettings, UserProfile } from '@/src/types';
import {
  loadSettings,
  saveSettings,
  updateTheme as updateThemeStorage,
  updateHaptics as updateHapticsStorage,
  updateEndpoint as updateEndpointStorage,
  updateSelectedModel as updateSelectedModelStorage,
} from '@/src/services/storage/settingsStorage';
import {
  loadUserProfile,
  saveUserProfile,
  updateUsername as updateUsernameStorage,
  updateProfileImage as updateProfileImageStorage,
} from '@/src/services/storage/userStorage';
import { Snackbar_Compat as Snackbar } from '@/src/utils/snackbar';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/src/constants';

interface SettingsContextType {
  settings: UserSettings;
  userProfile: UserProfile;
  isLoading: boolean;
  updateTheme: (theme: UserSettings['theme']) => Promise<void>;
  updateHaptics: (enabled: boolean) => Promise<void>;
  updateEndpoint: (endpoint: string) => Promise<void>;
  updateSelectedModel: (modelId: string | undefined) => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  updateProfileImage: (imageUri: string | undefined) => Promise<void>;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  updateProfile: (newProfile: Partial<UserProfile>) => Promise<void>;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<UserSettings>({
    serverEndpoint: 'http://192.168.56.1:1234',
    theme: 'dark',
    hapticsEnabled: true,
    selectedModel: undefined,
  });
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: 'User',
    profileImage: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load settings and profile on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  /**
   * Load settings and user profile from storage
   */
  const loadInitialData = async () => {
    try {
      const [loadedSettings, loadedProfile] = await Promise.all([
        loadSettings(),
        loadUserProfile(),
      ]);
      setSettings(loadedSettings);
      setUserProfile(loadedProfile);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      Snackbar.show({
        text: ERROR_MESSAGES.LOAD_ERROR,
        duration: Snackbar.LENGTH_SHORT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update theme preference
   */
  const updateTheme = async (theme: UserSettings['theme']) => {
    try {
      const success = await updateThemeStorage(theme);
      if (success) {
        setSettings((prev) => ({ ...prev, theme }));
      } else {
        throw new Error('Failed to save theme');
      }
    } catch (error) {
      console.error('Failed to update theme:', error);
      Snackbar.show({
        text: ERROR_MESSAGES.STORAGE_ERROR,
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  /**
   * Update haptics preference
   */
  const updateHaptics = async (enabled: boolean) => {
    try {
      const success = await updateHapticsStorage(enabled);
      if (success) {
        setSettings((prev) => ({ ...prev, hapticsEnabled: enabled }));
      } else {
        throw new Error('Failed to save haptics preference');
      }
    } catch (error) {
      console.error('Failed to update haptics:', error);
      Snackbar.show({
        text: ERROR_MESSAGES.STORAGE_ERROR,
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  /**
   * Update server endpoint
   */
  const updateEndpoint = async (endpoint: string) => {
    try {
      const success = await updateEndpointStorage(endpoint);
      if (success) {
        setSettings((prev) => ({ ...prev, serverEndpoint: endpoint }));
        Snackbar.show({
          text: SUCCESS_MESSAGES.SETTINGS_SAVED,
          duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        throw new Error('Failed to save endpoint');
      }
    } catch (error) {
      console.error('Failed to update endpoint:', error);
      Snackbar.show({
        text: ERROR_MESSAGES.STORAGE_ERROR,
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  /**
   * Update selected model
   */
  const updateSelectedModel = async (modelId: string | undefined) => {
    try {
      const success = await updateSelectedModelStorage(modelId);
      if (success) {
        setSettings((prev) => ({ ...prev, selectedModel: modelId }));
      } else {
        throw new Error('Failed to save model selection');
      }
    } catch (error) {
      console.error('Failed to update selected model:', error);
      Snackbar.show({
        text: ERROR_MESSAGES.STORAGE_ERROR,
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  /**
   * Update username
   */
  const updateUsername = async (username: string) => {
    try {
      const success = await updateUsernameStorage(username);
      if (success) {
        setUserProfile((prev) => ({ ...prev, username }));
        Snackbar.show({
          text: SUCCESS_MESSAGES.PROFILE_UPDATED,
          duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        throw new Error('Failed to save username');
      }
    } catch (error) {
      console.error('Failed to update username:', error);
      Snackbar.show({
        text: ERROR_MESSAGES.STORAGE_ERROR,
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  /**
   * Update profile image
   */
  const updateProfileImage = async (imageUri: string | undefined) => {
    try {
      const success = await updateProfileImageStorage(imageUri);
      if (success) {
        setUserProfile((prev) => ({ ...prev, profileImage: imageUri }));
        Snackbar.show({
          text: SUCCESS_MESSAGES.PROFILE_UPDATED,
          duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        throw new Error('Failed to save profile image');
      }
    } catch (error) {
      console.error('Failed to update profile image:', error);
      Snackbar.show({
        text: ERROR_MESSAGES.STORAGE_ERROR,
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  /**
   * Update multiple settings at once
   */
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      const success = await saveSettings(updatedSettings);
      if (success) {
        setSettings(updatedSettings);
        Snackbar.show({
          text: SUCCESS_MESSAGES.SETTINGS_SAVED,
          duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      Snackbar.show({
        text: ERROR_MESSAGES.STORAGE_ERROR,
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  /**
   * Update multiple profile fields at once
   */
  const updateProfile = async (newProfile: Partial<UserProfile>) => {
    try {
      const updatedProfile = { ...userProfile, ...newProfile };
      const success = await saveUserProfile(updatedProfile);
      if (success) {
        setUserProfile(updatedProfile);
        Snackbar.show({
          text: SUCCESS_MESSAGES.PROFILE_UPDATED,
          duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      Snackbar.show({
        text: ERROR_MESSAGES.STORAGE_ERROR,
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  const value: SettingsContextType = {
    settings,
    userProfile,
    isLoading,
    updateTheme,
    updateHaptics,
    updateEndpoint,
    updateSelectedModel,
    updateUsername,
    updateProfileImage,
    updateSettings,
    updateProfile,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}