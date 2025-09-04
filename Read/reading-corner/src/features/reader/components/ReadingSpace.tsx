import { useState, useEffect } from 'react';
import { Chapter } from '../../../types';
import { ChapterReader } from './ChapterReader';
import contentData from '../../../content/content.json';

interface ReadingSpaceProps {
  userRole: 'worldsMostBeautifulWoman' | 'herManservant';
}

export function ReadingSpace({ userRole }: ReadingSpaceProps) {
  const [chapters] = useState<Chapter[]>(contentData.chapters);
  const [currentChapterId, setCurrentChapterId] = useState<string>(chapters[0]?.id || '');

  const currentChapter = chapters.find(chapter => chapter.id === currentChapterId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              我们的读书角落
            </h1>
            <div className="flex items-center space-x-2">
              <div className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${userRole === 'worldsMostBeautifulWoman' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-blue-100 text-blue-800'
                }
              `}>
                {userRole === 'worldsMostBeautifulWoman' ? '🌸 世上最美的女人' : '🛡️ 她的男仆'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 章节导航 */}
      {chapters.length > 1 && (
        <nav className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex space-x-4 overflow-x-auto">
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => setCurrentChapterId(chapter.id)}
                  className={`
                    px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors
                    ${currentChapterId === chapter.id
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  {chapter.title}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* 阅读内容 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {currentChapter ? (
          <ChapterReader 
            chapter={currentChapter} 
            userRole={userRole}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">没有找到章节内容</p>
          </div>
        )}
      </main>
    </div>
  );
}