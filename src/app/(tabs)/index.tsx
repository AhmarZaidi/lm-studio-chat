/**
 * src/app/(tabs)/index.tsx
 * Main chat screen with full integration
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SetupScreen } from '@/src/components/screens/SetupScreen';
import { TopBar } from '@/src/components/common/TopBar';
import { ChatList } from '@/src/components/chat/ChatList';
import { ChatInput } from '@/src/components/chat/ChatInput';
import { useConnection } from '@/src/hooks/useConnection';
import { useApp } from '@/src/hooks/useApp';
import { useSettings } from '@/src/hooks/useSettings';
import { useChat } from '@/src/hooks/useChat';
import { useStreamingChat } from '@/src/hooks/useStreamingChat';
import { Colors } from '@/src/constants';

export default function HomeScreen() {
  const { isConnected, testConnection } = useConnection();
  const { isSetupComplete, setSetupComplete } = useApp();
  const { settings, isLoading: isLoadingSettings } = useSettings();
  const { activeChat, isLoading: isLoadingChat, createNewChat } = useChat();
  const { sendMessage, isSending, canSend } = useStreamingChat();

  const [isCheckingInitialConnection, setIsCheckingInitialConnection] =
    useState(true);

  /**
   * Check connection on mount with saved endpoint
   */
  useEffect(() => {
    const checkInitialConnection = async () => {
      // Wait for settings to load
      if (isLoadingSettings) {
        return;
      }

      // If we have a saved endpoint, try to connect silently
      if (settings.serverEndpoint) {
        const success = await testConnection(settings.serverEndpoint, true);
        if (success) {
          setSetupComplete(true);
        }
      }

      setIsCheckingInitialConnection(false);
    };

    checkInitialConnection();
  }, [isLoadingSettings]);

  /**
   * Create initial chat if none exists
   */
  useEffect(() => {
    if (isSetupComplete && isConnected && !activeChat && !isLoadingChat) {
      createNewChat();
    }
  }, [isSetupComplete, isConnected, activeChat, isLoadingChat]);

  /**
   * Handle sending a message
   */
  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  /**
   * Show loading while checking initial connection
   */
  if (isCheckingInitialConnection || isLoadingSettings) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

  /**
   * Show setup screen if not connected or setup not complete
   */
  if (!isSetupComplete || !isConnected) {
    return (
      <SafeAreaProvider>
        <SetupScreen />
      </SafeAreaProvider>
    );
  }

  /**
   * Show loading while chat is being created
   */
  if (isLoadingChat || !activeChat) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

  /**
   * Main chat screen
   */
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* Top Bar */}
        <TopBar />

        {/* Chat Messages */}
        <ChatList
          messages={activeChat.messages}
          isStreaming={isSending}
          isLoading={isLoadingChat}
        />

        {/* Chat Input */}
        <ChatInput
          onSend={handleSendMessage}
          disabled={!canSend || isSending}
          placeholder={
            isSending ? 'Generating response...' : 'Type a message...'
          }
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});