/**
 * Theme constants for consistent styling across the app.
 * Designed to be easily extensible for dark mode and custom themes.
 */

export const Colors = {
  light: {
    // Primary colors
    primary: '#007AFF',
    primaryLight: '#E5F2FF',
    
    // Background colors
    background: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F3F4',
    
    // Text colors
    text: '#1A1A1A',
    textSecondary: '#666666',
    textTertiary: '#999999',
    
    // Status colors
    success: '#34C759',
    successLight: '#E8F8EC',
    warning: '#FF9500',
    warningLight: '#FFF4E5',
    error: '#FF3B30',
    errorLight: '#FFEBEA',
    info: '#007AFF',
    infoLight: '#E5F2FF',
    
    // Border colors
    border: '#E5E5E5',
    borderLight: '#F0F0F0',
    
    // Platform specific
    youtube: '#FF0000',
    instagram: '#E4405F',
    
    // Legacy support
    tint: '#007AFF',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#007AFF',
  },
  dark: {
    primary: '#0A84FF',
    primaryLight: '#1C3A5E',
    background: '#000000',
    surface: '#1C1C1E',
    surfaceSecondary: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#ABABAB',
    textTertiary: '#666666',
    success: '#30D158',
    successLight: '#1A3D2A',
    warning: '#FF9F0A',
    warningLight: '#3D2E0A',
    error: '#FF453A',
    errorLight: '#3D1A18',
    info: '#0A84FF',
    infoLight: '#1C3A5E',
    border: '#38383A',
    borderLight: '#2C2C2E',
    youtube: '#FF0000',
    instagram: '#E4405F',
    tint: '#FFFFFF',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#FFFFFF',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  title: 34,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Status color mapping
export const StatusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: Colors.light.warningLight, text: Colors.light.warning },
  processing: { bg: Colors.light.infoLight, text: Colors.light.info },
  done: { bg: Colors.light.successLight, text: Colors.light.success },
  error: { bg: Colors.light.errorLight, text: Colors.light.error },
};