import { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';
import { LoginState, User } from '../../../types';

export function useAuth() {
  const [loginState, setLoginState] = useState<LoginState>({
    isAuthenticated: false,
    user: null,
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    setIsLoading(true);
    
    try {
      if (storage.isAuthValid()) {
        const auth = storage.getAuth();
        if (auth) {
          setLoginState({
            isAuthenticated: true,
            user: {
              role: auth.role as 'worldsMostBeautifulWoman' | 'herManservant',
              loginDate: auth.loginDate,
            },
          });
        }
      } else {
        storage.clearAuth();
        setLoginState({
          isAuthenticated: false,
          user: null,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setLoginState({
        isAuthenticated: false,
        user: null,
      });
    }
    
    setIsLoading(false);
  };

  const validatePassword = (password: string): 'A' | 'B' | null => {
    if (password === '021117') return 'A';
    if (password === '000726') return 'B';
    return null;
  };

  const login = (password: string, role: 'worldsMostBeautifulWoman' | 'herManservant') => {
    const userType = validatePassword(password);
    
    if (!userType) {
      throw new Error('密码错误');
    }

    // 验证角色绑定
    if (userType === 'A' && role !== 'worldsMostBeautifulWoman') {
      throw new Error('请找准自己的位置');
    }
    
    if (userType === 'B' && role !== 'herManservant') {
      throw new Error('请找准自己的位置');
    }

    const user: User = {
      role,
      loginDate: new Date().toISOString().split('T')[0],
    };

    storage.setAuth(user);
    setLoginState({
      isAuthenticated: true,
      user,
    });
  };

  const logout = () => {
    storage.clearAuth();
    setLoginState({
      isAuthenticated: false,
      user: null,
    });
  };

  return {
    ...loginState,
    isLoading,
    login,
    logout,
    validatePassword,
    checkAuthStatus,
  };
}