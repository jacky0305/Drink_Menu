// 菜單資料結構（從 JSON 檔案動態載入）
let menuData = {
    categories: []
};

// DOM 元素
const menuGrid = document.getElementById('menuGrid');
const categoryTabs = document.getElementById('categoryTabs');
let tabButtons = [];

// 當前顯示的分類
let currentCategory = 'coffee';

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 先嘗試從本地 JSON 載入資料
    loadMenuFromLocal();
    
    // 設置滾動動畫觀察器
    setupScrollAnimations();
});

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
        
        // 載入第一個分類的菜單
        if (menuData.categories && menuData.categories.length > 0) {
            currentCategory = menuData.categories[0].id;
            renderMenu(currentCategory);
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

// 切換分類
function switchCategory(category) {
    if (category === currentCategory) return;
    
    // 更新按鈕狀態
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // 移除之前的動畫類別
    menuGrid.classList.remove('fade-in', 'loading');
    
    // 開始淡出動畫
    menuGrid.classList.add('fade-out');
    
    // 等待淡出完成後開始載入
    setTimeout(() => {
        // 更新當前分類
        currentCategory = category;
        
        // 渲染新內容
        renderMenu(category);
        
        // 短暫延遲後開始淡入
        setTimeout(() => {
            menuGrid.classList.remove('fade-out');
            menuGrid.classList.add('fade-in');
            
            // 平滑滾動到頂部
            scrollToTop();
        }, 150);
        
    }, 500); // 等待淡出動畫完成
}

// 渲染菜單
function renderMenu(categoryId) {
    // 找到對應的分類
    const category = menuData.categories?.find(cat => cat.id === categoryId);
    const drinks = category?.items || [];
    
    // 先清空容器
    menuGrid.innerHTML = '';
    
    // 短暫延遲後開始渲染，避免閃爍
    setTimeout(() => {
        menuGrid.innerHTML = drinks.map((drink, index) => `
            <div class="drink-card" style="animation-delay: ${index * 0.1}s">
                <div class="drink-image">
                    <img src="${drink.image}" alt="${drink.name}" loading="lazy">
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
            </div>
        `).join('');
        
        // 設置卡片動畫
        setupCardAnimations();
    }, 50);
}

// 設置卡片動畫
function setupCardAnimations() {
    const cards = document.querySelectorAll('.drink-card');
    
    // 重置所有卡片狀態
    cards.forEach(card => {
        card.classList.remove('fade-in');
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
    });
    
    // 依序顯示卡片，時間更長
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.classList.add('fade-in');
        }, index * 200); // 延長間隔到 200ms
    });
    
    // 重新設置滾動觀察器
    setTimeout(() => {
        if (window.observeCards) {
            window.observeCards();
        }
    }, cards.length * 200 + 200);
}

// 滾動動畫設置
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
