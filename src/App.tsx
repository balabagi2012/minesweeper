import { useState } from "react";
import "./App.css";
import { GameBoard, GameStatus } from "./types";

function App() {
  const [board, setBoard] = useState<GameBoard>();
  const [status, setStatus] = useState<GameStatus>(GameStatus.Initial);

  return (
    <>
      <div>
        <h1>Minesweeper</h1>
        <div>
          <button onClick={() => setStatus(GameStatus.InProgress)}>
            {status === "initial" ? "Start" : "Reset"}
          </button>
        </div>
      </div>

      <div className="card">the board</div>
    </>
  );
}

export default App;
