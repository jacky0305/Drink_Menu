// roulette.js - 轉盤功能

import { menuData } from './menu.js';
import { getImageSrc } from './utils.js';

// 轉盤相關的全局變數
let rouletteModal;
let rouletteOverlay;
let rouletteClose;
let rouletteBtn;
let rouletteSpinBtn;
let rouletteWheel;
let rouletteSegments;
let rouletteResult;
let rouletteFilter;
let isSpinning = false;

// 顏色配置 - 為不同飲品類型設置不同顏色
const rouletteColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D2B4DE',
    '#AED6F1', '#A3E4D7', '#F9E79F', '#FADBD8', '#D5DBDB'
];

// 初始化轉盤功能
export function initializeRoulette() {
    // 檢查是否已經初始化過
    if (window.rouletteInitialized) {
        console.log('轉盤功能已經初始化過，跳過重複初始化');
        return;
    }

    // 獲取DOM元素
    rouletteModal = document.getElementById('rouletteModal');
    rouletteOverlay = document.getElementById('rouletteOverlay');
    rouletteClose = document.getElementById('rouletteClose');
    rouletteBtn = document.getElementById('rouletteBtn');
    rouletteSpinBtn = document.getElementById('rouletteSpinBtn');
    rouletteWheel = document.getElementById('rouletteWheel');
    rouletteSegments = document.getElementById('rouletteSegments');
    rouletteResult = document.getElementById('rouletteResult');
    rouletteFilter = document.getElementById('rouletteFilter');

    // 綁定事件監聽器
    if (rouletteBtn) {
        rouletteBtn.addEventListener('click', openRouletteModal);
    }

    if (rouletteClose) {
        rouletteClose.addEventListener('click', closeRouletteModal);
    }

    if (rouletteOverlay) {
        rouletteOverlay.addEventListener('click', closeRouletteModal);
    }

    if (rouletteSpinBtn) {
        rouletteSpinBtn.addEventListener('click', startSpin);
    }

    if (rouletteFilter) {
        rouletteFilter.addEventListener('change', generateRouletteSegments);
    }

    // ESC鍵關閉模態框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && rouletteModal && rouletteModal.classList.contains('show')) {
            closeRouletteModal();
        }
    });

    // 標記為已初始化
    window.rouletteInitialized = true;
    console.log('轉盤功能已初始化');
}

// 開啟轉盤模態框
function openRouletteModal() {
    if (!rouletteModal) return;

    console.log('開啟轉盤模態框');

    // 清除之前的結果
    if (rouletteResult) {
        rouletteResult.innerHTML = '';
    }

    // 重置轉盤狀態
    resetRouletteWheel();

    // 生成分類選項
    generateFilterOptions();

    // 生成轉盤區段
    generateRouletteSegments();

    // 顯示模態框
    rouletteModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // 防止背景滾動

    console.log('轉盤模態框已開啟');
}

// 關閉轉盤模態框
function closeRouletteModal() {
    if (!rouletteModal) return;

    rouletteModal.classList.remove('show');
    document.body.style.overflow = ''; // 恢復背景滾動
    isSpinning = false;

    // 重置按鈕狀態
    if (rouletteSpinBtn) {
        rouletteSpinBtn.disabled = false;
        const spinText = rouletteSpinBtn.querySelector('.spin-text');
        if (spinText) {
            spinText.textContent = '開始轉盤';
        }
    }

    console.log('轉盤模態框已關閉');
}

// 重置轉盤狀態
function resetRouletteWheel() {
    if (!rouletteSegments) return;

    console.log('重置轉盤狀態');

    // 重置轉盤旋轉
    rouletteSegments.style.transform = 'rotate(0deg)';
    rouletteSegments.style.transition = 'none';
    rouletteSegments.classList.remove('spinning');
    isSpinning = false;

    // 重置按鈕狀態
    if (rouletteSpinBtn) {
        rouletteSpinBtn.disabled = false;
        const spinText = rouletteSpinBtn.querySelector('.spin-text');
        if (spinText) {
            spinText.textContent = '開始轉盤';
        }
    }

    console.log('轉盤狀態重置完成');
}

