/**
 * src/components/common/Snackbar.tsx
 * Custom snackbar component for toast notifications
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '@/src/constants';

export type SnackbarDuration = 'short' | 'long' | 'indefinite';
export type SnackbarType = 'default' | 'success' | 'error' | 'warning' | 'info';

interface SnackbarProps {
  message: string;
  duration?: SnackbarDuration;
  type?: SnackbarType;
  onDismiss?: () => void;
}

const DURATION_MAP = {
  short: 2000,
  long: 3500,
  indefinite: 0,
};

export function Snackbar({
  message,
  duration = 'short',
  type = 'default',
  onDismiss,
}: SnackbarProps) {
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    const durationMs = DURATION_MAP[duration];
    if (durationMs > 0) {
      const timer = setTimeout(() => {
        dismiss();
      }, durationMs);

      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.();
    });
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return Colors.dark.success;
      case 'error':
        return Colors.dark.error;
      case 'warning':
        return Colors.dark.warning;
      case 'info':
        return Colors.dark.info;
      default:
        return Colors.dark.surface;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
          backgroundColor: getBackgroundColor(),
        },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    left: Spacing.lg,
    right: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadow.md,
    zIndex: 9999,
  },
  message: {
    color: Colors.dark.text,
    fontSize: FontSize.md,
    textAlign: 'center',
  },
});