# CSS 重構說明

## 結構改善

原本的 `style.css` 檔案有 1123 行，非常難以維護。現在已重構為模塊化結構：

### 新的 CSS 架構

```
css/
├── reset.css          # 基本重置和跨瀏覽器兼容性 (46行)
├── variables.css      # CSS 變數定義和基本樣式 (45行)
├── header.css         # 標題區域樣式 (25行)
├── navigation.css     # 導航相關樣式 (120行)
├── layout.css         # 主要佈局和網格系統 (81行)
├── components.css     # 飲品卡片和組件樣式 (136行)
├── animations.css     # 動畫效果和載入狀態 (106行)
└── responsive.css     # 響應式設計和媒體查詢 (584行)
```

**總計: 1143 行 (vs 原本 1123 行)**

### 優點

1. **模塊化**: 每個檔案負責特定功能，容易定位和修改
2. **可維護性**: 小檔案更容易閱讀和理解  
3. **協作友善**: 多人開發時減少衝突
4. **載入效率**: 可選擇性載入需要的模塊
5. **擴展性**: 新增功能時可以增加新模塊

### 使用方式

主 `style.css` 檔案使用 `@import` 引入所有模塊，保持向後兼容性。

### 檔案說明

- **reset.css**: 瀏覽器重置、防跑版設定
- **variables.css**: 顏色變數、字體、基本樣式
- **header.css**: Logo 和標題區域
- **navigation.css**: 分類導航和子分類導航
- **layout.css**: 主內容區域和 Grid 佈局
- **components.css**: 飲品卡片、標籤等組件
- **animations.css**: 漸入效果、載入動畫
- **responsive.css**: 手機和平板適配

### 修改建議

現在當您需要修改特定功能時，可以直接編輯對應的小檔案：

- 修改顏色主題 → `variables.css`
- 調整手機版佈局 → `responsive.css`
- 修改卡片樣式 → `components.css`
- 調整動畫效果 → `animations.css`

### 備份

原始檔案已備份為 `style-backup.css`，如有需要可以回復。
