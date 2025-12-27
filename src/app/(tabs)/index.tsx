/**
 * src/app/(tabs)/index.tsx
 * Main home screen with setup flow integration
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SetupScreen } from '@/src/components/screens/SetupScreen';
import { useConnection } from '@/src/hooks/useConnection';
import { useApp } from '@/src/hooks/useApp';
import { useSettings } from '@/src/hooks/useSettings';
import { Colors } from '@/src/constants';

export default function HomeScreen() {
  const { isConnected, testConnection } = useConnection();
  const { isSetupComplete, setSetupComplete } = useApp();
  const { settings } = useSettings();

  /**
   * Check connection on mount
   */
  useEffect(() => {
    const checkInitialConnection = async () => {
      if (!isSetupComplete && settings.serverEndpoint) {
        const success = await testConnection(settings.serverEndpoint);
        if (success) {
          setSetupComplete(true);
        }
      }
    };

    checkInitialConnection();
  }, []);

  /**
   * Show setup screen if not connected or setup not complete
   */
  if (!isSetupComplete || !isConnected) {
    return <SetupScreen />;
  }

  /**
   * Main chat screen (placeholder for now)
   */
  return (
    <View style={styles.container}>
      {/* Chat screen will be implemented in Phase 3 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
});