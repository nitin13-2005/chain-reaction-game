import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// import { useState } from "react";
// import { io } from "socket.io-client";
// import "./App.css";

// function App() {
//   const totalRows = 17;
//   const totalCols = 8;
//   const url = "http://192.168.1.17:8787";
//   const playerList = ["red", "blue", "green", "orange"];

//   const [currentPlayer, setCurrentPlayer] = useState(0);
//   const [moves, setMoves] = useState(0);
//   const [winner, setWinner] = useState(null);

//   const [grid, setGrid] = useState(
//     Array.from({ length: totalRows }, () =>
//       Array.from({ length: totalCols }, () => ({
//         value: 0,
//         player: null,
//       }))
//     )
//   );

//   const spreadLogic = (row, col, player, newGrid) => {
//     console.log(" spreadLogic called:", { row, col, player });

//     if (row < 0 || col < 0 || row >= totalRows || col >= totalCols) {
//       console.log(" Out of bounds:", row, col);
//       return;
//     }

//     let maxValue = 4;

//     if (
//       (row === 0 && col === 0) ||
//       (row === 0 && col === totalCols - 1) ||
//       (row === totalRows - 1 && col === 0) ||
//       (row === totalRows - 1 && col === totalCols - 1)
//     ) {
//       maxValue = 2;
//     } else if (
//       row === 0 ||
//       row === totalRows - 1 ||
//       col === 0 ||
//       col === totalCols - 1
//     ) {
//       maxValue = 3;
//     }

//     console.log(" Max Value:", maxValue);

//     newGrid[row][col].value += 1;
//     newGrid[row][col].player = player;

//     console.log(" Updated Cell:", newGrid[row][col]);

//     if (newGrid[row][col].value >= maxValue) {
//       console.log(" Explosion at:", row, col);

//       newGrid[row][col].value -= maxValue;

//       if (newGrid[row][col].value === 0) {
//         newGrid[row][col].player = null;
//       }

//       if (row > 0) spreadLogic(row - 1, col, player, newGrid);
//       if (row < totalRows - 1)
//         spreadLogic(row + 1, col, player, newGrid);
//       if (col > 0) spreadLogic(row, col - 1, player, newGrid);
//       if (col < totalCols - 1)
//         spreadLogic(row, col + 1, player, newGrid);
//     }
//   };

//   const getPlayerCounts = (grid) => {
//     const counts = new Array(playerList.length).fill(0);

//     grid.forEach((row, rIndex) => {
//       row.forEach((cell, cIndex) => {
//         if (cell.player !== null) {
//           counts[cell.player]++;
//           console.log(
//             ` Counting cell [${rIndex}, ${cIndex}] for player ${cell.player}`
//           );
//         }
//       });
//     });

//     console.log(" Player Counts:", counts);
//     return counts;
//   };

//   const handleClick = (row, col) => {
//     console.log(" Clicked:", row, col);

//     if (winner !== null) {
//       console.log(" Game already finished. Winner:", winner);
//       return;
//     }

//     const newGrid = grid.map((r) =>
//       r.map((cell) => ({ ...cell }))
//     );

//     console.log(" Cloned Grid");

//     if (
//       newGrid[row][col].player !== null &&
//       newGrid[row][col].player !== currentPlayer
//     ) {
//       console.log(" Invalid move! Cell belongs to another player");
//       return;
//     }

//     console.log(" Valid Move by Player:", currentPlayer);

//     spreadLogic(row, col, currentPlayer, newGrid);

//     console.log(" Grid after spread:", newGrid);

//     setGrid(newGrid);

//     const newMoves = moves + 1;
//     setMoves(newMoves);

//     console.log(" Total Moves:", newMoves);

//     const counts = getPlayerCounts(newGrid);

//     if (newMoves >= playerList.length) {
//       let alive = 0;
//       let win = -1;

//       for (let i = 0; i < counts.length; i++) {
//         if (counts[i] > 0) {
//           alive++;
//           win = i;
//         }
//       }

//       console.log(" Alive Players:", alive);

//       if (alive === 1) {
//         console.log(" Winner Found:", win);
//         setWinner(win);
//         return;
//       }
//     }

//     let nextPlayer = currentPlayer;

//     if (newMoves < playerList.length) {
//       nextPlayer = (currentPlayer + 1) % playerList.length;
//     } else {
//       for (let i = 1; i <= playerList.length; i++) {
//         let check = (currentPlayer + i) % playerList.length;

//         if (counts[check] !== 0) {
//           nextPlayer = check;
//           break;
//         }
//       }
//     }

//     console.log(" Next Player:", nextPlayer);
//     setCurrentPlayer(nextPlayer);
//   };

//   console.log(" Render State:", {
//     currentPlayer,
//     moves,
//     winner,
//     grid,
//   });

//   return (
//     <div className="container">
//       <h1>Chain Reaction</h1>

//       {winner !== null ? (
//         <h2 style={{ color: playerList[winner] }}>
//           Winner: {playerList[winner]}
//         </h2>
//       ) : (
//         <h2>Current Player: {playerList[currentPlayer]}</h2>
//       )}

//       <div className="grid">
//         {grid.map((rowArr, r) =>
//           rowArr.map((cell, c) => (
//             <div
//               key={r + "-" + c}
//               className="cell"
//               onClick={() => handleClick(r, c)}
//             >
//               {Array.from({ length: cell.value }).map((_, i) => (
//                 <div
//                   key={i}
//                   className="dot"
//                   style={{
//                     background: `radial-gradient(circle at 30% 30%, ${
//                       cell.player !== null
//                         ? playerList[cell.player]
//                         : "transparent"
//                     }, #000)`,
//                   }}
//                 ></div>
//               ))}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;