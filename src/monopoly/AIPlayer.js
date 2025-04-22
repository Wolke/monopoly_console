// filepath: /Users/wolkebidian/forpraticedemo/monopoly_console/src/monopoly/AIPlayer.js
// AI 玩家類別 - 繼承自 Player 類別
import Player from './Player.js';

class AIPlayer extends Player {
  constructor(name, cash = 15000) {
    // 若沒有提供名稱，則設定預設名稱 "AI 玩家"
    super(name || `AI 玩家${Math.floor(Math.random() * 1000)}`, cash);
    this.isAI = true;
    this.riskTolerance = Math.random(); // 0-1 之間的隨機值，代表 AI 的風險承受度
    this.buyThreshold = 0.4; // 購買決策門檻值
  }

  // AI 決策 - 是否購買地產
  decidePurchase(property, game) {
    // 基本邏輯：
    // 1. 檢查現金是否足夠
    // 2. 根據風險承受度和地產價值決定是否購買

    if (this.cash < property.price) {
      console.log(`${this.name} 資金不足，無法購買 ${property.name}`);
      return false;
    }

    // 計算剩餘現金比例（購買後還剩多少錢）
    const remainingCashRatio = (this.cash - property.price) / this.cash;
    
    // 根據地產類型調整購買意願
    let willBuy = false;
    
    if (property.type === 'property') {
      // 地產類型 - 根據位置和價格決定
      const propertyValue = property.price / 1000; // 標準化價值
      willBuy = (this.riskTolerance > this.buyThreshold && remainingCashRatio > 0.3) || 
                (propertyValue < 0.5 && remainingCashRatio > 0.5);
    } else if (property.type === 'utility') {
      // 公用事業 - AI 較喜歡購買
      willBuy = this.riskTolerance > 0.3 && remainingCashRatio > 0.4;
    } else if (property.type === 'station') {
      // 車站 - AI 非常喜歡購買
      willBuy = this.riskTolerance > 0.2 && remainingCashRatio > 0.3;
      
      // 如果已經有其他車站，更願意購買
      const ownedStations = this.properties.filter(p => p.type === 'station').length;
      if (ownedStations > 0) {
        willBuy = true; // 有其他車站時強烈傾向於購買
      }
    }
    
    // 根據決策購買或拒絕
    if (willBuy) {
      console.log(`${this.name} 決定購買 ${property.name}`);
      return true;
    } else {
      console.log(`${this.name} 決定不購買 ${property.name}`);
      return false;
    }
  }
  
  // AI 決策 - 監獄策略
  decideJailStrategy(game) {
    // 如果有足夠的現金且風險承受度高，則支付罰金
    if (this.cash >= 500 && this.riskTolerance > 0.6) {
      return 'pay';
    }
    // 否則等待
    return 'wait';
  }
  
  // AI 決策 - 升級地產策略
  decideUpgradeStrategy(game) {
    // 尋找可升級的地產
    const upgradableProperties = this.properties.filter(property => 
      property.type === 'property' && 
      property.level < 5 && 
      this.cash >= property.upgradePrice
    );
    
    // 根據風險承受度決定是否升級
    if (upgradableProperties.length > 0 && this.riskTolerance > 0.5) {
      // 選擇價值最高的地產升級
      const propertyToUpgrade = upgradableProperties.sort((a, b) => b.price - a.price)[0];
      
      // 確保升級後仍有足夠的現金儲備
      if ((this.cash - propertyToUpgrade.upgradePrice) > this.cash * 0.3) {
        return propertyToUpgrade;
      }
    }
    
    return null; // 不升級
  }
  
  // 顯示 AI 玩家資訊 (覆寫原方法)
  displayInfo() {
    console.log(`
------ AI 玩家資訊 ------
名稱: ${this.name}
現金: $${this.cash}
位置: ${this.position}
擁有地產: ${this.properties.map(p => p.name).join(', ') || '無'}
狀態: ${this.inJail ? '在監獄中' : '自由'}
風險承受度: ${Math.floor(this.riskTolerance * 100)}%
------------------------
    `);
  }
}

export default AIPlayer;
