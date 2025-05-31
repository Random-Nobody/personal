import { BoardState, Move } from '../types';

export default function getValidMoves(board: BoardState, row: number, col: number,
  getMoveHistory: () => Move[],): (0 | 1 | 2)[][] {
  // maybe should have better way to communicate en passant than 2
  // 0 = no move, 1 = valid move, 2 = en passant
  
  const empty: 0[][] = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => 0));
  const piece = board[row][col];
  if (!piece) return empty;

  switch (piece[1]) {
    case 'k':
      return getKingMoves({ board, row, col, color: piece[0] });
    case 'n':
      return getKnightMoves({ board, row, col, color: piece[0] });
    case 'p':
      return getPawnMoves({ board, row, col, color: piece[0] }, getMoveHistory);
    case 'r':
      return getRookMoves({ board, row, col, color: piece[0] });
    case 'b':
      return getBishopMoves({ board, row, col, color: piece[0] });
    case 'q':
      return getQueenMoves({ board, row, col, color: piece[0] });
    default:
      return empty;
  }
};

interface PieceMoves {
  board: BoardState;
  row: number;
  col: number;
  color: string;
}

function getKingMoves({ board, row, col, color }: PieceMoves): (0 | 1)[][] {
  return board.map((pieces, r) => pieces.map((piece, c) => {
    if (piece.startsWith(color)) return 0; // only take opposite color
    if (row === r && col === c) return 0; // not moving doesn't count as move
    return Math.abs(row - r) < 2 && Math.abs(col - c) < 2 ? 1 : 0;
  }));
}

function getKnightMoves({ board, row, col, color }: PieceMoves): (0 | 1)[][] {
  return board.map((pieces, r) => pieces.map((piece, c) => {
    if (piece.startsWith(color)) return 0;
    return (Math.abs(row - r) === 2 && Math.abs(col - c) === 1)
      || (Math.abs(row - r) === 1 && Math.abs(col - c) === 2) ? 1 : 0;
  }));
}

function getPawnMoves({ board, row, col, color }: PieceMoves, getMoveHistory: () => Move[])
  : (0 | 1 | 2)[][] {
  const [direction, startRow] = color === 'w' ? [1, 1] : [-1, 6];
  return board.map((pieces, r) => pieces.map((piece, c) => {
    if (col === c) {
      if (r === row + direction)
        return !piece ? 1 : 0;
      else if (r === row + 2 * direction && row === startRow)
        return !piece && !board[row + direction][c] ? 1 : 0;
    }
    //capture     
    if (r === row + direction && Math.abs(col - c) === 1) {
      if (piece) return piece && !piece.startsWith(color) ? 1 : 0;

      //en passant
      const lastMove = getMoveHistory()[getMoveHistory().length - 1];
      if (lastMove && board[lastMove.to.row][lastMove.to.col][1] === 'p' //last move is pawn
        && lastMove.from.row - 2 * direction === lastMove.to.row //moved 2 spaces
        && lastMove.to.row + direction === r && lastMove.to.col === c //position is correct
        && !board[lastMove.to.row][lastMove.to.col].startsWith(color)) //just in case I reuse this with repeated turns
        return 2;
    }
    return 0;
  }));
}

function getRookMoves({ board, row, col, color }: PieceMoves): (0 | 1)[][] {
  return directionHelper({
    board, row, col, color, dirs: [
      [1, 0], [-1, 0], [0, 1], [0, -1]
    ]
  });
}

function getBishopMoves({ board, row, col, color }: PieceMoves): (0 | 1)[][] {
  return directionHelper({
    board, row, col, color, dirs: [
      [1, 1], [-1, -1], [1, -1], [-1, 1]
    ]
  });
}

function getQueenMoves({ board, row, col, color }: PieceMoves): (0 | 1)[][] {
  return directionHelper({
    board, row, col, color, dirs: [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [-1, -1], [1, -1], [-1, 1]
    ]
  });
}

interface DirectionHelp extends PieceMoves {
  dirs: (-1 | 0 | 1)[][];
}

function directionHelper({ board, row, col, color, dirs }: DirectionHelp): (0 | 1)[][] {
  const moves: (0 | 1)[][] = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => 0));

  dirs.forEach(dir => {
    let r = row + dir[0], c = col + dir[1];
    while (moves[r]?.[c] !== undefined) { // boundary check
      if (board[r][c]) { // if hit a piece
        moves[r][c] = board[r][c].startsWith(color) ? 0 : 1; // valid if can take
        break;
      }
      moves[r][c] = 1; // otherwise keep going
      r += dir[0];
      c += dir[1];
    }
  });
  return moves;
};