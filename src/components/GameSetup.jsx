import React, { useState } from 'react';
import MonopolyGame from '../monopoly/index.js';

// 遊戲設定元件 - 處理初始化遊戲和玩家設定
function GameSetup({ onGameStart }) {
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [message, setMessage] = useState('');

  // 初始化遊戲
  const initializeGame = () => {
    MonopolyGame.initGame();
    setInitialized(true);
    setMessage('遊戲已初始化，請新增玩家');
  };

  // 新增玩家
  const addHumanPlayer = () => {
    if (!newPlayerName.trim()) {
      setMessage('請輸入玩家名稱');
      return;
    }

    const player = MonopolyGame.addPlayer(newPlayerName);
    if (player) {
      setPlayers([...players, { name: newPlayerName, isAI: false }]);
      setNewPlayerName('');
      setMessage(`已新增玩家: ${newPlayerName}`);
    }
  };

  // 新增 AI 玩家
  const addAIPlayer = () => {
    const aiName = newPlayerName.trim() || undefined;
    const player = MonopolyGame.addAIPlayer(aiName);
    if (player) {
      setPlayers([...players, { name: player.name, isAI: true }]);
      setNewPlayerName('');
      setMessage(`已新增 AI 玩家: ${player.name}`);
    }
  };

  // 開始遊戲
  const startGame = () => {
    if (players.length < 2) {
      setMessage('至少需要 2 名玩家才能開始遊戲');
      return;
    }

    const success = MonopolyGame.startGame();
    if (success) {
      onGameStart();
    }
  };

  // 刪除玩家
  const removePlayer = (index) => {
    const updatedPlayers = [...players];
    updatedPlayers.splice(index, 1);
    setPlayers(updatedPlayers);
    
    // 重新初始化遊戲和玩家
    MonopolyGame.initGame();
    updatedPlayers.forEach(player => {
      if (player.isAI) {
        MonopolyGame.addAIPlayer(player.name);
      } else {
        MonopolyGame.addPlayer(player.name);
      }
    });
    
    setMessage('已移除玩家');
  };

  return (
    <div className="game-setup">
      <h1 className="title">大富翁遊戲</h1>
      
      {!initialized ? (
        <div className="init-container">
          <p>開始一場新的大富翁遊戲！</p>
          <button className="primary-btn" onClick={initializeGame}>初始化遊戲</button>
        </div>
      ) : (
        <div className="setup-container">
          <div className="player-form">
            <input 
              type="text" 
              value={newPlayerName} 
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="輸入玩家名稱" 
              className="player-input"
            />
            <div className="btn-group">
              <button className="action-btn add-btn" onClick={addHumanPlayer}>新增玩家</button>
              <button className="action-btn add-ai-btn" onClick={addAIPlayer}>新增 AI 玩家</button>
            </div>
          </div>
          
          {message && <p className="message">{message}</p>}
          
          <div className="players-list">
            <h3>玩家列表 ({players.length})</h3>
            {players.length === 0 && <p className="empty-state">尚未新增玩家</p>}
            <ul>
              {players.map((player, index) => (
                <li key={index} className={`player-item ${player.isAI ? 'ai-player' : 'human-player'}`}>
                  <span>{player.name} {player.isAI ? '(AI)' : ''}</span>
                  <button 
                    className="remove-btn" 
                    onClick={() => removePlayer(index)}
                    aria-label="移除玩家"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <button 
            className="primary-btn start-btn"
            onClick={startGame}
            disabled={players.length < 2}
          >
            開始遊戲
          </button>
        </div>
      )}
    </div>
  );
}

export default GameSetup;
