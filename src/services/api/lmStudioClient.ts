/**
 * src/services/api/lmStudioClient.ts
 * Core HTTP client for LM Studio API with retry logic
 */

import {
  APIClientConfig,
  APIResponse,
  RetryConfig,
} from '@/src/types/api';
import {
  APIError,
  NetworkError,
  TimeoutError,
  ServerError,
  CancellationError,
  handleFetchError,
  isRetryableError,
} from './errors';
import { API_CONFIG } from '@/src/constants';

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
};

/**
 * LM Studio API Client
 */
export class LMStudioClient {
  private config: APIClientConfig;
  private retryConfig: RetryConfig;

  constructor(baseUrl: string, timeout: number = API_CONFIG.DEFAULT_TIMEOUT) {
    this.config = {
      baseUrl: baseUrl.replace(/\/$/, ''), // Remove trailing slash
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    this.retryConfig = DEFAULT_RETRY_CONFIG;
  }

  /**
   * Update base URL
   */
  setBaseUrl(baseUrl: string) {
    this.config.baseUrl = baseUrl.replace(/\/$/, '');
  }

  /**
   * Update timeout
   */
  setTimeout(timeout: number) {
    this.config.timeout = timeout;
  }

  /**
   * Update retry configuration
   */
  setRetryConfig(retryConfig: Partial<RetryConfig>) {
    this.retryConfig = { ...this.retryConfig, ...retryConfig };
  }

  /**
   * Calculate delay for retry with exponential backoff
   */
  private calculateRetryDelay(attemptNumber: number): number {
    const delay = Math.min(
      this.retryConfig.initialDelayMs *
        Math.pow(this.retryConfig.backoffMultiplier, attemptNumber),
      this.retryConfig.maxDelayMs
    );
    // Add jitter to prevent thundering herd
    return delay + Math.random() * 1000;
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Make HTTP request with retry logic
   */
  async request<T>(
    path: string,
    options: RequestInit = {},
    signal?: AbortSignal
  ): Promise<APIResponse<T>> {
    const url = `${this.config.baseUrl}${path}`;
    let lastError: APIError | null = null;

    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        // Create timeout signal
        const timeoutController = new AbortController();
        const timeoutId = setTimeout(
          () => timeoutController.abort(),
          this.config.timeout
        );

        // Combine timeout signal with user signal
        const combinedSignal = signal
          ? this.combineAbortSignals(signal, timeoutController.signal)
          : timeoutController.signal;

        // Make request
        const response = await fetch(url, {
          ...options,
          headers: {
            ...this.config.headers,
            ...options.headers,
          },
          signal: combinedSignal,
        });

        clearTimeout(timeoutId);

        // Handle non-OK responses
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `Server error: ${response.status}`;

          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error?.message) {
              errorMessage = errorJson.error.message;
            }
          } catch {
            // Use default error message
          }

          throw new ServerError(errorMessage, response.status);
        }

        // Parse response
        const data = await response.json();

        return {
          data: data as T,
          status: response.status,
          headers: this.headersToObject(response.headers),
        };
      } catch (error) {
        lastError = handleFetchError(error);

        // Don't retry if cancelled
        if (lastError instanceof CancellationError) {
          throw lastError;
        }

        // Don't retry if not retryable or max retries reached
        if (!isRetryableError(lastError) || attempt >= this.retryConfig.maxRetries) {
          throw lastError;
        }

        // Wait before retrying
        const delay = this.calculateRetryDelay(attempt);
        console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
        await this.sleep(delay);
      }
    }

    // Should not reach here, but throw last error if it does
    throw lastError || new APIError('Request failed after retries', 'REQUEST_FAILED');
  }

  /**
   * GET request
   */
  async get<T>(path: string, signal?: AbortSignal): Promise<APIResponse<T>> {
    return this.request<T>(path, { method: 'GET' }, signal);
  }

  /**
   * POST request
   */
  async post<T>(
    path: string,
    body: any,
    signal?: AbortSignal
  ): Promise<APIResponse<T>> {
    return this.request<T>(
      path,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      signal
    );
  }

  /**
   * POST request for streaming
   */
  async postStream(
    path: string,
    body: any,
    signal?: AbortSignal
  ): Promise<Response> {
    const url = `${this.config.baseUrl}${path}`;

    // Create timeout signal
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(
      () => timeoutController.abort(),
      API_CONFIG.STREAM_TIMEOUT // Longer timeout for streams
    );

    try {
      // Combine timeout signal with user signal
      const combinedSignal = signal
        ? this.combineAbortSignals(signal, timeoutController.signal)
        : timeoutController.signal;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...this.config.headers,
          Accept: 'text/event-stream',
        },
        body: JSON.stringify(body),
        signal: combinedSignal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Server error: ${response.status}`;

        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error?.message) {
            errorMessage = errorJson.error.message;
          }
        } catch {
          // Use default error message
        }

        throw new ServerError(errorMessage, response.status);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw handleFetchError(error);
    }
  }

  /**
   * Combine multiple abort signals
   */
  private combineAbortSignals(...signals: AbortSignal[]): AbortSignal {
    const controller = new AbortController();

    for (const signal of signals) {
      if (signal.aborted) {
        controller.abort();
        break;
      }

      signal.addEventListener('abort', () => controller.abort(), {
        once: true,
      });
    }

    return controller.signal;
  }

  /**
   * Convert Headers to plain object
   */
  private headersToObject(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
}

/**
 * Create a client instance
 */
export function createLMStudioClient(
  baseUrl: string,
  timeout?: number
): LMStudioClient {
  return new LMStudioClient(baseUrl, timeout);
}