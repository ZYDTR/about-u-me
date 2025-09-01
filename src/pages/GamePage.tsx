import React, { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import GameCanvas from '../components/GameCanvas';
import QuestionPopup from '../components/QuestionPopup';
import RewardPopup from '../components/RewardPopup';
import NoRewardMessage from '../components/NoRewardMessage';
import RevivalPopup from '../components/RevivalPopup';
import CountdownOverlay from '../components/CountdownOverlay';
import VictoryScreen from '../components/VictoryScreen';
import { getGameQuestions, getQuestionById } from '../data/gameData';
import { soundManager } from '../utils/soundManager';
import { Pause, Play, Home } from 'lucide-react';

const GamePage: React.FC = () => {
  const {
    gameState,
    gameMode,
    score,
    currentQuestionIndex,
    showQuestionPopup,
    showRewardPopup,
    showNoRewardMessage,
    showRevivalPopup,
    showCountdown,
    showVictoryScreen,
    gameTime,
    revivalPillsRemaining,
    currentRevivalQuestion,
    jumpBird,
    pauseGame,
    resumeGame,
    resetGame,
    startGame,
    setGameMode,
    checkQuestionTimer,
    showQuestion,
    hideQuestion,
    answerQuestion,
    hideReward,
    hideNoReward,
    showRevivalPill,
    hideRevivalPill,
    startCountdown,
    updateGameTime
  } = useGameStore();

  // 自动启动游戏
  useEffect(() => {
    if (gameState === 'menu') {
      console.log('Auto-starting game from GamePage');
      setGameMode('simple'); // 设置默认游戏模式
      startGame(); // 启动游戏
    }
  }, [gameState, setGameMode, startGame]);




  // 键盘控制
  const handleKeyPress = useCallback(async (event: KeyboardEvent) => {
    // 处理首次用户交互
    if (!soundManager.getHasUserInteracted()) {
      await soundManager.handleFirstUserInteraction();
    }
    
    if (event.code === 'Space' || event.code === 'ArrowUp') {
      event.preventDefault();
      if (gameState === 'playing' && !showQuestionPopup) {
        jumpBird();
      }
    }
    if (event.code === 'Escape') {
      if (gameState === 'playing') {
        pauseGame();
      } else if (gameState === 'paused' && !showQuestionPopup && !showRewardPopup && !showNoRewardMessage) {
        resumeGame();
      }
    }
  }, [gameState, showQuestionPopup, showRewardPopup, showNoRewardMessage, jumpBird, pauseGame, resumeGame]);

  // 鼠标/触摸控制
  const handleCanvasClick = useCallback(async () => {
    // 处理首次用户交互
    if (!soundManager.getHasUserInteracted()) {
      await soundManager.handleFirstUserInteraction();
    }
    
    if (gameState === 'playing' && !showQuestionPopup) {
      jumpBird();
    }
  }, [gameState, showQuestionPopup, jumpBird]);

  // 移除重复的游戏循环，让GameCanvas统一处理时间更新和问题检查

  // 键盘事件监听
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // 获取当前问题
  const getCurrentQuestion = () => {
    const questions = getGameQuestions();
    if (currentQuestionIndex < questions.length) {
      return questions[currentQuestionIndex];
    }
    return null;
  };

  // 格式化时间显示
  const formatTime = (time: number) => {
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 计算下次问题时间
  const getNextQuestionTime = () => {
    const nextQuestionIn = 10 - ((gameTime / 1000) % 10);
    return Math.ceil(nextQuestionIn);
  };

  const currentQuestion = getCurrentQuestion();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-600 flex flex-col">
      {/* 游戏头部信息 */}
      <div className="flex items-center justify-between p-4 bg-white bg-opacity-20 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={resetGame}
            className="flex items-center space-x-2 px-3 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
          >
            <Home className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">主页</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {gameState === 'playing' && !showQuestionPopup && (
            <button
              onClick={pauseGame}
              className="flex items-center space-x-2 px-3 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <Pause className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">暂停</span>
            </button>
          )}
          
          {gameState === 'paused' && !showQuestionPopup && !showRewardPopup && !showNoRewardMessage && (
            <button
              onClick={resumeGame}
              className="flex items-center space-x-2 px-3 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <Play className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">继续</span>
            </button>
          )}
        </div>
      </div>

      {/* 游戏画布区域 */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative">
          <GameCanvas onClick={handleCanvasClick} />
          
          {/* 游戏状态覆盖层 */}
          {gameState === 'paused' && !showQuestionPopup && !showRewardPopup && !showNoRewardMessage && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="text-white text-2xl font-bold mb-4">游戏暂停</div>
                <button
                  onClick={resumeGame}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  继续游戏
                </button>
              </div>
            </div>
          )}
          
          {gameState === 'gameOver' && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="text-white text-3xl font-bold mb-6">游戏结束</div>
                <div className="space-x-4">
                  <button
                    onClick={resetGame}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >返回主页</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 操作提示 */}
      <div className="p-4 bg-white bg-opacity-20 backdrop-blur-sm">
        <div className="text-center text-white text-sm opacity-80">
          {gameState === 'playing' && !showQuestionPopup ? (
            <span>点击屏幕或按空格键让小鸟跳跃 • 按ESC暂停游戏</span>
          ) : gameState === 'paused' && !showQuestionPopup ? (
            <span>按ESC或点击继续按钮恢复游戏</span>
          ) : (
            <span>About U&Me Flappy Bird - 在游戏中了解彼此</span>
          )}
        </div>
      </div>

      {/* 问题弹窗 */}
      {showQuestionPopup && currentQuestion && (
        <QuestionPopup
          question={currentQuestion}
          onAnswer={(isCorrect, selectedOption) => {
            if (isCorrect) {
              answerQuestion(isCorrect, currentQuestion.id);
            } else {
              // 答错了，检查是否有复活丹
              if (revivalPillsRemaining > 0) {
                showRevivalPill(currentQuestion);
              } else {
                answerQuestion(isCorrect, currentQuestion.id);
              }
            }
          }}
          onClose={hideQuestion}
          onContinue={() => {
            hideQuestion();
          }}
          isVisible={showQuestionPopup}
        />
      )}

      {/* 彩蛋弹窗 */}
      {showRewardPopup && currentQuestion && (
        <RewardPopup
          isVisible={showRewardPopup}
          onClose={hideReward}
          onContinue={() => {
            hideReward();
            startCountdown();
          }}
          questionNumber={currentQuestion.id}
        />
      )}

      {/* 无彩蛋消息 */}
      {showNoRewardMessage && currentQuestion && (
        <NoRewardMessage
          isVisible={showNoRewardMessage}
          onClose={hideNoReward}
          onContinue={() => {
            hideNoReward();
            startCountdown();
          }}
          questionNumber={currentQuestion.id}
        />
      )}

      {/* 复活丹弹窗 */}
      {showRevivalPopup && currentRevivalQuestion && (
        <RevivalPopup
          onRevive={() => {
            // 复活成功后会直接显示彩蛋，这个回调现在不会被调用
            // 保留以防未来需要
          }}
          onFail={() => {
            // 复活失败，继续游戏逻辑
            answerQuestion(false, currentRevivalQuestion.id);
          }}
        />
      )}

      {/* 倒计时覆盖层 */}
      <CountdownOverlay />
      
      {/* 通关界面 */}
      {showVictoryScreen && <VictoryScreen />}
    </div>
  );
};

export default GamePage;