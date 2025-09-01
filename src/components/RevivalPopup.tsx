import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { hasRewardDrop } from '../data/gameData';

interface RevivalPopupProps {
  onRevive: () => void;
  onFail: () => void;
}

const RevivalPopup: React.FC<RevivalPopupProps> = ({ onRevive, onFail }) => {
  const { 
    showRevivalPopup, 
    revivalPillsRemaining, 
    useRevivalPill, 
    hideRevivalPill,
    currentRevivalQuestion,
    showReward,
    showNoReward
  } = useGameStore();
  
  const [answer, setAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shouldBounce, setShouldBounce] = useState(true);
  const [showDTooltip, setShowDTooltip] = useState(false);

  useEffect(() => {
    if (showRevivalPopup) {
      setAnswer('');
      setSelectedOption('');
      setShowError(false);
      setShowSuccess(false);
      setShouldBounce(true);
      setShowDTooltip(false);
      
      // 2秒后停止跳动动画
      const timer = setTimeout(() => {
        setShouldBounce(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showRevivalPopup]);

  const handleSubmit = () => {
    // 只检查A、B、C选项（都是正确答案）
    if (selectedOption === 'A' || selectedOption === 'B' || selectedOption === 'C') {
      // 复活成功，显示成功提示
      setShowSuccess(true);
    } else {
      // 没有选择任何选项
      return;
    }
  };

  const handleDOptionClick = () => {
    setShowDTooltip(true);
    // 3秒后自动隐藏提示
    setTimeout(() => {
      setShowDTooltip(false);
    }, 3000);
  };

  const handleSuccessConfirm = () => {
    // 减少复活丹数量并关闭界面
    const state = useGameStore.getState();
    
    if (currentRevivalQuestion) {
      // 将题目标记为已答过
      const newAnsweredQuestions = [...state.answeredQuestions, currentRevivalQuestion.id];
      
      useGameStore.setState({
        revivalPillsRemaining: state.revivalPillsRemaining - 1,
        showRevivalPopup: false,
        currentRevivalQuestion: null,
        showQuestionPopup: false, // 确保关闭问题弹窗
        answeredQuestions: newAnsweredQuestions // 标记题目为已答过
      });
      
      setShowSuccess(false);
      
      // 调用onRevive回调
      onRevive();
      
      // 延迟检查彩蛋，确保问题弹窗先关闭
      setTimeout(() => {
        if (hasRewardDrop(currentRevivalQuestion.id)) {
          showReward(currentRevivalQuestion.id);
        } else {
          showNoReward(currentRevivalQuestion.id);
        }
      }, 100);
    }
  };

  const handleErrorConfirm = () => {
    setShowError(false);
    hideRevivalPill();
    onFail();
  };

  if (!showRevivalPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center ${
        shouldBounce ? 'animate-bounce' : ''
      }`}>
        {showSuccess ? (
          <div className="text-green-600">
            <h2 className="text-2xl font-bold mb-4">🎉</h2>
            <p className="text-lg font-semibold mb-6">
              您的审美相当高级！正在为您检查彩蛋！
            </p>
            <button
              onClick={handleSuccessConfirm}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              确认
            </button>
          </div>
        ) : showError ? (
          <div className="text-red-600">
            <h2 className="text-2xl font-bold mb-4">😤</h2>
            <p className="text-lg font-semibold mb-6">
              胡说啊！因为你是7型审美而损失此次机会！
            </p>
            <button
              onClick={handleErrorConfirm}
              className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              确认
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-purple-600 mb-2">🧪 复活丹</h2>
              <p className="text-gray-600 mb-2">
                剩余复活丹：{revivalPillsRemaining} 颗
              </p>
              <p className="text-sm text-gray-500">
                回答正确可直接检查是否有彩蛋，每个答案只能使用一次
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                魔镜魔镜，谁是世界上最美的女人？
              </h3>
              
              <div className="space-y-3 mb-4">
                {/* A选项 */}
                <label className="flex items-center p-3 border-2 border-purple-300 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                  <input
                    type="radio"
                    name="revival-option"
                    value="A"
                    checked={selectedOption === 'A'}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="mr-3 text-purple-600"
                  />
                  <span className="text-lg">A. 当然是张艺啦</span>
                </label>
                
                {/* B选项 */}
                <label className="flex items-center p-3 border-2 border-purple-300 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                  <input
                    type="radio"
                    name="revival-option"
                    value="B"
                    checked={selectedOption === 'B'}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="mr-3 text-purple-600"
                  />
                  <span className="text-lg">B. 必须是曼妙歌姬</span>
                </label>
                
                {/* C选项 */}
                <label className="flex items-center p-3 border-2 border-purple-300 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                  <input
                    type="radio"
                    name="revival-option"
                    value="C"
                    checked={selectedOption === 'C'}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="mr-3 text-purple-600"
                  />
                  <span className="text-lg">C. 肯定是小美呀</span>
                </label>
                
                {/* D选项 - 提示按钮 */}
                <div className="relative">
                  <button
                    onClick={handleDOptionClick}
                    className="w-full flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-gray-600"
                  >
                    <span className="text-lg">D. 其他答案</span>
                  </button>
                  
                  {/* 一次性提示 */}
                  {showDTooltip && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-black text-white text-sm rounded-lg shadow-lg z-10 whitespace-nowrap">
                      你是7型审美吗？
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                确定
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RevivalPopup;