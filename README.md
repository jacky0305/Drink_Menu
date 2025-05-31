# 家の飲品 | Home Café Menu

一個優雅的日系風格飲品菜單網站，採用純前端技術打造，具有流暢的動畫效果和響應式設計。

## 🌟 專案特色

- **日系咖啡廳風格設計**：溫暖的色調搭配簡潔的版面
- **流暢的動畫效果**：優雅的淡入淡出切換動畫
- **響應式設計**：完美適配桌面和移動設備
- **動態內容載入**：從 JSON 檔案動態載入菜單資料
- **GitHub Pages 自動部署**：推送即部署

## 🔧 技術架構

### 前端技術
- **HTML5**: 語義化標籤結構
- **CSS3**: Flexbox/Grid 佈局 + CSS 動畫
- **Vanilla JavaScript**: 原生 JS，無依賴框架
- **Google Fonts**: Noto Sans TC + Zen Maru Gothic

### 部署方式
- **GitHub Actions**: 自動化 CI/CD
- **GitHub Pages**: 靜態網站託管
- **網址**: https://jacky0305.github.io/Drink_Menu

## 📁 檔案結構

```
Drink_Menu/
├── index.html              # 主頁面
├── style.css               # 樣式表
├── script.js               # JavaScript 邏輯
├── menu.json               # 菜單資料
├── README.md               # 專案說明
└── .github/
    └── workflows/
        └── deploy.yml       # GitHub Actions 部署設定
```

## 🎨 設計系統

### 色彩變數 (CSS Variables)
```css
:root {
    /* 基礎色彩 */
    --primary-white: #ffffff;
    --soft-white: #fefefe;
    --light-gray: #f8f9fa;
    
    /* 日系咖啡廳色系 */
    --coffee-light: #f9f6f2;    /* 淺咖啡色背景 */
    --coffee-soft: #f0ebe5;     /* 柔和咖啡色 */
    --coffee-medium: #d4c4b0;   /* 中等咖啡色 */
    --coffee-dark: #a68b5b;     /* 深咖啡色 */
    --coffee-text: #6b5344;     /* 咖啡色文字 */
    
    /* 文字色彩 */
    --text-primary: #2c2c2c;    /* 主要文字 */
    --text-secondary: #6c757d;  /* 次要文字 */
    --text-light: #9c9c9c;      /* 淡色文字 */
    
    /* 效果 */
    --soft-shadow: rgba(107, 83, 68, 0.08);
    --hover-shadow: rgba(107, 83, 68, 0.12);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 字體系統
- **主標題**: Zen Maru Gothic (日系字體)
- **內文**: Noto Sans TC (繁體中文最佳化)
- **後備字體**: -apple-system, BlinkMacSystemFont

## ⚡ 動畫系統

### 菜單切換動畫流程
1. **淡出階段** (500ms)
   - 舊內容透明度降至 0
   - 向下移動 20px
   - 禁用滑鼠事件

2. **內容更新** (瞬間)
   - 清空舊內容
   - 載入新分類資料
   - 渲染新 DOM 元素

3. **淡入階段** (500ms + 卡片動畫)
   - 容器透明度回復至 1
   - 位置回復至原點
   - 卡片依序淡入 (每個間隔 200ms)

### 卡片動畫參數
```css
/* 卡片過渡效果 */
transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);

