/**
 * Pieces Container
 * Renders all pieces on the board
 * Pattern from react-native-chessboard
 */

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Piece from './Piece';
import { useChessboardProps } from '../contexts/ChessboardPropsContext';
import { useChessboardState } from '../contexts/ChessboardStateContext';
import { parseFENPosition } from '../utils/pieces';
import type { PieceSymbol } from '../types';

const Pieces: React.FC = () => {
  const { size } = useChessboardProps();
  const { position, draggedSquare } = useChessboardState();

  // Parse FEN to get piece positions
  const piecePositions = useMemo(() => parseFENPosition(position), [position]);

  return (
    <View style={[styles.container, { width: size, height: size }]} pointerEvents="box-none">
      {Object.entries(piecePositions).map(([square, piece]) => {
        // Don't render dragged piece at original position
        // (it will be rendered at the drag position by the Piece component's transform)
        return (
          <Piece
            key={square}
            square={square as any}
            piece={piece as PieceSymbol}
            size={size}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default React.memo(Pieces);
