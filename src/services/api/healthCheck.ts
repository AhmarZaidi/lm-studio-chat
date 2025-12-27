/**
 * src/services/api/healthCheck.ts
 * Health check service for LM Studio connection
 */

import { LMStudioClient } from './lmStudioClient';
import { HealthCheckResult } from '@/src/types/api';
import { APIError } from './errors';

/**
 * Health Check Service
 */
export class HealthCheckService {
  private client: LMStudioClient;

  constructor(client: LMStudioClient) {
    this.client = client;
  }

  /**
   * Perform health check by fetching models with short timeout
   */
  async check(signal?: AbortSignal): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      // Create a short timeout for health check (5 seconds)
      const timeoutController = new AbortController();
      const timeoutId = setTimeout(() => timeoutController.abort(), 5000);

      // Combine timeout with any provided signal
      const combinedSignal = signal
        ? this.combineAbortSignals(signal, timeoutController.signal)
        : timeoutController.signal;

      const response = await this.client.get<{ data: any[] }>(
        '/v1/models',
        combinedSignal
      );

      clearTimeout(timeoutId);

      const latency = Date.now() - startTime;
      const modelsAvailable = response.data?.data?.length || 0;

      return {
        isHealthy: true,
        latency,
        modelsAvailable,
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      const apiError = error as APIError;

      return {
        isHealthy: false,
        latency,
        modelsAvailable: 0,
        error: apiError.message || 'Health check failed',
      };
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
   * Check with timeout
   */
  async checkWithTimeout(timeoutMs: number): Promise<HealthCheckResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const result = await this.check(controller.signal);
      clearTimeout(timeoutId);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      return {
        isHealthy: false,
        error: 'Health check timeout',
      };
    }
  }

  /**
   * Perform multiple health checks and return average
   */
  async checkMultiple(
    count: number = 3,
    delayMs: number = 1000
  ): Promise<{
    isHealthy: boolean;
    averageLatency?: number;
    successRate: number;
  }> {
    const results: HealthCheckResult[] = [];

    for (let i = 0; i < count; i++) {
      const result = await this.check();
      results.push(result);

      if (i < count - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    const healthyResults = results.filter((r) => r.isHealthy);
    const successRate = healthyResults.length / count;

    if (healthyResults.length === 0) {
      return {
        isHealthy: false,
        successRate: 0,
      };
    }

    const averageLatency =
      healthyResults.reduce((sum, r) => sum + (r.latency || 0), 0) /
      healthyResults.length;

    return {
      isHealthy: successRate >= 0.5, // Consider healthy if >50% success
      averageLatency,
      successRate,
    };
  }
}

/**
 * Create a health check service instance
 */
export function createHealthCheckService(
  client: LMStudioClient
): HealthCheckService {
  return new HealthCheckService(client);
}