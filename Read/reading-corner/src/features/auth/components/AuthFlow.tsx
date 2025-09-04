import { useState } from 'react';
import { PasswordEntry } from './PasswordEntry';
import { RoleSelection } from './RoleSelection';
import { useAuth } from '../hooks/useAuth';

export function AuthFlow() {
  const { login, validatePassword } = useAuth();
  const [step, setStep] = useState<'password' | 'role'>('password');
  const [userType, setUserType] = useState<'A' | 'B' | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handlePasswordSubmit = (inputPassword: string) => {
    const type = validatePassword(inputPassword);
    
    if (!type) {
      setError('密码错误，请重试');
      return;
    }
    
    setPassword(inputPassword);
    setUserType(type);
    setStep('role');
    setError('');
  };

  const handleRoleSelect = (role: 'worldsMostBeautifulWoman' | 'herManservant') => {
    try {
      login(password, role);
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    }
  };

  if (step === 'password') {
    return (
      <PasswordEntry 
        onPasswordSubmit={handlePasswordSubmit}
        error={error}
      />
    );
  }

  if (step === 'role' && userType) {
    return (
      <RoleSelection
        userType={userType}
        onRoleSelect={handleRoleSelect}
        error={error}
      />
    );
  }

  return null;
}