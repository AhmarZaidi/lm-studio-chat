/**
 * src/hooks/useHaptics.ts
 * Custom hook for haptic feedback with settings integration
 */

import * as Haptics from 'expo-haptics';
import { useSettings } from './useSettings';

export type HapticStyle = 'light' | 'medium' | 'heavy';
export type HapticNotification = 'success' | 'warning' | 'error';

/**
 * Hook for haptic feedback that respects user settings
 */
export function useHaptics() {
  const { settings } = useSettings();

  /**
   * Trigger impact haptic feedback
   */
  const impact = async (style: HapticStyle = 'medium') => {
    if (!settings.hapticsEnabled) return;

    try {
      switch (style) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
      }
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  };

  /**
   * Trigger notification haptic feedback
   */
  const notification = async (type: HapticNotification) => {
    if (!settings.hapticsEnabled) return;

    try {
      switch (type) {
        case 'success':
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
          break;
        case 'warning':
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Warning
          );
          break;
        case 'error':
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Error
          );
          break;
      }
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  };

  /**
   * Trigger selection haptic feedback
   */
  const selection = async () => {
    if (!settings.hapticsEnabled) return;

    try {
      await Haptics.selectionAsync();
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  };

  /**
   * Light impact - for subtle interactions
   */
  const light = async () => {
    await impact('light');
  };

  /**
   * Medium impact - for standard interactions
   */
  const medium = async () => {
    await impact('medium');
  };

  /**
   * Heavy impact - for important interactions
   */
  const heavy = async () => {
    await impact('heavy');
  };

  /**
   * Success notification - for successful operations
   */
  const success = async () => {
    await notification('success');
  };

  /**
   * Warning notification - for warnings
   */
  const warning = async () => {
    await notification('warning');
  };

  /**
   * Error notification - for errors
   */
  const error = async () => {
    await notification('error');
  };

  return {
    impact,
    notification,
    selection,
    light,
    medium,
    heavy,
    success,
    warning,
    error,
    isEnabled: settings.hapticsEnabled,
  };
}