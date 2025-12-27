/**
 * src/hooks/useApp.ts
 * Custom hook for accessing app context
 */

import { useContext } from 'react';
import { AppContext } from '@/src/contexts/AppContext';

/**
 * Hook to access app context
 * @throws Error if used outside AppProvider
 */
export function useApp() {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
}