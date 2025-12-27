/**
 * src/components/chat/ChatList.tsx
 * Scrollable list of chat messages
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Message } from '@/src/types';
import { ChatMessage } from './ChatMessage';
import { EmptyChat } from './EmptyChat';
import { TypingIndicator } from './TypingIndicator';
import { Colors, Spacing } from '@/src/constants/theme';

interface ChatListProps {
  messages: Message[];
  isStreaming?: boolean;
  isLoading?: boolean;
}

export function ChatList({ messages, isStreaming, isLoading }: ChatListProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const shouldAutoScroll = useRef(true);

  /**
   * Auto-scroll to bottom when new messages arrive or streaming updates
   */
  useEffect(() => {
    if (shouldAutoScroll.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isStreaming]);

  /**
   * Handle scroll - disable auto-scroll if user scrolls up
   */
  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtBottom =
      contentOffset.y >= contentSize.height - layoutMeasurement.height - 50;
    shouldAutoScroll.current = isAtBottom;
  };

  /**
   * Show empty state if no messages
   */
  if (messages.length === 0 && !isLoading) {
    return <EmptyChat />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isStreaming && (
          <View style={styles.typingContainer}>
            <TypingIndicator />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  contentContainer: {
    paddingVertical: Spacing.md,
    flexGrow: 1,
  },
  typingContainer: {
    marginVertical: Spacing.xs,
  },
});