/**
 * src/utils/snackbar.tsx
 * Snackbar manager for displaying toast notifications
 */

import React from 'react';
import { Snackbar, SnackbarDuration, SnackbarType } from '@/src/components/common/Snackbar';

type SnackbarOptions = {
  text: string;
  duration?: SnackbarDuration;
  type?: SnackbarType;
};

// Singleton snackbar manager
class SnackbarManager {
  private showCallback: ((options: SnackbarOptions) => void) | null = null;

  /**
   * Register the show callback
   */
  register(callback: (options: SnackbarOptions) => void) {
    this.showCallback = callback;
  }

  /**
   * Unregister the show callback
   */
  unregister() {
    this.showCallback = null;
  }

  /**
   * Show a snackbar
   */
  show(options: SnackbarOptions) {
    if (this.showCallback) {
      this.showCallback(options);
    } else {
      console.warn('Snackbar: No callback registered. Did you forget to add SnackbarProvider?');
    }
  }
}

export const SnackbarService = new SnackbarManager();

/**
 * Convert duration number to duration string
 */
function getDuration(durationMs?: number): SnackbarDuration {
  if (!durationMs) return 'short';
  if (durationMs <= 2000) return 'short';
  if (durationMs <= 3500) return 'long';
  return 'long';
}

/**
 * Compatibility layer with react-native-snackbar API
 */
export const Snackbar_Compat = {
  LENGTH_SHORT: 'short' as const,
  LENGTH_LONG: 'long' as const,
  LENGTH_INDEFINITE: 'indefinite' as const,

  show(options: {
    text: string;
    duration?: number | SnackbarDuration;
    type?: SnackbarType;
  }) {
    const duration = typeof options.duration === 'number' 
      ? getDuration(options.duration)
      : (options.duration || 'short');

    SnackbarService.show({
      text: options.text,
      duration,
      type: options.type,
    });
  },
};