/**
 * src/app/_layout.tsx
 * Root layout with context providers and theme setup
 */

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// Import context providers
import { SettingsProvider } from '@/src/contexts/SettingsContext';
import { ConnectionProvider } from '@/src/contexts/ConnectionContext';
import { ChatProvider } from '@/src/contexts/ChatContext';
import { SnackbarProvider } from '@/src/components/common/SnackbarProvider';
import { AppProvider } from '@/src/contexts/AppContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <SnackbarProvider>
      <SettingsProvider>
        <ConnectionProvider>
          <ChatProvider>
            <AppProvider>
              <ThemeProvider value={DefaultTheme}>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
                <StatusBar style="auto" />
              </ThemeProvider>
            </AppProvider>
          </ChatProvider>
        </ConnectionProvider>
      </SettingsProvider>
    </SnackbarProvider>
  );
}