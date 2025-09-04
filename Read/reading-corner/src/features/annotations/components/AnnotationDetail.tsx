import { Annotation } from '../../../types';

interface AnnotationDetailProps {
  annotation: Annotation;
  userRole: 'worldsMostBeautifulWoman' | 'herManservant';
  onClose: () => void;
}

export function AnnotationDetail({ annotation, userRole, onClose }: AnnotationDetailProps) {
  const isOwn = annotation.author === userRole;
  const authorName = annotation.author === 'worldsMostBeautifulWoman' ? '世上最美的女人' : '她的男仆';
  const authorColor = annotation.author === 'worldsMostBeautifulWoman' ? 'text-pink-700' : 'text-blue-700';
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const renderContent = () => {
    switch (annotation.type) {
      case 'reaction':
        return (
          <div className="flex items-center space-x-2">
            <span className="text-2xl">
              {annotation.content === '思考' && '🤔'}
              {annotation.content === '惊讶' && '😮'}
              {annotation.content === '喜欢' && '❤️'}
              {annotation.content === '疑惑' && '🤨'}
            </span>
            <span className="text-gray-600">{annotation.content}</span>
          </div>
        );

      case 'deferred':
        return (
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💌</span>
            <span className="text-gray-600">回信</span>
          </div>
        );

      case 'comment':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">💬</span>
              <span className="text-gray-600">评论</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-800 whitespace-pre-wrap">{annotation.content}</p>
            </div>
          </div>
        );

      case 'voice':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🎵</span>
              <span className="text-gray-600">语音</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <audio 
                src={annotation.content} 
                controls 
                className="w-full h-8"
                preload="metadata"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* 遮罩层 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      {/* 详情卡片 */}
      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl border max-w-sm w-full mx-4 z-50">
        <div className="p-4 space-y-4">
          {/* 头部 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`font-medium ${authorColor}`}>
                {isOwn ? '你' : authorName}
              </span>
              <span className="text-sm text-gray-500">
                {formatTime(annotation.createdAt)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>

          {/* 选中的文本 */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">选中文本:</p>
            <p className="text-gray-800 font-medium">"{annotation.selectedText}"</p>
          </div>

          {/* 标注内容 */}
          <div>
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}