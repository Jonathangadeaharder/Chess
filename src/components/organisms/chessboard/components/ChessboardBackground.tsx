/**
 * Chessboard Background
 * Renders the board grid with squares and optional coordinates
 * Pattern from react-native-chessboard
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useChessboardProps } from '../contexts/ChessboardPropsContext';
import { getFileChar, getRankNum, getSquareColor } from '../utils/coordinates';
import type { Square } from '../../../../types';

const ChessboardBackground: React.FC = () => {
  const { size, theme, orientation, showCoordinates } = useChessboardProps();
  const squareSize = size / 8;

  const renderSquare = (fileIndex: number, rankIndex: number) => {
    // Calculate square based on orientation
    const isFlipped = orientation === 'black';
    const actualFile = isFlipped ? 7 - fileIndex : fileIndex;
    const actualRank = isFlipped ? rankIndex : 7 - rankIndex;

    const file = getFileChar(actualFile);
    const rank = getRankNum(actualRank + 1);
    const square = `${file}${rank}` as Square;
    const squareColor = getSquareColor(square);

    const backgroundColor = squareColor === 'light' ? theme.light : theme.dark;

    // Show coordinates on edge squares
    const showFileLabel = showCoordinates && rankIndex === 7;
    const showRankLabel = showCoordinates && fileIndex === 0;

    return (
      <View
        key={square}
        style={[
          styles.square,
          {
            width: squareSize,
            height: squareSize,
            backgroundColor,
          },
        ]}
      >
        {/* File label (a-h) at bottom */}
        {showFileLabel && (
          <Text
            style={[
              styles.coordinateLabel,
              styles.fileLabel,
              { color: squareColor === 'light' ? theme.dark : theme.light },
            ]}
          >
            {file}
          </Text>
        )}

        {/* Rank label (1-8) at left */}
        {showRankLabel && (
          <Text
            style={[
              styles.coordinateLabel,
              styles.rankLabel,
              { color: squareColor === 'light' ? theme.dark : theme.light },
            ]}
          >
            {rank}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {Array.from({ length: 8 }).map((_, rankIndex) => (
        <View key={rankIndex} style={styles.row}>
          {Array.from({ length: 8 }).map((_, fileIndex) => renderSquare(fileIndex, rankIndex))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  coordinateLabel: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.7,
  },
  fileLabel: {
    bottom: 2,
    right: 2,
  },
  rankLabel: {
    top: 2,
    left: 2,
  },
});

export default React.memo(ChessboardBackground);
