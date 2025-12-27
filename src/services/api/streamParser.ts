/**
 * src/services/api/streamParser.ts
 * Server-Sent Events (SSE) parser for streaming responses
 */

import { ChatCompletionStreamChunk } from '@/src/types/api';
import { StreamError, ParseError } from './errors';

/**
 * Parse SSE data line
 */
function parseSSELine(line: string): { type: string; data: string } | null {
  if (!line.trim()) {
    return null;
  }

  // SSE format: "data: {json}"
  if (line.startsWith('data: ')) {
    const data = line.slice(6).trim();
    return { type: 'data', data };
  }

  // Other SSE fields (event, id, retry)
  const colonIndex = line.indexOf(':');
  if (colonIndex > 0) {
    const type = line.slice(0, colonIndex).trim();
    const data = line.slice(colonIndex + 1).trim();
    return { type, data };
  }

  return null;
}

/**
 * Parse streaming response from LM Studio
 */
export async function* parseStreamResponse(
  response: Response
): AsyncGenerator<ChatCompletionStreamChunk, void, unknown> {
  if (!response.body) {
    throw new StreamError('Response body is null');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // Decode chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });

      // Split by newlines
      const lines = buffer.split('\n');

      // Keep the last incomplete line in buffer
      buffer = lines.pop() || '';

      // Process complete lines
      for (const line of lines) {
        const parsed = parseSSELine(line);

        if (!parsed || parsed.type !== 'data') {
          continue;
        }

        // Check for stream end marker
        if (parsed.data === '[DONE]') {
          return;
        }

        // Parse JSON chunk
        try {
          const chunk = JSON.parse(parsed.data) as ChatCompletionStreamChunk;
          yield chunk;
        } catch (error) {
          console.warn('Failed to parse chunk:', parsed.data, error);
          // Continue processing other chunks
        }
      }
    }

    // Process any remaining data in buffer
    if (buffer.trim()) {
      const parsed = parseSSELine(buffer);
      if (parsed && parsed.type === 'data' && parsed.data !== '[DONE]') {
        try {
          const chunk = JSON.parse(parsed.data) as ChatCompletionStreamChunk;
          yield chunk;
        } catch (error) {
          console.warn('Failed to parse final chunk:', parsed.data, error);
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      // Stream was cancelled, exit gracefully
      return;
    }
    throw new StreamError('Error parsing stream', error as Error);
  } finally {
    reader.releaseLock();
  }
}

/**
 * Extract content from stream chunk
 */
export function extractContentFromChunk(
  chunk: ChatCompletionStreamChunk
): string {
  if (chunk.choices && chunk.choices.length > 0) {
    const choice = chunk.choices[0];
    if (choice.delta && choice.delta.content) {
      return choice.delta.content;
    }
  }
  return '';
}

/**
 * Check if chunk indicates stream completion
 */
export function isStreamComplete(chunk: ChatCompletionStreamChunk): boolean {
  if (chunk.choices && chunk.choices.length > 0) {
    const choice = chunk.choices[0];
    return choice.finish_reason !== null && choice.finish_reason !== undefined;
  }
  return false;
}

/**
 * Get finish reason from chunk
 */
export function getFinishReason(
  chunk: ChatCompletionStreamChunk
): string | null {
  if (chunk.choices && chunk.choices.length > 0) {
    const choice = chunk.choices[0];
    return choice.finish_reason;
  }
  return null;
}

/**
 * Process stream with callbacks
 */
export async function processStream(
  response: Response,
  callbacks: {
    onChunk?: (chunk: ChatCompletionStreamChunk) => void;
    onContent?: (content: string, fullContent: string) => void;
    onComplete?: (fullContent: string, finishReason: string | null) => void;
    onError?: (error: Error) => void;
  }
): Promise<string> {
  let fullContent = '';
  let finishReason: string | null = null;

  try {
    for await (const chunk of parseStreamResponse(response)) {
      // Call chunk callback
      callbacks.onChunk?.(chunk);

      // Extract and accumulate content
      const content = extractContentFromChunk(chunk);
      if (content) {
        fullContent += content;
        callbacks.onContent?.(content, fullContent);
      }

      // Check for completion
      if (isStreamComplete(chunk)) {
        finishReason = getFinishReason(chunk);
      }
    }

    // Call completion callback
    callbacks.onComplete?.(fullContent, finishReason);

    return fullContent;
  } catch (error) {
    callbacks.onError?.(error as Error);
    throw error;
  }
}

/**
 * Convert stream to simple content string
 */
export async function streamToString(response: Response): Promise<string> {
  let content = '';

  for await (const chunk of parseStreamResponse(response)) {
    const chunkContent = extractContentFromChunk(chunk);
    content += chunkContent;
  }

  return content;
}

/**
 * Collect all chunks from stream
 */
export async function collectStreamChunks(
  response: Response
): Promise<ChatCompletionStreamChunk[]> {
  const chunks: ChatCompletionStreamChunk[] = [];

  for await (const chunk of parseStreamResponse(response)) {
    chunks.push(chunk);
  }

  return chunks;
}