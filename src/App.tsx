import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { Coordinate, GameBoard, GameStatus } from "./types";

function App() {
  const [board, setBoard] = useState<GameBoard>();
  const [status, setStatus] = useState<GameStatus>(GameStatus.Initial);
  const [flagCount, setFlagCount] = useState(0);
  const [timeCount, setTimeCount] = useState(0);

  useEffect(() => {
    if (status === GameStatus.Initial) {
      setTimeCount(0);
    } else if (status === GameStatus.InProgress) {
      const interval = setInterval(() => {
        setTimeCount((timeCount) => timeCount + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const resetGame = () => {
    setBoard(undefined);
    setStatus(GameStatus.Initial);
    setFlagCount(0);
  };

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
      if (board[row][col].isRevealed || board[row][col].isFlagged) {
        return;
      }

      const newBoard = [...board];
      newBoard[row][col] = {
        ...newBoard[row][col],
        isRevealed: true,
      };

      if (newBoard[row][col].hasMine) {
        setStatus(GameStatus.Lost);
      }

      if (
        board[row][col].numberOfNeighboringMines === 0 &&
        !board[row][col].hasMine
      ) {
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
            !board[newRow][newCol].isRevealed &&
            !board[newRow][newCol].isFlagged
          ) {
            revealCell(board, newRow, newCol);
          }
        }
      } else {
        setBoard(newBoard);
        const isWon = newBoard.every((row) =>
          row.every((cell) => cell.isRevealed || cell.hasMine)
        );
        if (isWon) {
          setStatus(GameStatus.Won);
        }
      }
    },
    []
  );

  const flagCell = useCallback(
    (board: GameBoard, row: number, col: number): void => {
      const newBoard = [...board];
      const newIsFlagged = !board[row][col].isFlagged;
      const newIsFlaggedCount = newIsFlagged ? 1 : -1;
      if (newIsFlagged && flagCount < 10) {
        setFlagCount(flagCount + newIsFlaggedCount);
      } else if (!newIsFlagged && flagCount > 0) {
        setFlagCount(flagCount + newIsFlaggedCount);
      } else {
        return;
      }
      newBoard[row][col] = {
        ...newBoard[row][col],
        isFlagged: !newBoard[row][col].isFlagged,
      };
      setBoard(newBoard);
    },
    [flagCount]
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
    revealCell(board, safeCell.row, safeCell.col);
  };

  const revealSurroundingCells = useCallback(
    (board: GameBoard, row: number, col: number): void => {
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
          !board[newRow][newCol].isRevealed &&
          !board[newRow][newCol].isFlagged
        ) {
          revealCell(board, newRow, newCol);
        }
      }
    },
    [revealCell]
  );

  return (
    <>
      <div>
        <div className="flex flex-row justify-center items-center">
          <h1>Minesweeper</h1>
          <div className="ml-auto">
            <button onClick={resetGame}>
              {status === GameStatus.Won || status === GameStatus.Lost
                ? "Retry"
                : "Reset"}
            </button>
            <p>Time: {timeCount}(s)</p>
          </div>
        </div>
      </div>
      <div className="mx-auto flex flex-col items-center">
        {status === GameStatus.Loading && <div>Loading...</div>}
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
        {(status === GameStatus.InProgress ||
          status === GameStatus.Won ||
          status === GameStatus.Lost) &&
          Array.isArray(board) &&
          board.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex flex-row">
              {row.map((cell, colIndex) => (
                <div
                  className="w-8 h-8 border select-none"
                  key={`row-${rowIndex}-col-${colIndex}`}
                  onClick={(event) => {
                    if (
                      status === GameStatus.Won ||
                      status === GameStatus.Lost
                    ) {
                      return;
                    }
                    event.preventDefault();
                    if (!cell.isFlagged && !cell.isRevealed) {
                      console.log(
                        `Left click on row: ${rowIndex}, col: ${colIndex}`
                      );
                      revealCell(board, rowIndex, colIndex);
                    }
                  }}
                  onContextMenu={(event) => {
                    if (status !== GameStatus.InProgress) {
                      return;
                    }
                    event.preventDefault();
                    console.log(
                      `Right click on row: ${rowIndex}, col: ${colIndex}`
                    );
                    flagCell(board, rowIndex, colIndex);
                  }}
                  onDoubleClick={(event) => {
                    if (status !== GameStatus.InProgress) {
                      return;
                    }
                    event.preventDefault();
                    if (!cell.isFlagged && cell.isRevealed) {
                      console.log(
                        `Double click on row: ${rowIndex}, col: ${colIndex}`
                      );
                      revealSurroundingCells(board, rowIndex, colIndex);
                    }
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
        {status === GameStatus.Won && <h1>You won!</h1>}
        {status === GameStatus.Lost && <h1>You lost!</h1>}
      </div>
    </>
  );
}

export default App;
