
export type PieceType = ''
  | 'wp' | 'wr' | 'wn' | 'wb' | 'wq' | 'wk'      
  | 'bp' | 'br' | 'bn' | 'bb' | 'bq' | 'bk'      ;

export type BoardState = PieceType[][];

export type ValidMoves = (0 | 1 | 2)[][]; // was boolean, added 2 for en passent

export interface BoardPosition { x: number, y: number, square: number }

export type HeldPiece = { row: number, col: number, piece: PieceType } | null;

export interface Move {
  from: { row: number; col: number };
  to: { row: number; col: number };
  captured?: PieceType;
  enPassant?: boolean;
}

export interface GameState {
  board: BoardState;
  currentPlayer: 'w' | 'b';
  moveHistory: Move[];
  // Add more state as needed:
  capturedPieces: PieceType[];
}