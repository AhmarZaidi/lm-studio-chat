/**
 * src/components/screens/SetupScreen.tsx
 * Initial setup screen for connecting to LM Studio
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useConnection } from '@/src/hooks/useConnection';
import { useSettings } from '@/src/hooks/useSettings';
import { useApp } from '@/src/hooks/useApp';
import { useHaptics } from '@/src/hooks/useHaptics';
import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
  BorderRadius,
  Shadow,
} from '@/src/constants/theme';
import { SETUP_CONTENT } from '@/src/constants/content';
import { isValidEndpoint } from '@/src/utils/validation';

export function SetupScreen() {
  const { testConnection, isChecking } = useConnection();
  const { settings, updateEndpoint } = useSettings();
  const { setSetupComplete } = useApp();
  const haptics = useHaptics();

  // Initialize with saved endpoint or default
  const [endpointInput, setEndpointInput] = useState(settings.serverEndpoint);
  const [validationError, setValidationError] = useState<string | null>(null);

  /**
   * Update input when settings load
   */
  useEffect(() => {
    if (settings.serverEndpoint) {
      setEndpointInput(settings.serverEndpoint);
    }
  }, [settings.serverEndpoint]);

  /**
   * Handle test connection button press
   */
  const handleTestConnection = async () => {
    haptics.light();
    setValidationError(null);

    // Validate endpoint
    const validation = isValidEndpoint(endpointInput.trim());
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid endpoint');
      haptics.error();
      return;
    }

    const trimmedEndpoint = endpointInput.trim();

    // Save endpoint to settings
    await updateEndpoint(trimmedEndpoint);

    // Test connection
    const success = await testConnection(trimmedEndpoint, false);

    if (success) {
      haptics.success();
      setSetupComplete(true);
    } else {
      haptics.error();
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="server-outline"
          size={64}
          color={Colors.dark.primary}
          style={styles.headerIcon}
        />
        <Text style={styles.title}>{SETUP_CONTENT.TITLE}</Text>
        <Text style={styles.subtitle}>{SETUP_CONTENT.SUBTITLE}</Text>
      </View>

      {/* Endpoint Input */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>{SETUP_CONTENT.ENDPOINT_LABEL}</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="link-outline"
            size={20}
            color={Colors.dark.textSecondary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={endpointInput}
            onChangeText={(text) => {
              setEndpointInput(text);
              setValidationError(null);
            }}
            placeholder={SETUP_CONTENT.ENDPOINT_PLACEHOLDER}
            placeholderTextColor={Colors.dark.textTertiary}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            editable={!isChecking}
          />
        </View>
        {validationError && (
          <Text style={styles.errorText}>{validationError}</Text>
        )}
      </View>

      {/* Test Connection Button */}
      <TouchableOpacity
        style={[
          styles.testButton,
          isChecking && styles.testButtonDisabled,
        ]}
        onPress={handleTestConnection}
        disabled={isChecking}
        activeOpacity={0.7}
      >
        {isChecking ? (
          <>
            <ActivityIndicator
              color={Colors.dark.text}
              style={styles.buttonLoader}
            />
            <Text style={styles.testButtonText}>
              {SETUP_CONTENT.CONNECTING}
            </Text>
          </>
        ) : (
          <>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color={Colors.dark.text}
              style={styles.buttonIcon}
            />
            <Text style={styles.testButtonText}>
              {SETUP_CONTENT.TEST_BUTTON}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Instructions */}
      <View style={styles.instructionsSection}>
        <Text style={styles.instructionsTitle}>
          {SETUP_CONTENT.INSTRUCTIONS_TITLE}
        </Text>

        {SETUP_CONTENT.INSTRUCTIONS.map((instruction) => (
          <View key={instruction.step} style={styles.instructionItem}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>{instruction.step}</Text>
            </View>
            <View style={styles.instructionContent}>
              <Text style={styles.instructionTitle}>{instruction.title}</Text>
              <Text style={styles.instructionDescription}>
                {instruction.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Footer Tips */}
      <View style={styles.tipsSection}>
        <View style={styles.tipItem}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={Colors.dark.info}
          />
          <Text style={styles.tipText}>
            Make sure your device and computer are on the same network
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color={Colors.dark.success}
          />
          <Text style={styles.tipText}>
            All data stays local - nothing is sent to external servers
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  contentContainer: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxxl * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  headerIcon: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: Spacing.xl,
  },
  inputLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    paddingHorizontal: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: FontSize.md,
    color: Colors.dark.text,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.dark.error,
    marginTop: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xxxl,
    ...Shadow.md,
  },
  testButtonDisabled: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: Spacing.sm,
  },
  buttonLoader: {
    marginRight: Spacing.sm,
  },
  testButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.dark.text,
  },
  instructionsSection: {
    marginBottom: Spacing.xxxl,
  },
  instructionsTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.dark.text,
    marginBottom: Spacing.lg,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  stepNumber: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.dark.text,
  },
  instructionContent: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.dark.text,
    marginBottom: Spacing.xs,
  },
  instructionDescription: {
    fontSize: FontSize.sm,
    color: Colors.dark.textSecondary,
    lineHeight: FontSize.sm * 1.5,
  },
  tipsSection: {
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  tipText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.dark.textSecondary,
    marginLeft: Spacing.sm,
    lineHeight: FontSize.sm * 1.5,
  },
});