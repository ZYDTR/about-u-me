import React, { useState, useEffect } from 'react';
import { Music, VolumeX } from 'lucide-react';
import { soundManager } from '../utils/soundManager';
import { AudioAssetManager } from '../utils/audioAssets';

interface SimpleAudioControlProps {
  className?: string;
}

export const SimpleAudioControl: React.FC<SimpleAudioControlProps> = ({ className = '' }) => {
  const [audioSettings, setAudioSettings] = useState(soundManager.getAudioSettings());
  const [availableMusic, setAvailableMusic] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 更新音频状态
  const updateStatus = () => {
    setAudioSettings(soundManager.getAudioSettings());
  };

  useEffect(() => {
    updateStatus();
    
    // 异步获取可用音频资源
    AudioAssetManager.getAvailableAssets().then(assets => {
      setAvailableMusic(assets);
    });
  }, []);
  
  useEffect(() => {
    // 如果有可用音乐且未初始化，自动加载并播放第一个
    if (availableMusic.length > 0 && !isInitialized) {
      const firstMusic = availableMusic[0];
      soundManager.loadBackgroundMusic(firstMusic.path)
        .then(() => {
          setIsInitialized(true);
          // 自动启用音乐并尝试播放
          soundManager.setMusicEnabled(true);
          soundManager.tryPlayMusicAfterUserInteraction();
          updateStatus();
        })
        .catch(console.error);
    }
  }, [availableMusic, isInitialized]);

  // 切换音乐开关
  const handleToggle = async () => {
    if (!audioSettings.musicEnabled) {
      // 启用音乐
      soundManager.setMusicEnabled(true);
      if (availableMusic.length > 0) {
        const success = await soundManager.tryPlayMusicAfterUserInteraction();
        if (!success) {
          // 如果自动播放失败，仍然启用音乐，等待用户交互
          console.log('音乐已启用，等待用户交互后播放');
        }
      }
    } else {
      // 禁用音乐
      soundManager.setMusicEnabled(false);
      soundManager.pauseBackgroundMusic();
    }
    updateStatus();
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-3 rounded-full transition-all duration-200 ${
        audioSettings.musicEnabled
          ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg'
          : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
      } ${className}`}
      title={audioSettings.musicEnabled ? '关闭背景音乐' : '开启背景音乐'}
    >
      {audioSettings.masterMuted ? (
        <VolumeX className="w-6 h-6" />
      ) : (
        <Music className="w-6 h-6" />
      )}
    </button>
  );
};

export default SimpleAudioControl;