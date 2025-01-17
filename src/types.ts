export interface Player {
  symbol: 'X' | 'O';
  wins: number;
  timeSpent: number;
}

export interface GameState {
  board: (string | null)[][];
  currentPlayer: 1 | 2;
  totalGames: number;
  isGameOver: boolean;
  winner: number | null;
  isDraw: boolean;
  gridSize: number;
  isTimerActive: boolean;
}