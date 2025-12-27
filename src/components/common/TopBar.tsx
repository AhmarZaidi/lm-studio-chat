/**
 * src/components/common/TopBar.tsx
 * Top navigation bar for chat screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/src/hooks/useApp';
import { useChat } from '@/src/hooks/useChat';
import { useHaptics } from '@/src/hooks/useHaptics';
import { shareChat, shareMessages } from '@/src/utils/share';
import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
  Shadow,
} from '@/src/constants/theme';

export function TopBar() {
  const { toggleLeftPanel } = useApp();
  const { activeChat } = useChat();
  const haptics = useHaptics();

  /**
   * Handle menu button press
   */
  const handleMenuPress = () => {
    haptics.light();
    toggleLeftPanel();
  };

  /**
   * Handle share button press
   */
  const handleSharePress = async () => {
    haptics.light();

    if (!activeChat) return;

    if (activeChat.messages?.length > 0) {
      await shareMessages(activeChat.messages, activeChat.title);
      return;
    }

    await shareChat(activeChat);
  };

  /**
   * Get title based on active chat
   */
  const getTitle = () => {
    if (activeChat?.title && activeChat.title !== 'New Chat') {
      return activeChat.title;
    }
    return 'LM Studio Chat';
  };

  const canShare = activeChat && activeChat.messages.length > 0;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Left: Menu Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleMenuPress}
          activeOpacity={0.7}
        >
          <Ionicons name="menu-outline" size={28} color={Colors.dark.text} />
        </TouchableOpacity>

        {/* Center: Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {getTitle()}
          </Text>
        </View>

        {/* Right: Share Button */}
        <TouchableOpacity
          style={[styles.iconButton, !canShare && styles.iconButtonDisabled]}
          onPress={handleSharePress}
          activeOpacity={0.7}
          disabled={!canShare}
        >
          <Ionicons
            name="share-outline"
            size={24}
            color={canShare ? Colors.dark.text : Colors.dark.textTertiary}
          />
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.dark.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  iconButton: {
    padding: Spacing.sm,
    borderRadius: Spacing.md,
  },
  iconButtonDisabled: {
    opacity: 0.3,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.dark.text,
  },
});