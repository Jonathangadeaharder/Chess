/**
 * Tests for pieces.ts
 * Piece symbol conversions and FEN parsing
 */

import {
  getPieceSymbol,
  getPieceUnicode,
  getPieceColor,
  getPieceType,
  parseFENPosition,
} from '../pieces';
import type { PieceSymbol } from '../../types';

describe('pieces.ts', () => {
  describe('getPieceSymbol', () => {
    it('should return correct unicode symbol for white pieces', () => {
      expect(getPieceSymbol('K')).toBe('♔');
      expect(getPieceSymbol('Q')).toBe('♕');
      expect(getPieceSymbol('R')).toBe('♖');
      expect(getPieceSymbol('B')).toBe('♗');
      expect(getPieceSymbol('N')).toBe('♘');
      expect(getPieceSymbol('P')).toBe('♙');
    });

    it('should return correct unicode symbol for black pieces', () => {
      expect(getPieceSymbol('k')).toBe('♚');
      expect(getPieceSymbol('q')).toBe('♛');
      expect(getPieceSymbol('r')).toBe('♜');
      expect(getPieceSymbol('b')).toBe('♝');
      expect(getPieceSymbol('n')).toBe('♞');
      expect(getPieceSymbol('p')).toBe('♟');
    });
  });

  describe('getPieceUnicode', () => {
    it('should return unicode for white king', () => {
      expect(getPieceUnicode('K')).toBe('♔');
    });

    it('should return unicode for black queen', () => {
      expect(getPieceUnicode('q')).toBe('♛');
    });

    it('should handle all piece types', () => {
      const pieces: PieceSymbol[] = ['K', 'Q', 'R', 'B', 'N', 'P', 'k', 'q', 'r', 'b', 'n', 'p'];
      pieces.forEach(piece => {
        const unicode = getPieceUnicode(piece);
        expect(unicode).toBeTruthy();
        expect(typeof unicode).toBe('string');
        expect(unicode.length).toBe(1);
      });
    });
  });

  describe('getPieceColor', () => {
    it('should return "w" for uppercase (white) pieces', () => {
      expect(getPieceColor('K')).toBe('w');
      expect(getPieceColor('Q')).toBe('w');
      expect(getPieceColor('R')).toBe('w');
      expect(getPieceColor('B')).toBe('w');
      expect(getPieceColor('N')).toBe('w');
      expect(getPieceColor('P')).toBe('w');
    });

    it('should return "b" for lowercase (black) pieces', () => {
      expect(getPieceColor('k')).toBe('b');
      expect(getPieceColor('q')).toBe('b');
      expect(getPieceColor('r')).toBe('b');
      expect(getPieceColor('b')).toBe('b');
      expect(getPieceColor('n')).toBe('b');
      expect(getPieceColor('p')).toBe('b');
    });
  });

  describe('getPieceType', () => {
    it('should return correct type for white pieces', () => {
      expect(getPieceType('K')).toBe('king');
      expect(getPieceType('Q')).toBe('queen');
      expect(getPieceType('R')).toBe('rook');
      expect(getPieceType('B')).toBe('bishop');
      expect(getPieceType('N')).toBe('knight');
      expect(getPieceType('P')).toBe('pawn');
    });

    it('should return correct type for black pieces', () => {
      expect(getPieceType('k')).toBe('king');
      expect(getPieceType('q')).toBe('queen');
      expect(getPieceType('r')).toBe('rook');
      expect(getPieceType('b')).toBe('bishop');
      expect(getPieceType('n')).toBe('knight');
      expect(getPieceType('p')).toBe('pawn');
    });
  });

  describe('parseFENPosition', () => {
    it('should parse starting position FEN correctly', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      const position = parseFENPosition(fen);

      // Check back rank for black
      expect(position['a8']).toBe('r');
      expect(position['b8']).toBe('n');
      expect(position['c8']).toBe('b');
      expect(position['d8']).toBe('q');
      expect(position['e8']).toBe('k');
      expect(position['f8']).toBe('b');
      expect(position['g8']).toBe('n');
      expect(position['h8']).toBe('r');

      // Check pawns for black
      expect(position['a7']).toBe('p');
      expect(position['h7']).toBe('p');

      // Check back rank for white
      expect(position['a1']).toBe('R');
      expect(position['e1']).toBe('K');
      expect(position['h1']).toBe('R');

      // Check pawns for white
      expect(position['a2']).toBe('P');
      expect(position['h2']).toBe('P');

      // Check empty squares
      expect(position['a4']).toBeUndefined();
      expect(position['e5']).toBeUndefined();
    });

    it('should parse position after 1.e4 correctly', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
      const position = parseFENPosition(fen);

      // White pawn on e4
      expect(position['e4']).toBe('P');

      // e2 should be empty
      expect(position['e2']).toBeUndefined();

      // Other pieces unchanged
      expect(position['e1']).toBe('K');
      expect(position['e8']).toBe('k');
    });

    it("should parse Bishop's Prison position correctly", () => {
      const fen = '5b2/ppp1k1pp/3p4/2p1P3/3P1P2/4K3/PPP3PP/2B5 w - - 0 1';
      const position = parseFENPosition(fen);

      // Black bishop on f8
      expect(position['f8']).toBe('b');

      // Black king on e7
      expect(position['e7']).toBe('k');

      // White king on e3
      expect(position['e3']).toBe('K');

      // White bishop on c1
      expect(position['c1']).toBe('B');

      // White pawns
      expect(position['e5']).toBe('P');
      expect(position['d4']).toBe('P');
      expect(position['f4']).toBe('P');

      // Black pawns
      expect(position['d6']).toBe('p');
      expect(position['c5']).toBe('p');
    });

    it('should handle empty ranks (consecutive numbers)', () => {
      const fen = 'rnbqkbnr/8/8/8/8/8/8/RNBQKBNR w KQkq - 0 1';
      const position = parseFENPosition(fen);

      // Back ranks should have pieces
      expect(position['e1']).toBe('K');
      expect(position['e8']).toBe('k');

      // Middle ranks should be empty
      expect(position['e4']).toBeUndefined();
      expect(position['d5']).toBeUndefined();

      // Count total pieces
      const pieceCount = Object.keys(position).length;
      expect(pieceCount).toBe(16); // 8 pieces per back rank
    });

    it('should parse complex middlegame position', () => {
      const fen = 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1';
      const position = parseFENPosition(fen);

      // Check specific pieces
      expect(position['e1']).toBe('K');
      expect(position['e8']).toBe('k');
      expect(position['c4']).toBe('B');
      expect(position['c5']).toBe('b');
      expect(position['f3']).toBe('N');
      expect(position['c6']).toBe('n');

      // Check empty squares
      expect(position['e2']).toBeUndefined();
      expect(position['f1']).toBeUndefined();
      expect(position['g1']).toBeUndefined();
    });

    it('should only parse board position, ignore metadata', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      const position = parseFENPosition(fen);

      // Should only have square->piece mappings
      Object.keys(position).forEach(key => {
        // All keys should be valid squares (a1-h8)
        expect(key).toMatch(/^[a-h][1-8]$/);
      });

      // Should have exactly 32 pieces in starting position
      expect(Object.keys(position).length).toBe(32);
    });

    it('should handle endgame positions with few pieces', () => {
      const fen = '8/8/4k3/8/8/4K3/8/8 w - - 0 1';
      const position = parseFENPosition(fen);

      expect(position['e3']).toBe('K');
      expect(position['e6']).toBe('k');
      expect(Object.keys(position).length).toBe(2);
    });

    it('should parse checkmate position', () => {
      const fen = 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3';
      const position = parseFENPosition(fen);

      // Black queen delivering checkmate
      expect(position['h4']).toBe('q');

      // White king in danger
      expect(position['e1']).toBe('K');
    });

    it('should parse all 64 squares correctly in various positions', () => {
      const positions = [
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
        '5b2/ppp1k1pp/3p4/2p1P3/3P1P2/4K3/PPP3PP/2B5 w - - 0 1',
      ];

      positions.forEach(fen => {
        const position = parseFENPosition(fen);

        // All returned positions should be valid squares
        Object.keys(position).forEach(square => {
          expect(square).toMatch(/^[a-h][1-8]$/);
        });

        // All pieces should be valid symbols
        Object.values(position).forEach(piece => {
          expect(['K', 'Q', 'R', 'B', 'N', 'P', 'k', 'q', 'r', 'b', 'n', 'p']).toContain(piece);
        });
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle FEN with only position part (no metadata)', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
      const position = parseFENPosition(fen);

      expect(position['e1']).toBe('K');
      expect(position['e8']).toBe('k');
      expect(Object.keys(position).length).toBe(32);
    });

    it('should handle empty board', () => {
      const fen = '8/8/8/8/8/8/8/8 w - - 0 1';
      const position = parseFENPosition(fen);

      expect(Object.keys(position).length).toBe(0);
    });

    it('should handle position with maximum pieces', () => {
      // All pawns promoted to queens
      const fen =
        'qqqqqqqq/qqqqqqqq/qqqqqqqq/qqqqqqqq/QQQQQQQQ/QQQQQQQQ/QQQQQQQQ/QQQQQQQQ w - - 0 1';
      const position = parseFENPosition(fen);

      expect(Object.keys(position).length).toBe(64);
      expect(position['a1']).toBe('Q');
      expect(position['h8']).toBe('q');
    });
  });
});
