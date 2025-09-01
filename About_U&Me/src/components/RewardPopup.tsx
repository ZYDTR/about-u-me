import React, { useState, useEffect } from 'react';
import { X, Heart, Star } from 'lucide-react';
import { getAboutYouReward } from '../data/gameData';

interface RewardPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onContinue: () => void;
  questionNumber: number;
}

const RewardPopup: React.FC<RewardPopupProps> = ({
  isVisible,
  onClose,
  onContinue,
  questionNumber
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [shouldBounce, setShouldBounce] = useState(true);

  useEffect(() => {
    if (isVisible) {
      // 先显示掉落动画
      setShowAnimation(true);
      setShowContent(false);
      setShouldBounce(true);
      
      // 1秒后显示内容
      const contentTimer = setTimeout(() => {
        setShowAnimation(false);
        setShowContent(true);
      }, 1000);
      
      // 2秒后停止跳动动画
      const bounceTimer = setTimeout(() => {
        setShouldBounce(false);
      }, 2000);
      
      return () => {
        clearTimeout(contentTimer);
        clearTimeout(bounceTimer);
      };
    } else {
      setShowAnimation(false);
      setShowContent(false);
      setShouldBounce(true);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      {/* 掉落动画 */}
      {showAnimation && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* 爱心掉落 */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`heart-${i}`}
              className="absolute animate-bounce"
              style={{
                left: `${20 + i * 10}%`,
                top: '-10%',
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            >
              <Heart 
                className="w-6 h-6 text-pink-500 fill-current drop-shadow-lg animate-bounce" 
              />
            </div>
          ))}
          
          {/* 星星掉落 */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute"
              style={{
                left: `${15 + i * 12}%`,
                top: '-10%',
                animationDelay: `${i * 0.15}s`
              }}
            >
              <Star 
                className="w-5 h-5 text-yellow-400 fill-current drop-shadow-lg animate-pulse" 
              />
            </div>
          ))}
        </div>
      )}

      {/* 奖励内容 */}
      {showContent && (
        <div className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-purple-200 ${shouldBounce ? 'animate-bounce' : ''}`}>
          {/* 头部 */}
          <div className="relative p-6 text-center border-b border-purple-200">
            <div className="absolute top-4 right-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-purple-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-purple-600" />
              </button>
            </div>
            
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white fill-current" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              About You
            </h2>
            <p className="text-sm text-purple-600 mt-1">
              第{questionNumber}题彩蛋掉落 🎁
            </p>
          </div>

          {/* 彩蛋内容 */}
          <div className="p-6">
            <div className="bg-white rounded-2xl p-6 shadow-inner border border-purple-100">
              <div className="text-center mb-4">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-purple-700">特别的话</span>
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed text-center whitespace-pre-line">
                  {getAboutYouReward(questionNumber)}
                </p>
              </div>
            </div>
            
            {/* 装饰元素 */}
            <div className="flex justify-center mt-6 space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="p-6 pt-0">
            <button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              继续游戏 💕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardPopup;