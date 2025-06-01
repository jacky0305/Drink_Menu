// navigation.js - 分類和子分類導航功能

import { menuData, renderMenu } from './menu.js';
import { animateCategorySwitch, animateSubcategorySwitch } from './animations.js';
import { scrollToTop } from './utils.js';
import { addMobileTouchSupport } from './mobile.js';

// 當前顯示的分類和子分類
export let currentCategory = 'coffee';
export let currentSubcategory = null;
export let isAnimating = false; // 防止動畫期間重複觸發

// DOM 元素
let categoryTabs;
let subcategoryNav;
let subcategoryTabs;
let tabButtons = [];
let subcategoryButtons = [];

// 初始化導航
export function initializeNavigation() {
    categoryTabs = document.getElementById('categoryTabs');
    subcategoryNav = document.getElementById('subcategoryNav');
    subcategoryTabs = document.getElementById('subcategoryTabs');
}

// 動態生成分類按鈕
export function renderCategories() {
    if (!menuData.categories || !categoryTabs) return;
    
    categoryTabs.innerHTML = menuData.categories.map((category, index) => `
        <button class="tab-button ${index === 0 ? 'active' : ''}" data-category="${category.id}">
            <span class="tab-icon">${category.icon}</span>
            <span class="tab-text">${category.name}</span>
        </button>
    `).join('');
    
    // 重新獲取按鈕並綁定事件
    tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            switchCategory(category);
        });
        
        // 添加觸摸事件處理
        button.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        });
    });
    
    // 重新初始化觸摸滾動
    addMobileTouchSupport();
}

// 渲染子分類按鈕
export function renderSubcategories(categoryId) {
    const category = menuData.categories?.find(cat => cat.id === categoryId);
    
    if (!category?.subcategories || category.subcategories.length === 0) {
        hideSubcategories();
        return;
    }
    
    // 顯示子分類導航
    if (subcategoryNav) {
        subcategoryNav.style.display = 'block';
    }
    
    // 生成子分類按鈕
    if (subcategoryTabs) {
        subcategoryTabs.innerHTML = category.subcategories.map((subcategory, index) => `
            <button class="subcategory-button ${index === 0 ? 'active' : ''}" 
                    data-subcategory="${subcategory.id}">
                ${subcategory.name}
            </button>
        `).join('');
        
        // 重新獲取按鈕並綁定事件
        subcategoryButtons = document.querySelectorAll('.subcategory-button');
        subcategoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const subcategory = button.dataset.subcategory;
                switchSubcategory(subcategory);
            });
            
            // 添加觸摸事件處理
            button.addEventListener('touchstart', (e) => {
                e.stopPropagation();
            });
        });
        
        // 重新初始化觸摸滾動
        addMobileTouchSupport();
    }
}

// 隱藏子分類導航
export function hideSubcategories() {
    if (subcategoryNav) {
        subcategoryNav.style.display = 'none';
    }
    currentSubcategory = null;
}

// 切換分類
export function switchCategory(category) {
    if (category === currentCategory || isAnimating) return;
    
    isAnimating = true; // 設置動畫狀態
    
    // 更新按鈕狀態
    tabButtons.forEach(btn => btn.classList.remove('active'));
    const categoryButton = document.querySelector(`[data-category="${category}"]`);
    if (categoryButton) {
        categoryButton.classList.add('active');
    }
    
    // 更新當前分類
    currentCategory = category;
    
    // 生成子分類按鈕
    const selectedCategory = menuData.categories?.find(cat => cat.id === category);
    if (selectedCategory?.subcategories && selectedCategory.subcategories.length > 0) {
        currentSubcategory = selectedCategory.subcategories[0].id;
        renderSubcategories(category);
    } else {
        currentSubcategory = null;
        hideSubcategories();
    }
    
    // 執行切換動畫
    animateCategorySwitch(() => {
        renderMenu(currentCategory, currentSubcategory);
        
        // 平滑滾動到頂部
        scrollToTop();
        
        // 重置動畫狀態
        setTimeout(() => {
            isAnimating = false;
        }, 200);
    });
}

// 切換子分類
export function switchSubcategory(subcategory) {
    if (subcategory === currentSubcategory || isAnimating) return;
    
    isAnimating = true; // 設置動畫狀態
    
    // 更新按鈕狀態
    subcategoryButtons.forEach(btn => btn.classList.remove('active'));
    const subcategoryButton = document.querySelector(`[data-subcategory="${subcategory}"]`);
    if (subcategoryButton) {
        subcategoryButton.classList.add('active');
    }
    
    // 更新當前子分類
    currentSubcategory = subcategory;
    
    // 執行切換動畫
    animateSubcategorySwitch(() => {
        renderMenu(currentCategory, currentSubcategory);
        
        // 重置動畫狀態
        setTimeout(() => {
            isAnimating = false;
        }, 150);
    });
}

// 初始化第一個分類
export function initializeFirstCategory() {
    if (menuData.categories && menuData.categories.length > 0 && !isAnimating) {
        currentCategory = menuData.categories[0].id;
        const firstCategory = menuData.categories[0];
        
        // 如果有子分類，設置第一個子分類為當前子分類
        if (firstCategory.subcategories && firstCategory.subcategories.length > 0) {
            currentSubcategory = firstCategory.subcategories[0].id;
            renderSubcategories(currentCategory);
        }
        
        // 初始載入不需要動畫
        isAnimating = true;
        renderMenu(currentCategory, currentSubcategory);
        
        // 短暫延遲後啟用動畫功能
        setTimeout(() => {
            isAnimating = false;
        }, 1000);
    }
}

// 暴露當前狀態的 getter 函數
export function getCurrentCategory() {
    return currentCategory;
}

export function getCurrentSubcategory() {
    return currentSubcategory;
}
