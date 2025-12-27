/**
 * src/constants/content.ts
 * Static content and text used throughout the application
 */

// Setup Screen Content
export const SETUP_CONTENT = {
  TITLE: 'LM Studio Connection',
  SUBTITLE: 'Connect to your local LM Studio server',
  ENDPOINT_LABEL: 'Server Endpoint',
  ENDPOINT_PLACEHOLDER: 'http://192.168.56.1:1234',
  TEST_BUTTON: 'Connect',
  CONNECTING: 'Connecting...',
  
  INSTRUCTIONS_TITLE: 'Setup Instructions',
  INSTRUCTIONS: [
    {
      step: 1,
      title: 'Install LM Studio',
      description: 'Download and install LM Studio on your computer from lmstudio.ai',
    },
    {
      step: 2,
      title: 'Start the Local Server',
      description: 'Open LM Studio, go to the Developer tab, and click "Start Server"',
    },
    {
      step: 3,
      title: 'Enable Network Access',
      description: 'Check "Serve on Local Network" and note the IP address displayed',
    },
    {
      step: 4,
      title: 'Load a Model',
      description: 'Make sure you have a model loaded in LM Studio before connecting',
    },
    {
      step: 5,
      title: 'Connect',
      description: 'Enter the server address above and tap "Test Connection"',
    },
  ],
};

// Empty State Content
export const EMPTY_STATE_CONTENT = {
  CHAT_TITLE: 'Start a Conversation',
  CHAT_SUBTITLE: 'Type a message below to begin chatting with your local LM Studio model',
  NO_CHATS_TITLE: 'No Conversations Yet',
  NO_CHATS_SUBTITLE: 'Create a new chat to get started',
};

// Settings Screen Content
export const SETTINGS_CONTENT = {
  TITLE: 'Settings',
  PROFILE_SECTION: 'Profile',
  APPEARANCE_SECTION: 'Appearance',
  PREFERENCES_SECTION: 'Preferences',
  INFORMATION_SECTION: 'Information',
  
  USERNAME_LABEL: 'Username',
  USERNAME_PLACEHOLDER: 'Enter your name',
  THEME_LABEL: 'Theme',
  HAPTICS_LABEL: 'Haptic Feedback',
  
  THEME_OPTIONS: [
    { value: 'system', label: 'System' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ],
  
  FAQ_BUTTON: 'FAQ',
  DOCS_BUTTON: 'Documentation',
  ABOUT_BUTTON: 'About',
};

// FAQ Content
export const FAQ_CONTENT = {
  TITLE: 'Frequently Asked Questions',
  ITEMS: [
    {
      question: 'What is LM Studio?',
      answer: 'LM Studio is a desktop application that allows you to run large language models locally on your computer. It provides an OpenAI-compatible API that this app connects to.',
    },
    {
      question: 'Why can\'t I connect to the server?',
      answer: 'Make sure LM Studio is running on your computer, the server is started, and "Serve on Local Network" is enabled. Also verify that your mobile device is on the same network.',
    },
    {
      question: 'Where is my chat history stored?',
      answer: 'All chat history is stored locally on your device using secure storage. Nothing is sent to external servers.',
    },
    {
      question: 'Can I use multiple models?',
      answer: 'Yes! You can switch between any models you have loaded in LM Studio. Just make sure the model is loaded before starting a chat.',
    },
    {
      question: 'Is my data private?',
      answer: 'Absolutely. All conversations happen between your mobile device and your local computer. No data leaves your network.',
    },
    {
      question: 'What happens if I lose connection?',
      answer: 'If the connection is lost during a conversation, you\'ll see an error message. Your chat history is preserved, and you can reconnect when the server is available.',
    },
  ],
};

// Documentation Content
export const DOCS_CONTENT = {
  TITLE: 'Documentation',
  SECTIONS: [
    {
      title: 'Getting Started',
      content: 'This app connects to a local LM Studio server running on your network. You need to have LM Studio installed on a computer and the server feature enabled.',
    },
    {
      title: 'Setting Up LM Studio',
      content: 'Download LM Studio from lmstudio.ai, install it on your computer, download a model, and start the local server from the Developer tab.',
    },
    {
      title: 'Network Configuration',
      content: 'Your mobile device and computer must be on the same network. Enable "Serve on Local Network" in LM Studio and use the displayed IP address.',
    },
    {
      title: 'Using the Chat',
      content: 'Type your message in the input box at the bottom. Messages are sent to the model and responses stream back in real-time. Long press any message to copy it.',
    },
    {
      title: 'Managing Chats',
      content: 'Open the left panel to see all your conversations. You can create new chats, switch between them, and search through your history.',
    },
    {
      title: 'Settings',
      content: 'Customize your experience through the settings menu. You can change themes, enable haptics, and update your profile information.',
    },
  ],
};

// About Content
export const ABOUT_CONTENT = {
  TITLE: 'About',
  APP_NAME: 'LM Studio Chat',
  VERSION: '1.0.0',
  DESCRIPTION: 'A modern React Native mobile client for chatting with locally hosted LM Studio models. All conversations stay on your device, ensuring complete privacy and control over your data.',
  
  DEVELOPER_SECTION: 'Developer',
  DEVELOPER_NAME: 'Ahmar Zaidi',
  DEVELOPER_BIO: 'Software engineer passionate about AI, mobile development, and privacy-focused applications.',
  
  LINKS_SECTION: 'Connect',
  LINKS: [
    { label: 'GitHub', url: 'https://github.com/AhmarZaidi' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/ahmarzaidi' },
    { label: 'Stack Overflow', url: 'https://stackoverflow.com/users/ahmarzaidi' },
  ],
  
  CREDITS_SECTION: 'Credits',
  CREDITS: [
    'LM Studio by lmstudio.ai',
    'Built with React Native and Expo',
    'Icons by Ionicons',
  ],
};

// Error Messages
export const ERROR_MESSAGES = {
  CONNECTION_FAILED: 'Failed to connect to LM Studio server',
  CONNECTION_TIMEOUT: 'Connection timeout. Please check your server.',
  INVALID_ENDPOINT: 'Invalid server endpoint URL',
  NO_MODELS_AVAILABLE: 'No models available. Please load a model in LM Studio.',
  SEND_MESSAGE_FAILED: 'Failed to send message. Please try again.',
  STREAM_ERROR: 'Error streaming response from server',
  STORAGE_ERROR: 'Failed to save data locally',
  LOAD_ERROR: 'Failed to load data',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CONNECTION_SUCCESS: 'Connected to LM Studio successfully',
  SETTINGS_SAVED: 'Settings saved',
  PROFILE_UPDATED: 'Profile updated',
  CHAT_DELETED: 'Chat deleted',
  MESSAGE_COPIED: 'Message copied to clipboard',
  CHAT_EXPORTED: 'Chat exported successfully',
};

// Warning Messages
export const WARNING_MESSAGES = {
  NO_MODEL_SELECTED: 'No model selected. Using default model.',
  LONG_MESSAGE: 'Message is very long and may take time to process',
  SERVER_SLOW: 'Server is responding slowly',
};

// Button Labels
export const BUTTON_LABELS = {
  SEND: 'Send',
  CANCEL: 'Cancel',
  SAVE: 'Save',
  DELETE: 'Delete',
  EDIT: 'Edit',
  COPY: 'Copy',
  SHARE: 'Share',
  NEW_CHAT: 'New Chat',
  CLEAR_CHAT: 'Clear Chat',
  RETRY: 'Retry',
  OK: 'OK',
  CLOSE: 'Close',
};