import Property from './Property.js';
import boardData from './data/board.json';
import chanceCardsData from './data/chance-cards.json';
import communityChestCardsData from './data/community-chest-cards.json';
import { BOARD_CONFIG } from './data/config.js';

// 棋盤類別
class Board {
  constructor() {
    this.cells = this.initializeBoard();
    this.chanceCards = this.initializeChanceCards();
    this.communityChestCards = this.initializeCommunityChestCards();
  }

  // 初始化棋盤
  initializeBoard() {
    // 從 JSON 檔案讀取棋盤資料並添加 action 函式
    return boardData.map(cell => {
      // 如果是地產類型，創建 Property 物件
      if (cell.type === 'property' || cell.type === 'station' || cell.type === 'utility') {
        return new Property(
          cell.id, 
          cell.name, 
          cell.price, 
          cell.type, 
          cell.rentLevels, 
          cell.upgradePrice
        );
      }
      
      // 添加 action 函式，根據不同的格子類型
      let action = () => {};
      
      switch (cell.type) {
        case 'go':
          action = (player) => {
            // 玩家經過起點時獲得薪水
            player.updateCash(BOARD_CONFIG.GO_SALARY);
          };
          break;
        case 'chance':
          action = (player, game) => {
            game.drawChanceCard(player);
          };
          break;
        case 'community':
          action = (player, game) => {
            game.drawCommunityChestCard(player);
          };
          break;
        case 'tax':
          if (cell.taxType === 'income') {
            action = (player) => {
              // 玩家支付所得稅
              const tax = Math.min(BOARD_CONFIG.INCOME_TAX.MAX_AMOUNT, Math.floor(player.cash * BOARD_CONFIG.INCOME_TAX.PERCENTAGE));
              player.updateCash(-tax);
            };
          } else if (cell.taxType === 'luxury') {
            action = (player) => {
              // 玩家支付奢侈稅
              player.updateCash(-cell.amount);
            };
          }
          break;
        case 'go-to-jail':
          action = (player) => {
            player.goToJail();
          };
          break;
        // 其他類型格子不需要特殊動作
      }
      
      return { ...cell, action };
    });
  }

  // 初始化機會卡
  initializeChanceCards() {
    // 從 JSON 檔案讀取機會卡資料並添加 action 函式
    return chanceCardsData.map(card => {
      let action;
      
      switch (card.actionType) {
        case 'addCash':
          action = (player) => { 
            player.updateCash(card.amount); 
          };
          break;
        case 'moveTo':
          action = (player) => { 
            player.setPosition(card.position); 
          };
          break;
        case 'payPerProperty':
          action = (player) => {
            const houses = player.properties.length;
            player.updateCash(-houses * card.amountPerProperty);
          };
          break;
        case 'payEachPlayer':
          action = (player, game) => {
            game.players.forEach(p => {
              if (p !== player) {
                player.updateCash(-card.amountPerPlayer);
                p.updateCash(card.amountPerPlayer);
              }
            });
          };
          break;
        case 'moveBack':
          action = (player) => { 
            player.setPosition(player.position - card.steps); 
          };
          break;
        case 'goToJail':
          action = (player) => { 
            player.goToJail(); 
          };
          break;
      }
      
      return { ...card, action };
    });
  }

  // 初始化社區寶箱卡
  initializeCommunityChestCards() {
    // 從 JSON 檔案讀取社區寶箱卡資料並添加 action 函式
    return communityChestCardsData.map(card => {
      let action;
      
      switch (card.actionType) {
        case 'addCash':
          action = (player) => { 
            player.updateCash(card.amount); 
          };
          break;
        case 'moveTo':
          action = (player) => { 
            player.setPosition(card.position); 
          };
          break;
        case 'collectFromEachPlayer':
          action = (player, game) => {
            game.players.forEach(p => {
              if (p !== player) {
                p.updateCash(-card.amountPerPlayer);
                player.updateCash(card.amountPerPlayer);
              }
            });
          };
          break;
      }
      
      return { ...card, action };
    });
  }

  // 顯示特定位置格子的資訊
  getCellInfo(position) {
    return this.cells[position % BOARD_CONFIG.TOTAL_CELLS];
  }

  // 顯示特定位置格子的詳細資訊
  displayCellInfo(position) {
    const cell = this.getCellInfo(position);
    if (cell.type === 'property' || cell.type === 'utility' || cell.type === 'station') {
      cell.displayInfo();
    } else {
      console.log(`
------ 格子資訊 ------
名稱: ${cell.name}
類型: ${cell.type}
----------------------
      `);
    }
  }

  // 隨機抽取機會卡
  getRandomChanceCard() {
    const index = Math.floor(Math.random() * this.chanceCards.length);
    return this.chanceCards[index];
  }

  // 隨機抽取社區寶箱卡
  getRandomCommunityChestCard() {
    const index = Math.floor(Math.random() * this.communityChestCards.length);
    return this.communityChestCards[index];
  }
}

export default Board;
