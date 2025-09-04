import { useState } from 'react';
import { CommentModal } from './CommentModal';

interface AnnotationToolbarProps {
  position: { x: number; y: number };
  onCreateAnnotation: (type: 'reaction' | 'comment' | 'voice' | 'deferred', content: string) => void;
  onClose: () => void;
}

const reactions = [
  { emoji: '🤔', type: 'reaction' as const, content: '思考' },
  { emoji: '😮', type: 'reaction' as const, content: '惊讶' },
  { emoji: '❤️', type: 'reaction' as const, content: '喜欢' },
  { emoji: '🤨', type: 'reaction' as const, content: '疑惑' },
];

export function AnnotationToolbar({ position, onCreateAnnotation, onClose }: AnnotationToolbarProps) {
  const [showCommentModal, setShowCommentModal] = useState(false);

  const handleReaction = (content: string) => {
    onCreateAnnotation('reaction', content);
    onClose();
  };

  const handleDeferred = () => {
    onCreateAnnotation('deferred', '回信');
    onClose();
  };

  const handleComment = () => {
    setShowCommentModal(true);
  };

  const handleCommentSubmit = (content: string, type: 'comment' | 'voice') => {
    onCreateAnnotation(type, content);
    setShowCommentModal(false);
    onClose();
  };

  const handleCommentCancel = () => {
    setShowCommentModal(false);
    onClose();
  };

  return (
    <>
      <div 
        className="fixed bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -100%)',
        }}
      >
        <div className="flex items-center space-x-1">
          {/* 表情反应 */}
          {reactions.map((reaction) => (
            <button
              key={reaction.emoji}
              onClick={() => handleReaction(reaction.content)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors text-xl"
              title={reaction.content}
            >
              {reaction.emoji}
            </button>
          ))}
          
          {/* 分隔线 */}
          <div className="w-px h-8 bg-gray-300 mx-1" />
          
          {/* 回信 */}
          <button
            onClick={handleDeferred}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors text-xl"
            title="回信"
          >
            💌
          </button>
          
          {/* 评论 */}
          <button
            onClick={handleComment}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors text-xl"
            title="评论"
          >
            💬
          </button>
        </div>
      </div>

      {/* 点击外部关闭 */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* 评论模态框 */}
      {showCommentModal && (
        <CommentModal
          onSubmit={handleCommentSubmit}
          onCancel={handleCommentCancel}
        />
      )}
    </>
  );
}