/**
 * Theme Constants
 * Modern, friendly, and inviting design system
 * Based on the blueprint's specifications for a "perfect and modern" UI
 */

export const Colors = {
  // Primary palette - light and clean, promoting focus
  primary: '#B15653', // Spicy Red - for key buttons and CTAs
  primaryLight: '#D17875',
  primaryDark: '#8A3D3B',

  // Background colors (Light Mode)
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  backgroundTertiary: '#E9ECEF',

  // Background colors (Dark Mode)
  backgroundDark: '#1a1a1a',
  backgroundDarkSecondary: '#2a2a2a',
  backgroundDarkTertiary: '#3a3a3a',

  // Chess board colors
  boardLight: '#F0D9B5',
  boardDark: '#B58863',

  // Semantic colors
  success: '#4CAF50',
  successLight: '#4caf5020', // 20% opacity
  error: '#F44336',
  errorLight: '#f4433620', // 20% opacity
  warning: '#FF9800',
  warningLight: '#ff990020', // 20% opacity
  info: '#2196F3',

  // Accent colors
  accent: '#4a9eff',
  accentRed: '#ff6b6b',

  // Text colors
  text: '#212529',
  textSecondary: '#6C757D',
  textLight: '#ADB5BD',
  textInverse: '#FFFFFF',
  textGray: '#999999',
  textGrayLight: '#b3b3b3',

  // UI elements
  border: '#DEE2E6',
  disabled: '#CED4DA',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
  overlayDarker: 'rgba(0, 0, 0, 0.8)',
  overlayLight: 'rgba(0, 0, 0, 0.1)',
  overlaySubtle: 'rgba(0, 0, 0, 0.2)',
  overlayMedium: 'rgba(0, 0, 0, 0.3)',

  // White overlays for dark backgrounds
  whiteOverlay: 'rgba(255, 255, 255, 0.1)',
  whiteOverlayMedium: 'rgba(255, 255, 255, 0.2)',
  whiteOverlayStrong: 'rgba(255, 255, 255, 0.3)',

  // Special colors
  transparent: 'transparent' as const,
  black: '#000',
  white: '#ffffff',

  // Gamification colors
  streak: '#FF6B35', // Flame color
  streakAlt: '#FFA500', // Orange
  milestone: '#FFD700', // Gold for achievements
  gold: '#FFD700', // Alias for milestone
  xp: '#9C27B0', // Purple for XP
};

export const Typography = {
  // Font family - DM Sans (modern sans-serif)
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Text style presets
  h1: {
    fontSize: 36,
    fontWeight: '700' as const,
    lineHeight: 1.25,
  },
  h2: {
    fontSize: 30,
    fontWeight: '700' as const,
    lineHeight: 1.25,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 1.3,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 1.5,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 1.4,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const Animations = {
  // Duration in milliseconds
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },

  // Easing functions (for react-native-reanimated)
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

/**
 * Board themes for user customization
 */
export const BoardThemes = {
  modern: {
    name: 'Modern',
    light: '#F0D9B5',
    dark: '#B58863',
  },
  wood: {
    name: 'Wood',
    light: '#D4A574',
    dark: '#8B5A3C',
  },
  neo: {
    name: 'Neo',
    light: '#E8EDF9',
    dark: '#7B8FA3',
  },
  green: {
    name: 'Classic Green',
    light: '#FFFFDD',
    dark: '#769656',
  },
  blue: {
    name: 'Ocean Blue',
    light: '#DEE3E6',
    dark: '#8CA2AD',
  },
};

export type BoardThemeName = keyof typeof BoardThemes;

/**
 * Piece themes
 */
export const PieceThemes = {
  modern: 'modern',
  classic: 'classic',
  neo: 'neo',
} as const;

export type PieceThemeName = keyof typeof PieceThemes;

/**
 * Digital Coach personalities
 */
export const CoachPersonalities = {
  friendly: {
    name: 'The Friendly Coach',
    tone: 'encouraging',
    unlocked: true,
  },
  attacker: {
    name: 'The Attacker',
    tone: 'aggressive',
    unlocked: false,
  },
  positional: {
    name: 'The Positional Master',
    tone: 'strategic',
    unlocked: false,
  },
  tactical: {
    name: 'The Tactician',
    tone: 'sharp',
    unlocked: false,
  },
};

export type CoachPersonalityName = keyof typeof CoachPersonalities;
