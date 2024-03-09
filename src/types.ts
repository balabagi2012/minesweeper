export interface Cell {
  hasMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  numberOfNeighboringMines: number;
}

export type GameBoard = Cell[][];

export enum GameStatus {
  Initial = "initial",
  InProgress = "inProgress",
  Won = "won",
  Lost = "lost",
}