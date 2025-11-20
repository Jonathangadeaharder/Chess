/**
 * Chessboard Props Context
 * Provides immutable configuration (colors, animation settings, etc.) to all child components
 * Pattern from react-native-chessboard
 */

import React, { createContext, useContext, useMemo } from 'react';
import { Colors } from '../../../../constants/theme';
import type { ChessboardConfig, BoardOrientation, BoardTheme, InteractionMode } from '../types';

// ============================================================================
// CONTEXT
// ============================================================================

const ChessboardPropsContext = createContext<ChessboardConfig | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

interface ChessboardPropsProviderProps {
  children: React.ReactNode;
  size: number;
  orientation?: BoardOrientation;
  theme?: BoardTheme;
  animationDuration?: number;
  showCoordinates?: boolean;
  enableHaptics?: boolean;
  enableSound?: boolean;
  interactionMode?: InteractionMode;
  draggable?: boolean;
  arePremovesAllowed?: boolean;
}

export const ChessboardPropsProvider: React.FC<ChessboardPropsProviderProps> = ({
  children,
  size,
  orientation = 'white',
  theme = { light: Colors.boardLight, dark: Colors.boardDark },
  animationDuration = 200,
  showCoordinates = true,
  enableHaptics = true,
  enableSound = true,
  interactionMode = 'both',
  draggable = true,
  arePremovesAllowed = false,
}) => {
  const config = useMemo<ChessboardConfig>(
    () => ({
      size,
      orientation,
      theme,
      animationDuration,
      showCoordinates,
      enableHaptics,
      enableSound,
      interactionMode,
      draggable,
      arePremovesAllowed,
    }),
    [
      size,
      orientation,
      theme,
      animationDuration,
      showCoordinates,
      enableHaptics,
      enableSound,
      interactionMode,
      draggable,
      arePremovesAllowed,
    ]
  );

  return <ChessboardPropsContext.Provider value={config}>{children}</ChessboardPropsContext.Provider>;
};

// ============================================================================
// HOOK
// ============================================================================

export const useChessboardProps = (): ChessboardConfig => {
  const context = useContext(ChessboardPropsContext);
  if (!context) {
    throw new Error('useChessboardProps must be used within ChessboardPropsProvider');
  }
  return context;
};
