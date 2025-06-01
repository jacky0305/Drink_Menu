// animations.js - 動畫和滾動效果

// 滾動動畫設置
export function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // 觀察所有卡片（動態觀察）
    const observeCards = () => {
        document.querySelectorAll('.drink-card').forEach(card => {
            observer.observe(card);
        });
    };

    // 初始觀察
    observeCards();
    
    // 將觀察器函數設為全域，供其他函數使用
    window.observeCards = observeCards;
}

// 設置卡片動畫
export function setupCardAnimations() {
    const cards = document.querySelectorAll('.drink-card');
    console.log('設置卡片動畫，卡片數量:', cards.length);
    
    if (cards.length === 0) {
        console.warn('沒有找到卡片元素');
        return;
    }
    
    // 檢測設備類型
    const isMobile = window.innerWidth <= 768;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // 重置所有卡片狀態
    cards.forEach((card, index) => {
        // 確保卡片可見
        card.style.display = 'block';
        card.style.visibility = 'visible';
        
        // 初始狀態
        card.style.opacity = '0';
        card.style.transform = isMobile ? 'translateY(20px)' : 'translateY(30px)';
        card.style.transition = isMobile ? 
            'opacity 0.4s ease, transform 0.4s ease' : 
            'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // 計算延遲時間
        const baseDelay = isMobile ? 100 : 150;
        const maxDelay = isMobile ? 300 : 500;
        const delay = Math.min(index * baseDelay, maxDelay);
        
        // 使用setTimeout顯示卡片
        setTimeout(() => {
            if (card && card.parentNode) { // 確保元素仍然存在
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                
                // 設置完成後清理will-change
                setTimeout(() => {
                    if (isMobile) {
                        card.style.willChange = 'auto';
                    }
                }, 600);
            }
        }, delay);
    });
    
    // 為桌面版啟用硬體加速
    if (!isMobile && !isTouch) {
        cards.forEach(card => {
            card.style.willChange = 'transform, opacity';
            card.style.backfaceVisibility = 'hidden';
        });
    }
}

// 分類切換動畫
export function animateCategorySwitch(callback) {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;
    
    // 移除之前的動畫類別
    menuGrid.classList.remove('fade-in', 'loading');
    
    // 使用 requestAnimationFrame 確保瀏覽器重新計算樣式
    requestAnimationFrame(() => {
        // 開始淡出動畫
        menuGrid.classList.add('fade-out');
        
        // 等待淡出完成後開始載入
        setTimeout(() => {
            // 執行回調函數（通常是渲染新內容）
            if (callback) callback();
            
            // 短暫延遲後開始淡入
            setTimeout(() => {
                menuGrid.classList.remove('fade-out');
                
                // 再次使用 requestAnimationFrame 確保淡出完全移除
                requestAnimationFrame(() => {
                    menuGrid.classList.add('fade-in');
                });
            }, 150);
            
        }, 500); // 等待淡出動畫完成
    });
}

// 子分類切換動畫（較快的切換）
export function animateSubcategorySwitch(callback) {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;
    
    // 移除之前的動畫類別
    menuGrid.classList.remove('fade-in', 'loading');
    
    // 使用 requestAnimationFrame 確保瀏覽器重新計算樣式
    requestAnimationFrame(() => {
        // 開始淡出動畫
        menuGrid.classList.add('fade-out');
        
        // 等待淡出完成後開始載入
        setTimeout(() => {
            // 執行回調函數（通常是渲染新內容）
            if (callback) callback();
            
            // 短暫延遲後開始淡入
            setTimeout(() => {
                menuGrid.classList.remove('fade-out');
                
                // 再次使用 requestAnimationFrame 確保淡出完全移除
                requestAnimationFrame(() => {
                    menuGrid.classList.add('fade-in');
                });
            }, 150);
            
        }, 300); // 子分類切換較快
    });
}
