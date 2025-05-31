// 菜單資料結構（從 JSON 檔案動態載入）
let menuData = {
    categories: []
};

// DOM 元素
const menuGrid = document.getElementById('menuGrid');
const categoryTabs = document.getElementById('categoryTabs');
const subcategoryNav = document.getElementById('subcategoryNav');
const subcategoryTabs = document.getElementById('subcategoryTabs');
let tabButtons = [];
let subcategoryButtons = [];

// 當前顯示的分類和子分類
let currentCategory = 'coffee';
let currentSubcategory = null;
let isAnimating = false; // 防止動畫期間重複觸發

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 檢查瀏覽器支持
    checkBrowserSupport();
    
    // 先嘗試從本地 JSON 載入資料
    loadMenuFromLocal();
    
    // 設置滾動動畫觀察器
    setupScrollAnimations();
});

// 檢查瀏覽器支持
function checkBrowserSupport() {
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

// 從本地 JSON 文件載入資料
async function loadMenuFromLocal() {
    try {
        const response = await fetch('./menu.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        menuData = data;
        
        // 生成分類按鈕
        renderCategories();
        
        // 載入第一個分類的菜單（只執行一次）
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
        
        console.log('菜單資料已從 JSON 檔案載入');
    } catch (error) {
        console.error('載入菜單資料失敗:', error);
        // 顯示錯誤訊息給使用者
        showErrorMessage('無法載入菜單資料，請檢查網路連線或聯絡管理員。');
    }
}

// 動態生成分類按鈕
function renderCategories() {
    if (!menuData.categories) return;
    
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
    });
}

// 渲染子分類按鈕
function renderSubcategories(categoryId) {
    const category = menuData.categories?.find(cat => cat.id === categoryId);
    
    if (!category?.subcategories || category.subcategories.length === 0) {
        hideSubcategories();
        return;
    }
    
    // 顯示子分類導航
    subcategoryNav.style.display = 'block';
    
    // 生成子分類按鈕
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
    });
}

// 隱藏子分類導航
function hideSubcategories() {
    subcategoryNav.style.display = 'none';
    currentSubcategory = null;
}

// 切換分類
function switchCategory(category) {
    if (category === currentCategory || isAnimating) return;
    
    isAnimating = true; // 設置動畫狀態
    
    // 更新按鈕狀態
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
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
    
    // 移除之前的動畫類別
    menuGrid.classList.remove('fade-in', 'loading');
    
    // 使用 requestAnimationFrame 確保瀏覽器重新計算樣式
    requestAnimationFrame(() => {
        // 開始淡出動畫
        menuGrid.classList.add('fade-out');
        
        // 等待淡出完成後開始載入
        setTimeout(() => {
            // 渲染新內容
            renderMenu(currentCategory, currentSubcategory);
            
            // 短暫延遲後開始淡入
            setTimeout(() => {
                menuGrid.classList.remove('fade-out');
                
                // 再次使用 requestAnimationFrame 確保淡出完全移除
                requestAnimationFrame(() => {
                    menuGrid.classList.add('fade-in');
                    
                    // 平滑滾動到頂部
                    scrollToTop();
                    
                    // 重置動畫狀態
                    setTimeout(() => {
                        isAnimating = false;
                    }, 200);
                });
            }, 150);
            
        }, 500); // 等待淡出動畫完成
    });
}

// 切換子分類
function switchSubcategory(subcategory) {
    if (subcategory === currentSubcategory || isAnimating) return;
    
    isAnimating = true; // 設置動畫狀態
    
    // 更新按鈕狀態
    subcategoryButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-subcategory="${subcategory}"]`).classList.add('active');
    
    // 更新當前子分類
    currentSubcategory = subcategory;
    
    // 移除之前的動畫類別
    menuGrid.classList.remove('fade-in', 'loading');
    
    // 使用 requestAnimationFrame 確保瀏覽器重新計算樣式
    requestAnimationFrame(() => {
        // 開始淡出動畫
        menuGrid.classList.add('fade-out');
        
        // 等待淡出完成後開始載入
        setTimeout(() => {
            // 渲染新內容
            renderMenu(currentCategory, currentSubcategory);
            
            // 短暫延遲後開始淡入
            setTimeout(() => {
                menuGrid.classList.remove('fade-out');
                
                // 再次使用 requestAnimationFrame 確保淡出完全移除
                requestAnimationFrame(() => {
                    menuGrid.classList.add('fade-in');
                    
                    // 重置動畫狀態
                    setTimeout(() => {
                        isAnimating = false;
                    }, 150);
                });
            }, 150);
            
        }, 300); // 子分類切換較快
    });
}

// 渲染菜單
function renderMenu(categoryId, subcategoryId = null) {
    // 如果正在動畫中，則不執行渲染
    if (isAnimating && menuGrid.innerHTML !== '') return;
    
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
    
    // 先清空容器
    menuGrid.innerHTML = '';
    
    // 檢查是否有飲品數據
    if (drinks.length === 0) {
        showErrorMessage('此分類暫無飲品資料');
        return;
    }
    
    // 短暫延遲後開始渲染，避免閃爍
    setTimeout(() => {
        menuGrid.innerHTML = drinks.map((drink, index) => {
            const imageSrc = getImageSrc(drink.image);
            return `
            <div class="drink-card" style="animation-delay: ${index * 0.1}s">
                <div class="drink-image">
                    <img src="${imageSrc}" alt="${drink.name}" loading="lazy" 
                         onerror="handleImageError(this, '${imageSrc}')">
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
        
        // 設置卡片動畫
        setupCardAnimations();
        
        // 桌面版性能優化
        optimizeDesktopPerformance();
    }, 50);
}

