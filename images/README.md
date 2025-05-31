# 圖片資料夾說明

這個資料夾用來存放飲品菜單的本地圖片。

## 📁 檔案命名建議

### 咖啡類 (coffee)
- `coffee-latte.jpg` - 拿鐵
- `coffee-cappuccino.jpg` - 卡布奇諾
- `coffee-americano.jpg` - 美式咖啡
- `coffee-cold-brew.jpg` - 冰滴咖啡

### 茶類 (tea)
- `tea-milk-tea.jpg` - 奶茶
- `tea-oolong.jpg` - 烏龍茶
- `tea-earl-grey.jpg` - 伯爵茶
- `tea-jasmine.jpg` - 茉莉花茶
- `tea-rose.jpg` - 玫瑰花茶

### 奶類 (milk)
- `milk-vanilla-shake.jpg` - 香草奶昔
- `milk-strawberry-shake.jpg` - 草莓奶昔
- `milk-chocolate-shake.jpg` - 巧克力奶昔

### 酒類 (alcohol)
- `alcohol-plum-wine.jpg` - 梅酒氣泡
- `alcohol-fruit-cocktail.jpg` - 水果調酒
- `alcohol-sake.jpg` - 清酒

## 🖼️ 圖片規格建議

- **解析度**: 建議 800x600px 或以上
- **比例**: 4:3 (會自動裁切為適合尺寸)
- **格式**: JPG 或 PNG
- **檔案大小**: 建議每張圖片小於 500KB
- **品質**: 清晰、光線充足、主體突出

## 💡 使用方式

在 `menu.json` 中，只需要將 `image` 欄位改為檔案名稱即可：

```json
{
  "name": "招牌拿鐵",
  "description": "使用精選阿拉比卡豆，搭配濃郁奶泡，口感順滑香醇",
  "image": "coffee-latte.jpg",
  "tags": ["中焙", "牛奶", "溫熱"]
}
```

系統會自動：
1. 優先載入本地圖片 (`./images/coffee-latte.jpg`)
2. 如果本地圖片載入失敗，會自動回退到對應類型的預設 Unsplash 圖片
3. 如果都失敗，則顯示 placeholder 圖片

## 🔄 圖片遷移計畫

1. **第一階段**: 先從咖啡類開始替換
2. **第二階段**: 茶類和奶類
3. **第三階段**: 酒類和其他分類
4. **最終階段**: 完全使用本地圖片，移除對 Unsplash 的依賴

這樣的設計讓您可以漸進式地更換圖片，不會影響網站的正常運作。
