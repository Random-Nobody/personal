import { Animated, View } from 'react-native';
import { BoardPosition, BoardState, HeldPiece, ValidMoves } from '../types';
import styles from '../styles';
import Piece from './Piece';
import { useRef } from 'react';

interface BoardProps {
  board: BoardState;
  boardPos: React.RefObject<BoardPosition>;
  heldPiece: HeldPiece;
  panHandlers: any;
  validMoves: ValidMoves;
}

export default function Board({ board, boardPos, heldPiece, panHandlers, validMoves }: BoardProps) {
  const boardRef = useRef<View>(null);

  const getboardPos = () => // event.nativeEvent.layout doesn't have pageX/Y
    boardRef.current && boardRef.current?.measure((_x, _y, width, _h, x, y) =>
      boardPos.current = {
        x, y, square: width / 8,
      })

  return <View ref={boardRef}
    style={styles.board}
    onLayout={getboardPos}
    {...panHandlers}>
    {board.map((pieces, row) => <View key={row} style={styles.row}>
      {pieces.map((piece, col) => <View
        key={row * 8 + col}
        style={[styles.square,
        (row + col) % 2 ? styles.dark : styles.light,
        ]}
      >
        {piece && (heldPiece?.row !== row || heldPiece?.col !== col)
          ? <Piece piece={piece} capture={validMoves[row][col] > 0} />
          : <View style={validMoves[row][col] === 2 ? styles.capturable
            : validMoves[row][col] ? styles.highlight : null} />
        }
      </View>)}
    </View>)
    }
  </View >;
};