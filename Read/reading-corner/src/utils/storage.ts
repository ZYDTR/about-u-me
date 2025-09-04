import { User } from '../types';

const STORAGE_KEY = 'reading_corner_auth';

export const storage = {
  getAuth: (): { loginDate: string; role: string } | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setAuth: (user: User) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        loginDate: user.loginDate,
        role: user.role
      }));
    } catch (error) {
      console.error('Failed to save auth data:', error);
    }
  },

  clearAuth: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  },

  isAuthValid: (): boolean => {
    const auth = storage.getAuth();
    if (!auth) return false;

    const today = new Date().toISOString().split('T')[0];
    return auth.loginDate === today;
  }
};