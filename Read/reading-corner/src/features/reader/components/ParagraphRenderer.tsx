import { useState, useRef } from 'react';
import { Paragraph, Annotation } from '../../../types';
import { AnnotationToolbar } from '../../annotations/components/AnnotationToolbar';
import { AnnotationHighlight } from '../../annotations/components/AnnotationHighlight';

interface ParagraphRendererProps {
  paragraph: Paragraph;
  chapterId: string;
  paragraphIndex: number;
  annotations: Annotation[];
  userRole: 'worldsMostBeautifulWoman' | 'herManservant';
  onCreateAnnotation: (annotation: Omit<Annotation, '_id' | 'createdAt'>) => void;
  onMarkAsRead: (annotationId: string) => void;
}

interface TextSelection {
  text: string;
  startOffset: number;
  endOffset: number;
}

export function ParagraphRenderer({ 
  paragraph, 
  chapterId,
  paragraphIndex,
  annotations,
  userRole, 
  onCreateAnnotation,
  onMarkAsRead 
}: ParagraphRendererProps) {
  const [selection, setSelection] = useState<TextSelection | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState<{ x: number; y: number } | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  const handleTextSelection = () => {
    const windowSelection = window.getSelection();
    
    if (!windowSelection || windowSelection.rangeCount === 0) {
      setSelection(null);
      setToolbarPosition(null);
      return;
    }

    const range = windowSelection.getRangeAt(0);
    const selectedText = range.toString().trim();
    
    if (!selectedText || !paragraphRef.current?.contains(range.commonAncestorContainer)) {
      setSelection(null);
      setToolbarPosition(null);
      return;
    }

    // 计算在段落内的偏移量
    const paragraphText = paragraph.text;
    const startOffset = paragraphText.indexOf(selectedText);
    const endOffset = startOffset + selectedText.length;

    if (startOffset === -1) {
      setSelection(null);
      setToolbarPosition(null);
      return;
    }

    setSelection({
      text: selectedText,
      startOffset,
      endOffset
    });

    // 计算工具栏位置
    const rect = range.getBoundingClientRect();
    const scrollY = window.scrollY;
    
    setToolbarPosition({
      x: rect.left + (rect.width / 2),
      y: rect.top + scrollY - 10 // 稍微向上偏移
    });
  };

  const handleCreateAnnotation = (type: 'reaction' | 'comment' | 'voice' | 'deferred', content: string) => {
    if (!selection) return;

    const annotation = {
      chapterId,
      selectedText: selection.text,
      range: {
        paragraphIndex,
        startOffset: selection.startOffset,
        endOffset: selection.endOffset
      },
      author: userRole,
      type,
      content,
      readBy: [userRole]
    };

    onCreateAnnotation(annotation);
    
    // 清除选择
    setSelection(null);
    setToolbarPosition(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleToolbarClose = () => {
    setSelection(null);
    setToolbarPosition(null);
    window.getSelection()?.removeAllRanges();
  };

  // 渲染带有标注高亮的文本
  const renderTextWithAnnotations = () => {
    if (annotations.length === 0) {
      return paragraph.text;
    }

    // 按位置排序标注
    const sortedAnnotations = [...annotations].sort((a, b) => a.range.startOffset - b.range.startOffset);
    
    const segments: (string | JSX.Element)[] = [];
    let currentIndex = 0;

    sortedAnnotations.forEach((annotation, index) => {
      const { startOffset, endOffset } = annotation.range;
      
      // 添加标注前的文本
      if (startOffset > currentIndex) {
        segments.push(paragraph.text.slice(currentIndex, startOffset));
      }
      
      // 添加高亮标注
      segments.push(
        <AnnotationHighlight
          key={`${annotation._id}-${index}`}
          annotation={annotation}
          text={paragraph.text.slice(startOffset, endOffset)}
          userRole={userRole}
          onMarkAsRead={onMarkAsRead}
        />
      );
      
      currentIndex = endOffset;
    });
    
    // 添加剩余文本
    if (currentIndex < paragraph.text.length) {
      segments.push(paragraph.text.slice(currentIndex));
    }
    
    return segments;
  };

  return (
    <>
      <p 
        ref={paragraphRef}
        className="mb-6 leading-8 text-lg text-gray-800 select-text cursor-text"
        onMouseUp={handleTextSelection}
        onTouchEnd={handleTextSelection}
      >
        {renderTextWithAnnotations()}
      </p>

      {selection && toolbarPosition && (
        <AnnotationToolbar
          position={toolbarPosition}
          onCreateAnnotation={handleCreateAnnotation}
          onClose={handleToolbarClose}
        />
      )}
    </>
  );
}