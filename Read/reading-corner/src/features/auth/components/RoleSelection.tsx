import { useState } from 'react';

interface RoleSelectionProps {
  userType: 'A' | 'B';
  onRoleSelect: (role: 'worldsMostBeautifulWoman' | 'herManservant') => void;
  error?: string;
}

export function RoleSelection({ userType, onRoleSelect, error }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<'worldsMostBeautifulWoman' | 'herManservant' | null>(null);

  const handleRoleClick = (role: 'worldsMostBeautifulWoman' | 'herManservant') => {
    setSelectedRole(role);
    
    // 检查角色绑定逻辑
    if (userType === 'A' && role !== 'worldsMostBeautifulWoman') {
      return; // 用户A只能选择"世上最美的女人"
    }
    
    if (userType === 'B' && role !== 'herManservant') {
      return; // 用户B只能选择"她的男仆"
    }
    
    onRoleSelect(role);
  };

  const getButtonStyle = (role: 'worldsMostBeautifulWoman' | 'herManservant') => {
    // 021117 -> 用户A -> 只能选择 worldsMostBeautifulWoman
    // 000726 -> 用户B -> 只能选择 herManservant
    const isCorrectRole = (userType === 'A' && role === 'worldsMostBeautifulWoman') || 
                         (userType === 'B' && role === 'herManservant');
    
    const baseStyle = "w-full py-4 px-6 rounded-lg font-medium text-lg transition-all duration-200 ";
    
    if (!isCorrectRole) {
      return baseStyle + "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60";
    }
    
    if (role === 'worldsMostBeautifulWoman') {
      return baseStyle + "bg-orange-100 text-orange-800 border-2 border-orange-300 hover:bg-orange-200 hover:border-orange-400";
    } else {
      return baseStyle + "bg-blue-100 text-blue-800 border-2 border-blue-300 hover:bg-blue-200 hover:border-blue-400";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            欢迎来到我们的读书角落
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">共读准则</h2>
            <div className="text-left text-gray-700 space-y-2">
              <p>• 这是我们专属的阅读空间</p>
              <p>• 在这里分享思考与感悟</p>
              <p>• 每个标注都是心与心的对话</p>
              <p>• 用心感受文字间的温柔</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-center text-gray-600 text-lg">请选择你的身份</p>
          
          <div className="space-y-3">
            <button
              onClick={() => handleRoleClick('worldsMostBeautifulWoman')}
              className={getButtonStyle('worldsMostBeautifulWoman')}
              disabled={userType !== 'A'}
            >
              🌸 世上最美的女人
            </button>
            
            <button
              onClick={() => handleRoleClick('herManservant')}
              className={getButtonStyle('herManservant')}
              disabled={userType !== 'B'}
            >
              🛡️ 她的男仆
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700 text-center">请找准自己的位置</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}