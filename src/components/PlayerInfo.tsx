import React from 'react';
import { Player } from '../types';

interface PlayerInfoProps {
  playerNumber: number;
  player: Player;
  isCurrentPlayer: boolean;
}

export function PlayerInfo({ playerNumber, player, isCurrentPlayer }: PlayerInfoProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className={`p-4 rounded-lg ${isCurrentPlayer ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}>
      <h2 className="text-xl font-bold mb-2">Player {playerNumber}</h2>
      <div className="space-y-1">
        <p>Symbol: {player.symbol}</p>
        <p>Wins: {player.wins}</p>
        <p>Time: {formatTime(player.timeSpent)}</p>
      </div>
    </div>
  );
}