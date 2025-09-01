import React, { useState } from 'react';
import { GameMode } from '../types/game';

interface ModeSelectionProps {
  onModeSelect: (mode: GameMode) => void;
}

const ModeSelection: React.FC<ModeSelectionProps> = ({ onModeSelect }) => {
  const [showPrank, setShowPrank] = useState(false);
  
  const handleModeSelect = (mode: GameMode) => {
    if (mode === 'hard') {
      // 恶搞困难模式
      setShowPrank(true);
      return;
    }
    console.log('Mode selected:', mode);
    onModeSelect(mode);
  };
  
  const closePrank = () => {
    setShowPrank(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* 游戏标题 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            About U&amp;Me
          </h1>
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">
            Flappy Bird
          </h2>
          <p className="text-gray-600 text-sm">
            选择游戏模式开始你的冒险
          </p>
        </div>

        {/* 模式选择卡片 */}
        <div className="space-y-4">
          {/* 简单模式 */}
          <button
            onClick={() => handleModeSelect('simple')}
            className="w-full p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-green-300"
          >
            <div className="text-left">
              <div className="flex items-center mb-3">
                <div className="w-4 h-4 bg-green-400 rounded-full mr-3"></div>
                <h3 className="text-xl font-bold text-gray-800">简单模式</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                答错问题时会有提示，但游戏继续进行。适合想要轻松体验的玩家。
              </p>
              <div className="mt-3 text-xs text-green-600 font-medium">
                ✨ 宽容模式 • 继续游戏
              </div>
            </div>
          </button>

          {/* 困难模式 */}
          <button
            onClick={() => handleModeSelect('hard')}
            className="w-full p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-red-300"
          >
            <div className="text-left">
              <div className="flex items-center mb-3">
                <div className="w-4 h-4 bg-red-400 rounded-full mr-3"></div>
                <h3 className="text-xl font-bold text-gray-800">困难模式</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                答错问题将重新开始游戏，需要重新选择问题。挑战你的记忆力！
              </p>
              <div className="mt-3 text-xs text-red-600 font-medium">
                🔥 挑战模式 • 重新开始
              </div>
            </div>
          </button>
        </div>

        {/* 游戏说明 */}
        <div className="bg-white/50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            游戏中每10秒会弹出"About Me"问题<br/>
            答对问题有机会获得"About You"彩蛋掉落
          </p>
        </div>
      </div>
      
      {/* 恶搞弹窗 */}
      {showPrank && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">😈</div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">骗你的！</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                困难模式是用脚玩77777
              </p>
            </div>
            
            <button
              onClick={closePrank}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              我知道了 😂
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeSelection;