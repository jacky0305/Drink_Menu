// app.js - 主要的應用程式邏輯和初始化

import { checkBrowserSupport, debugMenuDisplay, debounce } from './js/utils.js';
import { preventLayoutIssues, fixCardDisplay, addMobileTouchSupport } from './js/mobile.js';
import { loadMenuFromLocal, setupImageErrorHandling, menuData } from './js/menu.js';
import { 
    initializeNavigation, 
    renderCategories, 
    initializeFirstCategory,
    getCurrentCategory,
    getCurrentSubcategory
} from './js/navigation.js';
import { setupScrollAnimations, setupCardAnimations } from './js/animations.js';
import { initializeRoulette } from './js/roulette.js';

// 初始化
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOMContentLoaded triggered');
    
    try {
        // 檢查瀏覽器支持
        checkBrowserSupport();
        
        // 添加防跑版措施
        preventLayoutIssues();
        
        // 初始化導航
        initializeNavigation();
        
        // 設置圖片錯誤處理
        setupImageErrorHandling();
        
        // 先嘗試從本地 JSON 載入資料
        await loadMenuFromLocal();
        
        // 生成分類按鈕
        renderCategories();
        
        // 載入第一個分類的菜單
        initializeFirstCategory();
        
        // 設置滾動動畫觀察器
        setupScrollAnimations();
        
        // 初始化轉盤功能
        initializeRoulette();
        
        // 添加調試信息
        setTimeout(() => {
            debugMenuDisplay(menuData, getCurrentCategory(), getCurrentSubcategory());
        }, 2000);
        
        console.log('應用程式初始化完成');
        
    } catch (error) {
        console.error('初始化過程中發生錯誤:', error);
    }
});

// 視窗大小改變時重新優化
window.addEventListener('resize', debounce(() => {
    const cards = document.querySelectorAll('.drink-card');
    if (cards.length > 0) {
        // 重新檢查設備類型並調整布局
        const isMobile = window.innerWidth <= 768;
        const menuGrid = document.getElementById('menuGrid');
        
        // 重新設置Grid布局
        if (menuGrid) {
            if (isMobile) {
                menuGrid.style.gridTemplateColumns = '1fr';
            } else if (window.innerWidth <= 991) {
                menuGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(260px, 1fr))';
            } else {
                menuGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
            }
        }
        
        // 重新設置卡片動畫和性能優化
        setupCardAnimations();
        
        // 重新初始化觸摸滾動
        addMobileTouchSupport();
        
        // 修復可能的顯示問題
        fixCardDisplay();
    }
}, 250));

// 暴露調試函數到全局作用域
window.debugMenuDisplay = () => debugMenuDisplay(menuData, getCurrentCategory(), getCurrentSubcategory());

console.log('主應用程式模組已載入');
