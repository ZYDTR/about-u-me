import React from 'react';
import { useGameStore } from '../store/gameStore';

const VictoryScreen: React.FC = () => {
  const { hideVictory, restartGame } = useGameStore();

  const handleRestart = () => {
    hideVictory();
    restartGame();
  };

  const handleClose = () => {
    hideVictory();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-green-600 mb-2">恭喜通关！</h2>
          <p className="text-gray-600 text-lg">
            你已经收集完所有彩蛋！
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleRestart}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            重新开始
          </button>
          
          <button
            onClick={handleClose}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            返回游戏
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryScreen;