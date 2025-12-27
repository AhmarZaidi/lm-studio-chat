/**
 * src/services/api/modelService.ts
 * Service for managing LM Studio models
 */

import { LMStudioClient } from './lmStudioClient';
import { ModelInfo, ModelsResponse } from '@/src/types/api';
import { ModelNotFoundError, APIError } from './errors';
import { API_CONFIG } from '@/src/constants';

/**
 * Model Service for LM Studio
 */
export class ModelService {
  private client: LMStudioClient;

  constructor(client: LMStudioClient) {
    this.client = client;
  }

  /**
   * Fetch all available models
   */
  async getModels(signal?: AbortSignal): Promise<ModelInfo[]> {
    try {
      const response = await this.client.get<ModelsResponse>(
        API_CONFIG.MODELS_PATH,
        signal
      );

      if (!response.data?.data) {
        throw new APIError('Invalid models response', 'INVALID_RESPONSE');
      }

      return response.data.data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        'Failed to fetch models',
        'FETCH_MODELS_ERROR',
        undefined,
        error as Error
      );
    }
  }

  /**
   * Get a specific model by ID
   */
  async getModel(modelId: string, signal?: AbortSignal): Promise<ModelInfo> {
    try {
      const models = await this.getModels(signal);
      const model = models.find((m) => m.id === modelId);

      if (!model) {
        throw new ModelNotFoundError(
          `Model "${modelId}" not found`,
          modelId
        );
      }

      return model;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        'Failed to get model',
        'GET_MODEL_ERROR',
        undefined,
        error as Error
      );
    }
  }

  /**
   * Check if a model exists
   */
  async modelExists(modelId: string, signal?: AbortSignal): Promise<boolean> {
    try {
      const models = await this.getModels(signal);
      return models.some((m) => m.id === modelId);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get the first available model (fallback)
   */
  async getFirstAvailableModel(signal?: AbortSignal): Promise<ModelInfo | null> {
    try {
      const models = await this.getModels(signal);
      return models.length > 0 ? models[0] : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if any models are available
   */
  async hasModels(signal?: AbortSignal): Promise<boolean> {
    try {
      const models = await this.getModels(signal);
      return models.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get model count
   */
  async getModelCount(signal?: AbortSignal): Promise<number> {
    try {
      const models = await this.getModels(signal);
      return models.length;
    } catch (error) {
      return 0;
    }
  }
}

/**
 * Create a model service instance
 */
export function createModelService(client: LMStudioClient): ModelService {
  return new ModelService(client);
}