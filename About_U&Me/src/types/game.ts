// 游戏模式类型
export type GameMode = 'simple' | 'hard';

// 游戏状态类型
export type GameState = 'menu' | 'playing' | 'paused' | 'gameOver' | 'questionPopup' | 'rewardPopup';

// 鸟的状态接口
export interface Bird {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
}

// 管道接口
export interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
  id: string;
}

// 游戏配置接口
export interface GameConfig {
  canvas: {
    width: number;
    height: number;
  };
  bird: {
    x: number;
    size: number;
    gravity: number;
    jumpForce: number;
    maxVelocity: number;
  };
  pipes: {
    width: number;
    gap: number;
    speed: number;
    spawnInterval: number;
  };
  question: {
    interval: number; // 30秒
  };
}

// 游戏统计接口
export interface GameStats {
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  rewardsCollected: number;
  currentQuestionIndex: number;
}

// 游戏上下文接口
export interface GameContext {
  mode: GameMode;
  state: GameState;
  stats: GameStats;
  bird: Bird;
  pipes: Pipe[];
  lastQuestionTime: number;
  gameStartTime: number;
  isGameRunning: boolean;
}