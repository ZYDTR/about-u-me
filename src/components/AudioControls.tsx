import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';
import { soundManager } from '../utils/soundManager';
import { AudioAssetManager, BACKGROUND_MUSIC_ASSETS, AUDIO_SETUP_GUIDE } from '../utils/audioAssets';

interface AudioControlsProps {
  className?: string;
}

const AudioControls: React.FC<AudioControlsProps> = ({ className = '' }) => {
  const [audioSettings, setAudioSettings] = useState(soundManager.getAudioSettings());
  const [musicStatus, setMusicStatus] = useState(soundManager.getMusicStatus());
  const [availableMusic, setAvailableMusic] = useState<typeof BACKGROUND_MUSIC_ASSETS>([]);
  const [selectedMusic, setSelectedMusic] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  // 更新状态
  const updateStatus = () => {
    setAudioSettings(soundManager.getAudioSettings());
    setMusicStatus(soundManager.getMusicStatus());
  };

  // 检查可用音频文件
  const checkAvailableMusic = async () => {
    const available = await AudioAssetManager.getAvailableAssets();
    setAvailableMusic(available);
    
    if (available.length === 0) {
      setShowSetupGuide(true);
    } else if (!selectedMusic && available.length > 0) {
      setSelectedMusic(available[0].name);
    }
  };

  useEffect(() => {
    checkAvailableMusic();
  }, []);

  // 加载背景音乐
  const handleLoadMusic = async (musicName: string) => {
    if (!musicName) return;
    
    setIsLoading(true);
    const asset = AudioAssetManager.getAssetByName(musicName);
    
    if (asset) {
      const success = await soundManager.loadBackgroundMusic(asset.path);
      if (success) {
        setSelectedMusic(musicName);
        updateStatus();
      } else {
        alert('音频文件加载失败，请检查文件是否存在');
      }
    }
    
    setIsLoading(false);
  };

  // 播放/暂停背景音乐
  const handlePlayPause = async () => {
    if (!musicStatus.loaded) {
      if (selectedMusic) {
        await handleLoadMusic(selectedMusic);
      }
      return;
    }

    if (musicStatus.isPlaying) {
      soundManager.pauseBackgroundMusic();
    } else {
      const success = await soundManager.tryPlayMusicAfterUserInteraction();
      if (!success) {
        alert('无法播放音频，可能是由于浏览器的自动播放限制。请先与页面进行交互。');
      }
    }
    updateStatus();
  };

  // 切换背景音乐开关
  const handleMusicToggle = (enabled: boolean) => {
    soundManager.setMusicEnabled(enabled);
    updateStatus();
  };

  // 调整音量
  const handleVolumeChange = (type: 'music' | 'effects', value: number) => {
    if (type === 'music') {
      soundManager.setMusicVolume(value / 100);
    } else {
      soundManager.setEffectsVolume(value / 100);
    }
    updateStatus();
  };

  // 主静音切换
  const handleMasterMute = () => {
    soundManager.setMasterMute(!audioSettings.masterMuted);
    updateStatus();
  };

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Music className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-800">音频控制</h3>
      </div>

      {/* 主静音控制 */}
      <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded">
        <span className="text-sm font-medium text-gray-700">主静音</span>
        <button
          onClick={handleMasterMute}
          className={`p-2 rounded-full transition-colors ${
            audioSettings.masterMuted
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
          }`}
        >
          {audioSettings.masterMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* 背景音乐控制 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={audioSettings.musicEnabled}
              onChange={(e) => handleMusicToggle(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">背景音乐</span>
          </label>
        </div>

        {audioSettings.musicEnabled && (
          <>
            {/* 音乐选择 */}
            {availableMusic.length > 0 ? (
              <div className="space-y-2">
                <select
                  value={selectedMusic}
                  onChange={(e) => handleLoadMusic(e.target.value)}
                  disabled={isLoading}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">选择背景音乐</option>
                  {availableMusic.map((asset) => (
                    <option key={asset.name} value={asset.name}>
                      {asset.description}
                    </option>
                  ))}
                </select>

                {/* 播放控制 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePlayPause}
                    disabled={isLoading || !selectedMusic}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : musicStatus.isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    {isLoading ? '加载中...' : musicStatus.isPlaying ? '暂停' : '播放'}
                  </button>
                  
                  {musicStatus.loaded && (
                    <span className="text-xs text-gray-500">
                      {musicStatus.isPlaying ? '正在播放' : '已暂停'}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                未找到音频文件
                <button
                  onClick={() => setShowSetupGuide(!showSetupGuide)}
                  className="ml-2 text-blue-500 hover:text-blue-700 underline"
                >
                  查看设置指南
                </button>
              </div>
            )}
          </>
        )}

        {/* 音量控制 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">背景音乐音量</label>
            <span className="text-xs text-gray-500">{Math.round(audioSettings.musicVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={audioSettings.musicVolume * 100}
            onChange={(e) => handleVolumeChange('music', parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">音效音量</label>
            <span className="text-xs text-gray-500">{Math.round(audioSettings.effectsVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={audioSettings.effectsVolume * 100}
            onChange={(e) => handleVolumeChange('effects', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* 设置指南 */}
      {showSetupGuide && (
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-blue-800">音频文件设置指南</h4>
            <button
              onClick={() => setShowSetupGuide(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </div>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>目录:</strong> {AUDIO_SETUP_GUIDE.directory}</p>
            <p><strong>推荐格式:</strong> {AUDIO_SETUP_GUIDE.recommendedFormat}</p>
            <p><strong>最大文件大小:</strong> {AUDIO_SETUP_GUIDE.maxFileSize}</p>
            <div className="mt-2">
              <p><strong>设置步骤:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                {AUDIO_SETUP_GUIDE.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioControls;