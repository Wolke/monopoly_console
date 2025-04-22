import Game from './Game.js';

// 建立全域遊戲物件，方便在控制台中訪問
window.MonopolyGame = {
  game: null,
  
  // 初始化遊戲
  initGame() {
    this.game = new Game();
    console.log('大富翁遊戲已初始化，請使用 addPlayer() 新增玩家');
    return this.game;
  },
  
  // 新增玩家
  addPlayer(name) {
    if (!this.game) {
      console.log('請先初始化遊戲: MonopolyGame.initGame()');
      return;
    }
    return this.game.addPlayer(name);
  },
  
  // 開始遊戲
  startGame() {
    if (!this.game) {
      console.log('請先初始化遊戲: MonopolyGame.initGame()');
      return;
    }
    return this.game.start();
  },
  
  // 擲骰子並執行當前玩家的回合
  rollAndMove() {
    if (!this.game) {
      console.log('請先初始化遊戲: MonopolyGame.initGame()');
      return;
    }
    return this.game.playTurn();
  },
  
  // 決定購買當前地產
  YesBuy() {
    if (!this.game) {
      console.log('請先初始化遊戲: MonopolyGame.initGame()');
      return;
    }
    return this.game.acceptPurchase();
  },
  
  // 決定不購買當前地產
  NoBuy() {
    if (!this.game) {
      console.log('請先初始化遊戲: MonopolyGame.initGame()');
      return;
    }
    return this.game.declinePurchase();
  },
  
  // 顯示遊戲狀態
  status() {
    if (!this.game) {
      console.log('請先初始化遊戲: MonopolyGame.initGame()');
      return;
    }
    return this.game.displayGameStatus();
  },
  
  // 自動購買測試 - 如果可以買就自動購買
  autoPlayTest(playerNames = ['小美', '小明'], maxTurns = 20) {
    console.log('===== 開始自動購買測試 =====');
    
    // 初始化遊戲
    this.initGame();
    
    // 新增玩家
    playerNames.forEach(name => {
      this.addPlayer(name);
    });
    
    // 開始遊戲
    if (!this.startGame()) {
      console.log('遊戲無法開始，測試中止');
      return;
    }
    
    let turnCount = 0;
    
    // 執行回合直到達到最大回合數或遊戲結束
    while (!this.game.isGameOver && turnCount < maxTurns) {
      console.log(`\n====== 回合 ${turnCount + 1} ======`);
      
      // 執行回合
      this.rollAndMove();
      
      // 如果有待購買的地產，自動購買
      if (this.game.pendingPurchase) {
        console.log('檢測到可購買地產，自動購買中...');
        this.YesBuy();
      }
      
      turnCount++;
      
      // 顯示當前遊戲狀態
      this.status();
    }
    
    console.log(`\n===== 測試結束 (共執行 ${turnCount} 回合) =====`);
    
    // 顯示最終遊戲狀態
    const remainingPlayers = this.game.players.map(player => {
      return {
        name: player.name,
        cash: player.cash,
        properties: player.properties.length,
        totalAssets: this.game.calculateTotalAssets(player)
      };
    }).sort((a, b) => b.totalAssets - a.totalAssets);
    
    console.log('\n===== 最終遊戲狀態 =====');
    remainingPlayers.forEach((player, index) => {
      console.log(`第 ${index + 1} 名: ${player.name}`);
      console.log(`- 現金: $${player.cash}`);
      console.log(`- 擁有地產數: ${player.properties}`);
      console.log(`- 總資產: $${player.totalAssets}`);
    });
  },
  
  // 顯示使用說明
  help() {
    console.log(`
===== 大富翁控制台遊戲說明 =====

1. 初始化遊戲: 
   MonopolyGame.initGame()

2. 新增玩家: 
   MonopolyGame.addPlayer('玩家名稱')
   
3. 開始遊戲: 
   MonopolyGame.startGame()
   
4. 執行當前玩家回合: 
   MonopolyGame.rollAndMove()
   
5. 購買決策:
   MonopolyGame.YesBuy() - 購買當前地產
   MonopolyGame.NoBuy() - 拒絕購買當前地產
   
6. 顯示遊戲狀態: 
   MonopolyGame.status()
   
7. 顯示使用說明: 
   MonopolyGame.help()
   
8. 自動購買測試:
   MonopolyGame.autoPlayTest(['小美', '小明'], 回合數)

===== 遊戲規則 =====
- 每位玩家初始有 $15000
- 通過/到達起點可獲得 $2000
- 進入監獄需要支付 $500 或等待 3 回合才能出獄
- 購買地產後，其他玩家到達時需支付租金
- 遊戲結束條件：只剩一位玩家或達到最大回合數 (100回合)

祝您遊戲愉快！
    `);
  }
};

// 自動顯示使用說明
MonopolyGame.help();

export default MonopolyGame;
