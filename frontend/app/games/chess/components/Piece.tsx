import React from 'react';
import { pieceComponents } from '../consts';
import { PieceType } from '../types';
import styles from '../styles';
import { View } from 'react-native';

export default function Piece({ piece, capture = false }
  : { piece: PieceType, capture?: boolean }) {
  const PieceComponent = pieceComponents[piece]
  return PieceComponent && <View style={capture && styles.capturable}>
    <PieceComponent
      height="100%"
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 45 45" />
  </View>;
};