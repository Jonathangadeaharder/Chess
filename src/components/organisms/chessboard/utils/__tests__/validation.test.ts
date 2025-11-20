/**
 * Tests for validation.ts
 * Move validation and chess rules helpers
 */

import { isValidSquare, isValidMove, areSameSquare, getSquareColor } from '../validation';
import type { Square } from '../../types';

describe('validation.ts', () => {
  describe('isValidSquare', () => {
    it('should return true for valid squares', () => {
      const validSquares = [
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

      validSquares.forEach(square => {
        expect(isValidSquare(square)).toBe(true);
      });
    });

    it('should return false for invalid file', () => {
      expect(isValidSquare('i1')).toBe(false);
      expect(isValidSquare('z5')).toBe(false);
      expect(isValidSquare('k4')).toBe(false);
    });

    it('should return false for invalid rank', () => {
      expect(isValidSquare('a0')).toBe(false);
      expect(isValidSquare('e9')).toBe(false);
      expect(isValidSquare('d10')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidSquare('')).toBe(false);
    });

    it('should return false for malformed input', () => {
      expect(isValidSquare('abc')).toBe(false);
      expect(isValidSquare('1a')).toBe(false); // Reversed
      expect(isValidSquare('ee')).toBe(false);
      expect(isValidSquare('44')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(isValidSquare(null as any)).toBe(false);
      expect(isValidSquare(undefined as any)).toBe(false);
    });

    it('should validate all 64 squares', () => {
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

      files.forEach(file => {
        ranks.forEach(rank => {
          const square = `${file}${rank}`;
          expect(isValidSquare(square)).toBe(true);
        });
      });
    });
  });

  describe('isValidMove', () => {
    it('should return false if from square is invalid', () => {
      expect(isValidMove('z1' as Square, 'e4' as Square)).toBe(false);
      expect(isValidMove('a9' as Square, 'e4' as Square)).toBe(false);
    });

    it('should return false if to square is invalid', () => {
      expect(isValidMove('e2' as Square, 'z4' as Square)).toBe(false);
      expect(isValidMove('e2' as Square, 'e9' as Square)).toBe(false);
    });

    it('should return false if from and to are the same', () => {
      expect(isValidMove('e4' as Square, 'e4' as Square)).toBe(false);
      expect(isValidMove('a1' as Square, 'a1' as Square)).toBe(false);
    });

    it('should return true for valid different squares', () => {
      expect(isValidMove('e2' as Square, 'e4' as Square)).toBe(true);
      expect(isValidMove('g1' as Square, 'f3' as Square)).toBe(true);
      expect(isValidMove('a1' as Square, 'h8' as Square)).toBe(true);
    });

    it('should handle edge-to-edge moves', () => {
      expect(isValidMove('a1' as Square, 'h8' as Square)).toBe(true);
      expect(isValidMove('h1' as Square, 'a8' as Square)).toBe(true);
    });
  });

  describe('areSameSquare', () => {
    it('should return true for identical squares', () => {
      expect(areSameSquare('e4' as Square, 'e4' as Square)).toBe(true);
      expect(areSameSquare('a1' as Square, 'a1' as Square)).toBe(true);
      expect(areSameSquare('h8' as Square, 'h8' as Square)).toBe(true);
    });

    it('should return false for different squares', () => {
      expect(areSameSquare('e4' as Square, 'e5' as Square)).toBe(false);
      expect(areSameSquare('a1' as Square, 'a2' as Square)).toBe(false);
      expect(areSameSquare('a1' as Square, 'h8' as Square)).toBe(false);
    });

    it('should handle null/undefined', () => {
      expect(areSameSquare(null, 'e4' as Square)).toBe(false);
      expect(areSameSquare('e4' as Square, null)).toBe(false);
      expect(areSameSquare(null, null)).toBe(false);
    });

    it('should be case-sensitive', () => {
      expect(areSameSquare('E4' as any, 'e4' as Square)).toBe(false);
    });
  });

  describe('getSquareColor', () => {
    it('should return "light" for light squares', () => {
      // Light squares on standard board
      expect(getSquareColor('a1' as Square)).toBe('dark'); // Bottom-left is dark
      expect(getSquareColor('h1' as Square)).toBe('light');
      expect(getSquareColor('a8' as Square)).toBe('light');
      expect(getSquareColor('h8' as Square)).toBe('dark');
      expect(getSquareColor('e4' as Square)).toBe('light');
      expect(getSquareColor('d4' as Square)).toBe('dark');
    });

    it('should return "dark" for dark squares', () => {
      expect(getSquareColor('a1' as Square)).toBe('dark');
      expect(getSquareColor('d5' as Square)).toBe('light');
      expect(getSquareColor('e5' as Square)).toBe('dark');
      expect(getSquareColor('c3' as Square)).toBe('dark');
    });

    it('should follow chess square color pattern', () => {
      // In chess: (file + rank) % 2 === 0 means dark square
      // a1: (1 + 1) % 2 = 0 (dark)
      // a2: (1 + 2) % 2 = 1 (light)
      // b1: (2 + 1) % 2 = 1 (light)
      // b2: (2 + 2) % 2 = 0 (dark)

      const testCases: [Square, 'light' | 'dark'][] = [
        ['a1', 'dark'],
        ['a2', 'light'],
        ['b1', 'light'],
        ['b2', 'dark'],
        ['c3', 'dark'],
        ['d4', 'dark'],
        ['e5', 'dark'],
        ['f6', 'dark'],
        ['g7', 'dark'],
        ['h8', 'dark'],
      ];

      testCases.forEach(([square, expectedColor]) => {
        expect(getSquareColor(square)).toBe(expectedColor);
      });
    });

    it('should have alternating colors along ranks', () => {
      // Check rank 1
      expect(getSquareColor('a1' as Square)).toBe('dark');
      expect(getSquareColor('b1' as Square)).toBe('light');
      expect(getSquareColor('c1' as Square)).toBe('dark');
      expect(getSquareColor('d1' as Square)).toBe('light');
      expect(getSquareColor('e1' as Square)).toBe('dark');
      expect(getSquareColor('f1' as Square)).toBe('light');
      expect(getSquareColor('g1' as Square)).toBe('dark');
      expect(getSquareColor('h1' as Square)).toBe('light');
    });

    it('should have alternating colors along files', () => {
      // Check a-file
      expect(getSquareColor('a1' as Square)).toBe('dark');
      expect(getSquareColor('a2' as Square)).toBe('light');
      expect(getSquareColor('a3' as Square)).toBe('dark');
      expect(getSquareColor('a4' as Square)).toBe('light');
      expect(getSquareColor('a5' as Square)).toBe('dark');
      expect(getSquareColor('a6' as Square)).toBe('light');
      expect(getSquareColor('a7' as Square)).toBe('dark');
      expect(getSquareColor('a8' as Square)).toBe('light');
    });

    it('should identify all light-squared bishop squares', () => {
      // Light-squared bishops start on c1/f1 (white) and c8/f8 (black)
      expect(getSquareColor('c1' as Square)).toBe('dark');
      expect(getSquareColor('f1' as Square)).toBe('light');
      expect(getSquareColor('c8' as Square)).toBe('light');
      expect(getSquareColor('f8' as Square)).toBe('dark');
    });

    it('should correctly identify corners', () => {
      expect(getSquareColor('a1' as Square)).toBe('dark');
      expect(getSquareColor('a8' as Square)).toBe('light');
      expect(getSquareColor('h1' as Square)).toBe('light');
      expect(getSquareColor('h8' as Square)).toBe('dark');
    });

    it('should have exactly 32 light and 32 dark squares', () => {
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

      let lightCount = 0;
      let darkCount = 0;

      files.forEach(file => {
        ranks.forEach(rank => {
          const square = `${file}${rank}` as Square;
          const color = getSquareColor(square);

          if (color === 'light') {
            lightCount++;
          } else {
            darkCount++;
          }
        });
      });

      expect(lightCount).toBe(32);
      expect(darkCount).toBe(32);
    });
  });

  describe('Edge cases and integration', () => {
    it('should validate moves only between valid squares', () => {
      expect(isValidMove('e2' as Square, 'e4' as Square)).toBe(true);
      expect(isValidMove('z9' as any, 'e4' as Square)).toBe(false);
    });

    it('should handle case sensitivity correctly', () => {
      expect(isValidSquare('E4')).toBe(false); // Should be lowercase
      expect(isValidSquare('e4')).toBe(true);
    });

    it('should work with type guards', () => {
      const square: string = 'e4';

      if (isValidSquare(square)) {
        // TypeScript should narrow type here
        expect(square).toBe('e4');
      }
    });
  });
});
