import React, { useState, useEffect } from 'react';
import { GameQuestion } from '../data/gameData';
import { X } from 'lucide-react';

interface QuestionPopupProps {
  question: GameQuestion;
  onAnswer: (isCorrect: boolean, selectedOption: string) => void;
  onClose: () => void;
  onContinue: () => void;
  isVisible: boolean;
}

const QuestionPopup: React.FC<QuestionPopupProps> = ({
  question,
  onAnswer,
  onClose,
  onContinue,
  isVisible
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  // 重置状态当问题改变时
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowResult(false);
    setShowConfirmButton(false);
  }, [question.id]);

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setShowConfirmButton(true);
  };

  const handleConfirm = () => {
    if (selectedOption === null) return;
    
    setIsAnswered(true);
    setShowResult(true);
    setShowConfirmButton(false);
    
    const selectedOptionData = question.options[selectedOption];
    const isCorrect = selectedOptionData.isCorrect;
    
    onAnswer(isCorrect, selectedOptionData.originalOption);
  };

  const handleContinue = () => {
    onContinue();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{question.id}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">About Me</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 问题内容 */}
        <div className="p-6">
          {/* 问题标题 */}
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {question.title}
          </h3>
          
          {/* 背景描述 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">
              {question.background}
            </p>
          </div>

          {/* 选项 */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ";
              
              if (isAnswered) {
                if (index === selectedOption) {
                  if (option.isCorrect) {
                    buttonClass += "border-green-500 bg-green-50 text-green-800";
                  } else {
                    buttonClass += "border-red-500 bg-red-50 text-red-800";
                  }
                } else if (option.isCorrect && showResult) {
                  buttonClass += "border-green-500 bg-green-50 text-green-800";
                } else {
                  buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
                }
              } else {
                if (index === selectedOption) {
                  buttonClass += "border-purple-500 bg-purple-50 text-purple-800";
                } else {
                  buttonClass += "border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-800";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={isAnswered}
                  className={buttonClass}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mt-1">
                      <span className="text-xs font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed flex-1">
                      {option.text}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 确认按钮 */}
          {showConfirmButton && selectedOption !== null && (
            <div className="mt-6 text-center">
              <button
                onClick={handleConfirm}
                className="bg-purple-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors"
              >
                确认答案
              </button>
            </div>
          )}

          {/* 结果显示 */}
          {showResult && selectedOption !== null && (
            <div className="mt-6 p-4 rounded-lg">
              {question.options[selectedOption].isCorrect ? (
                <div className="text-center">
                  <div className="text-green-600 font-semibold mb-2">✅ 回答正确！</div>
                  {question.hasReward && (
                    <div className="text-purple-600 text-sm">
                      🎁 准备获得About You彩蛋...
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-red-600 font-semibold mb-2">❌ 回答错误</div>
                  <div className="text-gray-600 text-sm">
                    正确答案是选项 {String.fromCharCode(65 + question.options.findIndex(opt => opt.isCorrect))}
                  </div>
                </div>
              )}
              
              {/* 继续按钮 */}
              <div className="mt-4 text-center">
                <button
                  onClick={handleContinue}
                  className="bg-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors"
                >
                  继续
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionPopup;