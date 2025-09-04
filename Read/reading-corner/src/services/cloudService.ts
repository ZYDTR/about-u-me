import cloudbase from '@cloudbase/js-sdk';
import { Annotation } from '../types';

// 腾讯云 CloudBase 服务实现
export interface CloudService {
  // 标注相关操作
  createAnnotation(annotation: Omit<Annotation, '_id' | 'createdAt'>): Promise<Annotation>;
  updateAnnotation(id: string, updates: Partial<Annotation>): Promise<Annotation>;
  getAnnotations(chapterId: string): Promise<Annotation[]>;
  deleteAnnotation(id: string): Promise<void>;
  
  // 实时监听
  subscribeToAnnotations(chapterId: string, callback: (annotations: Annotation[]) => void): () => void;
  
  // 文件上传（语音文件）
  uploadFile(file: File, path: string): Promise<string>;
  
  // 初始化方法
  initialize(): Promise<void>;
}

class TencentCloudService implements CloudService {
  private app: any = null;
  private db: any = null;
  private storage: any = null;
  private listeners: Map<string, any> = new Map();

  async initialize(): Promise<void> {
    const envId = import.meta.env.VITE_CLOUDBASE_ENV_ID;
    
    if (!envId || envId === 'your-env-id-here') {
      console.warn('CloudBase 环境未配置，使用本地存储模拟');
      return;
    }

    try {
      // 初始化 CloudBase
      this.app = cloudbase.init({
        env: envId,
      });

      // 匿名登录（开发测试用）
      const auth = this.app.auth();
      await auth.anonymousAuthProvider().signIn();

      // 初始化数据库和存储
      this.db = this.app.database();
      this.storage = this.app.uploadFile;

      console.log('CloudBase 初始化成功');
    } catch (error) {
      console.error('CloudBase 初始化失败:', error);
      console.warn('回退到本地存储模式');
    }
  }

  async createAnnotation(annotation: Omit<Annotation, '_id' | 'createdAt'>): Promise<Annotation> {
    if (!this.db) {
      return this.mockCreateAnnotation(annotation);
    }

    try {
      const newAnnotation = {
        ...annotation,
        createdAt: new Date(),
      };

      const result = await this.db.collection('annotations').add(newAnnotation);
      
      return {
        ...newAnnotation,
        _id: result.id,
      };
    } catch (error) {
      console.error('创建标注失败:', error);
      return this.mockCreateAnnotation(annotation);
    }
  }

  async updateAnnotation(id: string, updates: Partial<Annotation>): Promise<Annotation> {
    if (!this.db) {
      return this.mockUpdateAnnotation(id, updates);
    }

    try {
      await this.db.collection('annotations').doc(id).update(updates);
      
      const result = await this.db.collection('annotations').doc(id).get();
      return result.data;
    } catch (error) {
      console.error('更新标注失败:', error);
      return this.mockUpdateAnnotation(id, updates);
    }
  }

  async getAnnotations(chapterId: string): Promise<Annotation[]> {
    if (!this.db) {
      return this.mockGetAnnotations(chapterId);
    }

    try {
      const result = await this.db
        .collection('annotations')
        .where({
          chapterId: chapterId
        })
        .orderBy('createdAt', 'asc')
        .get();

      return result.data.map((doc: any) => ({
        ...doc,
        _id: doc._id,
      }));
    } catch (error) {
      console.error('获取标注失败:', error);
      return this.mockGetAnnotations(chapterId);
    }
  }

  async deleteAnnotation(id: string): Promise<void> {
    if (!this.db) {
      return this.mockDeleteAnnotation(id);
    }

    try {
      await this.db.collection('annotations').doc(id).remove();
    } catch (error) {
      console.error('删除标注失败:', error);
      return this.mockDeleteAnnotation(id);
    }
  }

