# 家の飲品 | Home Café Menu

一個現代化的日系風格飲品菜單網站，採用純前端技術打造，具有流暢的動畫效果、響應式設計，以及全面的瀏覽器兼容性和性能優化。

## 🌟 專案特色

- **日系咖啡廳風格設計**：溫暖的色調搭配簡潔的版面
- **流暢的動畫效果**：優雅的淡入淡出切換動畫，支援不同設備的動畫策略
- **響應式設計**：完美適配桌面、平板和移動設備
- **動態內容載入**：從 JSON 檔案動態載入菜單資料，支援子分類結構
- **強制淺色主題**：完全禁用深色模式，確保一致的視覺體驗
- **瀏覽器兼容性**：支援 IE11、Safari、Firefox 等多種瀏覽器
- **性能優化**：硬體加速、動畫狀態管理、防重複渲染
- **GitHub Pages 自動部署**：推送即部署

## 🔧 技術架構

### 前端技術
- **HTML5**: 語義化標籤結構，包含 `color-scheme` meta 標籤強制淺色模式
- **CSS3**: Flexbox/Grid 佈局 + CSS 動畫，完整的瀏覽器前綴支援
- **Vanilla JavaScript**: 原生 JS，無依賴框架，包含現代 API polyfills
- **Google Fonts**: Noto Sans TC + Zen Maru Gothic，優化字體載入

### 核心功能
- **深色模式防護**：多層次防止系統深色模式影響
- **動畫狀態管理**：防止重複點擊和併發動畫問題
- **瀏覽器兼容性檢測**：自動檢測並適配不同瀏覽器
- **性能優化**：硬體加速、防抖函數、響應式動畫策略

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
├── images/                 # 本地圖片資料夾
│   └── README.md           # 圖片使用說明
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
    --hover-shadow: rgba(107, 83, 68, 0.15);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 深色模式防護系統
```css
/* HTML meta 標籤 */
<meta name="color-scheme" content="light only">

/* CSS 強制淺色模式 */
:root { color-scheme: light only; }
html, body { color-scheme: light; }

/* 媒體查詢覆蓋 */
@media (prefers-color-scheme: dark) {
    :root { color-scheme: light !important; }
    /* 所有顏色變數強制覆蓋 */
}
```

### 字體系統
- **主標題**: Zen Maru Gothic (日系字體)
- **內文**: Noto Sans TC (繁體中文最佳化)
- **後備字體**: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto

## ⚡ 動畫系統

### 增強的陰影效果
- **普通狀態**: `0 4px 16px rgba(107, 83, 68, 0.12), 0 2px 8px rgba(107, 83, 68, 0.08)`
- **懸停狀態**: `0 8px 32px rgba(107, 83, 68, 0.18), 0 4px 16px rgba(107, 83, 68, 0.12)`
- **懸停位移**: `translateY(-6px)` 增強立體感

### 動畫狀態管理
```javascript
let isAnimating = false; // 防止重複觸發

function switchCategory(category) {
    if (category === currentCategory || isAnimating) return;
    isAnimating = true; // 設置狀態鎖
    
    // 動畫邏輯...
    
    setTimeout(() => {
        isAnimating = false; // 釋放狀態鎖
    }, animationDuration);
}
```

### 響應式動畫策略
- **桌面版** (≥1024px): CSS 動畫類，硬體加速
- **平板版** (768px-1024px): JavaScript 動畫，中等延遲
- **手機版** (≤768px): JavaScript 動畫，較長延遲，降低複雜度

### 菜單切換動畫流程
1. **淡出階段** (300-500ms)
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
   - 卡片依序淡入 (延遲優化)

