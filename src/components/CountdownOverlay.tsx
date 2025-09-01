import React from 'react';
import { useGameStore } from '../store/gameStore';

interface CountdownOverlayProps {
  // 可以添加额外的props如果需要
}

const CountdownOverlay: React.FC<CountdownOverlayProps> = () => {
  const { showCountdown, countdownText } = useGameStore();

  if (!showCountdown) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-2xl text-center">
        <div className="text-6xl font-bold text-gray-800 mb-4">
          {countdownText}
        </div>
        <div className="text-lg text-gray-600">
          {countdownText === '预备' ? '准备好了吗？' : '游戏开始！'}
        </div>
      </div>
    </div>
  );
};

export default CountdownOverlay;