/* 陰影效果 */
box-shadow: 0 6px 24px rgba(139, 105, 20, 0.15);  /* 普通狀態 */
box-shadow: 0 12px 36px rgba(139, 105, 20, 0.25); /* 懸停狀態 */
```

## 📱 響應式設計

### 斷點設定
- **桌面版**: > 768px
- **平板版**: ≤ 768px
- **手機版**: ≤ 480px

### 主要調整項目
- **Grid 佈局**: 自動適應 (`auto-fit, minmax(300px, 1fr)`)
- **Header 高度**: 桌面 30px → 手機 20px
- **字體大小**: 使用 `clamp()` 動態縮放
- **間距調整**: 容器 padding 逐級縮小

## 🗂️ 資料結構

### menu.json 格式
```json
{
  "categories": [
    {
      "id": "coffee",
      "name": "咖啡",
      "icon": "☕",
      "items": [
        {
          "name": "招牌拿鐵",
          "description": "使用精選阿拉比卡豆...",
          "image": "https://images.unsplash.com/...",
          "tags": ["中焙", "牛奶", "溫熱"]
        }
      ]
    }
  ]
}
```

### 圖片來源
- **Unsplash API**: 高品質飲品圖片
- **尺寸**: 400x300px
- **載入策略**: lazy loading
- **錯誤處理**: SVG placeholder

## 🔄 核心功能

### 1. 動態內容載入
- `loadMenuFromLocal()`: 從本地 JSON 載入
- `renderCategories()`: 動態生成分類按鈕
- `renderMenu()`: 渲染選定分類的項目

### 2. 動畫控制
- `switchCategory()`: 處理分類切換邏輯
- `setupCardAnimations()`: 設置卡片入場動畫
- `setupScrollAnimations()`: 滾動觸發動畫

### 3. 使用者體驗
- **平滑滾動**: 切換時自動滾動到頂部
- **防重複點擊**: 動畫進行中禁用切換
- **圖片錯誤處理**: 自動替換為 placeholder

## 🚀 部署流程

### GitHub Actions 自動部署
1. **觸發條件**: 推送到 main 分支
2. **建置步驟**: Checkout → Setup Pages → Upload
3. **部署步驟**: Deploy to GitHub Pages
4. **權限設定**: pages: write, id-token: write

### 手動部署步驟
1. 在 GitHub 儲存庫設定中啟用 GitHub Pages
2. Source 選擇 "GitHub Actions"
3. 推送程式碼會自動觸發部署

## 🛠️ 開發指南

### 新增飲品分類
1. 編輯 `menu.json`
2. 在 `categories` 陣列中新增項目
3. 設定 `id`, `name`, `icon`, `items`

### 調整動畫效果
- **速度調整**: 修改 CSS `transition` 時間
- **緩動函數**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **卡片間隔**: 修改 JavaScript 中的 `setTimeout` 延遲

### 色彩主題調整
- 修改 CSS `:root` 中的變數
- 所有元件會自動套用新色彩

### 響應式調整
- 新增或修改 `@media` 查詢
- 調整 `clamp()` 函數參數

## 🔮 未來改善方向

### 功能擴展
- [ ] 購物車功能
- [ ] 價格顯示
- [ ] 多語言支援
- [ ] 搜尋功能
- [ ] 收藏清單

### 技術優化
- [ ] 圖片懶載入優化
- [ ] PWA 支援
- [ ] 暗色主題
- [ ] 動畫效能優化
- [ ] TypeScript 重構

### 設計改善
- [ ] 更多動畫效果
- [ ] 微互動設計
- [ ] 載入骨架屏
- [ ] 更豐富的視覺層次

## 📝 開發筆記

### 重要的設計決策
1. **純前端實現**: 避免後端複雜性，便於部署
2. **JSON 資料管理**: 方便內容更新，未來可接 API
3. **CSS Grid + Flexbox**: 現代佈局技術組合
4. **原生 JavaScript**: 避免框架依賴，提升載入速度

### 已解決的問題
- ✅ 菜單切換時的閃爍問題
- ✅ 動畫流暢度優化
- ✅ 響應式設計適配
- ✅ 圖片載入錯誤處理
- ✅ GitHub Pages 部署自動化

### 效能考量
- 使用 CSS 動畫取代 JavaScript 動畫
- 圖片 lazy loading
- 最小化 DOM 操作
- 合理的動畫時間設定

---

**專案維護者**: GitHub Copilot  
**最後更新**: 2025年6月1日  
**專案狀態**: 活躍開發中

> 💡 **提示**: 未來修改時，請參考此文件了解專案架構和設計理念，以確保改動符合整體風格。
