// 宠物聚会 - 主要JavaScript功能文件

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 主应用初始化
function initializeApp() {
    setupNavigation();
    setupModals();
    setupFormValidation();
    setupSearchFilters();
    setupPlaceholderImages();
    setupScrollEffects();
    setupLanguageSelector();
}

// 导航功能设置
function setupNavigation() {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    
    // 移动端菜单切换
    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            burger.classList.toggle('active');
        });
    }
    
    // 导航链接点击处理
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // 移除所有active类
            navItems.forEach(nav => nav.classList.remove('active'));
            // 添加active到当前点击的项
            item.classList.add('active');
            
            // 在移动端关闭菜单
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                burger.classList.remove('active');
            }
        });
    });
}

// 模态框功能设置
function setupModals() {
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const ctaBtn = document.querySelector('.cta-btn');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const closeModals = document.querySelectorAll('.close-modal');
    
    // 打开登录模态框
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(loginModal);
        });
    }
    
    // 打开注册模态框
    if (signupBtn && signupModal) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(signupModal);
        });
    }
    
    // CTA按钮打开注册模态框
    if (ctaBtn && signupModal) {
        ctaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(signupModal);
        });
    }
    
    // 关闭模态框
    closeModals.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeAllModals();
        });
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// 打开模态框
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // 聚焦到第一个输入框
    const firstInput = modal.querySelector('input');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

// 关闭所有模态框
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// 表单验证设置
function setupFormValidation() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
    }
    
    // 实时验证
    setupRealTimeValidation();
}

// 登录表单提交处理
function handleLoginSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const remember = document.getElementById('remember').checked;
    
    // 验证邮箱
    if (!validateEmail(email)) {
        showError('login-email', '请输入有效的邮箱地址');
        return;
    }
    
    // 验证密码
    if (!validatePassword(password)) {
        showError('login-password', '密码长度至少6位');
        return;
    }
    
    // 模拟登录过程
    showLoading('login-form');
    
    setTimeout(() => {
        hideLoading('login-form');
        showSuccess('登录成功！欢迎回到宠物聚会');
        closeAllModals();
        
        // 这里可以添加实际的登录逻辑
        console.log('登录信息:', { email, password, remember });
    }, 1500);
}

// 注册表单提交处理
function handleSignupSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // 验证邮箱
    if (!validateEmail(email)) {
        showError('email', '请输入有效的邮箱地址');
        return;
    }
    
    // 验证密码
    if (!validatePassword(password)) {
        showError('password', '密码长度至少6位，且包含字母和数字');
        return;
    }
    
    // 验证密码确认
    if (password !== confirmPassword) {
        showError('confirm-password', '两次输入的密码不一致');
        return;
    }
    
    // 模拟注册过程
    showLoading('signup-form');
    
    setTimeout(() => {
        hideLoading('signup-form');
        showSuccess('注册成功！欢迎加入宠物聚会大家庭');
        closeAllModals();
        
        // 这里可以添加实际的注册逻辑
        console.log('注册信息:', { email, password });
    }, 2000);
}

// 实时验证设置
function setupRealTimeValidation() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    emailInputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value && !validateEmail(input.value)) {
                showError(input.id, '请输入有效的邮箱地址');
            } else {
                clearError(input.id);
            }
        });
    });
    
    passwordInputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value && !validatePassword(input.value)) {
                if (input.id === 'confirm-password') {
                    const password = document.getElementById('password').value;
                    if (input.value !== password) {
                        showError(input.id, '两次输入的密码不一致');
                    }
                } else {
                    showError(input.id, '密码长度至少6位，且包含字母和数字');
                }
            } else {
                clearError(input.id);
            }
        });
    });
}

// 邮箱验证
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 密码验证
function validatePassword(password) {
    return password.length >= 6 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

// 显示错误信息
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const formGroup = input.parentElement;
    
    // 移除已存在的错误信息
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // 添加错误样式
    input.style.borderColor = '#FC4A1A';
    
    // 创建错误信息元素
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = '#FC4A1A';
    errorElement.style.fontSize = '0.85rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.textContent = message;
    
    formGroup.appendChild(errorElement);
}

// 清除错误信息
function clearError(inputId) {
    const input = document.getElementById(inputId);
    const formGroup = input.parentElement;
    
    // 移除错误信息
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    
    // 重置输入框样式
    input.style.borderColor = '#e9ecef';
}

// 显示加载状态
function showLoading(formId) {
    const form = document.getElementById(formId);
    const submitBtn = form.querySelector('.submit-btn');
    
    submitBtn.disabled = true;
    submitBtn.textContent = '处理中...';
    submitBtn.style.opacity = '0.7';
}

// 隐藏加载状态
function hideLoading(formId) {
    const form = document.getElementById(formId);
    const submitBtn = form.querySelector('.submit-btn');
    
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    
    if (formId === 'login-form') {
        submitBtn.textContent = '登录';
    } else if (formId === 'signup-form') {
        submitBtn.textContent = '注册';
    }
}

// 显示成功消息
function showSuccess(message) {
    // 创建成功提示
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 3000;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    // 3秒后自动移除
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 300);
    }, 3000);
}

