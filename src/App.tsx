import { useState } from "react";
import "./App.css";
import { Coordinate, GameBoard, GameStatus } from "./types";

function App() {
  const [board, setBoard] = useState<GameBoard>();
  const [status, setStatus] = useState<GameStatus>(GameStatus.Initial);

  const countMinesAround = (
    board: GameBoard,
    row: number,
    col: number
  ): number => {
    let count = 0;

    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 0],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (let i = 0; i < directions.length; i++) {
      const dir = directions[i];
      const newRow = row + dir[0];
      const newCol = col + dir[1];

      if (
        newRow >= 0 &&
        newRow < board.length &&
        newCol >= 0 &&
        newCol < board[0].length &&
        board[newRow][newCol].hasMine
      ) {
        count++;
      }
    }

    return count;
  };

  const initializeGameBoard = (safeCell: Coordinate): void => {
    setStatus(GameStatus.Loading);
    const board: GameBoard = Array(8)
      .fill(null)
      .map(() =>
        Array(8).fill({
          hasMine: false,
          isRevealed: false,
          isFlagged: false,
          numberOfNeighboringMines: 0,
        })
      );

    // 隨機地放置 10 個地雷
    for (let i = 0; i < 10; i++) {
      let row, col;
      do {
        row = Math.floor(Math.random() * 8);
        col = Math.floor(Math.random() * 8);
      } while (
        board[row][col].hasMine ||
        (row === safeCell.row && col === safeCell.col)
      );

      board[row][col] = {
        hasMine: true,
        isRevealed: false,
        isFlagged: false,
        numberOfNeighboringMines: 0,
      };
    }

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        board[row][col].numberOfNeighboringMines = countMinesAround(
          board,
          row,
          col
        );
      }
    }
    setBoard(board);
    setStatus(GameStatus.InProgress);
  };

  return (
    <>
      <div>
        <h1>Minesweeper</h1>
        <div>
          <button onClick={() => setStatus(GameStatus.Initial)}>Reset</button>
        </div>
      </div>

      <div className="mx-auto flex flex-col items-center">
        {status === "loading" && <div>Loading...</div>}
        {status === GameStatus.Initial &&
          [0, 1, 2, 3, 4, 5, 6, 7].map((rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex flex-row">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((colIndex) => (
                <div
                  className="w-8 h-8 border"
                  key={`row-${rowIndex}-col-${colIndex}`}
                  onClick={() =>
                    initializeGameBoard({ row: rowIndex, col: colIndex })
                  }
                ></div>
              ))}
            </div>
          ))}
        {status === "inProgress" && (
          <div>
            <div>
              {board?.map((row, rowIndex) => (
                <div key={rowIndex} className="flex flex-row">
                  {row.map((cell, colIndex) => (
                    <div key={colIndex} className="w-8 h-8 border">
                      {cell.hasMine ? "💣" : cell.numberOfNeighboringMines}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
