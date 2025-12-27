/**
 * src/contexts/ChatContext.tsx
 * Chat state management context (basic implementation for Phase 1)
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Chat, Message } from '@/src/types';
import {
  loadChats,
  saveChat,
  deleteChat as deleteChatStorage,
  loadActiveChatId,
  saveActiveChatId,
} from '@/src/services/storage/chatStorage';
import { Snackbar_Compat as Snackbar } from '@/src/utils/snackbar';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/src/constants';

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  isLoading: boolean;
  isStreaming: boolean;
  createNewChat: () => void;
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => Promise<void>;
  updateChatTitle: (chatId: string, title: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateStreamingMessage: (content: string) => void;
  setStreaming: (streaming: boolean) => void;
  clearActiveChat: () => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);

  // Load chats on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Save active chat whenever it changes
  useEffect(() => {
    if (!isLoading && activeChat) {
      saveChat(activeChat);
      saveActiveChatId(activeChat.id);
    }
  }, [activeChat, isLoading]);

  /**
   * Load chats and active chat from storage
   */
  const loadInitialData = async () => {
    try {
      const [loadedChats, activeChatId] = await Promise.all([
        loadChats(),
        loadActiveChatId(),
      ]);

      setChats(loadedChats);

      if (activeChatId) {
        const active = loadedChats.find((c) => c.id === activeChatId);
        setActiveChat(active || null);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
      Snackbar.show({
        text: ERROR_MESSAGES.LOAD_ERROR,
        duration: Snackbar.LENGTH_SHORT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Generate a unique ID
   */
  const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Generate chat title from first message
   */
  const generateChatTitle = (firstMessage: string): string => {
    const maxLength = 50;
    if (firstMessage.length <= maxLength) {
      return firstMessage;
    }
    return firstMessage.substring(0, maxLength) + '...';
  };

  /**
   * Create a new chat
   */
  const createNewChat = () => {
    const newChat: Chat = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChat);
  };

  /**
   * Select a chat by ID
   */
  const selectChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setActiveChat(chat);
    }
  };

  /**
   * Delete a chat
   */
  const deleteChat = async (chatId: string) => {
    try {
      await deleteChatStorage(chatId);
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      
      if (activeChat?.id === chatId) {
        setActiveChat(null);
      }

      Snackbar.show({
        text: SUCCESS_MESSAGES.CHAT_DELETED,
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error) {
      console.error('Failed to delete chat:', error);
      Snackbar.show({
        text: ERROR_MESSAGES.STORAGE_ERROR,
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  /**
   * Update chat title
   */
  const updateChatTitle = (chatId: string, title: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, title, updatedAt: Date.now() }
          : chat
      )
    );

    if (activeChat?.id === chatId) {
      setActiveChat((prev) =>
        prev ? { ...prev, title, updatedAt: Date.now() } : null
      );
    }
  };

  /**
   * Add a new message to active chat
   */
  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    if (!activeChat) {
      // Create new chat if none exists
      createNewChat();
      // Will add message after chat is created
      return;
    }

    const newMessage: Message = {
      ...message,
      id: generateId(),
      timestamp: Date.now(),
    };

    const updatedMessages = [...activeChat.messages, newMessage];
    
    // Update title if this is the first user message
    let newTitle = activeChat.title;
    if (activeChat.title === 'New Chat' && message.role === 'user') {
      newTitle = generateChatTitle(message.content);
    }

    const updatedChat: Chat = {
      ...activeChat,
      messages: updatedMessages,
      title: newTitle,
      updatedAt: Date.now(),
    };

    setActiveChat(updatedChat);
    setChats((prev) =>
      prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
    );
  };

  /**
   * Update the content of the last streaming message
   */
  const updateStreamingMessage = (content: string) => {
    if (!activeChat || activeChat.messages.length === 0) return;

    const lastMessage = activeChat.messages[activeChat.messages.length - 1];
    if (lastMessage.role !== 'assistant') return;

    const updatedMessages = [...activeChat.messages];
    updatedMessages[updatedMessages.length - 1] = {
      ...lastMessage,
      content,
      isStreaming: true,
    };

    const updatedChat: Chat = {
      ...activeChat,
      messages: updatedMessages,
      updatedAt: Date.now(),
    };

    setActiveChat(updatedChat);
    setChats((prev) =>
      prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
    );
  };

  /**
   * Set streaming state
   */
  const setStreaming = (streaming: boolean) => {
    setIsStreaming(streaming);
    
    // Mark last message as not streaming when done
    if (!streaming && activeChat && activeChat.messages.length > 0) {
      const lastMessage = activeChat.messages[activeChat.messages.length - 1];
      if (lastMessage.isStreaming) {
        const updatedMessages = [...activeChat.messages];
        updatedMessages[updatedMessages.length - 1] = {
          ...lastMessage,
          isStreaming: false,
        };

        const updatedChat: Chat = {
          ...activeChat,
          messages: updatedMessages,
        };

        setActiveChat(updatedChat);
        setChats((prev) =>
          prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
        );
      }
    }
  };

  /**
   * Clear active chat
   */
  const clearActiveChat = () => {
    setActiveChat(null);
    saveActiveChatId(null);
  };

  const value: ChatContextType = {
    chats,
    activeChat,
    isLoading,
    isStreaming,
    createNewChat,
    selectChat,
    deleteChat,
    updateChatTitle,
    addMessage,
    updateStreamingMessage,
    setStreaming,
    clearActiveChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}