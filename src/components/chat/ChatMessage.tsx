/**
 * src/components/chat/ChatMessage.tsx
 * Individual chat message bubble component
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { Message } from '@/src/types';
import { useHaptics } from '@/src/hooks';
import { copyToClipboard } from '@/src/utils/clipboard';
import { formatTime } from '@/src/utils/helpers';
import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
  BorderRadius,
  Shadow,
} from '@/src/constants/theme';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const haptics = useHaptics();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isUser = message.role === 'user';
  const isStreaming = message.isStreaming;

  /**
   * Handle long press to copy message
   */
  const handleLongPress = async () => {
    haptics.medium();
    
    // Animate press feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    await copyToClipboard(message.content);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Pressable
        onLongPress={handleLongPress}
        delayLongPress={500}
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <Text
          style={[
            styles.content,
            isUser ? styles.userContent : styles.assistantContent,
          ]}
        >
          {message.content}
        </Text>
        
        <View style={styles.footer}>
          <Text
            style={[
              styles.timestamp,
              isUser ? styles.userTimestamp : styles.assistantTimestamp,
            ]}
          >
            {formatTime(message.timestamp)}
          </Text>
          
          {isStreaming && (
            <View style={styles.streamingIndicator}>
              <View style={styles.streamingDot} />
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
  },
  userBubble: {
    backgroundColor: Colors.dark.userMessageBg,
    borderBottomRightRadius: Spacing.xs,
  },
  assistantBubble: {
    backgroundColor: Colors.dark.assistantMessageBg,
    borderBottomLeftRadius: Spacing.xs,
  },
  content: {
    fontSize: FontSize.md,
    lineHeight: FontSize.md * 1.5,
  },
  userContent: {
    color: Colors.dark.userMessageText,
  },
  assistantContent: {
    color: Colors.dark.assistantMessageText,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  timestamp: {
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },
  userTimestamp: {
    color: Colors.dark.userMessageText,
    opacity: 0.7,
  },
  assistantTimestamp: {
    color: Colors.dark.textTertiary,
  },
  streamingIndicator: {
    marginLeft: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  streamingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.dark.success,
  },
});