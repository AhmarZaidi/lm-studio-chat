/**
 * src/services/api/chatService.ts
 * Service for chat completions with LM Studio
 */

import { LMStudioClient } from './lmStudioClient';
import {
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatCompletionStreamChunk,
  StreamOptions,
  StreamResponse,
} from '@/src/types/api';
import { Message } from '@/src/types';
import {
  parseStreamResponse,
  extractContentFromChunk,
  processStream,
} from './streamParser';
import { APIError, ValidationError } from './errors';
import { API_CONFIG, MODEL_DEFAULTS } from '@/src/constants';
import { isValidMessage } from '@/src/utils/validation';

/**
 * Chat Service for LM Studio
 */
export class ChatService {
  private client: LMStudioClient;

  constructor(client: LMStudioClient) {
    this.client = client;
  }

  /**
   * Format messages for API request
   */
  private formatMessages(messages: Message[]): Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }> {
    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  /**
   * Validate chat request
   */
  private validateRequest(request: ChatCompletionRequest): void {
    if (!request.model) {
      throw new ValidationError('Model is required', 'model');
    }

    if (!request.messages || request.messages.length === 0) {
      throw new ValidationError('At least one message is required', 'messages');
    }

    // Validate last message
    const lastMessage = request.messages[request.messages.length - 1];
    const validation = isValidMessage(lastMessage.content);
    if (!validation.valid) {
      throw new ValidationError(
        validation.error || 'Invalid message',
        'messages'
      );
    }
  }

  /**
   * Send a non-streaming chat completion request
   */
  async sendMessage(
    messages: Message[],
    model: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
      topP?: number;
      signal?: AbortSignal;
    }
  ): Promise<string> {
    const request: ChatCompletionRequest = {
      model,
      messages: this.formatMessages(messages),
      temperature: options?.temperature ?? MODEL_DEFAULTS.TEMPERATURE,
      max_tokens: options?.maxTokens ?? MODEL_DEFAULTS.MAX_TOKENS,
      top_p: options?.topP ?? MODEL_DEFAULTS.TOP_P,
      stream: false,
    };

    this.validateRequest(request);

    try {
      const response = await this.client.post<ChatCompletionResponse>(
        API_CONFIG.CHAT_COMPLETION_PATH,
        request,
        options?.signal
      );

      if (!response.data?.choices || response.data.choices.length === 0) {
        throw new APIError('No response from model', 'NO_RESPONSE');
      }

      const choice = response.data.choices[0];
      return choice.message.content;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        'Failed to send message',
        'SEND_MESSAGE_ERROR',
        undefined,
        error as Error
      );
    }
  }

  /**
   * Send a streaming chat completion request
   */
  async sendMessageStream(
    messages: Message[],
    model: string,
    options: StreamOptions & {
      temperature?: number;
      maxTokens?: number;
      topP?: number;
    }
  ): Promise<StreamResponse> {
    const request: ChatCompletionRequest = {
      model,
      messages: this.formatMessages(messages),
      temperature: options.temperature ?? MODEL_DEFAULTS.TEMPERATURE,
      max_tokens: options.maxTokens ?? MODEL_DEFAULTS.MAX_TOKENS,
      top_p: options.topP ?? MODEL_DEFAULTS.TOP_P,
      stream: true,
    };

    this.validateRequest(request);

    try {
      const response = await this.client.postStream(
        API_CONFIG.CHAT_COMPLETION_PATH,
        request,
        options.signal
      );

      const chunks: ChatCompletionStreamChunk[] = [];
      let fullContent = '';
      let finishReason: string | null = null;

      fullContent = await processStream(response, {
        onChunk: (chunk) => {
          chunks.push(chunk);
          options.onChunk?.(chunk);
        },
        onContent: (content, full) => {
          fullContent = full;
          options.onContent?.(content);
        },
        onComplete: (content, reason) => {
          fullContent = content;
          finishReason = reason;
          options.onComplete?.(content);
        },
        onError: (error) => {
          options.onError?.(error);
        },
      });

      return {
        content: fullContent,
        finishReason,
        chunks,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        'Failed to send streaming message',
        'SEND_STREAM_ERROR',
        undefined,
        error as Error
      );
    }
  }

  /**
   * Simple streaming helper that returns async generator
   */
  async *streamMessage(
    messages: Message[],
    model: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
      topP?: number;
      signal?: AbortSignal;
    }
  ): AsyncGenerator<string, void, unknown> {
    const request: ChatCompletionRequest = {
      model,
      messages: this.formatMessages(messages),
      temperature: options?.temperature ?? MODEL_DEFAULTS.TEMPERATURE,
      max_tokens: options?.maxTokens ?? MODEL_DEFAULTS.MAX_TOKENS,
      top_p: options?.topP ?? MODEL_DEFAULTS.TOP_P,
      stream: true,
    };

    this.validateRequest(request);

    const response = await this.client.postStream(
      API_CONFIG.CHAT_COMPLETION_PATH,
      request,
      options?.signal
    );

    for await (const chunk of parseStreamResponse(response)) {
      const content = extractContentFromChunk(chunk);
      if (content) {
        yield content;
      }
    }
  }

  /**
   * Create a new conversation with system message
   */
  createConversation(systemMessage?: string): Message[] {
    if (systemMessage) {
      return [
        {
          id: Date.now().toString(),
          role: 'system',
          content: systemMessage,
          timestamp: Date.now(),
        },
      ];
    }
    return [];
  }

  /**
   * Add user message to conversation
   */
  addUserMessage(messages: Message[], content: string): Message[] {
    return [
      ...messages,
      {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: Date.now(),
      },
    ];
  }

  /**
   * Add assistant message to conversation
   */
  addAssistantMessage(messages: Message[], content: string): Message[] {
    return [
      ...messages,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content,
        timestamp: Date.now(),
      },
    ];
  }
}

/**
 * Create a chat service instance
 */
export function createChatService(client: LMStudioClient): ChatService {
  return new ChatService(client);
}