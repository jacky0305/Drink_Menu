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
    console.log('DOMContentLoaded triggered');
    
    // 檢查瀏覽器支持
    checkBrowserSupport();
    
    // 添加防跑版措施
    preventLayoutIssues();
    
    // 先嘗試從本地 JSON 載入資料
    loadMenuFromLocal();
    
    // 設置滾動動畫觀察器
    setupScrollAnimations();
    
    // 添加調試信息
    setTimeout(() => {
        debugMenuDisplay();
    }, 2000);
});

// 防止佈局問題
function preventLayoutIssues() {
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
function addMobileTouchSupport() {
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
function checkLayout() {
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
        
        // 添加觸摸事件處理
        button.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        });
    });
    
    // 重新初始化觸摸滾動
    addMobileTouchSupport();
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
        
        // 添加觸摸事件處理
        button.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        });
    });
    
    // 重新初始化觸摸滾動
    addMobileTouchSupport();
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
    console.log('開始渲染菜單:', categoryId, subcategoryId);
    
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

// 設置卡片動畫
function setupCardAnimations() {
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
        optimizeDesktopPerformance();
        
        // 修復可能的顯示問題
        fixCardDisplay();
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

// 調試函數 - 檢查菜單顯示狀態
function debugMenuDisplay() {
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

// 修復函數 - 如果發現卡片沒有正確顯示，嘗試修復
function fixCardDisplay() {
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

// 暴露調試函數到全局作用域
window.debugMenuDisplay = debugMenuDisplay;
window.fixCardDisplay = fixCardDisplay;
