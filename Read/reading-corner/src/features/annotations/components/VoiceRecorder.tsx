import { useState, useRef, useCallback } from 'react';
import { cloudService } from '../../../services/cloudService';

interface VoiceRecorderProps {
  onSubmit: (audioUrl: string) => void;
  onCancel: () => void;
  maxDuration: number; // 秒
}

type RecorderState = 'idle' | 'recording' | 'paused' | 'completed' | 'uploading';

export function VoiceRecorder({ onSubmit, onCancel, maxDuration }: VoiceRecorderProps) {
  const [state, setState] = useState<RecorderState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= maxDuration) {
          stopRecording();
          return maxDuration;
        }
        return prev + 1;
      });
    }, 1000);
  }, [maxDuration]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
        
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setState('completed');
        
        // 停止所有音轨
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // 每秒收集数据
      setState('recording');
      setRecordingTime(0);
      startTimer();

    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('无法访问麦克风，请检查权限设置');
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === 'recording') {
      mediaRecorderRef.current.stop();
      stopTimer();
    }
  }, [state, stopTimer]);

  const pauseRecording = () => {
    if (mediaRecorderRef.current && state === 'recording') {
      mediaRecorderRef.current.pause();
      setState('paused');
      stopTimer();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && state === 'paused') {
      mediaRecorderRef.current.resume();
      setState('recording');
      startTimer();
    }
  };

  const resetRecording = () => {
    stopTimer();
    setRecordingTime(0);
    setAudioBlob(null);
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    
    setState('idle');
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;

    setState('uploading');
    setUploadProgress(0);

    try {
      // 创建文件对象
      const fileName = `voice-${Date.now()}.webm`;
      const file = new File([audioBlob], fileName, { type: 'audio/webm' });

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // 上传文件
      const uploadedUrl = await cloudService.uploadFile(file, 'voices');
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        onSubmit(uploadedUrl);
      }, 500);

    } catch (error) {
      console.error('Upload failed:', error);
      alert('上传失败，请重试');
      setState('completed');
      setUploadProgress(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* 录音状态显示 */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
          state === 'recording' ? 'bg-red-100 animate-pulse' : 
          state === 'paused' ? 'bg-yellow-100' :
          state === 'completed' ? 'bg-green-100' :
          state === 'uploading' ? 'bg-blue-100' :
          'bg-gray-100'
        }`}>
          {state === 'recording' && <span className="text-3xl">🎙️</span>}
          {state === 'paused' && <span className="text-3xl">⏸️</span>}
          {state === 'completed' && <span className="text-3xl">✅</span>}
          {state === 'uploading' && <span className="text-3xl">📤</span>}
          {state === 'idle' && <span className="text-3xl">🎤</span>}
        </div>
        
        <div className="mt-4">
          <div className="text-2xl font-mono font-bold text-gray-800">
            {formatTime(recordingTime)}
          </div>
          <div className="text-sm text-gray-500">
            最长 {formatTime(maxDuration)}
          </div>
        </div>

        {state === 'uploading' && (
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="text-sm text-gray-500 mt-1">
              上传中... {uploadProgress}%
            </div>
          </div>
        )}
      </div>

      {/* 录音控制 */}
      {state === 'idle' && (
        <div className="flex justify-center">
          <button
            onClick={startRecording}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            🎙️ 开始录音
          </button>
        </div>
      )}

      {state === 'recording' && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={pauseRecording}
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            ⏸️ 暂停
          </button>
          <button
            onClick={stopRecording}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ⏹️ 停止
          </button>
        </div>
      )}

      {state === 'paused' && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={resumeRecording}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            ▶️ 继续
          </button>
          <button
            onClick={stopRecording}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ⏹️ 停止
          </button>
        </div>
      )}

      {/* 音频预览和操作 */}
      {state === 'completed' && audioUrl && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <audio 
              src={audioUrl} 
              controls 
              className="w-full"
              preload="metadata"
            />
          </div>
          
          <div className="flex justify-between space-x-2">
            <button
              onClick={resetRecording}
              className="flex-1 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              🔄 重新录制
            </button>
            <button
              onClick={onCancel}
              className="flex-1 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              📤 提交
            </button>
          </div>
        </div>
      )}

      {state === 'uploading' && (
        <div className="text-center">
          <p className="text-gray-600">正在上传录音，请稍候...</p>
        </div>
      )}
    </div>
  );
}