// 設置卡片動畫
function setupCardAnimations() {
    const cards = document.querySelectorAll('.drink-card');
    
    // 檢測螢幕尺寸並調整動畫策略
    const isDesktop = window.innerWidth >= 1024;
    const isMobile = window.innerWidth <= 768;
    
    if (isDesktop) {
        // 桌面版使用 CSS 動畫類，更流暢
        cards.forEach((card, index) => {
            // 重置狀態
            card.classList.remove('fade-in');
            card.style.opacity = '';
            card.style.transform = '';
            card.style.transition = '';
            
            // 設置延遲並觸發動畫
            const delay = Math.min(index * 100, 400);
            setTimeout(() => {
                card.classList.add('fade-in');
            }, delay);
        });
    } else {
        // 手機和平板版使用 JavaScript 動畫
        let animationDelay = isMobile ? 150 : 120;
        let maxDelay = isMobile ? 300 : 350;
        
        // 重置所有卡片狀態
        cards.forEach(card => {
            card.classList.remove('fade-in');
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
        });
        
        // 依序顯示卡片
        cards.forEach((card, index) => {
            const delay = Math.min(index * animationDelay, maxDelay);
            
            setTimeout(() => {
                card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, delay);
        });
    }
    
    // 重新設置滾動觀察器
    const totalAnimationTime = isDesktop ? 500 : 600;
    setTimeout(() => {
        if (window.observeCards) {
            window.observeCards();
        }
    }, totalAnimationTime);
}

// 處理圖片路徑 - 支援本地圖片和 Unsplash 圖片混合使用
function getImageSrc(imagePath) {
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
function handleImageError(img, originalSrc) {
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

// 滾动動畫設置
function setupScrollAnimations() {
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

// 平滑滾動到頂部（當切換分類時）
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 圖片載入錯誤處理
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE3MCAyMDBIMjMwTDIwMCAxNTBaIiBmaWxsPSIjQ0NDIi8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjEyMCIgcj0iMTAiIGZpbGw9IiNDQ0MiLz4KPC9zdmc+';
        e.target.alt = '圖片載入失敗';
    }
}, true);

// 未來會加入的 GitHub JSON 載入功能
async function loadMenuFromGitHub(jsonUrl) {
    try {
        const response = await fetch(jsonUrl);
        const data = await response.json();
        menuData = data;
        
        // 重新生成分類按鈕
        renderCategories();
        
        // 載入第一個分類的菜單
        if (menuData.categories && menuData.categories.length > 0) {
            currentCategory = menuData.categories[0].id;
            renderMenu(currentCategory);
        }
        
        console.log('菜單資料已從 GitHub 載入');
    } catch (error) {
        console.error('載入菜單資料失敗:', error);
        // 使用預設資料
    }
}

// 預留的 GitHub Raw JSON URL
// const MENU_JSON_URL = 'https://raw.githubusercontent.com/your-username/your-repo/main/menu.json';
// loadMenuFromGitHub(MENU_JSON_URL);

// 顯示錯誤訊息
function showErrorMessage(message) {
    menuGrid.innerHTML = `
        <div class="error-message">
            <div class="error-icon">⚠️</div>
            <h3>載入錯誤</h3>
            <p>${message}</p>
        </div>
    `;
}

// 優化桌面版性能
function optimizeDesktopPerformance() {
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

// 視窗大小改變時重新優化
window.addEventListener('resize', debounce(() => {
    const cards = document.querySelectorAll('.drink-card');
    if (cards.length > 0) {
        setupCardAnimations();
        optimizeDesktopPerformance();
    }
}, 250));

// 防抖函數
function debounce(func, wait) {
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
