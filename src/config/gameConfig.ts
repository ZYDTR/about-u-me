import { GameConfig } from '../types/game';

// 游戏配置常量
export const GAME_CONFIG: GameConfig = {
  canvas: {
    width: 400,
    height: 600
  },
  bird: {
    x: 100,
    size: 30,
    gravity: 30,
    jumpForce: -30,
    maxVelocity: 40
  },
  pipes: {
    width: 60,
    gap: 150,
    speed: 2,
    spawnInterval: 200 // 像素间距
  },
  question: {
    interval: 30000 // 30秒 = 30000毫秒
  }
};

// 颜色配置
export const COLORS = {
  background: '#87CEEB', // 天蓝色
  bird: '#FFD700', // 金黄色
  pipe: '#32CD32', // 绿色
  ground: '#8B4513', // 棕色
  text: '#FFFFFF' // 白色
};

// 游戏物理常量
export const PHYSICS = {
  GRAVITY: 7500,
  JUMP_FORCE: -30,
  MAX_VELOCITY: 150,
  PIPE_SPEED: 2
};

// 游戏尺寸常量
export const DIMENSIONS = {
  BIRD_SIZE: 30,
  PIPE_WIDTH: 60,
  PIPE_GAP: 150,
  GROUND_HEIGHT: 50
};