import { useState } from 'react';

interface PasswordEntryProps {
  onPasswordSubmit: (password: string) => void;
  error?: string;
}

export function PasswordEntry({ onPasswordSubmit, error }: PasswordEntryProps) {
  const [password, setPassword] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onPasswordSubmit(password.trim());
      
      if (error) {
        setIsShaking(true);
        setPassword('');
        setTimeout(() => setIsShaking(false), 500);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            我们的读书角落
          </h1>
          <p className="text-gray-600">请输入密码进入专属空间</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`
                w-full px-4 py-3 border rounded-lg text-center text-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${isShaking ? 'animate-pulse border-red-500' : 'border-gray-300'}
                ${error ? 'border-red-500' : ''}
              `}
              placeholder="请输入密码"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 text-center">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!password.trim()}
            className="
              w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            "
          >
            进入
          </button>
        </form>
      </div>
    </div>
  );
}