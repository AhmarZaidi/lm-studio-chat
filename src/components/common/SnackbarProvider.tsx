/**
 * src/components/common/SnackbarProvider.tsx
 * Provider component for snackbar functionality
 */

import React, { useState, useEffect, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar, SnackbarDuration, SnackbarType } from './Snackbar';
import { SnackbarService } from '@/src/utils/snackbar';

interface SnackbarState {
  message: string;
  duration: SnackbarDuration;
  type: SnackbarType;
  visible: boolean;
  key: number;
}

interface SnackbarProviderProps {
  children: ReactNode;
}

export function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: '',
    duration: 'short',
    type: 'default',
    visible: false,
    key: 0,
  });

  useEffect(() => {
    // Register the show callback
    SnackbarService.register((options) => {
      setSnackbar({
        message: options.text,
        duration: options.duration || 'short',
        type: options.type || 'default',
        visible: true,
        key: Date.now(),
      });
    });

    return () => {
      SnackbarService.unregister();
    };
  }, []);

  const handleDismiss = () => {
    setSnackbar((prev) => ({ ...prev, visible: false }));
  };

  return (
    <View style={styles.container}>
      {children}
      {snackbar.visible && (
        <Snackbar
          key={snackbar.key}
          message={snackbar.message}
          duration={snackbar.duration}
          type={snackbar.type}
          onDismiss={handleDismiss}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});