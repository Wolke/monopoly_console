import React, { useState, useEffect, useRef } from 'react';
import MonopolyGame from '../monopoly/index.js';

// 格子元件 - 顯示棋盤上的單個格子
const Cell = ({ cell, isCurrentPosition, hasPlayer }) => {
  return (
    <div className={`board-cell ${isCurrentPosition ? 'current' : ''}`}>
      <div className="cell-content">
        <div className="cell-name">{cell.name}</div>
        {cell.price && <div className="cell-price">${cell.price}</div>}
        {hasPlayer && <div className="player-token">👤</div>}
        {cell.owner && <div className="cell-owner">{cell.owner.name}</div>}
      </div>
    </div>
  );
};

// 遊戲畫面元件 - 主要遊戲介面
function GameBoard({ onBackToSetup }) {
  const [gameState, setGameState] = useState({
    currentPlayer: null,
    pendingPurchase: null,
    message: '',
    diceResult: null,
    gameOver: false,
    showPurchaseDialog: false
  });
  const boardRef = useRef(null);

  // 初始化遊戲狀態
  useEffect(() => {
    updateGameState();
  }, []);

  // 更新遊戲狀態
  const updateGameState = () => {
    const game = MonopolyGame.game;
    if (!game) return;

    const currentPlayer = game.getCurrentPlayer();
    setGameState({
      currentPlayer,
      pendingPurchase: game.pendingPurchase,
      message: `輪到 ${currentPlayer.name} 的回合`,
      diceResult: null,
      gameOver: game.isGameOver,
      showPurchaseDialog: !!game.pendingPurchase
    });
  };

  // 擲骰子並移動
  const rollAndMove = () => {
    const result = MonopolyGame.rollAndMove();
    const game = MonopolyGame.game;
    
    if (result) {
      // 更新遊戲狀態
      setGameState(prev => ({
        ...prev,
        currentPlayer: game.getCurrentPlayer(),
        pendingPurchase: game.pendingPurchase,
        message: game.pendingPurchase 
          ? `${prev.currentPlayer.name} 可以購買 ${game.pendingPurchase.property.name}` 
          : `${prev.currentPlayer.name} 已完成回合，輪到 ${game.getCurrentPlayer().name}`,
        diceResult: game.lastDiceResult || { dice1: 1, dice2: 1, total: 2 },
        gameOver: game.isGameOver,
        showPurchaseDialog: !!game.pendingPurchase
      }));

      // 如果當前格子在視圖外，滾動到可見區域
      scrollToCurrentPosition();
    }
  };

  // 自動執行 AI 玩家回合
  const autoPlayAI = () => {
    MonopolyGame.autoPlayAI();
    updateGameState();
  };

  // 購買地產
  const buyProperty = () => {
    MonopolyGame.YesBuy();
    setGameState(prev => ({
      ...prev,
      pendingPurchase: null,
      message: `${prev.currentPlayer.name} 購買了 ${prev.pendingPurchase.property.name}`,
      showPurchaseDialog: false
    }));
  };

  // 拒絕購買地產
  const declinePurchase = () => {
    MonopolyGame.NoBuy();
    setGameState(prev => ({
      ...prev,
      pendingPurchase: null,
      message: `${prev.currentPlayer.name} 拒絕購買 ${prev.pendingPurchase.property.name}`,
      showPurchaseDialog: false
    }));
  };

  // 顯示遊戲狀態
  const showStatus = () => {
    MonopolyGame.status();
  };

  // 滾動到當前玩家位置
  const scrollToCurrentPosition = () => {
    if (!boardRef.current || !gameState.currentPlayer) return;
    
    const cellWidth = 120; // 每個格子的寬度
    const position = gameState.currentPlayer.position;
    
    // 計算滾動位置，使當前格子居中
    const scrollPosition = position * cellWidth - (boardRef.current.clientWidth / 2) + (cellWidth / 2);
    
    boardRef.current.scrollTo({
      left: Math.max(0, scrollPosition),
      behavior: 'smooth'
    });
  };

  // 重新開始遊戲
  const restartGame = () => {
    onBackToSetup();
  };

  // 渲染棋盤
  const renderBoard = () => {
    if (!MonopolyGame.game) return null;

    const cells = MonopolyGame.game.board.cells;
    const currentPosition = gameState.currentPlayer?.position || 0;

    return (
      <div className="board-scroll-container" ref={boardRef}>
        <div className="board-row">
          {cells.map((cell, index) => {
            const isCurrentPosition = index === currentPosition;
            const hasPlayer = MonopolyGame.game.players.some(p => p.position === index);
            return (
              <Cell 
                key={index} 
                cell={cell} 
                isCurrentPosition={isCurrentPosition}
                hasPlayer={hasPlayer}
              />
            );
          })}
        </div>
      </div>
    );
  };

  // 渲染骰子
  const renderDice = () => {
    if (!gameState.diceResult) return null;
    
    return (
      <div className="dice-container">
        <div className="dice">{gameState.diceResult.dice1}</div>
        <div className="dice">{gameState.diceResult.dice2}</div>
        <div className="dice-total">總點數: {gameState.diceResult.total}</div>
      </div>
    );
  };

  // 渲染玩家資訊
  const renderPlayerInfo = () => {
    if (!gameState.currentPlayer) return null;
    
    return (
      <div className="player-info">
        <h3>{gameState.currentPlayer.name} 的資訊</h3>
        <p>現金: ${gameState.currentPlayer.cash}</p>
        <p>位置: {gameState.currentPlayer.position}</p>
        <p>地產數: {gameState.currentPlayer.properties.length}</p>
        {gameState.currentPlayer.inJail && 
          <p className="in-jail">在監獄中 (第 {gameState.currentPlayer.jailTurns} 回合)</p>
        }
      </div>
    );
  };

  // 渲染購買對話框
  const renderPurchaseDialog = () => {
    if (!gameState.showPurchaseDialog || !gameState.pendingPurchase) return null;
    
    const { property } = gameState.pendingPurchase;
    
    return (
      <div className="purchase-dialog">
        <h3>購買決策</h3>
        <p>是否購買 {property.name}?</p>
        <p>價格: ${property.price}</p>
        <p>租金: ${property.getRent()}</p>
        
        <div className="btn-group">
          <button className="action-btn yes-btn" onClick={buyProperty}>購買</button>
          <button className="action-btn no-btn" onClick={declinePurchase}>放棄</button>
        </div>
      </div>
    );
  };

  return (
    <div className="game-board">
      <div className="game-header">
        <h2>大富翁遊戲</h2>
        <button className="small-btn back-btn" onClick={restartGame}>重新開始</button>
      </div>

      {/* 上半部: 棋盤 */}
      <div className="board-container">
        {renderBoard()}
      </div>

      {/* 下半部: 操作和資訊 */}
      <div className="control-panel">
        <div className="message-box">{gameState.message}</div>
        
        {renderDice()}
        {renderPlayerInfo()}
        
        <div className="action-buttons">
          <button 
            className="game-btn roll-btn"
            onClick={rollAndMove}
            disabled={gameState.showPurchaseDialog || gameState.gameOver || (gameState.currentPlayer?.isAI)}
          >
            擲骰子
          </button>
          
          <button 
            className="game-btn ai-btn"
            onClick={autoPlayAI}
            disabled={gameState.showPurchaseDialog || gameState.gameOver || (!gameState.currentPlayer?.isAI)}
          >
            AI 自動回合
          </button>
          
          <button className="game-btn status-btn" onClick={showStatus}>
            遊戲狀態
          </button>
        </div>
        
        {renderPurchaseDialog()}
        
        {gameState.gameOver && (
          <div className="game-over">
            <h3>遊戲結束！</h3>
            <button className="primary-btn" onClick={restartGame}>
              重新開始遊戲
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameBoard;
