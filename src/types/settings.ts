/**
 * src/types/settings.ts
 * Type definitions for user settings and preferences
 */

export type Theme = 'system' | 'light' | 'dark';

export interface UserProfile {
  username: string;
  profileImage?: string;
}

export interface UserSettings {
  serverEndpoint: string;
  theme: Theme;
  hapticsEnabled: boolean;
  selectedModel?: string;
}

export interface AppPreferences {
  temperature: number;
  maxTokens: number;
  topP: number;
}