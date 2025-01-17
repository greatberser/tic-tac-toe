import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner: number | null;
  isDraw: boolean;
  winnerTime?: number;
}

export function Modal({ isOpen, onClose, winner, isDraw, winnerTime }: ModalProps) {
  if (!isOpen) return null;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="text-center">
          {isDraw ? (
            <h2 className="text-2xl font-bold mb-4">Draw! Try again :)</h2>
          ) : (
            <h2 className="text-2xl font-bold mb-4">
              Player {winner} won. Congratulations!
              {winnerTime && (
                <div className="text-lg mt-2">
                  Winning time: {formatTime(winnerTime)}
                </div>
              )}
            </h2>
          )}
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}