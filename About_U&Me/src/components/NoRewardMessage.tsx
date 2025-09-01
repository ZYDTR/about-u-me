import React, { useState, useEffect } from 'react';
import { Gift, X } from 'lucide-react';
import { noRewardMessage } from '../data/gameData';

interface NoRewardMessageProps {
  isVisible: boolean;
  onClose: () => void;
  onContinue: () => void;
  questionNumber: number;
}

const NoRewardMessage: React.FC<NoRewardMessageProps> = ({
  isVisible,
  onClose,
  onContinue,
  questionNumber
}) => {
  const [showContent, setShowContent] = useState(false);
  const [shouldBounce, setShouldBounce] = useState(true);

  useEffect(() => {
    if (isVisible) {
      setShowContent(true);
      setShouldBounce(true);
      
      // 2秒后停止跳动动画
      const bounceTimer = setTimeout(() => {
        setShouldBounce(false);
      }, 2000);
      
      return () => clearTimeout(bounceTimer);
    } else {
      setShowContent(false);
      setShouldBounce(true);
    }
  }, [isVisible]);

  if (!isVisible || !showContent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-sm w-full ${shouldBounce ? 'animate-bounce' : ''}`}>
        {/* 头部 */}
        <div className="relative p-6 text-center border-b border-gray-200">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-gray-400" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-700">
            第{questionNumber}题
          </h3>
        </div>

        {/* 消息内容 */}
        <div className="p-6 text-center">
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              {noRewardMessage}
            </p>
          </div>
          
          {/* 鼓励图标 */}
          <div className="flex justify-center space-x-1 mb-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
          
          <p className="text-xs text-gray-500">
            继续努力，下一题可能有惊喜哦！
          </p>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 pt-0">
          <button
            onClick={onContinue}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            继续游戏
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoRewardMessage;