import { create } from 'zustand';
import { GameMode, GameState, Bird, Pipe } from '../types/game';
import { GameQuestion, getGameQuestions, getQuestionById, hasRewardDrop } from '../data/gameData';
import { GAME_CONFIG, PHYSICS, DIMENSIONS } from '../config/gameConfig';
import { soundManager } from '../utils/soundManager';

// 存档点接口
interface SavePoint {
  gameTime: number;
  score: number;
  bird: Bird;
  pipes: Pipe[];
  currentQuestionIndex: number;
  answeredQuestions: number[];
  lastQuestionTime: number;
}

interface GameStore {
  // 游戏基础状态
  gameMode: GameMode | null;
  gameState: GameState;
  score: number;
  
  // 鸟的状态
  bird: Bird;
  
  // 管道状态
  pipes: Pipe[];
  
  // 问题相关状态
  currentQuestionIndex: number;
  answeredQuestions: number[];
  showQuestionPopup: boolean;
  showRewardPopup: boolean;
  showNoRewardMessage: boolean;
  questionTimer: number;
  
  // 倒计时相关状态
  showCountdown: boolean;
  countdownText: string;
  countdownTimer: number;
  
  // 游戏计时
  gameTime: number;
  lastQuestionTime: number;
  
  // 存档点相关状态（仅简单模式使用）
  savePoints: SavePoint[];
  currentSavePointIndex: number;
  
  // 复活丹相关状态
  revivalPillsRemaining: number;
  usedRevivalAnswers: string[];
  showRevivalPopup: boolean;
  currentRevivalQuestion: GameQuestion | null;
  
  // 彩蛋收集状态
  collectedRewards: number[];
  showVictoryScreen: boolean;
  
  // Actions
  setGameMode: (mode: GameMode) => void;
  setGameState: (state: GameState) => void;
  
  // 游戏控制
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  gameOver: () => void;
  startGameWithProgress: () => void;
  
  // 鸟的控制
  jumpBird: () => void;
  updateBird: (deltaTime: number) => void;
  
  // 管道控制
  addPipe: () => void;
  updatePipes: (deltaTime: number) => void;
  removePipe: (pipeId: string) => void;
  
  // 问题控制
  checkQuestionTimer: () => void;
  showQuestion: () => void;
  hideQuestion: () => void;
  answerQuestion: (isCorrect: boolean, questionId: number) => void;
  
  // 彩蛋控制
  showReward: (questionId: number) => void;
  hideReward: () => void;
  showNoReward: (questionId: number) => void;
  hideNoReward: () => void;
  
  // 倒计时控制
  startCountdown: () => void;
  hideCountdown: () => void;
  
  // 分数控制
  addScore: (points: number) => void;
  
  // 时间控制
  updateGameTime: (deltaTime: number) => void;
  
  // 存档点控制（仅简单模式使用）
  createSavePoint: () => void;
  restoreFromSavePoint: () => void;
  clearSavePoints: () => void;
  
  // 复活丹控制
  showRevivalPill: (question: GameQuestion) => void;
  hideRevivalPill: () => void;
  useRevivalPill: (answer: string) => boolean;
  resetRevivalPills: () => void;
  
  // 通关控制
  checkVictoryCondition: () => void;
  showVictory: () => void;
  hideVictory: () => void;
  restartGame: () => void;
}

const INITIAL_BIRD: Bird = {
  x: 100,
  y: 250,
  velocity: 0,
  rotation: 0
};

