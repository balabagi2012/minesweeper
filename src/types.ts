export interface Coordinate {
  row: number;
  col: number;
}

export interface Cell {
  hasMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  numberOfNeighboringMines: number;
}

export type GameBoard = Cell[][];

export enum GameStatus {
  Initial = "initial",
  Loading = "loading",
  InProgress = "inProgress",
  Won = "won",
  Lost = "lost",
}
