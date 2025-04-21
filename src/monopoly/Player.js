// 玩家類別
class Player {
  constructor(name, cash = 15000) {
    this.name = name;
    this.cash = cash;
    this.position = 0;
    this.properties = [];
    this.inJail = false;
    this.jailTurns = 0;
  }

  // 移動玩家
  move(steps) {
    this.position = (this.position + steps) % 40;
    console.log(`${this.name} 移動到位置 ${this.position}`);
    return this.position;
  }

  // 直接設定位置
  setPosition(position) {
    this.position = position % 40;
    console.log(`${this.name} 被移動到位置 ${this.position}`);
    return this.position;
  }

  // 增加或減少現金
  updateCash(amount) {
    this.cash += amount;
    if (amount > 0) {
      console.log(`${this.name} 獲得了 $${amount}`);
    } else {
      console.log(`${this.name} 支付了 $${Math.abs(amount)}`);
    }
    return this.cash;
  }

  // 購買地產
  buyProperty(property) {
    if (this.cash >= property.price) {
      this.updateCash(-property.price);
      this.properties.push(property);
      property.owner = this;
      console.log(`${this.name} 購買了 ${property.name}，價格: $${property.price}`);
      return true;
    } else {
      console.log(`${this.name} 資金不足，無法購買 ${property.name}`);
      return false;
    }
  }

  // 進入監獄
  goToJail() {
    this.inJail = true;
    this.jailTurns = 0;
    this.setPosition(10); // 監獄位置通常是10
    console.log(`${this.name} 進入了監獄`);
  }

  // 從監獄釋放
  releaseFromJail() {
    this.inJail = false;
    this.jailTurns = 0;
    console.log(`${this.name} 從監獄被釋放了`);
  }

  // 顯示玩家資訊
  displayInfo() {
    console.log(`
------ 玩家資訊 ------
名稱: ${this.name}
現金: $${this.cash}
位置: ${this.position}
擁有地產: ${this.properties.map(p => p.name).join(', ') || '無'}
狀態: ${this.inJail ? '在監獄中' : '自由'}
----------------------
    `);
  }
}

export default Player;
