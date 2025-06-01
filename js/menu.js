// menu.js - 菜單數據載入和渲染功能

import { getImageSrc, handleImageError, showErrorMessage } from './utils.js';
import { setupCardAnimations } from './animations.js';
import { optimizeDesktopPerformance } from './mobile.js';

// 菜單資料結構（從 JSON 檔案動態載入）
export let menuData = {
    categories: []
};

// 從本地 JSON 文件載入資料
export async function loadMenuFromLocal() {
    try {
        const response = await fetch('./menu.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        menuData = data;
        
        console.log('菜單資料已從 JSON 檔案載入');
        return data;
    } catch (error) {
        console.error('載入菜單資料失敗:', error);
        const menuGrid = document.getElementById('menuGrid');
        if (menuGrid) {
            showErrorMessage('無法載入菜單資料，請檢查網路連線或聯絡管理員。', menuGrid);
        }
        throw error;
    }
}

// 未來會加入的 GitHub JSON 載入功能
export async function loadMenuFromGitHub(jsonUrl) {
    try {
        const response = await fetch(jsonUrl);
        const data = await response.json();
        menuData = data;
        
        console.log('菜單資料已從 GitHub 載入');
        return data;
    } catch (error) {
        console.error('載入菜單資料失敗:', error);
        throw error;
    }
}

// 渲染菜單
export function renderMenu(categoryId, subcategoryId = null) {
    console.log('開始渲染菜單:', categoryId, subcategoryId);
    
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;
    
    // 找到對應的分類
    const category = menuData.categories?.find(cat => cat.id === categoryId);
    let drinks = [];
    
    if (subcategoryId && category?.subcategories) {
        // 如果有子分類，從子分類中獲取飲品
        const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
        drinks = subcategory?.items || [];
    } else if (category?.items) {
        // 如果沒有子分類，直接從分類中獲取飲品（向後兼容）
        drinks = category.items;
    } else if (category?.subcategories && category.subcategories.length > 0) {
        // 如果有子分類但沒指定，取第一個子分類的飲品
        drinks = category.subcategories[0]?.items || [];
    }
    
    console.log('找到飲品數據:', drinks);
    
    // 先清空容器
    menuGrid.innerHTML = '';
    
    // 檢查是否有飲品數據
    if (!drinks || drinks.length === 0) {
        console.warn('沒有找到飲品數據');
        menuGrid.innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #6c757d;">此分類暫無飲品資料</div>';
        return;
    }
    
    // 立即渲染卡片
    try {
        const cardsHTML = drinks.map((drink, index) => {
            const imageSrc = getImageSrc(drink.image);
            return `
            <div class="drink-card" data-index="${index}" style="opacity: 0; transform: translateY(30px);">
                <div class="drink-image">
                    <img src="${imageSrc}" alt="${drink.name}" loading="lazy" 
                         onerror="handleImageError(this, '${drink.image}')">
                </div>
                <div class="drink-info">
                    <h3 class="drink-name">${drink.name}</h3>
                    <p class="drink-description">${drink.description}</p>
                    ${drink.tags ? `
                        <div class="drink-tags">
                            ${drink.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>`;
        }).join('');
        
        menuGrid.innerHTML = cardsHTML;
        console.log('卡片HTML已插入，數量:', drinks.length);
        
        // 短暫延遲後設置動畫
        setTimeout(() => {
            setupCardAnimations();
        }, 50);
        
        // 桌面版性能優化
        if (window.innerWidth >= 1024) {
            optimizeDesktopPerformance();
        }
        
    } catch (error) {
        console.error('渲染菜單時發生錯誤:', error);
        menuGrid.innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #d32f2f;">載入菜單時發生錯誤，請重新整理頁面</div>';
    }
}

// 設置圖片錯誤處理
export function setupImageErrorHandling() {
    // 圖片載入錯誤處理
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE3MCAyMDBIMjMwTDIwMCAxNTBaIiBmaWxsPSIjQ0NDIi8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjEyMCIgcj0iMTAiIGZpbGw9IiNDQ0MiLz4KPC9zdmc+';
            e.target.alt = '圖片載入失敗';
        }
    }, true);
}

// 設置全局handleImageError函數
window.handleImageError = handleImageError;
