// 遊戲控制器類別
import Player from './Player.js';
import AIPlayer from './AIPlayer.js';
import Board from './Board.js';
import { BOARD_CONFIG } from './data/config.js';

class Game {
  constructor() {
    this.board = new Board();
    this.players = [];
    this.currentPlayerIndex = 0;
    this.isGameOver = false;
    this.turnCount = 0;
    this.maxTurns = BOARD_CONFIG.MAX_TURNS;
    this.pendingPurchase = null; // 等待購買決定的地產
    this.lastDiceResult = null; // 最後一次擲骰子結果
  }

  // 添加玩家
  addPlayer(name, emoji = '👤') {
    const player = new Player(name, 15000, emoji);
    this.players.push(player);
    console.log(`新增玩家: ${name} (${emoji})`);
    return player;
  }

  // 添加 AI 玩家
  addAIPlayer(name) {
    const aiPlayer = new AIPlayer(name);
    this.players.push(aiPlayer);
    console.log(`新增 AI 玩家: ${aiPlayer.name}`);
    return aiPlayer;
  }

  // 開始遊戲
  start() {
    if (this.players.length < 2) {
      console.log('遊戲需要至少 2 名玩家才能開始');
      return false;
    }
    
    this.turnCount = 0;
    this.currentPlayerIndex = 0;
    this.isGameOver = false;
    
    console.log('遊戲開始！');
    console.log(`輪到 ${this.getCurrentPlayer().name} 的回合`);
    
    return true;
  }

  // 獲取當前玩家
  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  // 擲骰子
  rollDice() {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;
    
    console.log(`${this.getCurrentPlayer().name} 擲骰子: ${dice1} + ${dice2} = ${total}`);
    
    return { dice1, dice2, total };
  }

  // 處理當前格子
  handleCell(player, position) {
    const cell = this.board.getCellInfo(position);
    console.log(`${player.name} 到達 ${cell.name}`);
    
    // 顯示格子資訊
    this.board.displayCellInfo(position);
    
    // 根據格子類型執行相應動作
    if (typeof cell.action === 'function') {
      // 特殊格子動作
      cell.action(player, this);
    } else if ((cell.type === 'property' || cell.type === 'utility' || cell.type === 'station') && !cell.owner) {
      // 無人擁有的地產
      this.handlePropertyPurchase(player, cell);
    } else if ((cell.type === 'property' || cell.type === 'utility' || cell.type === 'station') && cell.owner !== player) {
      // 其他玩家擁有的地產
      this.handleRentPayment(player, cell);
    }
  }

  // 處理地產購買
  handlePropertyPurchase(player, property) {
    if (property.owner === null) {
      console.log(`${property.name} 可以購買，價格: $${property.price}`);
      
      if (player.cash >= property.price) {
        // AI 玩家自動決策
        if (player.isAI) {
          if (player.decidePurchase(property, this)) {
            player.buyProperty(property);
          }
        } else {
          // 人類玩家需要手動決策
          console.log(`${player.name} 有足夠的現金購買 ${property.name}`);
          console.log(`請使用以下指令決定是否購買：`);
          console.log(`- MonopolyGame.YesBuy() - 購買此地產`);
          console.log(`- MonopolyGame.NoBuy() - 不購買此地產`);
          
          // 設定待購買的地產
          this.pendingPurchase = {
            player: player,
            property: property
          };
        }
      } else {
        console.log(`${player.name} 資金不足，無法購買 ${property.name}`);
      }
    }
  }
  
  // 接受購買地產
  acceptPurchase() {
    if (!this.pendingPurchase) {
      console.log('目前沒有等待購買決定的地產');
      return false;
    }
    
    const { player, property } = this.pendingPurchase;
    console.log(`${player.name} 決定購買 ${property.name}`);
    player.buyProperty(property);
    this.pendingPurchase = null;
    return true;
  }
  
  // 拒絕購買地產
  declinePurchase() {
    if (!this.pendingPurchase) {
      console.log('目前沒有等待購買決定的地產');
      return false;
    }
    
    const { player, property } = this.pendingPurchase;
    console.log(`${player.name} 決定不購買 ${property.name}`);
    this.pendingPurchase = null;
    return true;
  }

  // 處理租金支付
  handleRentPayment(player, property) {
    if (property.owner && property.owner !== player) {
      const rent = property.getRent();
      console.log(`${player.name} 需要支付 ${property.owner.name} 租金 $${rent}`);
      
      if (player.cash >= rent) {
        player.updateCash(-rent);
        property.owner.updateCash(rent);
      } else {
        console.log(`${player.name} 資金不足，無法支付租金，進入破產狀態`);
        this.handleBankruptcy(player, property.owner);
      }
    }
  }

  // 處理破產
  handleBankruptcy(player, creditor) {
    console.log(`${player.name} 破產了！將所有資產轉移給 ${creditor ? creditor.name : '銀行'}`);
    
    // 轉移現金
    if (creditor) {
      creditor.updateCash(player.cash);
    }
    
    // 轉移地產
    player.properties.forEach(property => {
      property.owner = creditor;
      if (creditor) {
        creditor.properties.push(property);
      }
    });
    
    // 從遊戲中移除玩家
    const playerIndex = this.players.indexOf(player);
    if (playerIndex !== -1) {
      this.players.splice(playerIndex, 1);
    }
    
    // 調整當前玩家索引
    if (playerIndex <= this.currentPlayerIndex && this.currentPlayerIndex > 0) {
      this.currentPlayerIndex--;
    }
    
    // 檢查遊戲是否結束
    if (this.players.length === 1) {
      console.log(`遊戲結束！${this.players[0].name} 獲勝！`);
      this.isGameOver = true;
    }
  }