  subscribeToAnnotations(chapterId: string, callback: (annotations: Annotation[]) => void): () => void {
    if (!this.db) {
      return this.mockSubscribeToAnnotations(chapterId, callback);
    }

    try {
      // 使用 CloudBase 实时数据库监听
      const watcher = this.db
        .collection('annotations')
        .where({
          chapterId: chapterId
        })
        .watch({
          onChange: (snapshot: any) => {
            const annotations = snapshot.docs.map((doc: any) => ({
              ...doc.data,
              _id: doc.id,
            }));
            callback(annotations);
          },
          onError: (error: any) => {
            console.error('实时监听错误:', error);
            // 回退到轮询模式
            this.startPolling(chapterId, callback);
          }
        });

      this.listeners.set(chapterId, watcher);

      return () => {
        if (this.listeners.has(chapterId)) {
          this.listeners.get(chapterId).close();
          this.listeners.delete(chapterId);
        }
      };
    } catch (error) {
      console.error('启动实时监听失败:', error);
      return this.mockSubscribeToAnnotations(chapterId, callback);
    }
  }

  async uploadFile(file: File, path: string): Promise<string> {
    if (!this.storage) {
      return this.mockUploadFile(file, path);
    }

    try {
      const fileName = `${path}/${Date.now()}-${file.name}`;
      
      const result = await this.storage({
        cloudPath: fileName,
        file: file,
      });

      return result.fileID;
    } catch (error) {
      console.error('文件上传失败:', error);
      return this.mockUploadFile(file, path);
    }
  }

  // 轮询模式（实时监听的备选方案）
  private startPolling(chapterId: string, callback: (annotations: Annotation[]) => void) {
    const pollInterval = setInterval(async () => {
      try {
        const annotations = await this.getAnnotations(chapterId);
        callback(annotations);
      } catch (error) {
        console.error('轮询获取数据失败:', error);
      }
    }, 3000); // 每3秒轮询一次

    // 立即执行一次
    this.getAnnotations(chapterId).then(callback);

    return () => {
      clearInterval(pollInterval);
    };
  }

  // Mock 方法（当 CloudBase 不可用时的备选方案）
  private mockAnnotations: Annotation[] = [];
  private mockListeners: ((annotations: Annotation[]) => void)[] = [];

  private async mockCreateAnnotation(annotation: Omit<Annotation, '_id' | 'createdAt'>): Promise<Annotation> {
    const newAnnotation: Annotation = {
      ...annotation,
      _id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    
    this.mockAnnotations.push(newAnnotation);
    this.notifyMockListeners();
    
    return newAnnotation;
  }

  private async mockUpdateAnnotation(id: string, updates: Partial<Annotation>): Promise<Annotation> {
    const index = this.mockAnnotations.findIndex(a => a._id === id);
    if (index === -1) throw new Error('Annotation not found');
    
    this.mockAnnotations[index] = { ...this.mockAnnotations[index], ...updates };
    this.notifyMockListeners();
    
    return this.mockAnnotations[index];
  }

  private async mockGetAnnotations(chapterId: string): Promise<Annotation[]> {
    return this.mockAnnotations.filter(a => a.chapterId === chapterId);
  }

  private async mockDeleteAnnotation(id: string): Promise<void> {
    this.mockAnnotations = this.mockAnnotations.filter(a => a._id !== id);
    this.notifyMockListeners();
  }

  private mockSubscribeToAnnotations(chapterId: string, callback: (annotations: Annotation[]) => void): () => void {
    const wrappedCallback = () => {
      const filtered = this.mockAnnotations.filter(a => a.chapterId === chapterId);
      callback(filtered);
    };
    
    this.mockListeners.push(wrappedCallback);
    wrappedCallback();
    
    return () => {
      const index = this.mockListeners.indexOf(wrappedCallback);
      if (index > -1) {
        this.mockListeners.splice(index, 1);
      }
    };
  }

  private async mockUploadFile(file: File, path: string): Promise<string> {
    // 模拟文件上传，创建本地 URL
    return URL.createObjectURL(file);
  }

  private notifyMockListeners() {
    this.mockListeners.forEach(callback => callback());
  }
}

// 导出服务实例
export const cloudService: CloudService = new TencentCloudService();