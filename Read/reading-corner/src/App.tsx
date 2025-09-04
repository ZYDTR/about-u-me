import { useEffect, useState } from 'react';
import { useAuth } from './features/auth/hooks/useAuth';
import { AuthFlow } from './features/auth/components/AuthFlow';
import { ReadingSpace } from './features/reader/components/ReadingSpace';
import { cloudService } from './services/cloudService';

function App() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [cloudInitialized, setCloudInitialized] = useState(false);
  const [cloudInitializing, setCloudInitializing] = useState(true);

  useEffect(() => {
    const initializeCloud = async () => {
      try {
        await cloudService.initialize();
        setCloudInitialized(true);
      } catch (error) {
        console.error('云服务初始化失败:', error);
        // 继续使用本地模拟模式
        setCloudInitialized(true);
      } finally {
        setCloudInitializing(false);
      }
    };

    initializeCloud();
  }, []);

  if (isLoading || cloudInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {cloudInitializing ? '初始化云服务...' : '加载中...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <AuthFlow />;
  }

  return <ReadingSpace userRole={user.role} />;
}

export default App
