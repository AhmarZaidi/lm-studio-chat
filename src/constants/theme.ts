/**
 * src/constants/theme.ts
 * Theme constants matching LM Studio's visual design
 */

export const Colors = {
  light: {
    // Primary colors
    primary: '#2563EB',
    primaryLight: '#DBEAFE',
    
    // Background colors
    background: '#FFFFFF',
    surface: '#F9FAFB',
    surfaceSecondary: '#F3F4F6',
    overlay: 'rgba(0, 0, 0, 0.5)',
    
    // Text colors
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',
    
    // Message bubble colors
    userMessageBg: '#2563EB',
    userMessageText: '#FFFFFF',
    assistantMessageBg: '#F3F4F6',
    assistantMessageText: '#111827',
    
    // Status colors
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
    
    // Border colors
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    
    // Input colors
    inputBackground: '#FFFFFF',
    inputBorder: '#D1D5DB',
    inputFocusBorder: '#2563EB',
    
    // Panel colors
    panelBackground: '#FFFFFF',
    panelBorder: '#E5E7EB',
    
    // Icon colors
    icon: '#6B7280',
    iconActive: '#2563EB',
    
    // Legacy support
    tint: '#2563EB',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#2563EB',
  },
  dark: {
    // Primary colors
    primary: '#3B82F6',
    primaryLight: '#1E3A5F',
    
    // Background colors - matching LM Studio dark theme
    background: '#0D0D0D',
    surface: '#1A1A1A',
    surfaceSecondary: '#262626',
    overlay: 'rgba(0, 0, 0, 0.75)',
    
    // Text colors
    text: '#FFFFFF',
    textSecondary: '#A3A3A3',
    textTertiary: '#737373',
    textInverse: '#0D0D0D',
    
    // Message bubble colors
    userMessageBg: '#3B82F6',
    userMessageText: '#FFFFFF',
    assistantMessageBg: '#262626',
    assistantMessageText: '#FFFFFF',
    
    // Status colors
    success: '#10B981',
    successLight: '#064E3B',
    warning: '#F59E0B',
    warningLight: '#78350F',
    error: '#EF4444',
    errorLight: '#7F1D1D',
    info: '#3B82F6',
    infoLight: '#1E3A5F',
    
    // Border colors
    border: '#404040',
    borderLight: '#262626',
    
    // Input colors
    inputBackground: '#1A1A1A',
    inputBorder: '#404040',
    inputFocusBorder: '#3B82F6',
    
    // Panel colors
    panelBackground: '#1A1A1A',
    panelBorder: '#404040',
    
    // Icon colors
    icon: '#A3A3A3',
    iconActive: '#3B82F6',
    
    // Legacy support
    tint: '#3B82F6',
    tabIconDefault: '#737373',
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
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Animation timings
export const Animation = {
  fast: 150,
  normal: 250,
  slow: 350,
};

// Layout dimensions
export const Layout = {
  sidePanelWidth: 280,
  maxMessageWidth: 600,
  inputMinHeight: 44,
  inputMaxHeight: 120,
};