export const useGameStore = create<GameStore>((set, get) => ({
  // 初始状态
  gameMode: null,
  gameState: 'menu',
  score: 0,
  bird: { ...INITIAL_BIRD },
  pipes: [],
  currentQuestionIndex: 0,
  answeredQuestions: [],
  showQuestionPopup: false,
  showRewardPopup: false,
  showNoRewardMessage: false,
  questionTimer: 0,
  showCountdown: false,
  countdownText: '',
  countdownTimer: 0,
  gameTime: 0,
  lastQuestionTime: 0,
  savePoints: [],
  currentSavePointIndex: -1,
  revivalPillsRemaining: 3,
  usedRevivalAnswers: [],
  showRevivalPopup: false,
  currentRevivalQuestion: null,
  collectedRewards: [],
  showVictoryScreen: false,

  // 基础设置
  setGameMode: (mode) => set({ gameMode: mode }),
  setGameState: (state) => set({ gameState: state }),

  // 游戏控制
  startGame: () => {
    const initialBird = { ...INITIAL_BIRD };
    
    set({
      gameState: 'playing',
      score: 0,
      gameTime: 0,
      bird: initialBird,
      pipes: [],
      currentQuestionIndex: 0,
      answeredQuestions: [],
      showQuestionPopup: false,
      showRewardPopup: false,
      showNoRewardMessage: false,
      showCountdown: false,
      countdownText: '',
      countdownTimer: 0,
      lastQuestionTime: 0,
      savePoints: [],
      currentSavePointIndex: -1,
      revivalPillsRemaining: 3,
      usedRevivalAnswers: [],
      showRevivalPopup: false,
      currentRevivalQuestion: null,
      collectedRewards: [],
      showVictoryScreen: false
    });
    
    // 确保复活丹状态被重置
    get().resetRevivalPills();
    
    // 立即生成第一个管道
    get().addPipe();
  },

  startGameWithProgress: () => {
    const state = get();
    const initialBird = { ...INITIAL_BIRD };
    
    // 保留题目进度，重置其他游戏状态
    set({
      gameState: 'paused',
      score: 0,
      gameTime: 0,
      bird: initialBird,
      pipes: [],
      // 保留 currentQuestionIndex 和 answeredQuestions
      showQuestionPopup: false,
      showRewardPopup: false,
      showNoRewardMessage: false,
      showCountdown: false,
      countdownText: '',
      countdownTimer: 0,
      lastQuestionTime: 0,
      savePoints: [],
      currentSavePointIndex: -1,
      revivalPillsRemaining: 3,
      usedRevivalAnswers: [],
      showRevivalPopup: false,
      currentRevivalQuestion: null,
      collectedRewards: [],
      showVictoryScreen: false
    });
    
    // 确保复活丹状态被重置
    get().resetRevivalPills();
    
    // 立即生成第一个管道
    get().addPipe();
    
    // 开始预备倒计时
    get().startCountdown();
  },

  pauseGame: () => {
    const state = get();
    if (state.gameState === 'playing') {
      set({ gameState: 'paused' });
    }
  },

  resumeGame: () => {
    const state = get();
    if (state.gameState === 'paused') {
      set({ gameState: 'playing' });
    }
  },

  resetGame: () => {
    set({
      gameState: 'menu',
      gameMode: null,
      score: 0,
      bird: { ...INITIAL_BIRD },
      pipes: [],
      currentQuestionIndex: 0,
      answeredQuestions: [],
      showQuestionPopup: false,
      showRewardPopup: false,
      showNoRewardMessage: false,
      questionTimer: 0,
      showCountdown: false,
      countdownText: '',
      countdownTimer: 0,
      gameTime: 0,
      lastQuestionTime: 0,
      savePoints: [],
      currentSavePointIndex: -1,
      revivalPillsRemaining: 3,
      usedRevivalAnswers: [],
      showRevivalPopup: false,
      currentRevivalQuestion: null
    });
    // 确保复活丹状态被重置
    get().resetRevivalPills();
  },

  gameOver: () => {
    const state = get();
    
    // 播放死亡音效
    soundManager.playDeathSound();
    
    console.log('gameOver called:', {
      gameMode: state.gameMode,
      gameTime: state.gameTime,
      currentQuestionIndex: state.currentQuestionIndex,
      answeredQuestions: state.answeredQuestions
    });
    
    // 所有模式都从第0秒开始，但保留题目进度
    console.log('Restarting game from 0 seconds with progress preserved');
    get().startGameWithProgress();
  },

  // 鸟的控制
  jumpBird: () => {
    const { gameState, bird } = get();
    if (gameState === 'playing') {
      // 播放跳跃音效
      soundManager.playJumpSound();
      
      // 瞬时跳跃：直接改变位置而不是速度
      const jumpHeight = 18; // 跳跃高度调整为18
      const newY = Math.max(20, bird.y - jumpHeight); // 确保不超出顶部边界
      
      set((state) => ({
        bird: {
          ...state.bird,
          y: newY,
          velocity: 0, // 跳跃后重置速度，让重力立即生效
          rotation: -Math.PI / 6 // 跳跃时稍微向上倾斜
        }
      }));
    }
  },

  updateBird: (deltaTime) => {
    const state = get();
    if (state.gameState !== 'playing') return;
    
    const dt = deltaTime / 1000; // 转换为秒
    let newVelocity = state.bird.velocity + PHYSICS.GRAVITY * dt;
    // 限制最大速度
    newVelocity = Math.max(-PHYSICS.MAX_VELOCITY, Math.min(PHYSICS.MAX_VELOCITY, newVelocity));
    const newY = state.bird.y + newVelocity * dt;
    
    // 限制鸟的位置在画布范围内
    const birdRadius = DIMENSIONS.BIRD_SIZE / 2;
    const groundY = GAME_CONFIG.canvas.height - DIMENSIONS.GROUND_HEIGHT;
    const clampedY = Math.max(birdRadius, Math.min(newY, groundY - birdRadius));
    
    // 根据速度计算旋转角度
    const newRotation = Math.max(-Math.PI / 4, Math.min(Math.PI / 2, newVelocity * 0.1));
    
    set({
      bird: {
        ...state.bird,
        y: clampedY,
        velocity: newVelocity,
        rotation: newRotation
      }
    });
  },

  // 管道控制
  addPipe: () => {
    if (get().gameState !== 'playing') {
      return;
    }

    const canvasHeight = GAME_CONFIG.canvas.height;
    const groundHeight = DIMENSIONS.GROUND_HEIGHT;
    const pipeGap = DIMENSIONS.PIPE_GAP;
    const minPipeHeight = 50; // 最小管道高度
    const maxPipeHeight = 300; // 最大管道高度
    
    // 可用高度（减去地面高度）
    const availableHeight = canvasHeight - groundHeight;
    
    // 计算上管道的最大高度（需要留出间隙和下管道的最小高度）
    const maxTopHeight = availableHeight - pipeGap - minPipeHeight;
    
    // 随机生成上管道高度
    const topHeight = Math.random() * (maxTopHeight - minPipeHeight) + minPipeHeight;
    
    // 计算下管道的起始Y坐标
    const bottomY = topHeight + pipeGap;
    
    const newPipe: Pipe = {
      id: Date.now().toString(),
      x: GAME_CONFIG.canvas.width + 50, // 从画布右侧外50像素开始
      topHeight,
      bottomY,
      passed: false
    };
    
    set(state => ({ 
      pipes: [...state.pipes, newPipe] 
    }));
  },

  updatePipes: (deltaTime) => {
    const state = get();
    if (state.gameState !== 'playing') return;

    // 将deltaTime从毫秒转换为秒，然后标准化到60fps
    const dt = Math.min(deltaTime / 1000 * 60, 3);
    const pipeSpeed = state.gameMode === 'hard' ? 3 : 2.5; // 管道移动速度
    
    const updatedPipes = state.pipes.map(pipe => {
      const newX = pipe.x - pipeSpeed * dt;
      
      // 检查是否通过管道（加分）
      if (!pipe.passed && newX + 60 < state.bird.x) {
        get().addScore(1);
        return { ...pipe, x: newX, passed: true };
      }
      
      return { ...pipe, x: newX };
    }).filter(pipe => pipe.x > -80); // 移除屏幕外的管道
    
    set({ pipes: updatedPipes });
  },

  removePipe: (pipeId) => {
    set(state => ({
      pipes: state.pipes.filter(pipe => pipe.id !== pipeId)
    }));
  },

  // 问题控制
  checkQuestionTimer: () => {
    const state = get();
    if (state.gameState !== 'playing' || state.showQuestionPopup) return;
    
    // 游戏开始后10秒弹出第一个问题，之后每10秒弹出一个问题
    if (state.gameTime >= 10000 && state.gameTime - state.lastQuestionTime >= 10000) {
      get().showQuestion();
    }
  },

  showQuestion: () => {
    const state = get();
    const questions = getGameQuestions();
    
    // 找到下一个未答过的题目
    let nextQuestionIndex = state.currentQuestionIndex;
    while (nextQuestionIndex < questions.length) {
      const questionId = questions[nextQuestionIndex].id;
      // 如果当前题目没有被答过，则显示这个题目
      if (!state.answeredQuestions.includes(questionId)) {
        // 更新currentQuestionIndex为当前要显示的题目索引
        set({
          currentQuestionIndex: nextQuestionIndex,
          showQuestionPopup: true,
          gameState: 'paused',
          lastQuestionTime: state.gameTime
        });
        return;
      }
      nextQuestionIndex++;
    }
    
    // 如果所有题目都已答过，不显示任何题目
  },

  hideQuestion: () => {
    set({
      showQuestionPopup: false,
      gameState: 'playing'
    });
  },

  answerQuestion: (isCorrect, questionId) => {
    const state = get();
    
    // 记录已回答的问题
    const newAnsweredQuestions = [...state.answeredQuestions, questionId];
    
    set({
      answeredQuestions: newAnsweredQuestions,
      showQuestionPopup: false
      // 不再自动递增currentQuestionIndex，让showQuestion方法来处理
    });

    // 在简单模式下，答题后创建存档点
    if (state.gameMode === 'simple') {
      // 延迟创建存档点，确保状态已更新
      setTimeout(() => {
        get().createSavePoint();
      }, 100);
    }

    // 如果回答正确，检查是否有彩蛋
    if (isCorrect) {
      if (hasRewardDrop(questionId)) {
        // 延迟显示彩蛋，让问题弹窗先关闭
        setTimeout(() => {
          get().showReward(questionId);
        }, 500);
      } else {
        // 延迟显示无彩蛋消息
        setTimeout(() => {
          get().showNoReward(questionId);
        }, 500);
      }
    }
    // 移除自动恢复游戏的逻辑，现在由继续按钮触发倒计时
  },

  // 彩蛋控制
  showReward: (questionId) => {
    const state = get();
    const newCollectedRewards = [...state.collectedRewards, questionId];
    
    // 播放彩蛋音效
    soundManager.playRewardSound();
    
    set({
      showRewardPopup: true,
      gameState: 'paused',
      collectedRewards: newCollectedRewards
    });
    
    // 检查是否收集完所有彩蛋
    setTimeout(() => {
      get().checkVictoryCondition();
    }, 100);
  },

  hideReward: () => {
    set({
      showRewardPopup: false,
      gameState: 'playing'
    });
  },

  showNoReward: (questionId) => {
    set({
      showNoRewardMessage: true,
      gameState: 'paused'
    });
  },

  hideNoReward: () => {
    set({
      showNoRewardMessage: false,
      gameState: 'playing'
    });
  },

  // 倒计时控制
  startCountdown: () => {
    set({
      showCountdown: true,
      countdownText: '预备',
      countdownTimer: 0,
      gameState: 'paused'
    });
    
    // 1秒后显示"开始"
    setTimeout(() => {
      const state = get();
      if (state.showCountdown) {
        set({ countdownText: '开始' });
      }
    }, 1000);
    
    // 2秒后隐藏倒计时并恢复游戏
    setTimeout(() => {
      const state = get();
      if (state.showCountdown) {
        get().hideCountdown();
      }
    }, 2000);
  },

  hideCountdown: () => {
    set({
      showCountdown: false,
      countdownText: '',
      countdownTimer: 0,
      gameState: 'playing'
    });
  },

  // 分数控制
  addScore: (points) => {
    set(state => ({
      score: state.score + points
    }));
  },

  // 时间控制
  updateGameTime: (deltaTime) => {
    const state = get();
    if (state.gameState === 'playing' && !state.showQuestionPopup) {
      const newGameTime = state.gameTime + deltaTime;
      set({
        gameTime: newGameTime
      });
    }
  },

  // 存档点控制（仅简单模式使用）
  createSavePoint: () => {
    const state = get();
    if (state.gameMode !== 'simple') return;
    
    const savePoint: SavePoint = {
      gameTime: state.gameTime,
      score: state.score,
      bird: { ...state.bird },
      pipes: state.pipes.map(pipe => ({ ...pipe })),
      currentQuestionIndex: state.currentQuestionIndex,
      answeredQuestions: [...state.answeredQuestions],
      lastQuestionTime: state.lastQuestionTime
    };
    
    set({
      savePoints: [...state.savePoints, savePoint],
      currentSavePointIndex: state.savePoints.length
    });
  },

  restoreFromSavePoint: () => {
    const state = get();
    if (state.gameMode !== 'simple' || state.savePoints.length === 0) return;
    
    // 获取最近的存档点
    const latestSavePoint = state.savePoints[state.savePoints.length - 1];
    
    set({
      gameState: 'playing',
      gameTime: latestSavePoint.gameTime,
      score: latestSavePoint.score,
      bird: { ...latestSavePoint.bird },
      pipes: latestSavePoint.pipes.map(pipe => ({ ...pipe })),
      currentQuestionIndex: latestSavePoint.currentQuestionIndex,
      answeredQuestions: [...latestSavePoint.answeredQuestions],
      lastQuestionTime: latestSavePoint.lastQuestionTime,
      showQuestionPopup: false,
      showRewardPopup: false,
      showNoRewardMessage: false,
      showCountdown: false,
      countdownText: '',
      countdownTimer: 0
    });
  },

  clearSavePoints: () => {
    set({
      savePoints: [],
      currentSavePointIndex: -1
    });
  },

  // 复活丹控制
  showRevivalPill: (question) => {
    set({
      showRevivalPopup: true,
      currentRevivalQuestion: question,
      gameState: 'paused'
    });
  },

  hideRevivalPill: () => {
    set({
      showRevivalPopup: false,
      currentRevivalQuestion: null,
      gameState: 'playing'
    });
  },

  useRevivalPill: (answer) => {
    const state = get();
    const validAnswers = ['张艺', '曼妙歌姬', '小美'];
    
    // 严格字符串匹配，只检查答案是否正确
    if (validAnswers.includes(answer)) {
      // 使用复活丹成功
      set({
        revivalPillsRemaining: state.revivalPillsRemaining - 1,
        usedRevivalAnswers: [...state.usedRevivalAnswers, answer],
        showRevivalPopup: false,
        currentRevivalQuestion: null
      });
      return true;
    }
    
    // 使用失败
    set({
      showRevivalPopup: false,
      currentRevivalQuestion: null
    });
    return false;
  },

  resetRevivalPills: () => {
    set({
      revivalPillsRemaining: 3,
      usedRevivalAnswers: [],
      showRevivalPopup: false,
      currentRevivalQuestion: null
    });
  },

  // 通关控制
  checkVictoryCondition: () => {
    const state = get();
    const totalRewardQuestions = 5; // 总共有5个彩蛋题目 (1, 3, 5, 8, 9)
    
    if (state.collectedRewards.length >= totalRewardQuestions) {
      // 收集完所有彩蛋，显示通关界面
      setTimeout(() => {
        get().showVictory();
      }, 1000); // 延迟1秒显示通关界面
    }
  },

  showVictory: () => {
    set({
      showVictoryScreen: true,
      gameState: 'paused'
    });
  },

  hideVictory: () => {
    set({
      showVictoryScreen: false
    });
  },

  restartGame: () => {
    // 重置所有游戏状态
    set({
      gameState: 'menu',
      gameTime: 0,
      score: 0,
      bird: {
        x: 100,
        y: 300,
        velocity: 0,
        rotation: 0
      },
      pipes: [],
      currentQuestionIndex: 0,
      answeredQuestions: [],
      lastQuestionTime: 0,
      showQuestionPopup: false,
      showRewardPopup: false,
      showNoRewardMessage: false,
      showCountdown: false,
      countdownText: '',
      countdownTimer: 0,
      savePoints: [],
      currentSavePointIndex: -1,
      revivalPillsRemaining: 3,
      usedRevivalAnswers: [],
      showRevivalPopup: false,
      currentRevivalQuestion: null,
      collectedRewards: [],
      showVictoryScreen: false
    });
  }
}));