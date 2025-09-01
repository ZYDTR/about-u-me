import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import ModeSelection from './components/ModeSelection';
import GamePage from './pages/GamePage';

function App() {
  const { gameMode, gameState, setGameMode, startGame } = useGameStore();
  
  console.log('App render:', { gameMode, gameState });
  console.log('Current URL:', window.location.pathname);

  const handleModeSelect = (mode: 'simple' | 'hard') => {
    console.log('Mode selected:', mode);
    setGameMode(mode);
    startGame();
  };

  // 自动启动简单模式进行测试
  React.useEffect(() => {
    if (!gameMode) {
      console.log('Auto-starting simple mode for testing');
      handleModeSelect('simple');
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-600">
        <Routes>
          <Route 
            path="/" 
            element={
              gameMode && (gameState === 'playing' || gameState === 'paused' || gameState === 'gameOver') ? (
                <Navigate to="/game" replace />
              ) : (
                <ModeSelection onModeSelect={handleModeSelect} />
              )
            } 
          />
          <Route 
            path="/game" 
            element={
              gameMode ? (
                <GamePage />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
