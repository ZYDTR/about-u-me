import React, { useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { Bird, Pipe } from '../types/game';
import { GAME_CONFIG, COLORS, PHYSICS, DIMENSIONS } from '../config/gameConfig';

interface GameCanvasProps {
  onClick?: () => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onClick }) => {
  // 从store获取状态和方法
  const {
    bird,
    pipes,
    gameState,
    gameMode,
    score,
    gameTime,
    jumpBird,
    updateBird,
    updatePipes,
    addPipe,
    gameOver,
    updateGameTime
  } = useGameStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // 绘制鸟
  const drawBird = useCallback((ctx: CanvasRenderingContext2D, bird: Bird) => {
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.rotation * Math.PI / 180); // 将角度转换为弧度
    
    // 绘制鸟的身体
    ctx.fillStyle = COLORS.bird;
    ctx.beginPath();
    ctx.arc(0, 0, DIMENSIONS.BIRD_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制鸟的眼睛
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(5, -5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制鸟的嘴
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(DIMENSIONS.BIRD_SIZE / 2, 0);
    ctx.lineTo(DIMENSIONS.BIRD_SIZE / 2 + 10, -2);
    ctx.lineTo(DIMENSIONS.BIRD_SIZE / 2 + 10, 2);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }, []);

  // 绘制管道
  const drawPipe = useCallback((ctx: CanvasRenderingContext2D, pipe: Pipe) => {
    const groundY = GAME_CONFIG.canvas.height - DIMENSIONS.GROUND_HEIGHT;
    const bottomHeight = groundY - pipe.bottomY;
    
    // 绘制上管道
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(pipe.x, 0, DIMENSIONS.PIPE_WIDTH, pipe.topHeight);
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 2;
    ctx.strokeRect(pipe.x, 0, DIMENSIONS.PIPE_WIDTH, pipe.topHeight);
    
    // 绘制下管道
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(pipe.x, pipe.bottomY, DIMENSIONS.PIPE_WIDTH, bottomHeight);
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 2;
    ctx.strokeRect(pipe.x, pipe.bottomY, DIMENSIONS.PIPE_WIDTH, bottomHeight);
  }, []);

  // 绘制背景
  const drawBackground = useCallback((ctx: CanvasRenderingContext2D) => {
    // 天空渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98D8E8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_CONFIG.canvas.width, GAME_CONFIG.canvas.height);
    
    // 地面
    ctx.fillStyle = COLORS.ground;
    ctx.fillRect(0, GAME_CONFIG.canvas.height - DIMENSIONS.GROUND_HEIGHT, GAME_CONFIG.canvas.width, DIMENSIONS.GROUND_HEIGHT);
  }, []);

  // 绘制UI信息
  const drawUI = useCallback((ctx: CanvasRenderingContext2D) => {
    // 分数显示已删除
  }, []);



  // 碰撞检测
  const checkCollision = useCallback((bird: Bird, pipes: Pipe[]) => {
    const birdRadius = DIMENSIONS.BIRD_SIZE / 2;
    const groundY = GAME_CONFIG.canvas.height - DIMENSIONS.GROUND_HEIGHT;
    
    // 检查是否撞到地面或天花板
    if (bird.y - birdRadius <= 0 || bird.y + birdRadius > groundY) {
      return true;
    }
    
    // 检查是否撞到管道
    for (const pipe of pipes) {
      if (bird.x + birdRadius > pipe.x && bird.x - birdRadius < pipe.x + DIMENSIONS.PIPE_WIDTH) {
        // pipe.topHeight 是上管道的高度
        // pipe.bottomY 是下管道的起始Y坐标
        // 下管道的底部是 canvasHeight - groundHeight
        const groundY = GAME_CONFIG.canvas.height - DIMENSIONS.GROUND_HEIGHT;
        if (bird.y - birdRadius < pipe.topHeight || bird.y + birdRadius > pipe.bottomY) {
          return true;
        }
      }
    }
    
    return false;
  }, []);

  // 检查是否通过管道
  const checkPipePass = useCallback((bird: Bird, pipes: Pipe[]) => {
    pipes.forEach(pipe => {
      if (!pipe.passed && bird.x > pipe.x + DIMENSIONS.PIPE_WIDTH) {
        pipe.passed = true;
        useGameStore.getState().addScore(1);
      }
    });
  }, []);

  // 使用ref存储计时器状态
  const lastTimeRef = useRef<number>(0);
  const pipeSpawnTimerRef = useRef<number>(0);



  // 处理点击/触摸事件
  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (gameState === 'playing') {
      jumpBird();
    }
    if (onClick) {
      onClick();
    }
  }, [gameState, jumpBird, onClick]);

  // 键盘事件处理
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (gameState === 'playing') {
          jumpBird();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameState, jumpBird]);

  // 启动游戏循环
  useEffect(() => {
    lastTimeRef.current = 0;
    pipeSpawnTimerRef.current = 0;
    
    const gameLoop = (currentTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        console.log('Canvas not found, skipping frame');
        return;
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.log('Context not found, skipping frame');
        return;
      }
      
      // 计算deltaTime
      const deltaTime = currentTime - (lastTimeRef.current || currentTime);
      lastTimeRef.current = currentTime;
      
      // 获取当前游戏状态
      const currentGameState = useGameStore.getState();
      
      if (currentGameState.gameState === 'playing') {
        // 更新游戏时间
        useGameStore.getState().updateGameTime(deltaTime);
        
        // 检查问题计时器
        useGameStore.getState().checkQuestionTimer();
        
        // 使用gameStore的方法更新小鸟物理
        useGameStore.getState().updateBird(deltaTime);
        
        // 使用gameStore的方法更新管道位置
        useGameStore.getState().updatePipes(deltaTime);
        
        // 生成新管道
        pipeSpawnTimerRef.current += deltaTime;
        if (pipeSpawnTimerRef.current >= 2000) { // 每2秒生成一个管道
          useGameStore.getState().addPipe();
          pipeSpawnTimerRef.current = 0;
        }
        
        // 重新获取更新后的状态进行碰撞检测
        const updatedState = useGameStore.getState();
        
        // 检查碰撞
        if (checkCollision(updatedState.bird, updatedState.pipes)) {
          useGameStore.getState().gameOver();
        } else {
          // 检查通过管道
          checkPipePass(updatedState.bird, updatedState.pipes);
        }
      }
      
      // 重新获取更新后的状态进行渲染
      const renderState = useGameStore.getState();
      
      // 渲染背景
      ctx.clearRect(0, 0, GAME_CONFIG.canvas.width, GAME_CONFIG.canvas.height);
      drawBackground(ctx);
      
      // 渲染小鸟
      drawBird(ctx, renderState.bird);
      
      // 渲染管道
      renderState.pipes.forEach(pipe => {
        drawPipe(ctx, pipe);
      });
      
      // 渲染UI
      drawUI(ctx);
      
      // 继续动画循环 (当前使用setInterval)
      // animationFrameRef.current = requestAnimationFrame(gameLoop);
    };
    
    // 使用setInterval代替requestAnimationFrame进行测试
    const intervalId = setInterval(() => {
      gameLoop(performance.now());
    }, 16); // 约60fps
    
    // 保存intervalId用于清理
    animationFrameRef.current = intervalId as any;
    
    return () => {
      if (animationFrameRef.current) {
        clearInterval(animationFrameRef.current);
      }
    };
  }, []); // 移除所有依赖，只在组件挂载时启动一次

  // 设置canvas尺寸
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = GAME_CONFIG.canvas.width;
      canvas.height = GAME_CONFIG.canvas.height;
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-2xl">
      <canvas
        ref={canvasRef}
        className="border-2 border-gray-300 rounded-lg cursor-pointer touch-none"
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
        onMouseDown={handleInteraction}
        style={{
          maxWidth: '100%',
          height: 'auto'
        }}
      />
    </div>
  );
};

export default GameCanvas;