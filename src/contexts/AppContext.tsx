/**
 * src/contexts/AppContext.tsx
 * Global app state management context
 */

import React, { createContext, useState, ReactNode } from 'react';

type AppScreen = 'chat' | 'settings' | 'faq' | 'docs' | 'about' | 'setup';

interface AppContextType {
  isLeftPanelOpen: boolean;
  currentScreen: AppScreen;
  isSetupComplete: boolean;
  toggleLeftPanel: () => void;
  openLeftPanel: () => void;
  closeLeftPanel: () => void;
  navigateTo: (screen: AppScreen) => void;
  setSetupComplete: (complete: boolean) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('chat');
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  /**
   * Toggle left panel open/closed
   */
  const toggleLeftPanel = () => {
    setIsLeftPanelOpen((prev) => !prev);
  };

  /**
   * Open left panel
   */
  const openLeftPanel = () => {
    setIsLeftPanelOpen(true);
  };

  /**
   * Close left panel
   */
  const closeLeftPanel = () => {
    setIsLeftPanelOpen(false);
  };

  /**
   * Navigate to a different screen
   */
  const navigateTo = (screen: AppScreen) => {
    setCurrentScreen(screen);
    // Close left panel when navigating
    if (isLeftPanelOpen) {
      setIsLeftPanelOpen(false);
    }
  };

  /**
   * Mark setup as complete or incomplete
   */
  const setSetupComplete = (complete: boolean) => {
    setIsSetupComplete(complete);
    if (complete) {
      setCurrentScreen('chat');
    } else {
      setCurrentScreen('setup');
    }
  };

  const value: AppContextType = {
    isLeftPanelOpen,
    currentScreen,
    isSetupComplete,
    toggleLeftPanel,
    openLeftPanel,
    closeLeftPanel,
    navigateTo,
    setSetupComplete,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}