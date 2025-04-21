import Property from './Property.js';

// 棋盤類別
class Board {
  constructor() {
    this.cells = this.initializeBoard();
    this.chanceCards = this.initializeChanceCards();
    this.communityChestCards = this.initializeCommunityChestCards();
  }

  // 初始化棋盤
  initializeBoard() {
    const board = [
      { id: 0, name: '起點', type: 'go', action: (player, game) => {
        // 玩家經過起點時獲得薪水
        player.updateCash(2000);
      }},
      new Property(1, '台北信義區', 1200, 'property', [60, 180, 500, 700, 900], 1000),
      { id: 2, name: '機會', type: 'chance', action: (player, game) => {
        game.drawChanceCard(player);
      }},
      new Property(3, '台北中山區', 1400, 'property', [70, 200, 550, 750, 950], 1000),
      { id: 4, name: '所得稅', type: 'tax', action: (player, game) => {
        // 玩家支付所得稅
        const tax = Math.min(2000, Math.floor(player.cash * 0.1));
        player.updateCash(-tax);
      }},
      new Property(5, '台北車站', 2000, 'station', [250, 500, 1000, 2000], 0),
      new Property(6, '台中西區', 1600, 'property', [80, 220, 600, 800, 1000], 1000),
      { id: 7, name: '社區寶箱', type: 'community', action: (player, game) => {
        game.drawCommunityChestCard(player);
      }},
      new Property(8, '台中北屯區', 1600, 'property', [80, 220, 600, 800, 1000], 1000),
      new Property(9, '台中南區', 1800, 'property', [90, 250, 700, 875, 1050], 1000),
      { id: 10, name: '訪問監獄', type: 'jail-visit', action: () => {}},
      new Property(11, '高雄鼓山區', 2000, 'property', [100, 300, 750, 925, 1100], 1500),
      new Property(12, '電力公司', 1500, 'utility', [100, 200], 0),
      new Property(13, '高雄左營區', 2000, 'property', [100, 300, 750, 925, 1100], 1500),
      new Property(14, '高雄三民區', 2200, 'property', [110, 330, 800, 975, 1150], 1500),
      new Property(15, '高雄車站', 2000, 'station', [250, 500, 1000, 2000], 0),
      new Property(16, '台南中西區', 2400, 'property', [120, 360, 850, 1025, 1200], 1500),
      { id: 17, name: '機會', type: 'chance', action: (player, game) => {
        game.drawChanceCard(player);
      }},
      new Property(18, '台南東區', 2400, 'property', [120, 360, 850, 1025, 1200], 1500),
      new Property(19, '台南安平區', 2600, 'property', [130, 390, 900, 1100, 1275], 1500),
      { id: 20, name: '免費停車場', type: 'free-parking', action: () => {}},
      new Property(21, '新北板橋區', 2800, 'property', [140, 450, 1000, 1200, 1400], 2000),
      { id: 22, name: '機會', type: 'chance', action: (player, game) => {
        game.drawChanceCard(player);
      }},
      new Property(23, '新北新莊區', 2800, 'property', [140, 450, 1000, 1200, 1400], 2000),
      new Property(24, '新北三重區', 3000, 'property', [150, 500, 1100, 1300, 1500], 2000),
      new Property(25, '新北車站', 2000, 'station', [250, 500, 1000, 2000], 0),
      new Property(26, '桃園中壢區', 3200, 'property', [160, 550, 1200, 1400, 1700], 2000),
      new Property(27, '桃園大溪區', 3200, 'property', [160, 550, 1200, 1400, 1700], 2000),
      new Property(28, '自來水公司', 1500, 'utility', [100, 200], 0),
      new Property(29, '桃園機場', 3500, 'property', [175, 600, 1300, 1700, 2000], 2000),
      { id: 30, name: '入獄', type: 'go-to-jail', action: (player, game) => {
        player.goToJail();
      }},
      new Property(31, '新竹竹北', 3600, 'property', [180, 650, 1400, 1750, 2100], 2500),
      new Property(32, '新竹市區', 3600, 'property', [180, 650, 1400, 1750, 2100], 2500),
      { id: 33, name: '社區寶箱', type: 'community', action: (player, game) => {
        game.drawCommunityChestCard(player);
      }},
      new Property(34, '新竹科學園區', 4000, 'property', [200, 700, 1700, 2000, 2300], 2500),
      new Property(35, '新竹車站', 2000, 'station', [250, 500, 1000, 2000], 0),
      { id: 36, name: '機會', type: 'chance', action: (player, game) => {
        game.drawChanceCard(player);
      }},
      new Property(37, '墾丁', 4300, 'property', [350, 750, 1800, 2200, 2600], 3000),
      { id: 38, name: '奢侈稅', type: 'tax', action: (player, game) => {
        // 玩家支付奢侈稅
        player.updateCash(-1000);
      }},
      new Property(39, '花蓮太魯閣', 4500, 'property', [400, 800, 2000, 2500, 3000], 3000),
    ];
    
    return board;
  }

  // 初始化機會卡
  initializeChanceCards() {
    return [
      { description: '銀行付給你股息 $500', action: (player) => { player.updateCash(500); } },
      { description: '向前移動到起點', action: (player) => { player.setPosition(0); } },
      { description: '前往台北信義區', action: (player) => { player.setPosition(1); } },
      { description: '前往高雄車站', action: (player) => { player.setPosition(15); } },
      { description: '前往新竹科學園區', action: (player) => { player.setPosition(34); } },
      { description: '繳納各建築物的修繕費，每棟房子 $250', action: (player) => {
        const houses = player.properties.length;
        player.updateCash(-houses * 250);
      } },
      { description: '在銀行的貸款到期，付款 $1500', action: (player) => { player.updateCash(-1500); } },
      { description: '你被選為董事長，付給每位玩家 $500', action: (player, game) => {
        game.players.forEach(p => {
          if (p !== player) {
            player.updateCash(-500);
            p.updateCash(500);
          }
        });
      } },
      { description: '後退三步', action: (player) => { player.setPosition(player.position - 3); } },
      { description: '進入監獄', action: (player) => { player.goToJail(); } },
    ];
  }

  // 初始化社區寶箱卡
  initializeCommunityChestCards() {
    return [
      { description: '銀行出錯，收到 $2000', action: (player) => { player.updateCash(2000); } },
      { description: '醫療費用，支付 $1000', action: (player) => { player.updateCash(-1000); } },
      { description: '所得稅退款，收到 $200', action: (player) => { player.updateCash(200); } },
      { description: '你的生日，從每位玩家收到 $100', action: (player, game) => {
        game.players.forEach(p => {
          if (p !== player) {
            p.updateCash(-100);
            player.updateCash(100);
          }
        });
      } },
      { description: '前往起點', action: (player) => { player.setPosition(0); } },
      { description: '遺產，收到 $1000', action: (player) => { player.updateCash(1000); } },
      { description: '獲得假期基金，收到 $500', action: (player) => { player.updateCash(500); } },
      { description: '繳納學費，支付 $500', action: (player) => { player.updateCash(-500); } },
      { description: '街道修繕，支付 $400', action: (player) => { player.updateCash(-400); } },
      { description: '獲得顧問費，收到 $250', action: (player) => { player.updateCash(250); } },
    ];
  }

  // 顯示特定位置格子的資訊
  getCellInfo(position) {
    return this.cells[position % 40];
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
