import { View } from 'react-native';
import { useRef } from 'react';
import useDrag from './hooks/useDrag';
import styles from './styles';
import Board from './components/Board';
import DraggedPiece from './components/DraggedPiece';
import { useChessStore } from './store/useChessStore';

export default function ChessGame() {
  const { board, getBoard, getCurrentPlayer, getMoveHistory, makeMove, }
    = useChessStore();
  const boardPos = useRef({ x: -1, y: -1, square: -1 });
  const { heldPiece, animate, panResponder, validMoves }
    = useDrag(getBoard, getMoveHistory, makeMove, getCurrentPlayer, boardPos);

  return <View style={styles.container}>
    <Board
      board={board}
      boardPos={boardPos}
      heldPiece={heldPiece}
      validMoves={validMoves}
      panHandlers={panResponder.panHandlers}
    />
    <DraggedPiece animate={animate} piece={heldPiece} />
  </View>;
}

