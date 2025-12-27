/**
 * src/hooks/useSettings.ts
 * Custom hook for accessing settings context
 */

import { useContext } from 'react';
import { SettingsContext } from '@/src/contexts/SettingsContext';

/**
 * Hook to access settings context
 * @throws Error if used outside SettingsProvider
 */
export function useSettings() {
  const context = useContext(SettingsContext);
  
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  
  return context;
}