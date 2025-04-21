import Game from './monopoly/Game.js';

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
  
  // 顯示遊戲狀態
  status() {
    if (!this.game) {
      console.log('請先初始化遊戲: MonopolyGame.initGame()');
      return;
    }
    return this.game.displayGameStatus();
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
   
5. 顯示遊戲狀態: 
   MonopolyGame.status()
   
6. 顯示使用說明: 
   MonopolyGame.help()

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
