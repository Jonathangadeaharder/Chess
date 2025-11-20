/**
 * Chessboard Types
 * All TypeScript interfaces and types for the chessboard component
 */

import type { Square as SquareType } from '../../../types';

// Re-export Square for convenience
export type Square = SquareType;
export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';

// ============================================================================
// HIGHLIGHT TYPES
// ============================================================================

export type HighlightType = 'selected' | 'legal-move' | 'last-move' | 'check' | 'mate' | 'custom';

export interface Highlight {
  square: Square;
  type: HighlightType;
  color?: string;
}

// ============================================================================
// ARROW TYPES
// ============================================================================

export interface Arrow {
  from: Square;
  to: Square;
  color?: string;
}

// ============================================================================
// PIECE TYPES
// ============================================================================

export type PieceSymbol = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P' | 'k' | 'q' | 'r' | 'b' | 'n' | 'p';

export type PieceColor = 'w' | 'b';

export interface PieceInfo {
  square: Square;
  piece: PieceSymbol;
  color: PieceColor;
}

// ============================================================================
// BOARD CONFIGURATION
// ============================================================================

export type InteractionMode = 'drag-drop' | 'tap-tap' | 'both';

export type BoardOrientation = 'white' | 'black';

export interface BoardTheme {
  light: string;
  dark: string;
}

export interface ChessboardConfig {
  size: number;
  orientation: BoardOrientation;
  theme: BoardTheme;
  animationDuration: number;
  showCoordinates: boolean;
  enableHaptics: boolean;
  enableSound: boolean;
  interactionMode: InteractionMode;
  draggable: boolean;
  arePremovesAllowed: boolean;
}

// ============================================================================
// BOARD STATE
// ============================================================================

export interface BoardState {
  position: string; // FEN
  selectedSquare: Square | null;
  draggedSquare: Square | null;
  highlightedSquares: Highlight[];
  arrows: Arrow[];
  legalMoves: Square[];
  lastMove: { from: Square; to: Square } | null;
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

export interface ChessboardEventHandlers {
  onMove?: (from: Square, to: Square) => void;
  onPieceDragBegin?: (piece: PieceSymbol, square: Square) => void;
  onPieceDragEnd?: () => void;
  onPieceDrop?: (from: Square, to: Square, piece: PieceSymbol) => boolean;
  onSquareClick?: (square: Square) => void;
  onSquareRightClick?: (square: Square) => void;
  onDragOverSquare?: (square: Square) => void;
  onPromotionCheck?: (from: Square, to: Square, piece: PieceSymbol) => boolean;
  onPromotionPieceSelect?: (piece?: PieceSymbol) => boolean;
}

// ============================================================================
// CHESSBOARD PROPS
// ============================================================================

export interface ChessboardProps extends Partial<ChessboardConfig>, ChessboardEventHandlers {
  // Position
  position?: string; // FEN string
  initialPosition?: string;

  // Visual
  arrows?: Arrow[];
  highlights?: Highlight[];
  customSquareStyles?: { [square: string]: React.CSSProperties };
  customArrowColor?: string;
  customPieces?: { [piece: string]: React.ReactNode };

  // Deprecated/compatibility props
  isFlipped?: boolean; // Maps to orientation
  boardTheme?: string; // Maps to theme
}

// ============================================================================
// IMPERATIVE API (REF)
// ============================================================================

export interface ChessboardRef {
  // Movement
  move: (from: Square, to: Square, promotion?: string) => boolean;
  undo: () => void;

  // Visual feedback
  highlight: (squares: Square[], color?: string) => void;
  clearHighlights: () => void;
  resetAllHighlightedSquares: () => void;

  // Arrows
  addArrow: (arrow: Arrow) => void;
  removeArrow: (from: Square, to: Square) => void;
  clearArrows: () => void;

  // State
  getState: () => BoardState;
  resetBoard: (fen?: string) => void;
  flip: () => void;

  // Programmatic interaction
  selectSquare: (square: Square | null) => void;
}

// ============================================================================
// INTERNAL COMPONENT PROPS
// ============================================================================

export interface PieceProps {
  square: Square;
  piece: PieceSymbol;
  size: number;
}

export interface ChessboardBackgroundProps {
  size: number;
  theme: BoardTheme;
  orientation: BoardOrientation;
  showCoordinates: boolean;
}
