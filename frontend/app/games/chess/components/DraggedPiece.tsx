import { Animated } from 'react-native';
import styles from '../styles';
import Piece from './Piece';
import { HeldPiece } from '../types';

interface DraggedPieceProps {
  animate: Animated.ValueXY;
  piece: HeldPiece;
}

export default function DraggedPiece({ animate, piece }: DraggedPieceProps) {
  if (!piece) return null;

  return <Animated.View style={[
    styles.heldPiece,
    {
      transform: [
        { translateX: animate.x },
        { translateY: animate.y },
      ]
    }
  ]}>
    <Piece piece={piece.piece} />
  </Animated.View>
};