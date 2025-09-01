// 音效管理器 - 处理游戏音效播放

import { GAME_SOUND_EFFECTS } from './audioAssets';

export class SoundEffectManager {
  private static instance: SoundEffectManager;
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private isEnabled: boolean = true;

  private constructor() {}

  static getInstance(): SoundEffectManager {
    if (!SoundEffectManager.instance) {
      SoundEffectManager.instance = new SoundEffectManager();
    }
    return SoundEffectManager.instance;
  }

  /**
   * 启用或禁用音效
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  /**
   * 预加载音效文件
   */
  async preloadSoundEffect(name: string): Promise<void> {
    if (this.audioCache.has(name)) return;

    const soundEffect = GAME_SOUND_EFFECTS.find(effect => effect.name === name);
    if (!soundEffect) {
      console.warn(`Sound effect not found: ${name}`);
      return;
    }

    try {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = soundEffect.path;
      
      await new Promise<void>((resolve, reject) => {
        audio.addEventListener('canplaythrough', () => resolve(), { once: true });
        audio.addEventListener('error', reject, { once: true });
      });
      
      this.audioCache.set(name, audio);
    } catch (error) {
      console.warn(`Failed to preload sound effect: ${name}`, error);
    }
  }

  /**
   * 播放音效
   */
  async playSound(name: string, volume: number = 0.7): Promise<void> {
    if (!this.isEnabled) return;

    try {
      let audio = this.audioCache.get(name);
      
      if (!audio) {
        // 如果没有预加载，尝试即时加载
        await this.preloadSoundEffect(name);
        audio = this.audioCache.get(name);
      }

      if (!audio) {
        console.warn(`Could not load sound effect: ${name}`);
        return;
      }

      // 重置音频到开始位置
      audio.currentTime = 0;
      audio.volume = Math.max(0, Math.min(1, volume));
      
      await audio.play();
    } catch (error) {
      console.warn(`Failed to play sound effect: ${name}`, error);
    }
  }

  /**
   * 播放彩蛋掉落音效
   */
  async playEasterEggDrop(): Promise<void> {
    await this.playSound('easter-egg-drop', 0.6);
  }

  /**
   * 预加载所有音效
   */
  async preloadAllSounds(): Promise<void> {
    const promises = GAME_SOUND_EFFECTS.map(effect => 
      this.preloadSoundEffect(effect.name)
    );
    
    await Promise.allSettled(promises);
  }

  /**
   * 清理音频缓存
   */
  cleanup(): void {
    this.audioCache.forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    this.audioCache.clear();
  }
}

// 导出单例实例
export const soundEffectManager = SoundEffectManager.getInstance();