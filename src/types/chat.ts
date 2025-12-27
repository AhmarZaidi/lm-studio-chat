/**
 * src/types/chat.ts
 * Type definitions for chat and message structures
 */

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model?: string;
}

export type StreamingStatus = 'idle' | 'streaming' | 'complete' | 'error';