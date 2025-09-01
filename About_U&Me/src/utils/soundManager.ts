// 音效管理器
class SoundManager {
  private audioContext: AudioContext | null = null;
  private isEnabled = true;

  constructor() {
    this.initAudioContext();
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
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.02);
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
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 0.1);
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
        const baseVolume = 0.06 - (index * 0.01);
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
}

// 创建全局音效管理器实例
export const soundManager = new SoundManager();