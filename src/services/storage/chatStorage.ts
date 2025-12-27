/**
 * src/services/storage/chatStorage.ts
 * Chat history persistence layer (basic structure for Phase 1, fully implemented in Phase 6)
 */

import { StorageManager } from './asyncStorage';
import { Chat } from '@/src/types';
import { STORAGE_KEYS } from '@/src/constants';

/**
 * Load all chats from storage
 */
export async function loadChats(): Promise<Chat[]> {
  const chats = await StorageManager.getItem<Chat[]>(STORAGE_KEYS.CHATS);
  return chats || [];
}

/**
 * Save all chats to storage
 */
export async function saveChats(chats: Chat[]): Promise<boolean> {
  return await StorageManager.setItem(STORAGE_KEYS.CHATS, chats);
}

/**
 * Save a single chat (creates or updates)
 */
export async function saveChat(chat: Chat): Promise<boolean> {
  const chats = await loadChats();
  const index = chats.findIndex((c) => c.id === chat.id);
  
  if (index >= 0) {
    // Update existing chat
    chats[index] = chat;
  } else {
    // Add new chat at the beginning
    chats.unshift(chat);
  }
  
  return await saveChats(chats);
}

/**
 * Delete a chat by ID
 */
export async function deleteChat(chatId: string): Promise<boolean> {
  const chats = await loadChats();
  const filtered = chats.filter((c) => c.id !== chatId);
  return await saveChats(filtered);
}

/**
 * Get a specific chat by ID
 */
export async function getChatById(chatId: string): Promise<Chat | null> {
  const chats = await loadChats();
  return chats.find((c) => c.id === chatId) || null;
}

/**
 * Load active chat ID
 */
export async function loadActiveChatId(): Promise<string | null> {
  return await StorageManager.getItem<string>(STORAGE_KEYS.ACTIVE_CHAT_ID);
}

/**
 * Save active chat ID
 */
export async function saveActiveChatId(
  chatId: string | null
): Promise<boolean> {
  if (chatId === null) {
    return await StorageManager.removeItem(STORAGE_KEYS.ACTIVE_CHAT_ID);
  }
  return await StorageManager.setItem(STORAGE_KEYS.ACTIVE_CHAT_ID, chatId);
}

/**
 * Clear all chats
 */
export async function clearAllChats(): Promise<boolean> {
  const success = await StorageManager.removeItem(STORAGE_KEYS.CHATS);
  await StorageManager.removeItem(STORAGE_KEYS.ACTIVE_CHAT_ID);
  return success;
}

/**
 * Search chats by query (basic implementation)
 */
export async function searchChats(query: string): Promise<Chat[]> {
  const chats = await loadChats();
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) {
    return chats;
  }
  
  return chats.filter((chat) => {
    // Search in chat title
    if (chat.title.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    // Search in message content
    return chat.messages.some((message) =>
      message.content.toLowerCase().includes(lowerQuery)
    );
  });
}

/**
 * Get chat statistics
 */
export async function getChatStats(): Promise<{
  totalChats: number;
  totalMessages: number;
  oldestChat: number | null;
  newestChat: number | null;
}> {
  const chats = await loadChats();
  
  let totalMessages = 0;
  let oldestChat: number | null = null;
  let newestChat: number | null = null;
  
  chats.forEach((chat) => {
    totalMessages += chat.messages.length;
    
    if (oldestChat === null || chat.createdAt < oldestChat) {
      oldestChat = chat.createdAt;
    }
    
    if (newestChat === null || chat.createdAt > newestChat) {
      newestChat = chat.createdAt;
    }
  });
  
  return {
    totalChats: chats.length,
    totalMessages,
    oldestChat,
    newestChat,
  };
}