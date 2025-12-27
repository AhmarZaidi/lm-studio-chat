/**
 * src/hooks/useStreamingChat.ts
 * Hook for managing streaming chat requests
 */

import { useState, useRef, useCallback } from 'react';
import { Message } from '@/src/types';
import { useConnection } from './useConnection';
import { useChat } from './useChat';
import { useSettings } from './useSettings';
import { createLMStudioClient } from '@/src/services/api/lmStudioClient';
import { createChatService } from '@/src/services/api/chatService';
import { APIError, getUserErrorMessage } from '@/src/services/api/errors';
import { Snackbar_Compat as Snackbar } from '@/src/utils/snackbar';
import { MODEL_DEFAULTS } from '@/src/constants';

export function useStreamingChat() {
  const { endpoint, isConnected, availableModels } = useConnection();
  const { activeChat, addMessage, updateStreamingMessage, setStreaming } = useChat();
  const { settings } = useSettings();
  
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Get the model to use for requests
   */
  const getModel = useCallback((): string => {
    // Use selected model from settings if available
    if (settings.selectedModel) {
      return settings.selectedModel;
    }

    // Use first available model
    if (availableModels.length > 0) {
      return availableModels[0].id;
    }

    // Fallback to default
    return MODEL_DEFAULTS.DEFAULT_MODEL;
  }, [settings.selectedModel, availableModels]);

  /**
   * Send a message with streaming response
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!isConnected) {
        Snackbar.show({
          text: 'Not connected to LM Studio',
          duration: Snackbar.LENGTH_SHORT,
          type: 'error',
        });
        return;
      }

      if (!activeChat) {
        Snackbar.show({
          text: 'No active chat',
          duration: Snackbar.LENGTH_SHORT,
          type: 'error',
        });
        return;
      }

      setIsSending(true);
      setError(null);

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      try {
        // Add user message
        addMessage({
          role: 'user',
          content,
        });

        // Add empty assistant message for streaming
        addMessage({
          role: 'assistant',
          content: '',
        });

        // Get model
        const model = getModel();

        // Create client and service
        const client = createLMStudioClient(endpoint);
        const chatService = createChatService(client);

        // Start streaming
        setStreaming(true);

        let fullContent = '';

        await chatService.sendMessageStream(
          [...activeChat.messages, { 
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: Date.now(),
          }],
          model,
          {
            signal: abortControllerRef.current.signal,
            onContent: (chunk) => {
              fullContent += chunk;
              updateStreamingMessage(fullContent);
            },
            onComplete: (content) => {
              updateStreamingMessage(content);
              setStreaming(false);
            },
            onError: (err) => {
              console.error('Streaming error:', err);
              const apiError = err as APIError;
              const errorMsg = getUserErrorMessage(apiError);
              setError(errorMsg);
              setStreaming(false);
              
              Snackbar.show({
                text: errorMsg,
                duration: Snackbar.LENGTH_LONG,
                type: 'error',
              });
            },
          }
        );
      } catch (err) {
        console.error('Send message error:', err);
        const apiError = err as APIError;
        const errorMsg = getUserErrorMessage(apiError);
        setError(errorMsg);
        setStreaming(false);

        // Only show snackbar if not cancelled
        if (apiError.code !== 'CANCELLED') {
          Snackbar.show({
            text: errorMsg,
            duration: Snackbar.LENGTH_LONG,
            type: 'error',
          });
        }
      } finally {
        setIsSending(false);
        abortControllerRef.current = null;
      }
    },
    [
      isConnected,
      activeChat,
      endpoint,
      getModel,
      addMessage,
      updateStreamingMessage,
      setStreaming,
    ]
  );

  /**
   * Cancel ongoing request
   */
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsSending(false);
      setStreaming(false);
      
      Snackbar.show({
        text: 'Request cancelled',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  }, [setStreaming]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sendMessage,
    cancelRequest,
    isSending,
    error,
    clearError,
    canSend: isConnected && !isSending,
  };
}