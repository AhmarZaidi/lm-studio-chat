/**
 * src/services/api/errors.ts
 * Custom error classes for API operations
 */

/**
 * Base API error class
 */
export class APIError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly originalError?: Error;

  constructor(
    message: string,
    code: string,
    statusCode?: number,
    originalError?: Error
  ) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.statusCode = statusCode;
    this.originalError = originalError;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Network connection error
 */
export class NetworkError extends APIError {
  constructor(message: string = 'Network request failed', originalError?: Error) {
    super(message, 'NETWORK_ERROR', undefined, originalError);
    this.name = 'NetworkError';
  }
}

/**
 * Request timeout error
 */
export class TimeoutError extends APIError {
  constructor(message: string = 'Request timeout', timeoutMs?: number) {
    const fullMessage = timeoutMs
      ? `${message} (${timeoutMs}ms)`
      : message;
    super(fullMessage, 'TIMEOUT_ERROR');
    this.name = 'TimeoutError';
  }
}

/**
 * Server responded with error status
 */
export class ServerError extends APIError {
  constructor(
    message: string,
    statusCode: number,
    originalError?: Error
  ) {
    super(message, 'SERVER_ERROR', statusCode, originalError);
    this.name = 'ServerError';
  }
}

/**
 * Streaming specific error
 */
export class StreamError extends APIError {
  constructor(message: string = 'Stream error occurred', originalError?: Error) {
    super(message, 'STREAM_ERROR', undefined, originalError);
    this.name = 'StreamError';
  }
}

/**
 * Model not found or not loaded
 */
export class ModelNotFoundError extends APIError {
  public readonly modelId?: string;

  constructor(message: string = 'Model not found', modelId?: string) {
    super(message, 'MODEL_NOT_FOUND', 404);
    this.name = 'ModelNotFoundError';
    this.modelId = modelId;
  }
}

/**
 * Invalid request data
 */
export class ValidationError extends APIError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Request was cancelled
 */
export class CancellationError extends APIError {
  constructor(message: string = 'Request was cancelled') {
    super(message, 'CANCELLED');
    this.name = 'CancellationError';
  }
}

/**
 * Parse response error
 */
export class ParseError extends APIError {
  constructor(message: string = 'Failed to parse response', originalError?: Error) {
    super(message, 'PARSE_ERROR', undefined, originalError);
    this.name = 'ParseError';
  }
}

/**
 * Error code constants
 */
export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  STREAM_ERROR: 'STREAM_ERROR',
  MODEL_NOT_FOUND: 'MODEL_NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CANCELLED: 'CANCELLED',
  PARSE_ERROR: 'PARSE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

/**
 * Convert fetch errors to our custom error types
 */
export function handleFetchError(error: unknown): APIError {
  // Already our error type
  if (error instanceof APIError) {
    return error;
  }

  // Native Error
  if (error instanceof Error) {
    // Check for specific error types
    if (error.name === 'AbortError') {
      return new CancellationError('Request was cancelled');
    }

    if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
      return new TimeoutError('Request timeout');
    }

    if (
      error.message.includes('Network') ||
      error.message.includes('Failed to fetch')
    ) {
      return new NetworkError('Network request failed', error);
    }

    // Generic error
    return new APIError(error.message, ErrorCodes.UNKNOWN_ERROR, undefined, error);
  }

  // Unknown error type
  return new APIError(
    'An unknown error occurred',
    ErrorCodes.UNKNOWN_ERROR
  );
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: APIError): boolean {
  // Network errors are retryable
  if (error instanceof NetworkError) {
    return true;
  }

  // Timeout errors are retryable
  if (error instanceof TimeoutError) {
    return true;
  }

  // Some server errors are retryable (5xx)
  if (error instanceof ServerError) {
    return (
      error.statusCode !== undefined &&
      error.statusCode >= 500 &&
      error.statusCode < 600
    );
  }

  return false;
}

/**
 * Get user-friendly error message
 */
export function getUserErrorMessage(error: APIError): string {
  if (error instanceof NetworkError) {
    return 'Unable to connect to the server. Please check your network connection.';
  }

  if (error instanceof TimeoutError) {
    return 'The request took too long. Please try again.';
  }

  if (error instanceof ModelNotFoundError) {
    return 'The selected model is not available. Please load a model in LM Studio.';
  }

  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error instanceof CancellationError) {
    return 'Request was cancelled.';
  }

  if (error instanceof ServerError) {
    if (error.statusCode === 503) {
      return 'Server is temporarily unavailable. Please try again later.';
    }
    if (error.statusCode === 429) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    return `Server error (${error.statusCode}). Please try again.`;
  }

  if (error instanceof StreamError) {
    return 'Error while streaming response. Please try again.';
  }

  if (error instanceof ParseError) {
    return 'Failed to process server response. Please try again.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
}