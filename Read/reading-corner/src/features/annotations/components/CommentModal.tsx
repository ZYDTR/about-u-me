import { useState, useRef } from 'react';
import { VoiceRecorder } from './VoiceRecorder';

interface CommentModalProps {
  onSubmit: (content: string, type: 'comment' | 'voice') => void;
  onCancel: () => void;
}

type TabType = 'text' | 'voice';

export function CommentModal({ onSubmit, onCancel }: CommentModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [textContent, setTextContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextSubmit = async () => {
    if (!textContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      onSubmit(textContent.trim(), 'comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoiceSubmit = async (audioUrl: string) => {
    setIsSubmitting(true);
    try {
      onSubmit(audioUrl, 'voice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 p-4">
      <div className="bg-white rounded-t-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">添加标注</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* 标签页 */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'text'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📝 文字
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'voice'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🎙️ 语音
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'text' && (
            <div className="space-y-4">
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="输入你的想法..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={isSubmitting}
                >
                  取消
                </button>
                <button
                  onClick={handleTextSubmit}
                  disabled={!textContent.trim() || isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? '提交中...' : '提交'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <VoiceRecorder 
              onSubmit={handleVoiceSubmit}
              onCancel={onCancel}
              maxDuration={180} // 3分钟
            />
          )}
        </div>
      </div>
    </div>
  );
}