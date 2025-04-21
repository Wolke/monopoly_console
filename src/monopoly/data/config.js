// 遊戲配置參數

// 棋盤配置
export const BOARD_CONFIG = {
  // 棋盤總格數
  TOTAL_CELLS: 40,
  
  // 起點薪水金額
  GO_SALARY: 2000,
  
  // 所得稅配置
  INCOME_TAX: {
    MAX_AMOUNT: 2000,
    PERCENTAGE: 0.1
  },
  
  // 奢侈稅固定金額
  LUXURY_TAX_AMOUNT: 1000,
  
  // 初始玩家現金
  INITIAL_CASH: 15000,
  
  // 監獄位置
  JAIL_POSITION: 10,
  
  // 入獄位置
  GO_TO_JAIL_POSITION: 30
};

// 卡片配置
export const CARD_CONFIG = {
  // 機會卡總數
  CHANCE_CARDS_COUNT: 10,
  
  // 社區寶箱卡總數
  COMMUNITY_CHEST_CARDS_COUNT: 10
};

export default {
  BOARD_CONFIG,
  CARD_CONFIG
};