// 搜索过滤器设置
function setupSearchFilters() {
    const searchBtn = document.querySelector('.search-btn');
    const viewMoreBtn = document.querySelector('.view-more-btn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleSearch();
        });
    }
    
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showMorePlaces();
        });
    }
}

// 处理搜索
function handleSearch() {
    const city = document.getElementById('city').value;
    const petType = document.getElementById('pet-type').value;
    const placeType = document.getElementById('place-type').value;
    
    // 显示搜索状态
    const searchBtn = document.querySelector('.search-btn');
    const originalText = searchBtn.textContent;
    searchBtn.textContent = '搜索中...';
    searchBtn.disabled = true;
    
    // 模拟搜索过程
    setTimeout(() => {
        searchBtn.textContent = originalText;
        searchBtn.disabled = false;
        
        if (!city && !petType && !placeType) {
            showSuccess('请选择搜索条件以获得更精确的结果');
        } else {
            showSuccess(`找到了适合${petType || '所有宠物'}的${placeType || '各类场所'}，位于${city || '全国各地'}`);
        }
        
        console.log('搜索参数:', { city, petType, placeType });
    }, 1000);
}

// 显示更多地点
function showMorePlaces() {
    const placesContainer = document.querySelector('.places-container');
    
    // 模拟加载更多地点
    const newPlaces = [
        {
            name: '宠物温泉度假村',
            type: '度假村',
            icon: 'fas fa-spa',
            location: '杭州市西湖区',
            rating: 4.8,
            gradient: 'linear-gradient(45deg, #FF5722, #FF9800)'
        },
        {
            name: '毛孩子游乐园',
            type: '游乐园',
            icon: 'fas fa-gamepad',
            location: '成都市锦江区',
            rating: 4.6,
            gradient: 'linear-gradient(45deg, #673AB7, #9C27B0)'
        }
    ];
    
    newPlaces.forEach((place, index) => {
        setTimeout(() => {
            const placeCard = createPlaceCard(place);
            placesContainer.appendChild(placeCard);
        }, index * 200);
    });
    
    showSuccess('已加载更多宠物友好地点');
}

// 创建地点卡片
function createPlaceCard(place) {
    const card = document.createElement('div');
    card.className = 'place-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    card.innerHTML = `
        <div class="place-image" style="background: ${place.gradient}; height: 200px;"></div>
        <div class="place-info">
            <h3>${place.name}</h3>
            <p class="place-type"><i class="${place.icon}"></i> ${place.type}</p>
            <p class="place-location"><i class="fas fa-map-pin"></i> ${place.location}</p>
            <div class="place-rating">
                ${generateStars(place.rating)}
                <span>${place.rating}</span>
            </div>
        </div>
    `;
    
    // 动画显示
    setTimeout(() => {
        card.style.transition = 'all 0.5s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);
    
    return card;
}

// 生成星级评分
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// 设置占位图片
function setupPlaceholderImages() {
    const logoPlaceholders = document.querySelectorAll('#logo-placeholder, #footer-logo-placeholder');
    
    logoPlaceholders.forEach(img => {
        img.style.backgroundColor = '#4B9CD3';
        img.style.display = 'flex';
        img.style.alignItems = 'center';
        img.style.justifyContent = 'center';
        img.style.color = 'white';
        img.style.fontWeight = 'bold';
        img.alt = '宠物聚会Logo';
        
        // 如果图片加载失败，显示文字
        img.onerror = function() {
            this.style.display = 'none';
            const textNode = document.createElement('div');
            textNode.textContent = 'LOGO';
            textNode.style.cssText = `
                width: ${this.style.width || '40px'};
                height: ${this.style.height || '40px'};
                background-color: #4B9CD3;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                font-weight: bold;
                font-size: 12px;
            `;
            this.parentNode.insertBefore(textNode, this);
        };
    });
}

// 滚动效果设置
function setupScrollEffects() {
    // 返回顶部按钮
    createBackToTopButton();
    
    // 导航栏滚动效果
    window.addEventListener('scroll', handleScroll);
    
    // 懒加载效果
    setupLazyLoading();
}

// 创建返回顶部按钮
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: #4B9CD3;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 18px;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    `;
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(backToTop);
    
    // 滚动显示/隐藏
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
}

// 处理滚动事件
function handleScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (window.pageYOffset > 100) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = '#ffffff';
        navbar.style.backdropFilter = 'none';
    }
}

// 懒加载设置
function setupLazyLoading() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.feature-card, .step, .place-card, .testimonial-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// 语言选择器设置
function setupLanguageSelector() {
    const languageSelect = document.getElementById('language');
    
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            const selectedLang = e.target.value;
            
            // 这里可以添加多语言切换逻辑
            if (selectedLang === 'en') {
                showSuccess('Language switching feature will be available soon!');
            } else {
                showSuccess('语言切换功能即将上线！');
            }
            
            console.log('Selected language:', selectedLang);
        });
    }
}

// 工具函数：防抖
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

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 添加必要的CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// 错误处理
window.addEventListener('error', (e) => {
    console.error('JavaScript错误:', e.error);
});

// 性能监控
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('页面加载时间:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// 导出主要函数（如果需要在其他地方使用）
window.PetPartyApp = {
    openModal,
    closeAllModals,
    showSuccess,
    validateEmail,
    validatePassword
};