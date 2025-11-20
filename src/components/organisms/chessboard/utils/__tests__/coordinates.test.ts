/**
 * Tests for coordinates.ts
 * Square ↔ pixel coordinate conversion utilities
 */

import { getSquareFromCoords, getCoordsFromSquare } from '../coordinates';
import type { Square, BoardOrientation } from '../../types';

describe('coordinates.ts', () => {
  const SQUARE_SIZE = 64;
  const BOARD_SIZE = SQUARE_SIZE * 8; // 512

  describe('getSquareFromCoords - White Orientation', () => {
    const orientation: BoardOrientation = 'white';

    it('should convert top-left pixel (0, 0) to square "a8"', () => {
      const result = getSquareFromCoords(0, 0, SQUARE_SIZE, orientation);
      expect(result).toBe('a8');
    });

    it('should convert top-right pixel (448, 0) to square "h8"', () => {
      const result = getSquareFromCoords(448, 0, SQUARE_SIZE, orientation);
      expect(result).toBe('h8');
    });

    it('should convert bottom-left pixel (0, 448) to square "a1"', () => {
      const result = getSquareFromCoords(0, 448, SQUARE_SIZE, orientation);
      expect(result).toBe('a1');
    });

    it('should convert bottom-right pixel (448, 448) to square "h1"', () => {
      const result = getSquareFromCoords(448, 448, SQUARE_SIZE, orientation);
      expect(result).toBe('h1');
    });

    it('should convert center of e4 square (256, 256) to "e4"', () => {
      const result = getSquareFromCoords(256, 256, SQUARE_SIZE, orientation);
      expect(result).toBe('e4');
    });

    it('should convert center of d5 square (192, 192) to "d5"', () => {
      const result = getSquareFromCoords(192, 192, SQUARE_SIZE, orientation);
      expect(result).toBe('d5');
    });

    it('should handle edge of square correctly (63, 63) -> "a8"', () => {
      const result = getSquareFromCoords(63, 63, SQUARE_SIZE, orientation);
      expect(result).toBe('a8');
    });

    it('should handle pixels in middle of board (320, 320) -> "f3"', () => {
      const result = getSquareFromCoords(320, 320, SQUARE_SIZE, orientation);
      expect(result).toBe('f3');
    });
  });

  describe('getSquareFromCoords - Black Orientation', () => {
    const orientation: BoardOrientation = 'black';

    it('should convert top-left pixel (0, 0) to square "h1" (flipped)', () => {
      const result = getSquareFromCoords(0, 0, SQUARE_SIZE, orientation);
      expect(result).toBe('h1');
    });

    it('should convert top-right pixel (448, 0) to square "a1" (flipped)', () => {
      const result = getSquareFromCoords(448, 0, SQUARE_SIZE, orientation);
      expect(result).toBe('a1');
    });

    it('should convert bottom-left pixel (0, 448) to square "h8" (flipped)', () => {
      const result = getSquareFromCoords(0, 448, SQUARE_SIZE, orientation);
      expect(result).toBe('h8');
    });

    it('should convert bottom-right pixel (448, 448) to square "a8" (flipped)', () => {
      const result = getSquareFromCoords(448, 448, SQUARE_SIZE, orientation);
      expect(result).toBe('a8');
    });

    it('should convert center correctly when flipped (256, 256) -> "d5"', () => {
      const result = getSquareFromCoords(256, 256, SQUARE_SIZE, orientation);
      expect(result).toBe('d5');
    });
  });

  describe('getCoordsFromSquare - White Orientation', () => {
    const orientation: BoardOrientation = 'white';

    it('should convert square "a8" to top-left coords (0, 0)', () => {
      const result = getCoordsFromSquare('a8' as Square, SQUARE_SIZE, orientation);
      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('should convert square "h8" to top-right coords (448, 0)', () => {
      const result = getCoordsFromSquare('h8' as Square, SQUARE_SIZE, orientation);
      expect(result).toEqual({ x: 448, y: 0 });
    });

    it('should convert square "a1" to bottom-left coords (0, 448)', () => {
      const result = getCoordsFromSquare('a1' as Square, SQUARE_SIZE, orientation);
      expect(result).toEqual({ x: 0, y: 448 });
    });

    it('should convert square "h1" to bottom-right coords (448, 448)', () => {
      const result = getCoordsFromSquare('h1' as Square, SQUARE_SIZE, orientation);
      expect(result).toEqual({ x: 448, y: 448 });
    });

    it('should convert square "e4" to center coords (256, 256)', () => {
      const result = getCoordsFromSquare('e4' as Square, SQUARE_SIZE, orientation);
      expect(result).toEqual({ x: 256, y: 256 });
    });

    it('should convert square "d5" to coords (192, 192)', () => {
      const result = getCoordsFromSquare('d5' as Square, SQUARE_SIZE, orientation);
      expect(result).toEqual({ x: 192, y: 192 });
    });

    it('should convert square "b2" to coords (64, 384)', () => {
      const result = getCoordsFromSquare('b2' as Square, SQUARE_SIZE, orientation);
      expect(result).toEqual({ x: 64, y: 384 });
    });

    it('should convert square "g7" to coords (384, 64)', () => {
      const result = getCoordsFromSquare('g7' as Square, SQUARE_SIZE, orientation);
      expect(result).toEqual({ x: 384, y: 64 });
    });
  });

  describe('getCoordsFromSquare - Black Orientation', () => {
    const orientation: BoardOrientation = 'black';

    it('should convert square "a8" to bottom-right coords (448, 448) (flipped)', () => {
      const result = getCoordsFromSquare('a8' as Square, SQUARE_SIZE, orientation);
      expect(result).toEqual({ x: 448, y: 448 });
    });

    it('should convert square "h8" to bottom-left coords (0, 448) (flipped)', () => {
      const result = getCoordsFromSquare('h8' as Square, SQUARE_SIZE, orientation);
      expect(result).toEqual({ x: 0, y: 448 });
    });

    it('should convert square "a1" to top-right coords (448, 0) (flipped)', () => {
      const result = getCoordsFromSquare('a1' as Square, SQUARE_SIZE, orientation);
      expect(result).toEqual({ x: 448, y: 0 });
    });

    it('should convert square "h1" to top-left coords (0, 0) (flipped)', () => {
      const result = getCoordsFromSquare('h1' as Square, SQUARE_SIZE, orientation);
      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('should convert square "e4" correctly when flipped', () => {
      const result = getCoordsFromSquare('e4' as Square, SQUARE_SIZE, orientation);
      expect(result).toEqual({ x: 192, y: 256 });
    });
  });

  describe('Round-trip conversion', () => {
    const orientation: BoardOrientation = 'white';
    const squares: Square[] = [
      'a1',
      'a8',
      'h1',
      'h8',
      'e4',
      'd5',
      'c3',
      'f6',
      'b2',
      'g7',
    ];

    it('should maintain consistency: square -> coords -> square', () => {
      squares.forEach(square => {
        const coords = getCoordsFromSquare(square, SQUARE_SIZE, orientation);
        const resultSquare = getSquareFromCoords(coords.x, coords.y, SQUARE_SIZE, orientation);
        expect(resultSquare).toBe(square);
      });
    });

    it('should maintain consistency with black orientation', () => {
      const blackOrientation: BoardOrientation = 'black';
      squares.forEach(square => {
        const coords = getCoordsFromSquare(square, SQUARE_SIZE, blackOrientation);
        const resultSquare = getSquareFromCoords(
          coords.x,
          coords.y,
          SQUARE_SIZE,
          blackOrientation
        );
        expect(resultSquare).toBe(square);
      });
    });
  });

  describe('Edge cases', () => {
    const orientation: BoardOrientation = 'white';

    it('should handle different square sizes correctly (32px)', () => {
      const smallSquareSize = 32;
      const result = getSquareFromCoords(0, 0, smallSquareSize, orientation);
      expect(result).toBe('a8');

      const coords = getCoordsFromSquare('a8' as Square, smallSquareSize, orientation);
      expect(coords).toEqual({ x: 0, y: 0 });
    });

    it('should handle different square sizes correctly (128px)', () => {
      const largeSquareSize = 128;
      const result = getSquareFromCoords(0, 0, largeSquareSize, orientation);
      expect(result).toBe('a8');

      const coords = getCoordsFromSquare('h1' as Square, largeSquareSize, orientation);
      expect(coords).toEqual({ x: 896, y: 896 });
    });

    it('should handle coordinates at exact square boundaries', () => {
      // Test boundary between a8 and b8
      expect(getSquareFromCoords(64, 0, SQUARE_SIZE, orientation)).toBe('b8');

      // Test boundary between a7 and a8
      expect(getSquareFromCoords(0, 64, SQUARE_SIZE, orientation)).toBe('a7');
    });
  });

  describe('Coordinate validation', () => {
    const orientation: BoardOrientation = 'white';

    it('should handle negative coordinates gracefully', () => {
      // Negative coords should still produce a square (clamping behavior)
      const result = getSquareFromCoords(-10, -10, SQUARE_SIZE, orientation);
      expect(result).toBe('a8'); // Should clamp to top-left
    });

    it('should handle coordinates beyond board gracefully', () => {
      // Coords beyond board should produce edge square
      const result = getSquareFromCoords(1000, 1000, SQUARE_SIZE, orientation);
      expect(result).toBe('h1'); // Should clamp to bottom-right (file 7, rank 0)
    });
  });

  describe('All squares coverage', () => {
    const orientation: BoardOrientation = 'white';
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

    it('should correctly convert all 64 squares', () => {
      files.forEach((file, fileIndex) => {
        ranks.forEach((rank, rankIndex) => {
          const square = `${file}${rank}` as Square;
          const coords = getCoordsFromSquare(square, SQUARE_SIZE, orientation);
          const resultSquare = getSquareFromCoords(coords.x, coords.y, SQUARE_SIZE, orientation);

          expect(resultSquare).toBe(square);
          expect(coords.x).toBe(fileIndex * SQUARE_SIZE);
          expect(coords.y).toBe((7 - rankIndex) * SQUARE_SIZE);
        });
      });
    });
  });
});
