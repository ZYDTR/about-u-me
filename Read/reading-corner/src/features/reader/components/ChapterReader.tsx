import { useState, useEffect } from 'react';
import { Chapter, Annotation } from '../../../types';
import { ParagraphRenderer } from './ParagraphRenderer';
import { cloudService } from '../../../services/cloudService';

interface ChapterReaderProps {
  chapter: Chapter;
  userRole: 'worldsMostBeautifulWoman' | 'herManservant';
}

export function ChapterReader({ chapter, userRole }: ChapterReaderProps) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  useEffect(() => {
    // 订阅实时标注更新
    const unsubscribe = cloudService.subscribeToAnnotations(chapter.id, (newAnnotations) => {
      setAnnotations(newAnnotations);
    });

    return unsubscribe;
  }, [chapter.id]);

  const handleCreateAnnotation = async (annotation: Omit<Annotation, '_id' | 'createdAt'>) => {
    try {
      await cloudService.createAnnotation(annotation);
    } catch (error) {
      console.error('Failed to create annotation:', error);
    }
  };

  const handleMarkAsRead = async (annotationId: string) => {
    try {
      const annotation = annotations.find(a => a._id === annotationId);
      if (annotation && !annotation.readBy.includes(userRole)) {
        await cloudService.updateAnnotation(annotationId, {
          readBy: [...annotation.readBy, userRole]
        });
      }
    } catch (error) {
      console.error('Failed to mark annotation as read:', error);
    }
  };

  return (
    <div className="space-y-8">
      <header className="text-center border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {chapter.title}
        </h1>
      </header>

      <div className="prose prose-lg max-w-none">
        {chapter.content.map((paragraph, index) => (
          <ParagraphRenderer
            key={paragraph.id}
            paragraph={paragraph}
            chapterId={chapter.id}
            paragraphIndex={index}
            annotations={annotations.filter(a => a.range.paragraphIndex === index)}
            userRole={userRole}
            onCreateAnnotation={handleCreateAnnotation}
            onMarkAsRead={handleMarkAsRead}
          />
        ))}
      </div>

      {/* 底部占位空间，避免内容被遮挡 */}
      <div className="h-32" />
    </div>
  );
}