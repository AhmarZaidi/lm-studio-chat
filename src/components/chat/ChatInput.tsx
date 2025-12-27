/**
 * src/components/chat/ChatInput.tsx
 * Multiline chat input with send button
 */

import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHaptics } from '@/src/hooks/useHaptics';
import { isValidMessage } from '@/src/utils/validation';
import {
  Colors,
  Spacing,
  FontSize,
  BorderRadius,
  Shadow,
  Layout,
} from '@/src/constants/theme';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const BUTTON_SIZE = 40;

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(Layout.inputMinHeight);
  const inputRef = useRef<TextInput>(null);
  const haptics = useHaptics();

  /**
   * Handle send button press
   */
  const handleSend = () => {
    const trimmed = message.trim();

    if (!trimmed || disabled) {
      return;
    }

    const validation = isValidMessage(trimmed);
    if (!validation.valid) {
      return;
    }

    haptics.light();
    onSend(trimmed);
    setMessage('');
    setInputHeight(Layout.inputMinHeight);

    // Reset focus
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  /**
   * Handle content size change for auto-expanding input
   */
  const handleContentSizeChange = (event: any) => {
    const { contentSize } = event.nativeEvent;
    const newHeight = Math.min(
      Math.max(Layout.inputMinHeight, contentSize.height + Spacing.md * 2),
      Layout.inputMaxHeight
    );
    setInputHeight(newHeight);
  };

  /**
   * Handle plus button (placeholder for attachments)
   */
  const handlePlusPress = () => {
    haptics.light();
    // TODO: Implement attachments in future phase
  };

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Plus Button (Attachments - Inactive) */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.attachButton]}
              onPress={handlePlusPress}
              disabled
              activeOpacity={0.7}
            >
              <Ionicons
                name="add-circle-outline"
                size={BUTTON_SIZE}
                color={Colors.dark.textTertiary}
              />
            </TouchableOpacity>
          </View>

          {/* Text Input */}
          <View style={[styles.inputWrapper, { minHeight: inputHeight }]}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder={placeholder}
              placeholderTextColor={Colors.dark.textTertiary}
              multiline
              maxLength={10000}
              editable={!disabled}
              onContentSizeChange={handleContentSizeChange}
              blurOnSubmit={false}
            />
          </View>

          {/* Send Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.sendButton,
                canSend ? styles.sendButtonActive : styles.sendButtonInactive,
              ]}
              onPress={handleSend}
              disabled={!canSend}
              activeOpacity={0.7}
            >
              <Ionicons
                name="send"
                size={20}
                color={canSend ? Colors.dark.text : Colors.dark.textTertiary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.dark.surface,
    ...Shadow.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.dark.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: Layout.inputMinHeight,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachButton: {
    backgroundColor: 'transparent',
    opacity: 0.3,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? Spacing.md : Spacing.sm,
    marginHorizontal: Spacing.sm,
    justifyContent: 'center',
  },
  input: {
    fontSize: FontSize.md,
    color: Colors.dark.text,
    maxHeight: Layout.inputMaxHeight - Spacing.md * 4,
    minHeight: Platform.OS === 'ios' ? 20 : 22,
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'center',
  },
  sendButton: {
    // Specific send button styles handled by active/inactive states
  },
  sendButtonActive: {
    backgroundColor: Colors.dark.primary,
  },
  sendButtonInactive: {
    backgroundColor: Colors.dark.surfaceSecondary,
  },
});