/**
 * src/utils/share.ts
 * Share functionality for exporting chats
 */

import { Share, Platform } from 'react-native';
import { Chat, Message } from '@/src/types';
import { formatFullDateTime } from './helpers';
import { Snackbar_Compat as Snackbar } from './snackbar';
import { SUCCESS_MESSAGES } from '@/src/constants';

/**
 * Format a single message for export
 */
function formatMessage(message: Message): string {
  const timestamp = formatFullDateTime(message.timestamp);
  const role = message.role === 'user' ? 'You' : 'Assistant';
  return `[${timestamp}] ${role}:\n${message.content}\n`;
}

/**
 * Format entire chat for export
 */
export function formatChatForExport(chat: Chat): string {
  const header = `Chat: ${chat.title}\n`;
  const date = `Created: ${formatFullDateTime(chat.createdAt)}\n`;
  const separator = '='.repeat(50) + '\n\n';
  
  const messages = chat.messages
    .map((msg) => formatMessage(msg))
    .join('\n');
  
  return header + date + separator + messages;
}

/**
 * Format messages array for export
 */
export function formatMessagesForExport(
  messages: Message[],
  title?: string
): string {
  const header = title ? `Chat: ${title}\n` : 'Chat Export\n';
  const date = `Exported: ${formatFullDateTime(Date.now())}\n`;
  const separator = '='.repeat(50) + '\n\n';
  
  const formattedMessages = messages
    .map((msg) => formatMessage(msg))
    .join('\n');
  
  return header + date + separator + formattedMessages;
}

/**
 * Share chat using native share dialog
 */
export async function shareChat(chat: Chat): Promise<boolean> {
  try {
    const content = formatChatForExport(chat);
    
    const result = await Share.share(
      {
        message: content,
        title: `Chat: ${chat.title}`,
      },
      {
        dialogTitle: 'Share Chat',
        subject: `Chat: ${chat.title}`, // For email on iOS
      }
    );

    if (result.action === Share.sharedAction) {
      Snackbar.show({
        text: SUCCESS_MESSAGES.CHAT_EXPORTED,
        duration: Snackbar.LENGTH_SHORT,
        type: 'success',
      });
      return true;
    } else if (result.action === Share.dismissedAction) {
      // User dismissed, not an error
      return false;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to share chat:', error);
    
    Snackbar.show({
      text: 'Failed to share chat',
      duration: Snackbar.LENGTH_SHORT,
      type: 'error',
    });
    
    return false;
  }
}

/**
 * Share messages array
 */
export async function shareMessages(
  messages: Message[],
  title?: string
): Promise<boolean> {
  try {
    const content = formatMessagesForExport(messages, title);
    
    const result = await Share.share(
      {
        message: content,
        title: title || 'Chat Export',
      },
      {
        dialogTitle: 'Share Chat',
        subject: title || 'Chat Export',
      }
    );

    if (result.action === Share.sharedAction) {
      Snackbar.show({
        text: SUCCESS_MESSAGES.CHAT_EXPORTED,
        duration: Snackbar.LENGTH_SHORT,
        type: 'success',
      });
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to share messages:', error);
    
    Snackbar.show({
      text: 'Failed to share messages',
      duration: Snackbar.LENGTH_SHORT,
      type: 'error',
    });
    
    return false;
  }
}

/**
 * Get share options based on platform
 */
export function getShareOptions() {
  return {
    supportsFiles: Platform.OS !== 'web',
    supportsUrls: true,
    supportsMultiple: Platform.OS === 'ios',
  };
}