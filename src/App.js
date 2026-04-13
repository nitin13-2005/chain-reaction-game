import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://192.168.1.15:8787");

function App() {
  const totalRows = 17;
  const totalCols = 8;

  // kjhdkgdlkh kdslkfh

  const playerList = ["red", "blue"];

  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [moves, setMoves] = useState(0);
  const [winner, setWinner] = useState(null);

  const createEmptyGrid = () =>
    Array.from({ length: totalRows }, () =>
      Array.from({ length: totalCols }, () => ({
        value: 0,
        player: null,
      }))
    );

  const [grid, setGrid] = useState(createEmptyGrid());



  // ================= GAME LOGIC =================
  const spreadLogic = (row, col, player, newGrid) => {
    if (row < 0 || col < 0 || row >= totalRows || col >= totalCols) return;

    let maxValue = 4;

    if (
      (row === 0 && col === 0) ||
      (row === 0 && col === totalCols - 1) ||
      (row === totalRows - 1 && col === 0) ||
      (row === totalRows - 1 && col === totalCols - 1)
    ) {
      maxValue = 2;
    } else if (
      row === 0 ||
      row === totalRows - 1 ||
      col === 0 ||
      col === totalCols - 1
    ) {
      maxValue = 3;
    }

    newGrid[row][col].value += 1;
    newGrid[row][col].player = player;

    if (newGrid[row][col].value >= maxValue) {
      newGrid[row][col].value -= maxValue;

      if (newGrid[row][col].value === 0) {
        newGrid[row][col].player = null;
      }

      spreadLogic(row - 1, col, player, newGrid);
      spreadLogic(row + 1, col, player, newGrid);
      spreadLogic(row, col - 1, player, newGrid);
      spreadLogic(row, col + 1, player, newGrid);
    }
  };

  const getCounts = (grid) => {
    const counts = new Array(playerList.length).fill(0);

    grid.forEach((row) =>
      row.forEach((cell) => {
        if (cell.player !== null) counts[cell.player]++;
      })
    );

    return counts;
  };

// /gldkjhlskdjhldkjh
  // ================= SOCKET =================
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("roomData", (data) => {
      if (!data) return;

      setJoined(true);
      setRoomId(data.roomId);
      setGrid(data.grid || createEmptyGrid());
      setCurrentPlayer(data.currentPlayer ?? 0);
      setMoves(data.moves ?? 0);
      setWinner(data.winner ?? null);
    });

    socket.on("receive", (data) => {
      if (!data) return;

      const { row, col, player } = data;

      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((r) =>
          r.map((cell) => ({ ...cell }))
        );

        spreadLogic(row, col, player, newGrid);

        // ===== GAME STATE =====
        const counts = getCounts(newGrid);

        let newMoves = moves + 1;
        let newWinner = null;

        if (newMoves >= playerList.length) {
          let alive = 0;
          let win = -1;

          for (let i = 0; i < counts.length; i++) {
            if (counts[i] > 0) {
              alive++;
              win = i;
            }
          }

          if (alive === 1) newWinner = win;
        }

        let nextPlayer = player;

        if (newMoves < playerList.length) {
          nextPlayer = (player + 1) % playerList.length;
        } else {
          for (let i = 1; i <= playerList.length; i++) {
            let check = (player + i) % playerList.length;
            if (counts[check] !== 0) {
              nextPlayer = check;
              break;
            }
          }
        }

        setMoves(newMoves);
        setCurrentPlayer(nextPlayer);
        setWinner(newWinner);

        return newGrid;
      });
    });

    socket.on("invalid", (msg) => alert(msg));

    return () => {
      socket.off("connect");
      socket.off("roomData");
      socket.off("receive");
      socket.off("invalid");
    };
  }, [moves]);

  // ================= ROOM =================
  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    setRoomCode(code);
  };

  const createRoom = () => {
    if (!roomCode) return alert("Generate room code first");
    socket.emit("createRoom", roomCode);
  };

  const joinRoom = () => {
    if (!roomId) return alert("Enter room ID");
    socket.emit("createRoom", roomId);
  };

  

  // ================= CLICK =================
  const handleClick = (row, col) => {
    if (!joined || winner !== null) return;

    if (
      grid[row][col].player !== null &&
      grid[row][col].player !== currentPlayer
    ) {
      socket.emit("invalid", "Invalid move!");
      return;
    }

    socket.emit("send", {
      row:row,
      col:col,
      player: currentPlayer,
    });
  };

  // ================= UI =================
  return (
    <div className="container">
      {!joined ? (
        <>
          <h1>Chain Reaction</h1>

          <button onClick={generateRoomCode}>Generate Code</button>
          <h2>{roomCode}</h2>

          <button onClick={createRoom}>Create Room</button>

          <input
            placeholder="Enter Room ID"
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
          />
          <button onClick={joinRoom}>Join Room</button>
        </>
      ) : (
        <>
          <h2>Room: {roomId}</h2>

          {winner !== null ? (
            <h2 style={{ color: playerList[winner] }}>
              Winner: {playerList[winner]}
            </h2>
          ) : (
            <h2>Current Player: {playerList[currentPlayer]}</h2>
          )}

          <div className="grid">
            {grid.map((rowArr, r) =>
              rowArr.map((cell, c) => (
                <div
                  key={r + "-" + c}
                  className="cell"
                  onClick={() => handleClick(r, c)}
                >
                  {Array.from({ length: cell.value }).map((_, i) => (
                    <div
                      key={i}
                      className="dot"
                      style={{
                        background:
                          cell.player !== null
                            ? playerList[cell.player]
                            : "transparent",
                      }}
                    />
                  ))}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;