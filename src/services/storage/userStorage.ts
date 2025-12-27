/**
 * src/services/storage/userStorage.ts
 * User profile persistence layer
 */

import { StorageManager } from './asyncStorage';
import { UserProfile } from '@/src/types';
import { STORAGE_KEYS, DEFAULT_USER_PROFILE } from '@/src/constants';

/**
 * Get default user profile
 */
export function getDefaultProfile(): UserProfile {
  return { ...DEFAULT_USER_PROFILE };
}

/**
 * Load user profile from storage
 */
export async function loadUserProfile(): Promise<UserProfile> {
  const profile = await StorageManager.getItem<UserProfile>(
    STORAGE_KEYS.USER_PROFILE
  );
  
  if (profile === null) {
    return getDefaultProfile();
  }
  
  // Merge with defaults to ensure all fields exist
  return {
    ...getDefaultProfile(),
    ...profile,
  };
}

/**
 * Save user profile to storage
 */
export async function saveUserProfile(profile: UserProfile): Promise<boolean> {
  return await StorageManager.setItem(STORAGE_KEYS.USER_PROFILE, profile);
}

/**
 * Update username
 */
export async function updateUsername(username: string): Promise<boolean> {
  const profile = await loadUserProfile();
  profile.username = username.trim();
  return await saveUserProfile(profile);
}

/**
 * Update profile image
 */
export async function updateProfileImage(
  imageUri: string | undefined
): Promise<boolean> {
  const profile = await loadUserProfile();
  profile.profileImage = imageUri;
  return await saveUserProfile(profile);
}

/**
 * Reset profile to defaults
 */
export async function resetProfile(): Promise<boolean> {
  return await saveUserProfile(getDefaultProfile());
}