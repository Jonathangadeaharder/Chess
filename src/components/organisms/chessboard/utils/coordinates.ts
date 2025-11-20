/**
 * Coordinate Utilities
 * Functions for converting between square notation (e.g., "e4") and pixel coordinates
 */

import type { Square } from '../../../../types';
import type { BoardOrientation } from '../types';

/**
 * Get square notation from pixel coordinates
 */
export const getSquareFromCoords = (
  x: number,
  y: number,
  squareSize: number,
  orientation: BoardOrientation = 'white'
): Square => {
  const file = Math.floor(x / squareSize);
  const rank = Math.floor(y / squareSize);

  const isFlipped = orientation === 'black';

  if (isFlipped) {
    const fileChar = String.fromCharCode(104 - file); // h-a
    const rankNum = rank + 1; // 1-8
    return `${fileChar}${rankNum}` as Square;
  } else {
    const fileChar = String.fromCharCode(97 + file); // a-h
    const rankNum = 8 - rank; // 8-1
    return `${fileChar}${rankNum}` as Square;
  }
};

/**
 * Get pixel coordinates from square notation
 */
export const getCoordsFromSquare = (
  square: Square,
  squareSize: number,
  orientation: BoardOrientation = 'white'
): { x: number; y: number } => {
  const file = square.charCodeAt(0) - 97; // a=0, h=7
  const rank = parseInt(square[1]) - 1; // 1=0, 8=7

  const isFlipped = orientation === 'black';

  if (isFlipped) {
    return {
      x: (7 - file) * squareSize,
      y: (8 - rank - 1) * squareSize,
    };
  } else {
    return {
      x: file * squareSize,
      y: (7 - rank) * squareSize,
    };
  }
};

/**
 * Check if coordinates are within board bounds
 */
export const isWithinBounds = (x: number, y: number, boardSize: number): boolean => {
  return x >= 0 && x < boardSize && y >= 0 && y < boardSize;
};

/**
 * Get square color (light or dark)
 */
export const getSquareColor = (square: Square): 'light' | 'dark' => {
  const file = square.charCodeAt(0) - 97; // a=0, h=7
  const rank = parseInt(square[1]) - 1; // 1=0, 8=7
  return (file + rank) % 2 === 0 ? 'dark' : 'light';
};

/**
 * Get file letter from index (0-7 => a-h)
 */
export const getFileChar = (fileIndex: number): string => {
  return String.fromCharCode(97 + fileIndex);
};

/**
 * Get rank number from index (0-7 => 1-8)
 */
export const getRankNum = (rankIndex: number): number => {
  return rankIndex + 1;
};
