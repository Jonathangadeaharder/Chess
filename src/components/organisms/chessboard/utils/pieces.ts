/**
 * Piece Utilities
 * Functions for piece symbols, names, and colors
 */

import type { PieceSymbol, PieceColor } from '../types';
import type { Square } from '../../../../types';

/**
 * Get Unicode symbol for a piece
 */
export const getPieceSymbol = (piece: PieceSymbol): string => {
  const symbols: { [key in PieceSymbol]: string } = {
    K: '♔',
    Q: '♕',
    R: '♖',
    B: '♗',
    N: '♘',
    P: '♙',
    k: '♚',
    q: '♛',
    r: '♜',
    b: '♝',
    n: '♞',
    p: '♟',
  };
  return symbols[piece] || '';
};

/**
 * Get human-readable name for a piece
 */
export const getPieceName = (piece: PieceSymbol): string => {
  const names: { [key in PieceSymbol]: string } = {
    K: 'White King',
    Q: 'White Queen',
    R: 'White Rook',
    B: 'White Bishop',
    N: 'White Knight',
    P: 'White Pawn',
    k: 'Black King',
    q: 'Black Queen',
    r: 'Black Rook',
    b: 'Black Bishop',
    n: 'Black Knight',
    p: 'Black Pawn',
  };
  return names[piece] || '';
};

/**
 * Get piece color from symbol
 */
export const getPieceColor = (piece: PieceSymbol): PieceColor => {
  return piece === piece.toUpperCase() ? 'w' : 'b';
};

/**
 * Check if piece is white
 */
export const isWhitePiece = (piece: PieceSymbol): boolean => {
  return piece === piece.toUpperCase();
};

/**
 * Check if piece is black
 */
export const isBlackPiece = (piece: PieceSymbol): boolean => {
  return piece === piece.toLowerCase();
};

/**
 * Parse FEN string to get piece positions
 */
export const parseFENPosition = (fen: string): { [square: string]: PieceSymbol } => {
  const positions: { [square: string]: PieceSymbol } = {};
  const fenParts = fen.split(' ');
  const ranks = fenParts[0].split('/');

  ranks.forEach((rank, rankIndex) => {
    let fileIndex = 0;
    for (let char of rank) {
      if (isNaN(parseInt(char))) {
        // It's a piece
        const file = String.fromCharCode(97 + fileIndex);
        const rankNum = 8 - rankIndex;
        const square = `${file}${rankNum}` as Square;
        positions[square] = char as PieceSymbol;
        fileIndex++;
      } else {
        // It's a number (empty squares)
        fileIndex += parseInt(char);
      }
    }
  });

  return positions;
};

/**
 * Get accessibility label for a square with a piece
 */
export const getSquareAccessibilityLabel = (square: Square, piece?: PieceSymbol): string => {
  if (piece) {
    return `${getPieceName(piece)} on ${square}`;
  }
  return `Empty square ${square}`;
};

/**
 * Get accessibility hint for a square
 */
export const getSquareAccessibilityHint = (
  square: Square,
  piece: PieceSymbol | undefined,
  isSelected: boolean,
  legalMovesCount: number,
  selectedSquare: Square | null
): string => {
  if (isSelected) {
    if (legalMovesCount > 0) {
      return `Selected. ${legalMovesCount} legal ${legalMovesCount === 1 ? 'move' : 'moves'} available. Double tap a destination square to move.`;
    }
    return 'Selected. No legal moves available. Double tap to deselect.';
  }

  if (piece) {
    return 'Double tap to select this piece and see legal moves';
  }

  if (selectedSquare) {
    return 'Double tap to move selected piece here';
  }

  return 'Empty square';
};
