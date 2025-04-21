// 地產類別
class Property {
  constructor(id, name, price, type = 'property', rentLevels = [], upgradePrice = 0) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.type = type;
    this.owner = null;
    this.level = 0;
    this.rentLevels = rentLevels;
    this.upgradePrice = upgradePrice;
  }

  // 取得當前租金
  getRent() {
    return this.rentLevels[this.level] || 0;
  }

  // 升級地產
  upgrade() {
    if (this.level < this.rentLevels.length - 1) {
      this.level++;
      console.log(`${this.name} 升級到 Level ${this.level}`);
      return true;
    }
    console.log(`${this.name} 已達最高等級，無法再升級`);
    return false;
  }

  // 計算地產價值 (用於抵押)
  getValue() {
    return this.price * 0.5;
  }

  // 顯示地產資訊
  displayInfo() {
    console.log(`
------ 地產資訊 ------
名稱: ${this.name}
類型: ${this.type}
價格: $${this.price}
擁有者: ${this.owner ? this.owner.name : '無'}
等級: ${this.level}
當前租金: $${this.getRent()}
升級費用: $${this.upgradePrice}
----------------------
    `);
  }
}

export default Property;
