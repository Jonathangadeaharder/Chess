/**
 * Validation Utilities
 * Functions for move validation and board state checks
 */

import type { Square } from '../../../../types';
import type { PieceSymbol } from '../types';

/**
 * Check if a square notation is valid (a1-h8)
 */
export const isValidSquare = (square: string): square is Square => {
  if (square.length !== 2) return false;
  const file = square[0];
  const rank = square[1];
  return file >= 'a' && file <= 'h' && rank >= '1' && rank <= '8';
};

/**
 * Check if a move is a pawn promotion
 */
export const isPromotion = (from: Square, to: Square, piece: PieceSymbol): boolean => {
  if (piece.toLowerCase() !== 'p') return false;
  const toRank = to[1];
  return toRank === '1' || toRank === '8';
};

/**
 * Check if two squares are the same
 */
export const isSameSquare = (square1: Square | null, square2: Square | null): boolean => {
  return square1 === square2;
};

/**
 * Get distance between two squares (in squares)
 */
export const getSquareDistance = (from: Square, to: Square): number => {
  const fileFrom = from.charCodeAt(0) - 97;
  const rankFrom = parseInt(from[1]) - 1;
  const fileTo = to.charCodeAt(0) - 97;
  const rankTo = parseInt(to[1]) - 1;

  return Math.max(Math.abs(fileFrom - fileTo), Math.abs(rankFrom - rankTo));
};

/**
 * Check if a move is a capture (has piece on destination square)
 */
export const isCapture = (
  to: Square,
  piecePositions: { [square: string]: PieceSymbol }
): boolean => {
  return !!piecePositions[to];
};
