/**
 * src/constants/config.ts
 * Application configuration and default values
 */

// API Configuration
export const API_CONFIG = {
  DEFAULT_ENDPOINT: 'http://192.168.56.1:1234',
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  STREAM_TIMEOUT: 300000, // 5 minutes for streaming
  HEALTH_CHECK_PATH: '/v1/models',
  CHAT_COMPLETION_PATH: '/v1/chat/completions',
  MODELS_PATH: '/v1/models',
};

// Storage Keys
export const STORAGE_KEYS = {
  SETTINGS: '@lm_chat_settings',
  USER_PROFILE: '@lm_chat_user_profile',
  CHATS: '@lm_chat_chats',
  ACTIVE_CHAT_ID: '@lm_chat_active_chat_id',
  APP_PREFERENCES: '@lm_chat_preferences',
};

// Default Model Settings
export const MODEL_DEFAULTS = {
  TEMPERATURE: 0.7,
  MAX_TOKENS: 2048,
  TOP_P: 0.9,
  DEFAULT_MODEL: 'local-model',
};

// App Information
export const APP_INFO = {
  VERSION: '1.0.0',
  NAME: 'LM Studio Chat',
  DESCRIPTION: 'A modern chat client for locally hosted LM Studio models',
  GITHUB_URL: 'https://github.com/AhmarZaidi',
  LINKEDIN_URL: 'https://linkedin.com/in/ahmarzaidi',
  STACKOVERFLOW_URL: 'https://stackoverflow.com/users/ahmarzaidi',
};

// Default User Profile
export const DEFAULT_USER_PROFILE = {
  username: 'User',
  profileImage: undefined,
};

// Default Settings
export const DEFAULT_SETTINGS = {
  serverEndpoint: API_CONFIG.DEFAULT_ENDPOINT,
  theme: 'dark' as const,
  hapticsEnabled: true,
  selectedModel: undefined,
};

// UI Configuration
export const UI_CONFIG = {
  MESSAGE_MAX_LENGTH: 10000,
  CHAT_TITLE_MAX_LENGTH: 50,
  USERNAME_MAX_LENGTH: 30,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 250,
};