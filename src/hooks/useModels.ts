/**
 * src/hooks/useModels.ts
 * Hook for fetching and managing LM Studio models
 */

import { useState, useEffect, useCallback } from 'react';
import { ModelInfo } from '@/src/types/api';
import { useConnection } from './useConnection';
import { useSettings } from './useSettings';
import { createLMStudioClient } from '@/src/services/api/lmStudioClient';
import { createModelService } from '@/src/services/api/modelService';
import { APIError, getUserErrorMessage } from '@/src/services/api/errors';
import { Snackbar_Compat as Snackbar } from '@/src/utils/snackbar';

export function useModels() {
  const { endpoint, isConnected } = useConnection();
  const { settings, updateSelectedModel } = useSettings();
  
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch available models
   */
  const fetchModels = useCallback(async () => {
    if (!isConnected) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const client = createLMStudioClient(endpoint);
      const modelService = createModelService(client);
      const fetchedModels = await modelService.getModels();
      
      setModels(fetchedModels);

      // Auto-select first model if none selected
      if (!settings.selectedModel && fetchedModels.length > 0) {
        await updateSelectedModel(fetchedModels[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch models:', err);
      const apiError = err as APIError;
      const errorMsg = getUserErrorMessage(apiError);
      setError(errorMsg);
      
      Snackbar.show({
        text: errorMsg,
        duration: Snackbar.LENGTH_SHORT,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, endpoint, settings.selectedModel, updateSelectedModel]);

  /**
   * Select a model
   */
  const selectModel = useCallback(
    async (modelId: string) => {
      await updateSelectedModel(modelId);
      
      Snackbar.show({
        text: 'Model selected',
        duration: Snackbar.LENGTH_SHORT,
        type: 'success',
      });
    },
    [updateSelectedModel]
  );

  /**
   * Get currently selected model info
   */
  const selectedModel = models.find((m) => m.id === settings.selectedModel);

  /**
   * Fetch models when connected
   */
  useEffect(() => {
    if (isConnected) {
      fetchModels();
    }
  }, [isConnected]);

  return {
    models,
    selectedModel,
    isLoading,
    error,
    fetchModels,
    selectModel,
    hasModels: models.length > 0,
  };
}