// 獲取所有可用的飲品
function getAllDrinks() {
    const allDrinks = [];
    
    if (!menuData.categories) return allDrinks;

    menuData.categories.forEach(category => {
        if (category.subcategories) {
            // 有子分類的情況
            category.subcategories.forEach(subcategory => {
                if (subcategory.items) {
                    subcategory.items.forEach(drink => {
                        allDrinks.push({
                            ...drink,
                            category: category.name,
                            categoryId: category.id,
                            subcategory: subcategory.name,
                            subcategoryId: subcategory.id
                        });
                    });
                }
            });
        } else if (category.items) {
            // 沒有子分類的情況（向後兼容）
            category.items.forEach(drink => {
                allDrinks.push({
                    ...drink,
                    category: category.name,
                    categoryId: category.id
                });
            });
        }
    });

    return allDrinks;
}

// 生成過濾選項
function generateFilterOptions() {
    if (!rouletteFilter || !menuData.categories) return;

    // 清空現有選項（保留"所有飲品"選項）
    rouletteFilter.innerHTML = '<option value="all">所有飲品</option>';

    // 添加分類選項
    menuData.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = `${category.icon} ${category.name}`;
        rouletteFilter.appendChild(option);
    });

    console.log('過濾選項已生成');
}

// 根據過濾條件獲取飲品
function getFilteredDrinks() {
    const filterValue = rouletteFilter ? rouletteFilter.value : 'all';
    const allDrinks = getAllDrinks();

    if (filterValue === 'all') {
        return allDrinks;
    }

    return allDrinks.filter(drink => drink.categoryId === filterValue);
}

// 生成轉盤區段
function generateRouletteSegments() {
    if (!rouletteSegments) return;
    
    // 如果正在轉動，不允許重新生成區段
    if (isSpinning) {
        console.log('轉盤正在轉動中，跳過重新生成');
        return;
    }

    const filteredDrinks = getFilteredDrinks();
    
    if (filteredDrinks.length === 0) {
        console.warn('沒有找到任何飲品資料');
        rouletteSegments.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">沒有找到符合條件的飲品</div>';
        return;
    }

    // 限制顯示的飲品數量，避免轉盤過於擁擠
    const maxDrinks = Math.min(filteredDrinks.length, 8);
    const selectedDrinks = filteredDrinks.slice(0, maxDrinks);
    const segmentAngle = 360 / selectedDrinks.length;

    // 使用SVG創建轉盤
    const centerX = 150;
    const centerY = 150;
    const radius = 140;

    let svgContent = `<svg width="300" height="300" viewBox="0 0 300 300" style="width: 100%; height: 100%;">`;
    
    selectedDrinks.forEach((drink, index) => {
        const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
        const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
        
        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);
        
        const largeArcFlag = segmentAngle > 180 ? 1 : 0;
        const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
        
        const backgroundColor = rouletteColors[index % rouletteColors.length];
        
        // 計算文字位置 - 保持水平
        const textAngle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
        const textRadius = radius * 0.65;
        const textX = centerX + textRadius * Math.cos(textAngle);
        const textY = centerY + textRadius * Math.sin(textAngle) + 4; // 微調垂直位置
        
        svgContent += `
            <path d="${pathData}" 
                  fill="${backgroundColor}" 
                  stroke="white" 
                  stroke-width="2" 
                  data-drink-index="${index}"/>
            <text x="${textX}" 
                  y="${textY}" 
                  text-anchor="middle" 
                  dominant-baseline="middle"
                  fill="white" 
                  font-size="11" 
                  font-weight="bold"
                  style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8); font-family: Arial, sans-serif;">
                ${drink.name}
            </text>
        `;
    });
    
    svgContent += `</svg>`;
    rouletteSegments.innerHTML = svgContent;

    // 儲存選中的飲品到轉盤元素上，供後續使用
    if (rouletteWheel) {
        rouletteWheel.dataset.drinks = JSON.stringify(selectedDrinks);
        rouletteWheel.dataset.segmentAngle = segmentAngle;
    }

    const filterText = rouletteFilter ? rouletteFilter.options[rouletteFilter.selectedIndex].text : '所有飲品';
    console.log(`轉盤已生成，範圍: ${filterText}，包含 ${selectedDrinks.length} 個飲品`);
}

