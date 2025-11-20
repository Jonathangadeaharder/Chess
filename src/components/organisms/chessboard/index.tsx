/**
 * Chessboard Organism - Public API
 * Exports main component and public types
 * Pattern: react-chessboard + react-native-chessboard
 */

// Main component
export { default } from './Chessboard';
export { default as Chessboard } from './Chessboard';

// Public types
export type {
  // Core types
  Square,
  PieceSymbol,
  PieceType,
  PieceColor,

  // Configuration
  BoardOrientation,
  BoardTheme,
  InteractionMode,
  ChessboardProps,
  ChessboardConfig,

  // State
  BoardState,

  // Visual feedback
  Highlight,
  HighlightType,
  Arrow,

  // Imperative API
  ChessboardRef,
} from './types';
