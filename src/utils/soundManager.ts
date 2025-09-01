// 音效管理器
class SoundManager {
  private audioContext: AudioContext | null = null;
  private isEnabled = true;
  
  // 背景音乐相关属性
  private backgroundMusic: {
    audio: HTMLAudioElement | null;
    isPlaying: boolean;
    volume: number;
    enabled: boolean;
  } = {
    audio: null,
    isPlaying: false,
    volume: 0.3,
    enabled: false
  };
  
  // 音效音量
  private effectsVolume = 0.1;
  private masterMuted = false;

  constructor() {
    this.initAudioContext();
    this.loadSettings();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      this.isEnabled = false;
    }
  }

  private async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // 生成跳跃音效 - 柔和的上升音调
  async playJumpSound() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      await this.resumeAudioContext();
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // 柔和的正弦波
      oscillator.type = 'sine';
      
      // 频率从200Hz上升到400Hz
      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
      
      // 音量包络 - 快速上升，缓慢下降
      const volume = this.masterMuted ? 0 : this.effectsVolume;
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.15);
    } catch (error) {
      console.warn('Failed to play jump sound:', error);
    }
  }

  // 生成死亡音效 - 柔和的下降音调
  async playDeathSound() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      await this.resumeAudioContext();
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // 柔和的正弦波
      oscillator.type = 'sine';
      
      // 频率从300Hz下降到100Hz
      oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);
      
      // 音量包络 - 缓慢上升，缓慢下降
      const volume = this.masterMuted ? 0 : this.effectsVolume * 0.8;
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('Failed to play death sound:', error);
    }
  }

  // 生成彩蛋音效 - 温馨柔和的和弦音调
  async playRewardSound() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      await this.resumeAudioContext();
      
      // 创建温馨的和弦音效 (C大调三和弦: C-E-G)
      const frequencies = [261.63, 329.63, 392.00]; // C4, E4, G4
      const oscillators: OscillatorNode[] = [];
      const gainNodes: GainNode[] = [];
      
      frequencies.forEach((freq, index) => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);
        
        // 使用三角波产生更温暖的音色
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime);
        
        // 每个音符的音量稍有不同，创造层次感
        const baseVolume = this.masterMuted ? 0 : (this.effectsVolume * 0.6) - (index * 0.01);
        gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime);
        gainNode.gain.linearRampToValueAtTime(baseVolume, this.audioContext!.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext!.currentTime + 0.8);
        
        oscillators.push(oscillator);
        gainNodes.push(gainNode);
      });
      
      // 启动所有振荡器
      oscillators.forEach(osc => {
        osc.start(this.audioContext!.currentTime);
        osc.stop(this.audioContext!.currentTime + 0.8);
      });
    } catch (error) {
      console.warn('Failed to play reward sound:', error);
    }
  }

  // 启用/禁用音效
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // 获取音效状态
  getEnabled(): boolean {
    return this.isEnabled;
  }
  
  // ========== 背景音乐功能 ==========
  
  /**
   * 加载背景音乐文件
   * @param audioPath 音频文件路径（相对于public目录）
   */
  async loadBackgroundMusic(audioPath: string): Promise<boolean> {
    try {
      if (this.backgroundMusic.audio) {
        this.stopBackgroundMusic();
      }
      
      const audio = new Audio(audioPath);
      audio.loop = true;
      audio.volume = this.masterMuted ? 0 : this.backgroundMusic.volume;
      audio.preload = 'auto';
      
      // 等待音频加载完成
      await new Promise<void>((resolve, reject) => {
        audio.addEventListener('canplaythrough', () => resolve(), { once: true });
        audio.addEventListener('error', reject, { once: true });
        audio.load();
      });
      
      this.backgroundMusic.audio = audio;
      return true;
    } catch (error) {
      console.warn('Failed to load background music:', error);
      return false;
    }
  }
  
  /**
   * 播放背景音乐
   */
  async playBackgroundMusic(): Promise<boolean> {
    if (!this.backgroundMusic.audio || !this.backgroundMusic.enabled) {
      return false;
    }
    
    try {
      // 处理浏览器自动播放限制
      await this.backgroundMusic.audio.play();
      this.backgroundMusic.isPlaying = true;
      return true;
    } catch (error) {
      console.warn('Failed to play background music (likely due to autoplay policy):', error);
      return false;
    }
  }
  
  /**
   * 暂停背景音乐
   */
  pauseBackgroundMusic(): void {
    if (this.backgroundMusic.audio && this.backgroundMusic.isPlaying) {
      this.backgroundMusic.audio.pause();
      this.backgroundMusic.isPlaying = false;
    }
  }
  
  /**
   * 停止背景音乐
   */
  stopBackgroundMusic(): void {
    if (this.backgroundMusic.audio) {
      this.backgroundMusic.audio.pause();
      this.backgroundMusic.audio.currentTime = 0;
      this.backgroundMusic.isPlaying = false;
    }
  }
  
  /**
   * 设置背景音乐音量
   * @param volume 音量值 (0-1)
   */
  setMusicVolume(volume: number): void {
    this.backgroundMusic.volume = Math.max(0, Math.min(1, volume));
    if (this.backgroundMusic.audio) {
      this.backgroundMusic.audio.volume = this.masterMuted ? 0 : this.backgroundMusic.volume;
    }
    this.saveSettings();
  }
  
  /**
   * 设置音效音量
   * @param volume 音量值 (0-1)
   */
  setEffectsVolume(volume: number): void {
    this.effectsVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }
  
  /**
   * 启用/禁用背景音乐
   * @param enabled 是否启用
   */
  setMusicEnabled(enabled: boolean): void {
    this.backgroundMusic.enabled = enabled;
    if (!enabled && this.backgroundMusic.isPlaying) {
      this.pauseBackgroundMusic();
    }
    this.saveSettings();
  }
  
  /**
   * 主静音开关
   * @param muted 是否静音
   */
  setMasterMute(muted: boolean): void {
    this.masterMuted = muted;
    if (this.backgroundMusic.audio) {
      this.backgroundMusic.audio.volume = muted ? 0 : this.backgroundMusic.volume;
    }
    this.saveSettings();
  }
  
  /**
   * 获取背景音乐状态
   */
  getMusicStatus() {
    return {
      isPlaying: this.backgroundMusic.isPlaying,
      enabled: this.backgroundMusic.enabled,
      volume: this.backgroundMusic.volume,
      loaded: !!this.backgroundMusic.audio
    };
  }
  
  /**
   * 获取音频设置
   */
  getAudioSettings() {
    return {
      musicEnabled: this.backgroundMusic.enabled,
      musicVolume: this.backgroundMusic.volume,
      effectsVolume: this.effectsVolume,
      masterMuted: this.masterMuted
    };
  }
  
  /**
   * 用户交互后尝试播放背景音乐（处理自动播放限制）
   */
  async tryPlayMusicAfterUserInteraction(): Promise<boolean> {
    if (this.backgroundMusic.enabled && this.backgroundMusic.audio && !this.backgroundMusic.isPlaying) {
      return await this.playBackgroundMusic();
    }
    return false;
  }

  // 处理用户首次交互，启用音频功能
  async handleFirstUserInteraction(): Promise<void> {
    try {
      await this.resumeAudioContext();
      
      // 如果有背景音乐且启用了音乐，则尝试播放
      if (this.backgroundMusic.enabled && this.backgroundMusic.audio && !this.masterMuted) {
        await this.playBackgroundMusic();
      }
      
      // 标记已处理首次交互
      this.hasUserInteracted = true;
    } catch (error) {
      console.warn('Failed to handle first user interaction:', error);
    }
  }

  // 检查是否已处理用户交互
  private hasUserInteracted: boolean = false;

  // 获取用户交互状态
  getHasUserInteracted(): boolean {
    return this.hasUserInteracted;
  }
  
  // ========== 设置持久化 ==========
  
  /**
   * 加载用户设置
   */
  private loadSettings(): void {
    try {
      const settings = localStorage.getItem('gameAudioSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        this.backgroundMusic.enabled = parsed.musicEnabled ?? false;
        this.backgroundMusic.volume = parsed.musicVolume ?? 0.3;
        this.effectsVolume = parsed.effectsVolume ?? 0.1;
        this.masterMuted = parsed.masterMuted ?? false;
      }
    } catch (error) {
      console.warn('Failed to load audio settings:', error);
    }
  }
  
  /**
   * 保存用户设置
   */
  private saveSettings(): void {
    try {
      const settings = {
        musicEnabled: this.backgroundMusic.enabled,
        musicVolume: this.backgroundMusic.volume,
        effectsVolume: this.effectsVolume,
        masterMuted: this.masterMuted
      };
      localStorage.setItem('gameAudioSettings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save audio settings:', error);
    }
  }
}

// 创建全局音效管理器实例
export const soundManager = new SoundManager();