/**
 * src/hooks/useChat.ts
 * Custom hook for accessing chat context
 */

import { useContext } from 'react';
import { ChatContext } from '@/src/contexts/ChatContext';

/**
 * Hook to access chat context
 * @throws Error if used outside ChatProvider
 */
export function useChat() {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
}