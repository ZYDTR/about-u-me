import { useState } from 'react';
import { Annotation } from '../../../types';
import { AnnotationDetail } from './AnnotationDetail';

interface AnnotationHighlightProps {
  annotation: Annotation;
  text: string;
  userRole: 'worldsMostBeautifulWoman' | 'herManservant';
  onMarkAsRead: (annotationId: string) => void;
}

export function AnnotationHighlight({ 
  annotation, 
  text, 
  userRole,
  onMarkAsRead 
}: AnnotationHighlightProps) {
  const [showDetail, setShowDetail] = useState(false);

  const getHighlightClass = () => {
    const baseClass = "cursor-pointer relative ";
    if (annotation.author === 'worldsMostBeautifulWoman') {
      return baseClass + "highlight-user-a hover:bg-orange-300";
    } else {
      return baseClass + "highlight-user-b hover:bg-blue-300";
    }
  };

  const handleClick = () => {
    setShowDetail(true);
    
    // 延迟标记为已读，避免误触
    setTimeout(() => {
      if (annotation._id && annotation.author !== userRole) {
        onMarkAsRead(annotation._id);
      }
    }, 1000);
  };

  const isRead = annotation.readBy.includes(userRole === annotation.author ? 
    (userRole === 'worldsMostBeautifulWoman' ? 'herManservant' : 'worldsMostBeautifulWoman') : userRole);

  const isOwn = annotation.author === userRole;

  return (
    <>
      <span 
        className={getHighlightClass()}
        onClick={handleClick}
      >
        {text}
        {/* 标注指示器 */}
        <span className="ml-1 text-xs">
          {annotation.type === 'reaction' && annotation.content === '思考' && '🤔'}
          {annotation.type === 'reaction' && annotation.content === '惊讶' && '😮'}
          {annotation.type === 'reaction' && annotation.content === '喜欢' && '❤️'}
          {annotation.type === 'reaction' && annotation.content === '疑惑' && '🤨'}
          {annotation.type === 'deferred' && '💌'}
          {annotation.type === 'comment' && '💬'}
          {annotation.type === 'voice' && '🎵'}
        </span>
        {/* 已读状态指示器 */}
        {isOwn && isRead && (
          <span className="ml-1 text-xs text-green-600">✓✓</span>
        )}
      </span>

      {showDetail && (
        <AnnotationDetail
          annotation={annotation}
          userRole={userRole}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}