### 卡片動畫參數
```css
/* 卡片過渡效果 */
transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);

/* 硬體加速 */
will-change: transform, opacity;
backface-visibility: hidden;
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

### menu.json 格式 (支援子分類)
```json
{
  "categories": [
    {
      "id": "coffee",
      "name": "咖啡",
      "icon": "☕",
      "subcategories": [
        {
          "id": "specialty",
          "name": "特調",
          "items": [
            {
              "name": "招牌拿鐵",
              "description": "使用精選阿拉比卡豆...",
              "image": "https://images.unsplash.com/...",
              "tags": ["中焙", "牛奶", "溫熱"]
            }
          ]
        },
        {
          "id": "single-origin",
          "name": "單品",
          "items": [...]
        }
      ]
    }
  ]
}
```

### 資料結構特點
- **多層分類**: 支援主分類 → 子分類 → 飲品項目的結構
- **向後兼容**: 仍支援沒有子分類的簡單結構
- **動態導航**: 自動生成分類和子分類按鈕

### 圖片管理系統
- **混合圖片來源**: 支援本地圖片與 Unsplash API 混用
- **智慧路徑處理**: 自動識別本地與外部圖片
- **漸進式遷移**: 可逐步將 Unsplash 圖片替換為本地圖片
- **錯誤處理**: 本地圖片載入失敗時自動回退到預設圖片
- **圖片優化**: lazy loading + 多層錯誤處理機制

#### 圖片路徑格式
- **本地圖片**: `"coffee-latte.jpg"` 或 `"./images/coffee-latte.jpg"`
- **外部圖片**: `"https://images.unsplash.com/photo-..."`
- **自動處理**: 系統會自動識別並使用正確的路徑

#### 錯誤處理機制
1. **第一層**: 嘗試載入指定圖片
2. **第二層**: 本地圖片失敗時回退到對應類型的 Unsplash 預設圖片
3. **第三層**: 所有圖片都失敗時顯示 Base64 SVG placeholder

### 圖片來源
- **本地圖片**: 存放在 `./images/` 資料夾，完全控制
- **Unsplash API**: 高品質飲品圖片，作為後備方案
- **尺寸**: 建議 800x600px，會自動裁切為 400x300px 顯示
- **載入策略**: lazy loading
- **檔案格式**: JPG/PNG，建議小於 500KB

## 🔄 核心功能

### 1. 動態內容載入
- `loadMenuFromLocal()`: 從本地 JSON 載入，支援子分類結構
- `renderCategories()`: 動態生成主分類按鈕
- `renderSubcategories()`: 動態生成子分類按鈕
- `renderMenu()`: 條件渲染，支援多層分類

### 2. 圖片管理與處理
- `getImageSrc()`: 智慧圖片路徑處理，自動識別本地/外部圖片
- `handleImageError()`: 多層錯誤處理，自動回退到預設圖片
- 支援本地圖片與 Unsplash 圖片混合使用
- 漸進式圖片遷移，不影響現有功能

### 3. 動畫控制與狀態管理
- `switchCategory()`: 處理主分類切換，包含狀態鎖定
- `switchSubcategory()`: 處理子分類切換，較快速的過渡
- `setupCardAnimations()`: 響應式動畫策略
- `isAnimating`: 全域狀態標記，防止併發動畫

### 3. 動畫控制與狀態管理
- `switchCategory()`: 處理主分類切換，包含狀態鎖定
- `switchSubcategory()`: 處理子分類切換，較快速的過渡
- `setupCardAnimations()`: 響應式動畫策略
- `isAnimating`: 全域狀態標記，防止併發動畫

### 4. 瀏覽器兼容性
- `checkBrowserSupport()`: 檢測並設置相容性功能
- CSS Grid 檢測與 Flexbox 後備方案
- Intersection Observer polyfill
- requestAnimationFrame polyfill
- 強制深色模式監聽與覆蓋

### 5. 性能優化
- `optimizeDesktopPerformance()`: 桌面版硬體加速
- `debounce()`: 防抖函數，優化 resize 事件
- 動畫延遲管理，避免過長載入時間
- will-change 屬性動態管理

### 6. 使用者體驗
- **平滑滾動**: 切換時自動滾動到頂部
- **防重複點擊**: 動畫進行中禁用切換
- **智慧圖片處理**: 自動回退機制，確保圖片始終可用
- **響應式動畫**: 不同設備使用最佳化的動畫策略

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
3. 設定 `id`, `name`, `icon`, `subcategories` (可選)
4. 每個子分類包含 `id`, `name`, `items`

### 圖片管理指南
1. **添加新圖片**
   - 將圖片放入 `./images/` 資料夾
   - 使用描述性檔名 (如 `coffee-latte.jpg`)
   - 建議解析度 800x600px，檔案小於 500KB

2. **更新菜單圖片**
   - 在 `menu.json` 中將 `image` 欄位改為檔名
   - 範例: `"image": "coffee-latte.jpg"`
   - 系統會自動處理路徑和錯誤回退

3. **漸進式遷移策略**
   - 可以混用本地圖片和 Unsplash 圖片
   - 建議按分類逐步替換
   - 本地圖片載入失敗會自動回退到 Unsplash

### 調整動畫效果
- **速度調整**: 修改 CSS `transition` 時間和 JavaScript 延遲
- **緩動函數**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **卡片間隔**: 修改 `setupCardAnimations()` 中的延遲算法
- **響應式**: 針對不同設備設置不同的動畫參數

### 色彩主題調整
- 修改 CSS `:root` 中的變數
- 注意同時更新深色模式覆蓋區塊中的對應變數
- 所有元件會自動套用新色彩

### 瀏覽器兼容性維護
- 新增 CSS 屬性時記得加上瀏覽器前綴
- 使用新 JavaScript API 前檢查 `checkBrowserSupport()` 函數
- 測試 IE11 的 Flexbox 後備方案

### 性能優化指南
- 桌面版優先使用 CSS 動畫
- 移動版使用 JavaScript 動畫控制
- 適當使用 `will-change` 但記得清除
- 避免在動畫中進行 DOM 查詢

## 🔮 未來改善方向

### 功能擴展
- [ ] 購物車功能
- [ ] 價格顯示
- [ ] 多語言支援 (i18n)
- [ ] 搜尋功能
- [ ] 收藏清單
- [ ] 飲品詳細頁面
- [ ] 用戶評分系統

### 技術優化
- [ ] 圖片懶載入進階優化
- [ ] PWA 支援 (Service Worker)
- [ ] 深色主題切換功能
- [ ] 動畫效能監控
- [ ] TypeScript 重構
- [ ] 單元測試覆蓋
- [ ] 無障礙功能增強 (a11y)

### 設計改善
- [ ] 更多微互動設計
- [ ] 載入骨架屏
- [ ] 更豐富的視覺層次
- [ ] 自定義主題色彩
- [ ] 動態背景效果

## 📝 開發筆記

### 重要的設計決策
1. **純前端實現**: 避免後端複雜性，便於部署
2. **JSON 資料管理**: 方便內容更新，未來可接 API
3. **CSS Grid + Flexbox**: 現代佈局技術組合，包含完整後備方案
4. **原生 JavaScript**: 避免框架依賴，提升載入速度
5. **多層防護深色模式**: 確保一致的視覺體驗
6. **響應式動畫策略**: 不同設備使用最佳化的動畫方案

### 已解決的問題
- ✅ 深色模式完全禁用
- ✅ 菜單切換時的閃爍問題
- ✅ 動畫流暢度優化
- ✅ 響應式設計適配
- ✅ 圖片載入錯誤處理
- ✅ GitHub Pages 部署自動化
- ✅ 瀏覽器兼容性問題 (IE11, Safari, Firefox)
- ✅ 多重渲染防護
- ✅ 卡片陰影效果增強
- ✅ 動畫狀態管理
- ✅ 性能優化 (硬體加速)

### 瀏覽器兼容性
| 瀏覽器 | 版本 | 支援狀態 | 特殊處理 |
|--------|------|----------|----------|
| Chrome | 60+ | ✅ 完全支援 | - |
| Safari | 12+ | ✅ 完全支援 | webkit 前綴 |
| Firefox | 55+ | ✅ 完全支援 | moz 前綴 |
| Edge | 16+ | ✅ 完全支援 | - |
| IE11 | 11 | ⚠️ 基本支援 | Flexbox 後備 |

### 效能考量
- 使用 CSS 動畫取代 JavaScript 動畫
- 圖片 lazy loading
- 最小化 DOM 操作
- 硬體加速優化 (桌面版)
- 防抖函數優化事件處理
- will-change 動態管理

### 已實現的性能優化
1. **硬體加速**: 桌面版啟用 GPU 加速
2. **動畫策略**: 響應式動畫，針對設備優化
3. **狀態管理**: 防止重複渲染和併發動畫
4. **記憶體管理**: 動態 will-change 屬性管理
5. **事件優化**: 防抖函數處理 resize 事件

---

**專案維護者**: GitHub Copilot  
**最後更新**: 2024年12月  
**專案狀態**: 活躍開發中  
**版本**: v2.0 - 多重改進版

### 🚀 最新更新 (v2.0)
- **深色模式完全禁用**: 多層防護確保始終顯示淺色主題
- **動畫狀態管理**: 防止重複觸發和併發動畫問題
- **瀏覽器兼容性**: 支援 IE11、Safari、Firefox 等舊版瀏覽器
- **性能優化**: 硬體加速、響應式動畫策略、防抖優化
- **子分類支援**: 完整的多層分類結構和導航
- **陰影效果增強**: 更深層次的視覺立體感

> 💡 **提示**: 未來修改時，請參考此文件了解專案架構和設計理念，以確保改動符合整體風格。特別注意保持瀏覽器兼容性和性能優化。
