/**
 * src/types/api.ts
 * Type definitions for LM Studio API interactions
 */

export interface LMStudioConfig {
  baseUrl: string;
  timeout: number;
}

export interface ChatCompletionRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatCompletionStreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string | null;
  }>;
}

export interface ModelInfo {
  id: string;
  object: string;
  created?: number;
  owned_by?: string;
}

export interface ModelsResponse {
  object: string;
  data: ModelInfo[];
}

export interface APIError {
  error: {
    message: string;
    type: string;
    code?: string;
  };
}

// New streaming types
export interface StreamOptions {
  onChunk?: (chunk: ChatCompletionStreamChunk) => void;
  onContent?: (content: string) => void;
  onComplete?: (fullContent: string) => void;
  onError?: (error: Error) => void;
  signal?: AbortSignal;
}

export interface StreamResponse {
  content: string;
  finishReason: string | null;
  chunks: ChatCompletionStreamChunk[];
}

// Request builder types
export interface ChatRequestBuilder {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stream: boolean;
}

// Health check types
export interface HealthCheckResult {
  isHealthy: boolean;
  latency?: number;
  modelsAvailable?: number;
  error?: string;
}

// Retry configuration
export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

// API client configuration
export interface APIClientConfig {
  baseUrl: string;
  timeout: number;
  retryConfig?: RetryConfig;
  headers?: Record<string, string>;
}

// Response envelope
export interface APIResponse<T> {
  data?: T;
  error?: APIError;
  status: number;
  headers?: Record<string, string>;
}