// 開始轉盤動畫
function startSpin() {
    if (isSpinning || !rouletteSegments || !rouletteSpinBtn) return;

    // 檢查是否有飲品數據
    const drinksData = rouletteWheel.dataset.drinks;
    if (!drinksData) {
        alert('沒有找到飲品數據，請確認菜單已載入');
        return;
    }

    const drinks = JSON.parse(drinksData);
    if (drinks.length === 0) {
        alert('該分類中沒有飲品，請選擇其他分類');
        return;
    }

    isSpinning = true;
    rouletteSpinBtn.disabled = true;
    const spinText = rouletteSpinBtn.querySelector('.spin-text');
    if (spinText) {
        spinText.textContent = '轉盤中...';
    }

    // 添加轉動時的視覺效果
    rouletteSegments.classList.add('spinning');

    // 清除之前的結果
    if (rouletteResult) {
        rouletteResult.innerHTML = '';
    }

    const segmentAngle = parseFloat(rouletteWheel.dataset.segmentAngle);
    
    // 隨機選擇一個飲品
    const randomDrinkIndex = Math.floor(Math.random() * drinks.length);
    const selectedDrink = drinks[randomDrinkIndex];

    // 計算轉盤需要轉到的角度
    // 指針在正上方，所以我們需要讓選中的區段轉到正上方
    const targetAngle = randomDrinkIndex * segmentAngle;
    
    // 增加多圈旋轉讓動畫更有趣
    const baseRotations = Math.floor(Math.random() * 3) + 4; // 4-6圈隨機
    const totalRotation = 360 * baseRotations - targetAngle;

    // 設置CSS變數並開始動畫
    rouletteSegments.style.transition = 'transform 4s cubic-bezier(0.23, 1, 0.32, 1)';
    rouletteSegments.style.transform = `rotate(${totalRotation}deg)`;

    // 動畫完成後顯示結果
    setTimeout(() => {
        showRouletteResult(selectedDrink);
        resetSpinState();
    }, 4000);

    console.log(`轉盤動畫已開始，選中的飲品: ${selectedDrink.name} (index: ${randomDrinkIndex})`);
}

// 重置轉盤轉動狀態
function resetSpinState() {
    isSpinning = false;
    rouletteSegments.classList.remove('spinning');
    
    if (rouletteSpinBtn) {
        rouletteSpinBtn.disabled = false;
        const spinText = rouletteSpinBtn.querySelector('.spin-text');
        if (spinText) {
            spinText.textContent = '再轉一次';
        }
    }
    
    console.log('轉盤狀態已重置');
}

// 顯示轉盤結果
function showRouletteResult(drink) {
    if (!rouletteResult) return;

    console.log('開始顯示轉盤結果:', drink.name);

    const resultHTML = `
        <div class="result-card">
            <h3>🎉 恭喜！您抽中了</h3>
            <h2>${drink.name}</h2>
            <p>${drink.description}</p>
            ${drink.tags ? `
                <div class="result-tags">
                    ${drink.tags.map(tag => `<span class="result-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            ${drink.category ? `
                <p style="margin-top: 1rem; opacity: 0.8; font-size: 0.9rem;">
                    分類: ${drink.category}${drink.subcategory ? ` > ${drink.subcategory}` : ''}
                </p>
            ` : ''}
        </div>
    `;

    rouletteResult.innerHTML = resultHTML;

    console.log('轉盤結果已顯示:', drink.name);
}

console.log('轉盤功能模組已載入');
