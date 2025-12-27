/**
 * src/utils/validation.ts
 * Input validation utilities
 */

import { UI_CONFIG } from '@/src/constants';

/**
 * Validate LM Studio endpoint URL
 */
export function isValidEndpoint(endpoint: string): {
  valid: boolean;
  error?: string;
} {
  if (!endpoint || endpoint.trim().length === 0) {
    return { valid: false, error: 'Endpoint cannot be empty' };
  }

  const trimmed = endpoint.trim();

  // Check URL format
  try {
    const url = new URL(trimmed);

    // Must be http or https
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return {
        valid: false,
        error: 'Endpoint must use HTTP or HTTPS protocol',
      };
    }

    // Must have a hostname
    if (!url.hostname) {
      return { valid: false, error: 'Invalid endpoint URL' };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Validate username
 */
export function isValidUsername(username: string): {
  valid: boolean;
  error?: string;
} {
  if (!username || username.trim().length === 0) {
    return { valid: false, error: 'Username cannot be empty' };
  }

  const trimmed = username.trim();

  if (trimmed.length < 1) {
    return { valid: false, error: 'Username is too short' };
  }

  if (trimmed.length > UI_CONFIG.USERNAME_MAX_LENGTH) {
    return {
      valid: false,
      error: `Username must be ${UI_CONFIG.USERNAME_MAX_LENGTH} characters or less`,
    };
  }

  // Check for valid characters (letters, numbers, spaces, basic punctuation)
  const validPattern = /^[a-zA-Z0-9\s\-_.]+$/;
  if (!validPattern.test(trimmed)) {
    return {
      valid: false,
      error: 'Username contains invalid characters',
    };
  }

  return { valid: true };
}

/**
 * Validate message content
 */
export function isValidMessage(message: string): {
  valid: boolean;
  error?: string;
} {
  if (!message || message.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  const trimmed = message.trim();

  if (trimmed.length > UI_CONFIG.MESSAGE_MAX_LENGTH) {
    return {
      valid: false,
      error: `Message must be ${UI_CONFIG.MESSAGE_MAX_LENGTH} characters or less`,
    };
  }

  return { valid: true };
}

/**
 * Validate chat title
 */
export function isValidChatTitle(title: string): {
  valid: boolean;
  error?: string;
} {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Title cannot be empty' };
  }

  const trimmed = title.trim();

  if (trimmed.length > UI_CONFIG.CHAT_TITLE_MAX_LENGTH) {
    return {
      valid: false,
      error: `Title must be ${UI_CONFIG.CHAT_TITLE_MAX_LENGTH} characters or less`,
    };
  }

  return { valid: true };
}

/**
 * Sanitize user input - remove potentially harmful content
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  // Remove control characters except newlines and tabs
  let sanitized = input.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

  // Normalize line breaks
  sanitized = sanitized.replace(/\r\n/g, '\n');

  // Remove excessive consecutive newlines (max 2)
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n');

  return sanitized;
}

/**
 * Sanitize URL - ensure it's safe to use
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  let sanitized = url.trim();

  // Remove any whitespace
  sanitized = sanitized.replace(/\s/g, '');

  // Ensure protocol exists
  if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
    sanitized = 'http://' + sanitized;
  }

  return sanitized;
}

/**
 * Check if port number is valid
 */
export function isValidPort(port: number): boolean {
  return Number.isInteger(port) && port >= 1 && port <= 65535;
}

/**
 * Validate temperature parameter
 */
export function isValidTemperature(temp: number): boolean {
  return typeof temp === 'number' && temp >= 0 && temp <= 2;
}

/**
 * Validate max tokens parameter
 */
export function isValidMaxTokens(tokens: number): boolean {
  return Number.isInteger(tokens) && tokens > 0 && tokens <= 32000;
}

/**
 * Validate top-p parameter
 */
export function isValidTopP(topP: number): boolean {
  return typeof topP === 'number' && topP >= 0 && topP <= 1;
}