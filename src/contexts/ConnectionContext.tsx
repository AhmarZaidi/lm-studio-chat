/**
 * src/contexts/ConnectionContext.tsx
 * LM Studio connection management context
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ModelInfo } from '@/src/types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/src/constants';
import { Snackbar_Compat as Snackbar } from '@/src/utils/snackbar';
import { createLMStudioClient } from '@/src/services/api/lmStudioClient';
import { createHealthCheckService } from '@/src/services/api/healthCheck';

interface ConnectionContextType {
  isConnected: boolean;
  isChecking: boolean;
  endpoint: string;
  availableModels: ModelInfo[];
  error: string | null;
  testConnection: (endpointUrl: string) => Promise<boolean>;
  checkConnection: () => Promise<boolean>;
  setEndpoint: (endpoint: string) => void;
  fetchModels: () => Promise<void>;
}

export const ConnectionContext = createContext<
  ConnectionContextType | undefined
>(undefined);

interface ConnectionProviderProps {
  children: ReactNode;
}

export function ConnectionProvider({ children }: ConnectionProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [endpoint, setEndpoint] = useState('http://192.168.56.1:1234');
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * Test connection to LM Studio server
   */
  const testConnection = async (endpointUrl: string): Promise<boolean> => {
    setIsChecking(true);
    setError(null);

    try {
      const client = createLMStudioClient(endpointUrl);
      const healthService = createHealthCheckService(client);
      
      const result = await healthService.check();

      if (result.isHealthy) {
        setAvailableModels([]);
        setIsConnected(true);
        setEndpoint(endpointUrl);
        setError(null);
        
        // Fetch models after successful connection
        await fetchModelsInternal(endpointUrl);
        
        Snackbar.show({
          text: SUCCESS_MESSAGES.CONNECTION_SUCCESS,
          duration: Snackbar.LENGTH_SHORT,
        });
        
        return true;
      } else {
        throw new Error(result.error || ERROR_MESSAGES.CONNECTION_FAILED);
      }
    } catch (err) {
      console.error('Connection test failed:', err);
      
      let errorMessage = ERROR_MESSAGES.CONNECTION_FAILED;
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsConnected(false);
      setAvailableModels([]);
      
      Snackbar.show({
        text: errorMessage,
        duration: Snackbar.LENGTH_LONG,
        type: 'error',
      });
      
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  /**
   * Check connection with current endpoint
   */
  const checkConnection = async (): Promise<boolean> => {
    return await testConnection(endpoint);
  };

  /**
   * Internal fetch models (without checking connection)
   */
  const fetchModelsInternal = async (endpointUrl: string) => {
    try {
      const client = createLMStudioClient(endpointUrl);
      const response = await client.get<{ data: ModelInfo[] }>(
        '/v1/models'
      );

      if (response.data?.data && Array.isArray(response.data.data)) {
        setAvailableModels(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch models:', err);
    }
  };

  /**
   * Fetch available models from server
   */
  const fetchModels = async () => {
    if (!isConnected) {
      return;
    }

    await fetchModelsInternal(endpoint);
  };

  const value: ConnectionContextType = {
    isConnected,
    isChecking,
    endpoint,
    availableModels,
    error,
    testConnection,
    checkConnection,
    setEndpoint,
    fetchModels,
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
}