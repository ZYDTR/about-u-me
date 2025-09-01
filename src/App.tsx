import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import ModeSelection from './components/ModeSelection';
import GamePage from './pages/GamePage';


function AppContent() {
  const { gameMode, gameState, setGameMode, startGame } = useGameStore();
  const navigate = useNavigate();
  
  console.log('App render:', { gameMode, gameState });
  console.log('Current URL:', window.location.pathname);

  const handleModeSelect = (mode: 'simple' | 'hard') => {
    console.log('Mode selected:', mode);
    setGameMode(mode);
    startGame();
    navigate('/game');
  };



  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-600">
      <Routes>
        <Route path="/" element={<ModeSelection onModeSelect={handleModeSelect} />} />
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
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
