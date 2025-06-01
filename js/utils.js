// utils.js - 工具函數和瀏覽器兼容性

// 防抖函數
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 檢查瀏覽器支持
export function checkBrowserSupport() {
    // 強制禁用深色模式
    document.documentElement.style.colorScheme = 'light';
    document.body.style.colorScheme = 'light';
    
    // 檢查 CSS Grid 支持
    if (!CSS.supports('display', 'grid')) {
        document.body.classList.add('no-grid');
    }
    
    // 檢查 Intersection Observer 支持
    if (!window.IntersectionObserver) {
        // Polyfill 或 fallback
        window.IntersectionObserver = function() {
            return {
                observe: function() {},
                unobserve: function() {},
                disconnect: function() {}
            };
        };
    }
    
    // 檢查 requestAnimationFrame 支持
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            return setTimeout(callback, 16);
        };
    }
    
    // 監聽深色模式變化並強制覆蓋
    if (window.matchMedia) {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const forceLightMode = () => {
            document.documentElement.style.colorScheme = 'light';
            document.body.style.colorScheme = 'light';
            document.documentElement.style.setProperty('color-scheme', 'light', 'important');
        };
        
        // 初始設定
        forceLightMode();
        
        // 監聽變化
        darkModeQuery.addListener(forceLightMode);
        
        // 現代瀏覽器語法
        if (darkModeQuery.addEventListener) {
            darkModeQuery.addEventListener('change', forceLightMode);
        }
    }
}

// 處理圖片路徑 - 支援本地圖片和 Unsplash 圖片混合使用
export function getImageSrc(imagePath) {
    // 如果是本地圖片路徑（以 ./images/ 或 images/ 開頭），直接使用
    if (imagePath.startsWith('./images/') || imagePath.startsWith('images/')) {
        return imagePath;
    }
    
    // 如果是相對路徑但不在 images 資料夾，假設是本地圖片
    if (!imagePath.startsWith('http') && !imagePath.startsWith('//')) {
        return `./images/${imagePath}`;
    }
    
    // 否則是外部圖片（如 Unsplash），直接使用
    return imagePath;
}

// 圖片錯誤處理 - 本地圖片載入失敗時的後備方案
export function handleImageError(img, originalSrc) {
    // 設置防跑版屬性
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.objectFit = 'cover';
    img.style.width = '100%';
    
    // 如果是本地圖片載入失敗，嘗試使用預設的 Unsplash 圖片
    if (originalSrc.startsWith('./images/') || originalSrc.startsWith('images/')) {
        console.warn(`本地圖片載入失敗: ${originalSrc}，使用預設圖片`);
        
        // 根據圖片名稱判斷飲品類型，提供對應的預設圖片
        let fallbackImage = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop&crop=center';
        
        if (originalSrc.includes('coffee') || originalSrc.includes('咖啡')) {
            fallbackImage = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop&crop=center';
        } else if (originalSrc.includes('tea') || originalSrc.includes('茶')) {
            fallbackImage = 'https://images.unsplash.com/photo-1594631661960-69a83bbb5ddc?w=400&h=300&fit=crop&crop=center';
        } else if (originalSrc.includes('milk') || originalSrc.includes('奶')) {
            fallbackImage = 'https://images.unsplash.com/photo-1541544181051-e46607bc22a4?w=400&h=300&fit=crop&crop=center';
        } else if (originalSrc.includes('alcohol') || originalSrc.includes('酒')) {
            fallbackImage = 'https://images.unsplash.com/photo-1544824284-d7cb9ec2cc5c?w=400&h=300&fit=crop&crop=center';
        }
        
        img.src = fallbackImage;
        return;
    }
    
    // 如果是外部圖片載入失敗，使用 Base64 SVG placeholder
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE3MCAyMDBIMjMwTDIwMCAxNTBaIiBmaWxsPSIjQ0NDIi8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjEyMCIgcj0iMTAiIGZpbGw9IiNDQ0MiLz4KPC9zdmc+';
    img.alt = '圖片載入失敗';
}

// 顯示錯誤訊息
export function showErrorMessage(message, container) {
    container.innerHTML = `
        <div class="error-message">
            <div class="error-icon">⚠️</div>
            <h3>載入錯誤</h3>
            <p>${message}</p>
        </div>
    `;
}

// 平滑滾動到頂部
export function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 調試函數 - 檢查菜單顯示狀態
export function debugMenuDisplay(menuData, currentCategory, currentSubcategory) {
    console.log('=== 菜單顯示調試信息 ===');
    console.log('menuData:', menuData);
    console.log('currentCategory:', currentCategory);
    console.log('currentSubcategory:', currentSubcategory);
    
    const menuGrid = document.getElementById('menuGrid');
    console.log('menuGrid element:', menuGrid);
    console.log('menuGrid innerHTML length:', menuGrid?.innerHTML?.length || 0);
    console.log('menuGrid children count:', menuGrid?.children?.length || 0);
    
    const cards = document.querySelectorAll('.drink-card');
    console.log('找到的卡片數量:', cards.length);
    
    cards.forEach((card, index) => {
        const style = window.getComputedStyle(card);
        console.log(`卡片 ${index}:`, {
            display: style.display,
            visibility: style.visibility,
            opacity: style.opacity,
            transform: style.transform
        });
    });
    
    // 檢查CSS類
    const gridClasses = menuGrid?.className || '';
    console.log('menuGrid classes:', gridClasses);
    
    // 檢查瀏覽器支持
    console.log('CSS Grid support:', CSS.supports('display', 'grid'));
    console.log('Flexbox support:', CSS.supports('display', 'flex'));
    console.log('Device info:', {
        innerWidth: window.innerWidth,
        isMobile: window.innerWidth <= 768,
        isTouch: 'ontouchstart' in window
    });
    
    console.log('=== 調試信息結束 ===');
}
