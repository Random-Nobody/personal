import { create } from 'zustand'
import { GameState, Move } from '../types'
import { initialBoard } from '../consts'

interface ChessStore {
  // State
  board: GameState['board']
  currentPlayer: GameState['currentPlayer']
  moveHistory: GameState['moveHistory']
  capturedPieces: GameState['capturedPieces']
  // Getters
  getBoard: () => GameState['board']
  getCurrentPlayer: () => GameState['currentPlayer']
  getMoveHistory: () => GameState['moveHistory']
  getCapturedPieces: () => GameState['capturedPieces']
  // Actions
  makeMove: (move: Move) => void
  undo: () => void
}

export const useChessStore = create<ChessStore>((set, get) => ({
  board: initialBoard,
  currentPlayer: 'w',
  moveHistory: [],
  capturedPieces: [],

  //getter for closure problems
  getBoard: () => get().board,
  getCurrentPlayer: () => get().currentPlayer,
  getMoveHistory: () => get().moveHistory,
  getCapturedPieces: () => get().capturedPieces,

  makeMove: (move: Move) => set(state => {
    const board = state.board.map(pieces => [...pieces]);
    move.captured = board[move.to.row][move.to.col];
    board[move.to.row][move.to.col] = board[move.from.row][move.from.col];
    board[move.from.row][move.from.col] = '';
    if (move.enPassant) board[move.from.row][move.to.col] = '';

    return {
      board,
      currentPlayer: state.currentPlayer === 'w' ? 'b' : 'w',
      moveHistory: [...state.moveHistory, move],
      capturedPieces: move.captured ? [...state.capturedPieces, move.captured]
        : state.capturedPieces,
    }
  }),

  undo: () => set((state) => {
    if (!state.moveHistory.length) return state

    const board = state.board.map(pieces => [...pieces])
    const move = state.moveHistory[state.moveHistory.length - 1]
    board[move.from.row][move.from.col] = board[move.to.row][move.to.col]
    board[move.to.row][move.to.col] = ''

    if (move.captured) {
      const capturedPieces = [...state.capturedPieces]
      capturedPieces.pop()
      if (move.enPassant) {
        board[move.from.row][move.to.col] = state.currentPlayer === 'w' ? 'wp' : 'bp';
      } else {
        board[move.to.row][move.to.col] = move.captured
      }
      return {
        board,
        currentPlayer: state.currentPlayer === 'w' ? 'b' : 'w',
        moveHistory: state.moveHistory.slice(0, -1),
        capturedPieces,
      }
    }

    return {
      board,
      currentPlayer: state.currentPlayer === 'w' ? 'b' : 'w',
      moveHistory: state.moveHistory.slice(0, -1),
      capturedPieces: state.capturedPieces,
    }
  }),
}))
