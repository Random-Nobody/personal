import { useEffect, useRef, useState } from 'react';
import { PanResponder, Animated } from 'react-native';
import { BoardPosition, BoardState, HeldPiece, Move, PieceType, ValidMoves } from '../types';
import getValidMoves from '../util/moves';

export default function useDrag(
  getBoard: () => BoardState,
  getMoveHistory: () => Move[],
  makeMove: (move: Move) => void,
  getCurrentPlayer: () => 'w' | 'b',
  boardPos: React.RefObject<BoardPosition>,
) {
  const [heldPiece, setHeldPiece] = useState<HeldPiece>(null);
  const [validMoves, setValidMoves] = useState<ValidMoves>(
    Array(8).fill(null).map(() => Array(8).fill(false))
  );
  const animate = useRef(new Animated.ValueXY()).current;

  const getRowCol = (x: number, y: number) => ({
    row: Math.floor((y - boardPos.current.y) / boardPos.current.square),
    col: Math.floor((x - boardPos.current.x) / boardPos.current.square),
  });

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (e, gestureState) => {
      const { row, col } = getRowCol(gestureState.x0, gestureState.y0);
      const board = getBoard();
      if (row > -1 && row < 8 && col > -1 && col < 8) { //shouldn't be out of bounds, but in case

        setHeldPiece({ row, col, piece: board[row][col] });
        if (board[row][col][0] === getCurrentPlayer())
          setValidMoves(getValidMoves(board, row, col, getMoveHistory));

        animate.setValue({
          x: gestureState.x0 - boardPos.current.x - boardPos.current.square / 2, //subtracted to center piece
          y: gestureState.y0 - boardPos.current.y - boardPos.current.square / 2,
        })
      }
    },
    onPanResponderMove: (e, gestureState) => {
      animate.setValue({
        x: gestureState.moveX - boardPos.current.x - boardPos.current.square / 2,
        y: gestureState.moveY - boardPos.current.y - boardPos.current.square / 2,
      })
    },
    onPanResponderRelease: (e, gestureState) =>
      setHeldPiece(oldPiece => { //solves closure problem. Have faith in react batching state updates.
        if (!oldPiece) return null;

        const { row, col } = getRowCol(gestureState.moveX, gestureState.moveY);
        setValidMoves(valid => { //more closure problems...
          if (valid[row]?.[col])
            makeMove({
              from: { row: oldPiece.row, col: oldPiece.col },
              to: { row, col },
              enPassant: valid[row][col] === 2,
            });
          return Array(8).fill(null).map(() => Array(8).fill(false));
        })

        return null;
      }),
  })).current;

  return { heldPiece, animate, panResponder, validMoves };
}