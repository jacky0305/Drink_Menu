// mobile.js - 移動設備相關功能

// 防止佈局問題
export function preventLayoutIssues() {
    // 確保所有圖片都有 max-width
    const style = document.createElement('style');
    style.textContent = `
        img { max-width: 100% !important; height: auto !important; }
        .drink-card { max-width: 100% !important; overflow: hidden !important; }
        .menu-grid { max-width: 100% !important; overflow: hidden !important; }
        .container { max-width: 100% !important; overflow: hidden !important; }
    `;
    document.head.appendChild(style);
    
    // 添加手機版觸摸滾動支持
    addMobileTouchSupport();
    
    // 監聽視窗大小改變
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // 重新檢查佈局
            checkLayout();
            // 重新初始化觸摸滾動
            addMobileTouchSupport();
        }, 100);
    });
    
    // 監聽滾動事件防止橫向滾動
    window.addEventListener('scroll', function() {
        if (window.scrollX > 0) {
            window.scrollTo(0, window.scrollY);
        }
    });
}

// 添加手機版觸摸滾動支持
export function addMobileTouchSupport() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        const categoryTabs = document.querySelector('.category-tabs');
        const subcategoryTabs = document.querySelector('.subcategory-tabs');
        
        // 為分類標籤添加觸摸滾動
        if (categoryTabs) {
            categoryTabs.style.overflow = 'auto';
            categoryTabs.style.webkitOverflowScrolling = 'touch';
            categoryTabs.style.scrollbarWidth = 'none';
            categoryTabs.style.msOverflowStyle = 'none';
            
            // 添加觸摸事件監聽
            let isScrolling = false;
            categoryTabs.addEventListener('touchstart', () => {
                isScrolling = false;
            });
            
            categoryTabs.addEventListener('touchmove', () => {
                isScrolling = true;
            });
            
            // 防止在滾動時觸發按鈕點擊
            categoryTabs.addEventListener('touchend', (e) => {
                if (isScrolling) {
                    e.preventDefault();
                }
            });
        }
        
        // 為子分類標籤添加觸摸滾動
        if (subcategoryTabs) {
            subcategoryTabs.style.overflow = 'auto';
            subcategoryTabs.style.webkitOverflowScrolling = 'touch';
            subcategoryTabs.style.scrollbarWidth = 'none';
            subcategoryTabs.style.msOverflowStyle = 'none';
            
            // 添加觸摸事件監聽
            let isScrolling = false;
            subcategoryTabs.addEventListener('touchstart', () => {
                isScrolling = false;
            });
            
            subcategoryTabs.addEventListener('touchmove', () => {
                isScrolling = true;
            });
            
            // 防止在滾動時觸發按鈕點擊
            subcategoryTabs.addEventListener('touchend', (e) => {
                if (isScrolling) {
                    e.preventDefault();
                }
            });
        }
    }
}

// 檢查佈局並修復問題
export function checkLayout() {
    const body = document.body;
    const scrollWidth = body.scrollWidth;
    const clientWidth = body.clientWidth;
    
    if (scrollWidth > clientWidth) {
        console.warn('檢測到橫向溢出，嘗試修復');
        
        // 找到可能造成溢出的元素
        const elements = document.querySelectorAll('.drink-card, .menu-grid, .container, .category-tabs, .subcategory-tabs');
        elements.forEach(el => {
            el.style.maxWidth = '100%';
            el.style.overflow = 'hidden';
            el.style.boxSizing = 'border-box';
        });
    }
}

// 修復函數 - 如果發現卡片沒有正確顯示，嘗試修復
export function fixCardDisplay() {
    console.log('嘗試修復卡片顯示...');
    
    const cards = document.querySelectorAll('.drink-card');
    const menuGrid = document.getElementById('menuGrid');
    const isMobile = window.innerWidth <= 768;
    
    // 修復菜單網格顯示
    if (menuGrid) {
        menuGrid.style.display = 'grid';
        
        // 根據螢幕尺寸設置適當的Grid布局
        if (isMobile) {
            menuGrid.style.gridTemplateColumns = '1fr';
            menuGrid.style.gap = '16px';
        } else if (window.innerWidth <= 991) {
            menuGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(260px, 1fr))';
            menuGrid.style.gap = '20px';
        } else {
            menuGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
            menuGrid.style.gap = '24px';
        }
        
        // 如果不支援Grid，使用Flexbox
        if (!CSS.supports('display', 'grid')) {
            menuGrid.style.display = 'flex';
            menuGrid.style.flexWrap = 'wrap';
            menuGrid.style.justifyContent = isMobile ? 'center' : 'space-between';
        }
    }
    
    // 修復每個卡片的顯示
    cards.forEach((card, index) => {
        // 強制設置基本樣式
        card.style.display = 'block';
        card.style.visibility = 'visible';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.transition = 'all 0.3s ease';
        
        // 確保卡片在Grid中正確顯示
        card.style.gridColumn = 'auto';
        card.style.gridRow = 'auto';
        
        // 設置適當的寬度
        if (isMobile) {
            card.style.width = '100%';
            card.style.maxWidth = '100%';
            card.style.minWidth = 'unset';
        } else {
            card.style.width = '100%';
            card.style.minWidth = window.innerWidth <= 991 ? '260px' : '280px';
            card.style.maxWidth = '400px';
        }
        
        // Flexbox 後備方案
        if (!CSS.supports('display', 'grid')) {
            if (isMobile) {
                card.style.flex = '1 1 100%';
                card.style.margin = '0 0 16px 0';
            } else {
                card.style.flex = '0 0 auto';
                card.style.margin = '10px';
            }
        }
    });
    
    console.log('修復完成，當前螢幕寬度:', window.innerWidth);
    console.log('卡片數量:', cards.length);
    console.log('Grid 支援:', CSS.supports('display', 'grid'));
}

// 優化桌面版性能
export function optimizeDesktopPerformance() {
    const isDesktop = window.innerWidth >= 1024;
    
    if (isDesktop) {
        // 桌面版啟用硬體加速，但不修改已有的 transform
        document.querySelectorAll('.drink-card').forEach(card => {
            // 只有在沒有動畫進行時才設置硬體加速
            if (card.style.opacity === '1') {
                card.style.willChange = 'transform';
            }
        });
        
        // 減少桌面版的重繪
        const menuGrid = document.getElementById('menuGrid');
        if (menuGrid) {
            menuGrid.style.willChange = 'transform, opacity';
            
            // 延遲移除 will-change 屬性
            setTimeout(() => {
                menuGrid.style.willChange = 'auto';
                document.querySelectorAll('.drink-card').forEach(card => {
                    card.style.willChange = 'auto';
                });
            }, 3000);
        }
    }
}
