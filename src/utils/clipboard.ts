/**
 * src/utils/clipboard.ts
 * Clipboard operations with feedback
 */

import * as Clipboard from 'expo-clipboard';
import { Snackbar_Compat as Snackbar } from './snackbar';
import { SUCCESS_MESSAGES } from '@/src/constants';

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await Clipboard.setStringAsync(text);
    
    Snackbar.show({
      text: SUCCESS_MESSAGES.MESSAGE_COPIED,
      duration: Snackbar.LENGTH_SHORT,
      type: 'success',
    });
    
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    
    Snackbar.show({
      text: 'Failed to copy to clipboard',
      duration: Snackbar.LENGTH_SHORT,
      type: 'error',
    });
    
    return false;
  }
}

/**
 * Get text from clipboard
 */
export async function getFromClipboard(): Promise<string | null> {
  try {
    const text = await Clipboard.getStringAsync();
    return text || null;
  } catch (error) {
    console.error('Failed to get from clipboard:', error);
    return null;
  }
}

/**
 * Check if clipboard has text
 */
export async function hasClipboardText(): Promise<boolean> {
  try {
    const hasText = await Clipboard.hasStringAsync();
    return hasText;
  } catch (error) {
    console.error('Failed to check clipboard:', error);
    return false;
  }
}

/**
 * Copy with custom message
 */
export async function copyToClipboardWithMessage(
  text: string,
  message: string
): Promise<boolean> {
  try {
    await Clipboard.setStringAsync(text);
    
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_SHORT,
      type: 'success',
    });
    
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    
    Snackbar.show({
      text: 'Failed to copy to clipboard',
      duration: Snackbar.LENGTH_SHORT,
      type: 'error',
    });
    
    return false;
  }
}