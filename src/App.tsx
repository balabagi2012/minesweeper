import { useCallback, useState } from "react";
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
    if (board[row][col].hasMine) {
      return 0;
    }

    let count = 0;

    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
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
        newRow < 8 &&
        newCol >= 0 &&
        newCol < 8 &&
        board[newRow][newCol].hasMine
      ) {
        count++;
      }
    }
    return count;
  };

  const revealCell = useCallback(
    (board: GameBoard, row: number, col: number): void => {
      const newBoard = [...board];
      newBoard[row][col] = {
        ...newBoard[row][col],
        isRevealed: true,
      };
      setBoard(newBoard);
    },
    []
  );

  const flagCell = useCallback(
    (board: GameBoard, row: number, col: number): void => {
      const newBoard = [...board];
      newBoard[row][col] = {
        ...newBoard[row][col],
        isFlagged: !newBoard[row][col].isFlagged,
      };
      setBoard(newBoard);
    },
    []
  );

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

    for (let i = 0; i < 10; i++) {
      let row;
      let col;

      do {
        row = Math.floor(Math.random() * 8);
        col = Math.floor(Math.random() * 8);
      } while (
        board[row][col].hasMine ||
        (row === safeCell.row && col === safeCell.col)
      );

      board[row][col] = {
        ...board[row][col],
        hasMine: true,
      };
    }

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (!board[row][col].hasMine) {
          board[row][col] = {
            ...board[row][col],
            numberOfNeighboringMines: countMinesAround(board, row, col),
          };
        }
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
        {status === "inProgress" &&
          Array.isArray(board) &&
          board.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex flex-row">
              {row.map((cell, colIndex) => (
                <div
                  className="w-8 h-8 border select-none"
                  key={`row-${rowIndex}-col-${colIndex}`}
                  onClick={(event) => {
                    event.preventDefault();
                    if (!cell.isFlagged && !cell.isRevealed) {
                      console.log(
                        `Left click on row: ${rowIndex}, col: ${colIndex}`
                      );
                      revealCell(board, rowIndex, colIndex);
                    }
                  }}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    console.log(
                      `Right click on row: ${rowIndex}, col: ${colIndex}`
                    );
                    flagCell(board, rowIndex, colIndex);
                  }}
                  onDoubleClick={(event) => {
                    event.preventDefault();
                    console.log(
                      `Double click on row: ${rowIndex}, col: ${colIndex}`
                    );
                  }}
                >
                  {cell.isFlagged
                    ? "🚩"
                    : cell.isRevealed
                    ? cell.hasMine
                      ? "💣"
                      : cell.numberOfNeighboringMines
                    : "❓"}
                </div>
              ))}
            </div>
          ))}
      </div>
    </>
  );
}

export default App;
