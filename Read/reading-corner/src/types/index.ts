export interface Annotation {
  _id?: string;
  chapterId: string;
  selectedText: string;
  range: {
    paragraphIndex: number; // 段落索引
    startOffset: number;    // 段落内起始偏移
    endOffset: number;      // 段落内结束偏移
  };
  author: 'worldsMostBeautifulWoman' | 'herManservant';
  type: 'reaction' | 'comment' | 'voice' | 'deferred';
  content: string; // 对应类型的内容
  createdAt: Date;
  readBy: ('worldsMostBeautifulWoman' | 'herManservant')[];
}

export interface Chapter {
  id: string;
  title: string;
  content: Paragraph[];
}

export interface Paragraph {
  id: string;
  text: string;
}

export interface User {
  role: 'worldsMostBeautifulWoman' | 'herManservant';
  loginDate: string;
}

export interface LoginState {
  isAuthenticated: boolean;
  user: User | null;
}