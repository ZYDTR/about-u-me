// 音频资源管理器

/**
 * 音频资源配置
 */
export interface AudioAsset {
  name: string;
  path: string;
  description: string;
  duration?: number; // 预估时长（秒）
  size?: string; // 文件大小
}

/**
 * 可用的背景音乐列表
 * 注意：这些文件需要手动添加到 public/audio/ 目录下
 */
export const BACKGROUND_MUSIC_ASSETS: AudioAsset[] = [
  {
    name: 'gentle-melody',
    path: '/audio/gentle-melody.mp3',
    description: '轻快温柔旋律 - 适合游戏的温柔背景音乐',
    duration: 150,
    size: '3.0MB'
  },
  {
    name: 'peaceful-melody',
    path: '/audio/peaceful-melody.mp3',
    description: '宁静旋律 - 轻松愉快的背景音乐',
    duration: 120,
    size: '2.5MB'
  },
  {
    name: 'game-loop',
    path: '/audio/game-loop.mp3', 
    description: '游戏循环 - 适合游戏的循环音乐',
    duration: 90,
    size: '2.1MB'
  },
  {
    name: 'ambient-chill',
    path: '/audio/ambient-chill.mp3',
    description: '环境音乐 - 舒缓的氛围音乐',
    duration: 180,
    size: '3.2MB'
  }
];

/**
 * 游戏音效列表
 */
export const GAME_SOUND_EFFECTS: AudioAsset[] = [
  {
    name: 'easter-egg-drop',
    path: '/audio/easter-egg-drop.mp3',
    description: '彩蛋掉落音效 - 温柔悦耳的音效',
    duration: 3,
    size: '150KB'
  }
];

/**
 * 音频文件验证器
 */
export class AudioAssetManager {
  /**
   * 检查音频文件是否存在
   * @param audioPath 音频文件路径
   */
  static async checkAudioExists(audioPath: string): Promise<boolean> {
    try {
      const response = await fetch(audioPath, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }
  
  /**
   * 获取可用的音频资源
   */
  static async getAvailableAssets(): Promise<AudioAsset[]> {
    const availableAssets: AudioAsset[] = [];
    
    for (const asset of BACKGROUND_MUSIC_ASSETS) {
      const exists = await this.checkAudioExists(asset.path);
      if (exists) {
        availableAssets.push(asset);
      }
    }
    
    return availableAssets;
  }
  
  /**
   * 根据名称获取音频资源
   * @param name 音频资源名称
   */
  static getAssetByName(name: string): AudioAsset | undefined {
    return BACKGROUND_MUSIC_ASSETS.find(asset => asset.name === name);
  }
  
  /**
   * 预加载音频文件
   * @param audioPath 音频文件路径
   */
  static async preloadAudio(audioPath: string): Promise<HTMLAudioElement | null> {
    try {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.src = audioPath;
      
      await new Promise<void>((resolve, reject) => {
        audio.addEventListener('loadedmetadata', () => resolve(), { once: true });
        audio.addEventListener('error', reject, { once: true });
      });
      
      return audio;
    } catch (error) {
      console.warn(`Failed to preload audio: ${audioPath}`, error);
      return null;
    }
  }
}

/**
 * 音频文件设置指南
 */
export const AUDIO_SETUP_GUIDE = {
  directory: 'public/audio/',
  supportedFormats: ['mp3', 'ogg', 'wav', 'm4a'],
  recommendedFormat: 'mp3',
  maxFileSize: '5MB',
  recommendedBitrate: '128kbps',
  instructions: [
    '1. 在项目根目录创建 public/audio/ 文件夹',
    '2. 将音频文件放入该文件夹',
    '3. 确保文件名与 BACKGROUND_MUSIC_ASSETS 中的路径匹配',
    '4. 推荐使用 MP3 格式，128kbps 比特率',
    '5. 文件大小建议控制在 5MB 以内',
    '6. 确保音频文件可以循环播放（无明显的开始/结束间隙）'
  ]
};