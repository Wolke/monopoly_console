import React, { useState } from 'react';
import GameSetup from './GameSetup';
import GameBoard from './GameBoard';
import './MonopolyApp.css';

function MonopolyApp() {
  const [gameStarted, setGameStarted] = useState(false);

  const handleGameStart = () => {
    setGameStarted(true);
  };

  const handleBackToSetup = () => {
    setGameStarted(false);
  };

  return (
    <div className="monopoly-app">
      {!gameStarted ? (
        <GameSetup onGameStart={handleGameStart} />
      ) : (
        <GameBoard onBackToSetup={handleBackToSetup} />
      )}
    </div>
  );
}

export default MonopolyApp;