  // 結束當前回合
  endTurn() {
    // 檢查遊戲是否應該結束
    this.turnCount++;
    if (this.turnCount >= this.maxTurns) {
      this.endGame();
      return;
    }
    
    // 檢查玩家是否只剩一位
    if (this.players.length <= 1) {
      this.endGame();
      return;
    }
    
    // 移到下一個玩家
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    console.log(`輪到 ${this.getCurrentPlayer().name} 的回合`);
  }

  // 結束遊戲
  endGame() {
    this.isGameOver = true;
    
    // 找出資產最多的玩家
    let winner = this.players[0];
    let maxAssets = this.calculateTotalAssets(winner);
    
    this.players.forEach(player => {
      const assets = this.calculateTotalAssets(player);
      console.log(`${player.name} 的總資產: $${assets}`);
      
      if (assets > maxAssets) {
        maxAssets = assets;
        winner = player;
      }
    });
    
    console.log(`遊戲結束！${winner.name} 贏得了遊戲，總資產: $${maxAssets}`);
  }

  // 計算玩家總資產
  calculateTotalAssets(player) {
    let total = player.cash;
    
    // 加上地產價值
    player.properties.forEach(property => {
      total += property.price;
      // 加上升級費用
      total += property.level * property.upgradePrice;
    });
    
    return total;
  }

  // 抽取機會卡
  drawChanceCard(player) {
    const card = this.board.getRandomChanceCard();
    console.log(`${player.name} 抽到機會卡: ${card.description}`);
    card.action(player, this);
  }

  // 抽取社區寶箱卡
  drawCommunityChestCard(player) {
    const card = this.board.getRandomCommunityChestCard();
    console.log(`${player.name} 抽到社區寶箱卡: ${card.description}`);
    card.action(player, this);
  }

  // 顯示遊戲狀態
  displayGameStatus() {
    console.log('\n====== 遊戲狀態 ======');
    console.log(`回合數: ${this.turnCount}`);
    console.log(`當前玩家: ${this.getCurrentPlayer().name}`);
    console.log('');
    
    this.players.forEach(player => {
      player.displayInfo();
    });
    
    console.log('=======================\n');
  }

  // 處理玩家回合
  playTurn() {
    const player = this.getCurrentPlayer();
    
    if (this.isGameOver) {
      console.log('遊戲已結束');
      return false;
    }
    
    console.log(`--- ${player.name} 的回合 ---`);
    
    // 處理監獄情況
    if (player.inJail) {
      player.jailTurns++;
      console.log(`${player.name} 在監獄中 (第 ${player.jailTurns} 回合)`);
      
      // AI 玩家監獄決策
      if (player.isAI) {
        const jailStrategy = player.decideJailStrategy(this);
        if (jailStrategy === 'pay' && player.cash >= 500) {
          console.log(`${player.name} 支付 $500 從監獄釋放`);
          player.updateCash(-500);
          player.releaseFromJail();
        } else if (player.jailTurns >= 3) {
          console.log(`${player.name} 已在監獄待了3回合，獲得釋放`);
          player.releaseFromJail();
        } else {
          // 本回合無法移動
          this.endTurn();
          return true;
        }
      } else {
        // 人類玩家監獄邏輯 (原有邏輯)
        // 付費出獄選項
        if (player.cash >= 500) {
          console.log(`${player.name} 支付 $500 從監獄釋放`);
          player.updateCash(-500);
          player.releaseFromJail();
        } else if (player.jailTurns >= 3) {
          console.log(`${player.name} 已在監獄待了3回合，獲得釋放`);
          player.releaseFromJail();
        } else {
          // 本回合無法移動
          this.endTurn();
          return true;
        }
      }
    }
    
    // 擲骰子並移動
    const diceResult = this.rollDice();
    // 儲存骰子結果
    this.lastDiceResult = diceResult;
    
    // 移動玩家
    const oldPosition = player.position;
    const newPosition = player.move(diceResult.total);
    
    // 檢查是否經過起點
    if (newPosition < oldPosition) {
      player.updateCash(2000);
      console.log(`${player.name} 經過起點，獲得 $2000`);
    }
    
    // 處理當前格子
    this.handleCell(player, newPosition);
    
    this.endTurn();
    return true;
  }

  // 自動進行 AI 玩家的所有回合
  autoPlayAI() {
    // 檢查當前是否為 AI 玩家回合
    const currentPlayer = this.getCurrentPlayer();
    
    if (!currentPlayer.isAI) {
      console.log('當前不是 AI 玩家的回合');
      return false;
    }
    
    while (this.getCurrentPlayer().isAI && !this.isGameOver) {
      this.playTurn();
      
      // 防止無限循環
      if (this.pendingPurchase && this.pendingPurchase.player.isAI) {
        const aiPlayer = this.pendingPurchase.player;
        const property = this.pendingPurchase.property;
        
        if (aiPlayer.decidePurchase(property, this)) {
          this.acceptPurchase();
        } else {
          this.declinePurchase();
        }
      }
    }
    
    return true;
  }
}

export default Game;
