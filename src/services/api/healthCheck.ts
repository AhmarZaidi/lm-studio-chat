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
   * Perform health check by fetching models
   */
  async check(signal?: AbortSignal): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      const response = await this.client.get<{ data: any[] }>(
        '/v1/models',
        signal
      );

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
   * Quick connectivity check (faster than full health check)
   */
  async ping(signal?: AbortSignal): Promise<boolean> {
    try {
      const result = await this.check(signal);
      return result.isHealthy;
    } catch {
      return false;
    }
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