import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from './components/Modal';
import { PlayerInfo } from './components/PlayerInfo';
import { GameState, Player } from './types';

const TIMER_INTERVAL = 100; // 100ms interval for timer updates

function App() {
  const [gridSize, setGridSize] = useState(3);
  const [pendingGridSize, setPendingGridSize] = useState(3);
  const [players, setPlayers] = useState<Record<number, Player>>({
    1: { symbol: 'X', wins: 0, timeSpent: 0 },
    2: { symbol: 'O', wins: 0, timeSpent: 0 }
  });

  const [gameState, setGameState] = useState<GameState>({
    board: Array(gridSize).fill(null).map(() => Array(gridSize).fill(null)),
    currentPlayer: 1,
    totalGames: 0,
    isGameOver: false,
    winner: null,
    isDraw: false,
    gridSize,
    isTimerActive: true
  });

  const [showModal, setShowModal] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState<number>(Date.now());

  const checkWinner = useCallback((board: (string | null)[][], row: number, col: number) => {
    const symbol = board[row][col];
    if (!symbol) return null;

    // Check row
    if (board[row].every(cell => cell === symbol)) return true;

    // Check column
    if (board.every(r => r[col] === symbol)) return true;

    // Check diagonals
    if (row === col || row + col === board.length - 1) {
      // Main diagonal
      if (Array(board.length).fill(null)
        .every((_, i) => board[i][i] === symbol)) return true;

      // Anti-diagonal
      if (Array(board.length).fill(null)
        .every((_, i) => board[i][board.length - 1 - i] === symbol)) return true;
    }

    return false;
  }, []);

  const checkDraw = (board: (string | null)[][]) => {
    return board.every(row => row.every(cell => cell !== null));
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameState.board[row][col] || gameState.isGameOver) return;

    const newBoard = gameState.board.map(r => [...r]);
    newBoard[row][col] = players[gameState.currentPlayer].symbol;

    const isWinner = checkWinner(newBoard, row, col);
    const isDraw = !isWinner && checkDraw(newBoard);

    if (isWinner || isDraw) {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        isGameOver: true,
        winner: isWinner ? prev.currentPlayer : null,
        isDraw,
        isTimerActive: false
      }));

      if (isWinner) {
        setPlayers(prev => ({
          ...prev,
          [gameState.currentPlayer]: {
            ...prev[gameState.currentPlayer],
            wins: prev[gameState.currentPlayer].wins + 1
          }
        }));
      }

      setTimeout(() => setShowModal(true), 2000);
    } else {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        currentPlayer: prev.currentPlayer === 1 ? 2 : 1
      }));
    }
  };

  const startNewGame = () => {
    setGameState({
      board: Array(pendingGridSize).fill(null).map(() => Array(pendingGridSize).fill(null)),
      currentPlayer: 1,
      totalGames: gameState.isGameOver ? gameState.totalGames + 1 : gameState.totalGames,
      isGameOver: false,
      winner: null,
      isDraw: false,
      gridSize: pendingGridSize,
      isTimerActive: true
    });
    setGridSize(pendingGridSize);
    setPlayers(prev => ({
      ...prev,
      1: { ...prev[1], timeSpent: 0 },
      2: { ...prev[2], timeSpent: 0 }
    }));
    setLastTimestamp(Date.now());
  };

  // Timer effect
  useEffect(() => {
    if (!gameState.isTimerActive) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTimestamp;

      setPlayers(prev => ({
        ...prev,
        [gameState.currentPlayer]: {
          ...prev[gameState.currentPlayer],
          timeSpent: prev[gameState.currentPlayer].timeSpent + elapsed
        }
      }));

      setLastTimestamp(now);
    }, TIMER_INTERVAL);

    return () => clearInterval(interval);
  }, [gameState.currentPlayer, gameState.isTimerActive, lastTimestamp]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Tic-Tac-Toe</h1>
            <div className="flex items-center gap-4">
              <select
                value={pendingGridSize}
                onChange={(e) => setPendingGridSize(Number(e.target.value))}
                className="p-2 rounded border"
              >
                {Array.from({ length: 7 }, (_, i) => i + 3).map(size => (
                  <option key={size} value={size}>{size}×{size}</option>
                ))}
              </select>
              <button
                onClick={startNewGame}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                New Game
              </button>
            </div>
          </div>
          <div className="flex justify-between gap-4">
            <PlayerInfo
              playerNumber={1}
              player={players[1]}
              isCurrentPlayer={gameState.currentPlayer === 1}
            />
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">Total Games: {gameState.totalGames}</p>
              <p className="text-lg font-semibold">
                {!gameState.isGameOver && `Player ${gameState.currentPlayer}'s turn`}
              </p>
            </div>
            <PlayerInfo
              playerNumber={2}
              player={players[2]}
              isCurrentPlayer={gameState.currentPlayer === 2}
            />
          </div>
        </div>

        <div className="grid place-items-center">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              width: `${gridSize * 80}px`
            }}
          >
            {gameState.board.map((row, i) =>
              row.map((cell, j) => (
                <button
                  key={`${i}-${j}`}
                  onClick={() => handleCellClick(i, j)}
                  className={`
                    w-20 h-20 bg-white rounded-lg shadow-md text-4xl font-bold
                    flex items-center justify-center
                    ${!cell && !gameState.isGameOver ? 'hover:bg-gray-50' : ''}
                    ${cell === 'X' ? 'text-blue-500' : 'text-red-500'}
                  `}
                  disabled={!!cell || gameState.isGameOver}
                >
                  {cell}
                </button>
              ))
            )}
          </div>
        </div>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          winner={gameState.winner}
          isDraw={gameState.isDraw}
          winnerTime={gameState.winner ? players[gameState.winner].timeSpent : undefined}
        />
      </div>
    </div>
  );
}

export default App;