/**
 * src/components/chat/EmptyChat.tsx
 * Empty state view for chat screen
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
} from '@/src/constants/theme';
import { EMPTY_STATE_CONTENT } from '@/src/constants/content';

export function EmptyChat() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name="chatbubbles-outline"
          size={80}
          color={Colors.dark.textTertiary}
        />
      </View>
      
      <Text style={styles.title}>
        {EMPTY_STATE_CONTENT.CHAT_TITLE}
      </Text>
      
      <Text style={styles.subtitle}>
        {EMPTY_STATE_CONTENT.CHAT_SUBTITLE}
      </Text>
      
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color={Colors.dark.success}
            style={styles.featureIcon}
          />
          <Text style={styles.featureText}>
            All conversations are private and local
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Ionicons
            name="flash-outline"
            size={20}
            color={Colors.dark.warning}
            style={styles.featureIcon}
          />
          <Text style={styles.featureText}>
            Real-time streaming responses
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Ionicons
            name="save-outline"
            size={20}
            color={Colors.dark.info}
            style={styles.featureIcon}
          />
          <Text style={styles.featureText}>
            Chat history saved automatically
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
    opacity: 0.5,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.md * 1.5,
    marginBottom: Spacing.xxxl,
  },
  featuresContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  featureIcon: {
    marginRight: Spacing.md,
  },
  featureText: {
    fontSize: FontSize.sm,
    color: Colors.dark.textSecondary,
    lineHeight: FontSize.sm * 1.5,
  },
});