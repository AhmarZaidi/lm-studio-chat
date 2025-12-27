/**
 * src/hooks/useConnection.ts
 * Custom hook for accessing connection context
 */

import { useContext } from 'react';
import { ConnectionContext } from '@/src/contexts/ConnectionContext';

/**
 * Hook to access connection context
 * @throws Error if used outside ConnectionProvider
 */
export function useConnection() {
  const context = useContext(ConnectionContext);
  
  if (context === undefined) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  
  return context;
}