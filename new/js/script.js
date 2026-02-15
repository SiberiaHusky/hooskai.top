// 全局状态管理
let currentLang = 'en'; // 当前语言设置：'en' 或 'zh'

// 语言检测和设置函数
/**
 * 检测浏览器语言并设置默认语言
 * @description 检测浏览器语言，如果支持中文则设置为中文，否则设置为英文
 */
function detectAndSetBrowserLanguage() {
    // 获取浏览器语言 - 处理多种情况
    let browserLang = navigator.language || navigator.userLanguage;

    // 如果浏览器语言为空或未定义，使用默认值
    if (!browserLang) {
        console.log('无法检测浏览器语言，使用默认值：en');
        currentLang = 'en';
    } else {
        // 检查是否为中文（包括zh-CN, zh-TW, zh-HK等）
        const isChinese = browserLang.toLowerCase().startsWith('zh');

        // 设置默认语言
        currentLang = isChinese ? 'zh' : 'en';

        console.log(`检测到浏览器语言: ${browserLang}, 自动设置为: ${currentLang}`);
    }

    // 设置HTML的lang属性
    document.documentElement.lang = currentLang;

    // 立即更新界面显示
    updateLanguageDisplay();
}

/**
 * 更新语言显示
 * @description 根据当前语言更新界面元素的显示
 */
function updateLanguageDisplay() {
    // 更新所有语言标记元素的显示状态
    document.querySelectorAll('.en').forEach(el => {
        el.style.display = currentLang === 'en' ? 'inline' : 'none';
    });
    document.querySelectorAll('.zh').forEach(el => {
        el.style.display = currentLang === 'zh' ? 'inline' : 'none';
    });
}

/**
 * 设置语言
 * @param {string} lang - 要设置的语言，'en' 或 'zh'
 * @description 根据指定的语言更新界面和HTML lang属性
 */
function setLanguage(lang) {
    currentLang = lang;

    // 设置HTML的lang属性
    document.documentElement.lang = currentLang;

    // 更新语言显示
    updateLanguageDisplay();

    // 重新初始化当前页面的3D列表以更新语言
    reinitializeCurrentPage3DLists();
}

// 页面切换函数
/**
 * 切换终端页面
 * @param {string} targetPage - 目标页面ID (home, about, projects, contact)
 * @description 执行页面切换动画并更新菜单状态
 */
function switchPage(targetPage) {
    const currentPage = document.querySelector('.page.active');

    if (currentPage.id === targetPage) return; // 防止重复切换

    // 添加最小化动画
    currentPage.classList.add('minimizing');

    setTimeout(() => {
        // 移除当前页面的活动状态
        currentPage.classList.remove('active', 'minimizing');

        // 显示目标页面
        const nextPage = document.getElementById(targetPage);
        nextPage.classList.add('active');

        // 更新菜单激活状态
        updateMenuActiveState(targetPage);

        // 页面特定初始化逻辑
        handlePageSpecificInit(targetPage);
    }, 500);
}

/**
 * 根据出生日期计算当前年龄
 * @param {string} birthDateString - 出生日期字符串，格式为 "YYYY-MM-DD"
 * @returns {number} 当前年龄（周岁）
 */
function calculateAge(birthDateString) {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    // 如果当前月份小于出生月份，或同月份但日期小于出生日期，则年龄减1
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// 3D列表核心逻辑
/**
 * 通用3D列表初始化函数
 * @param {string} sliderId - 滑块容器ID
 * @param {string} statusId - 状态指示器ID
 * @param {Array} data - 列表数据数组，每个对象可包含onClick回调
 * @description 创建具有3D效果的可交互列表，支持点击事件
 */
function init3DList(sliderId, statusId, data) {
    const slider = document.getElementById(sliderId);
    const statusElement = document.getElementById(statusId);

    if (!slider || !statusElement) return;

    // 内部状态管理
    let activeIndex = 0;        // 当前选中项索引
    let isDragging = false;     // 拖动状态标志
    let startY = 0;             // 拖动起始Y坐标
    let currentY = 0;           // 当前Y坐标
    let deltaY = 0;             // Y坐标差值

    // 核心功能函数

    /**
     * 初始化列表项
     */
    function initItems() {
        slider.innerHTML = ''; // 清空现有内容

        // 遍历数据创建列表项
        data.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'list-item-3d';
            itemElement.setAttribute('role', 'option');
            itemElement.setAttribute('aria-selected', 'false');

            // 根据当前语言获取文本
            const text = currentLang === 'zh' ? item.text.zh : item.text.en;
            const desc = currentLang === 'zh' ? (item.desc?.zh || '') : (item.desc?.en || '');

            itemElement.innerHTML = `
                <div class="item-content-3d">
                    <div class="item-icon-3d">${item.icon}</div>
                    <div class="item-text-3d" style="display: flex; flex-direction: column;">
                        <b>${text}</b>
                        ${desc ? `<span style="font-size: small;">${desc}</span>` : ''}
                    </div>
                    <div class="item-index-3d">${index + 1}</div>
                </div>
            `;

            itemElement.dataset.index = index;

            // 点击事件处理
            // 为每个列表项添加点击事件监听器
            itemElement.addEventListener('click', (e) => {
                // 防止拖动结束时的误触发
                if (isDragging) return;

                // 更新选中状态
                setActiveIndex(index);

                // 如果数据项定义了onClick回调，则执行
                if (typeof item.onClick === 'function') {
                    // 调用回调函数，传入当前项的数据和索引
                    item.onClick(item, index, {
                        currentLang: currentLang,
                        sliderId: sliderId,
                        statusElement: statusElement
                    });
                } else {
                    // 默认行为：仅更新位置指示器
                    console.log(`Item ${index + 1} clicked: ${text}`);
                }
            });

            // 为无障碍访问添加键盘支持
            itemElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    itemElement.click();
                }
            });

            slider.appendChild(itemElement);
        });

        updateItemsPosition();
    }

    /**
     * 设置当前选中索引并更新UI
     */
    function setActiveIndex(newIndex) {
        if (newIndex >= 0 && newIndex < data.length) {
            activeIndex = newIndex;
            updateItemsPosition();
        }
    }

    /**
     * 更新所有列表项的3D位置
     */
    function updateItemsPosition() {
        const items = document.querySelectorAll(`#${sliderId} .list-item-3d`);
        const visibleCount = 2; // 一次显示3个项目

        items.forEach((item, index) => {
            const diff = index - activeIndex;
            const absDiff = Math.abs(diff);

            // 重置基础样式
            item.style.opacity = '0';
            item.style.pointerEvents = 'none';
            item.style.transform = 'translateZ(0) translateY(-50%) scale(0.9)';
            item.style.zIndex = '1';

            // 只处理可见范围内的项目
            if (absDiff < visibleCount) {
                // 计算3D变换参数
                let translateZ = -50 * absDiff;
                let translateY = diff * 100; // 百分比
                let rotateX = diff === 0 ? 0 : (diff > 0 ? -15 : 15);
                let scale = 1 - (absDiff * 0.08);
                let opacity = 1 - (absDiff * 0.3);
                let zIndex = 10 - absDiff;

                // 应用变换
                item.style.transform = `
                    translateZ(${translateZ}px)
                    translateY(${translateY}%)
                    rotateX(${rotateX}deg)
                    scale(${scale})
                `;
                item.style.opacity = opacity;
                item.style.zIndex = zIndex;
                item.style.pointerEvents = 'auto';

                // 当前选中项特殊样式
                if (diff === 0) {
                    item.style.boxShadow = '0 0 15px rgba(51, 255, 0, 0.5)';
                    item.style.borderColor = 'rgba(51, 255, 0, 0.8)';
                    item.setAttribute('aria-selected', 'true');
                } else {
                    item.setAttribute('aria-selected', 'false');
                }
            } else {
                // 不可见项目的初始位置
                let initialTranslateY = diff < 0 ? -150 : 150;
                let initialTranslateZ = -50 * absDiff;

                item.style.transform = `
                    translateZ(${initialTranslateZ}px)
                    translateY(${initialTranslateY}%)
                    scale(0.9)
                `;
                item.setAttribute('aria-selected', 'false');
            }
        });

        // 更新状态指示器文本（根据语言）
        const positionText = currentLang === 'zh' ? '位置' : 'Position';
        statusElement.textContent = `${positionText}: ${activeIndex + 1}/${data.length}`;
    }

    // 其他交互函数
    function navigate(direction) {
        if (direction === 'next' && activeIndex < data.length - 1) {
            setActiveIndex(activeIndex + 1);
        } else if (direction === 'prev' && activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }
    }

    function handleWheel(e) {
        e.preventDefault();
        if (e.deltaY > 0) {
            navigate('next');
        } else {
            navigate('prev');
        }
    }

    function handleDragStart(e) {
        isDragging = true;
        startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        slider.style.transition = 'none';
    }

    function handleDragMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        deltaY = currentY - startY;

        const rotation = -deltaY * 0.05;
        slider.style.transform = `rotateX(${rotation}deg)`;
    }

    function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;

        slider.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
        slider.style.transform = '';

        if (deltaY < -50) {
            navigate('next');
        } else if (deltaY > 50) {
            navigate('prev');
        }

        deltaY = 0;
    }

    // 事件监听器绑定
    slider.addEventListener('wheel', handleWheel, { passive: false });
    slider.addEventListener('mousedown', handleDragStart);
    slider.addEventListener('mousemove', handleDragMove);
    slider.addEventListener('mouseup', handleDragEnd);
    slider.addEventListener('mouseleave', handleDragEnd);
    slider.addEventListener('touchstart', handleDragStart, { passive: true });
    slider.addEventListener('touchmove', handleDragMove, { passive: false });
    slider.addEventListener('touchend', handleDragEnd);

    document.addEventListener('keydown', (e) => {
        if (document.activeElement.closest(`#${sliderId}`) || document.activeElement.closest('.page.active')) {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                navigate('prev');
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                navigate('next');
            }
        }
    });

    // 初始化
    initItems();
}

// 辅助函数

/**
 * 更新菜单激活状态
 */
function updateMenuActiveState(targetPage) {
    document.querySelectorAll('.desktop-menu li, .mobile-menu li').forEach(li => {
        li.classList.remove('active');
        if (li.dataset.page === targetPage) {
            li.classList.add('active');
        }
    });
}

/**
 * 页面特定初始化逻辑
 */
function handlePageSpecificInit(targetPage) {
    // 触发技能条动画（关于页面）
    if (targetPage === 'about') {
        setTimeout(() => {
            document.querySelectorAll('.bar-fill').forEach(bar => {
                bar.style.width = bar.style.width || '0%';
            });
        }, 300);
    }

    // 初始化各页面的3D列表
    const pageInitMap = {
        'home': () => {
            init3DList('nav-slider', 'nav-status', navigationData);
            init3DList('interests-slider', 'interests-status', interestsData);
        },
        'about': () => {
            init3DList('aboutme-slider', 'aboutme-status', aboutmeData);
            init3DList('interests-slider', 'interests-status', interestsData);
        },
        'projects': () => {
            init3DList('projects-slider', 'projects-status', projectsData);
            init3DList('tech-slider', 'tech-status', techData);
        },
        'contact': () => {
            init3DList('comms-slider', 'comms-status', commsData);
        }
    };

    if (pageInitMap[targetPage]) {
        setTimeout(pageInitMap[targetPage], 300);
    }
}

/**
 * 重新初始化当前页面的所有3D列表
 */
function reinitializeCurrentPage3DLists() {
    const currentPage = document.querySelector('.page.active');
    const pageInitMap = {
        'home': () => {
            init3DList('nav-slider', 'nav-status', navigationData);
            init3DList('interests-slider', 'interests-status', interestsData);
        },
        'about': () => {
            init3DList('aboutme-slider', 'aboutme-status', aboutmeData);
            init3DList('interests-slider', 'interests-status', interestsData);
        },
        'projects': () => {
            init3DList('projects-slider', 'projects-status', projectsData);
            init3DList('tech-slider', 'tech-status', techData);
        },
        'contact': () => {
            init3DList('comms-slider', 'comms-status', commsData);
        }
    };

    if (pageInitMap[currentPage.id]) {
        pageInitMap[currentPage.id]();
    }
}

// 更新时间显示
/**
 * 更新时间显示
 */
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
        timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

// 关机功能
/**
 * 初始化关机功能
 */
function initShutdown() {
    const modal = document.getElementById('shutdown-modal');
    const screen = document.getElementById('shutdown-screen');
    const confirmBtn = document.getElementById('confirm-dialog');
    const cancelBtn = document.getElementById('cancel-dialog');

    // 打开确认框
    function openShutdownModal() {
        modal.classList.add('active');
    }

    // 关闭确认框
    function closeShutdownModal() {
        modal.classList.remove('active');
    }

    // 执行关机
    function executeShutdown() {
        closeShutdownModal();
        document.body.style.overflow = 'hidden';
        screen.classList.add('active');

        // 禁用所有交互
        document.querySelectorAll('button, li, input').forEach(el => {
            el.style.pointerEvents = 'none';
        });
    }

    // 绑定事件 - 保持原有的事件绑定，但使用新的ID
    document.getElementById('desktop-shutdown').addEventListener('click', openShutdownModal);
    document.getElementById('mobile-shutdown').addEventListener('click', openShutdownModal);
    confirmBtn.addEventListener('click', executeShutdown);
    cancelBtn.addEventListener('click', closeShutdownModal);
}

// 移动端菜单覆盖层功能
/**
 * 初始化移动端菜单覆盖层功能
 */
function initMobileMenuOverlay() {
    const overlay = document.getElementById('mobile-menu-overlay');
    const mobileMenu = document.getElementById('mobile-menu');

    // 打开菜单（同时显示覆盖层）
    function openMobileMenu() {
        mobileMenu.classList.add('open');
        overlay.classList.add('active');
    }

    // 关闭菜单（同时隐藏覆盖层）
    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        overlay.classList.remove('active');
    }

    // 绑定事件
    document.getElementById('hamburger').addEventListener('click', openMobileMenu);
    document.getElementById('close-menu').addEventListener('click', closeMobileMenu);

    // 点击覆盖层关闭菜单
    overlay.addEventListener('click', closeMobileMenu);

    // 点击菜单内的项目后关闭菜单（除了关机按钮）
    mobileMenu.querySelectorAll('li[data-page]').forEach(li => {
        li.addEventListener('click', closeMobileMenu);
    });

    // 关机按钮不自动关闭菜单，保持一致性
    document.getElementById('mobile-shutdown').addEventListener('click', (e) => {
        e.stopPropagation(); // 防止事件冒泡触发覆盖层点击
    });
}

// 数据源定义

/**
 * 导航选项数据
 * @type {Array<{text: {zh: string, en: string}, icon: string, desc: {zh: string, en: string}, onClick: Function}>}
 */
const navigationData = [
    {
        text: { zh: "关于我", en: "About Me" },
        icon: '<i class="fa-solid fa-user"></i>',
        desc: { zh: "了解我的背景和技能", en: "Learn about my background and skills" },

        onClick: function (item, index, context) {
            switchPage('about');
            console.log(`切换到关于页面`);
        }
    },
    {
        text: { zh: "我的项目", en: "My Projects" },
        icon: '<i class="fa-solid fa-code"></i>',
        desc: { zh: "查看我的技术项目", en: "View my technical projects" },

        onClick: function (item, index, context) {
            switchPage('projects');
            console.log(`切换到项目页面`);
        }
    },
    {
        text: { zh: "联系我", en: "Contact" },
        icon: '<i class="fa-solid fa-envelope"></i>',
        desc: { zh: "通过多种渠道联系我", en: "Get in touch via various channels" },

        onClick: function (item, index, context) {
            switchPage('contact');
            console.log(`切换到联系页面`);
        }
    }
];

/**
 * 关于我数据
 */
const aboutmeData = [
    {
        text: { zh: "是海边城市居民", en: "am a resident of a coastal city" },
        icon: '<i class="fa-solid fa-ship"></i>',
    },
    {
        text: { zh: `今年 ${calculateAge('2007-03-14')} 岁`, en: `am ${calculateAge('2007-03-14')} years old` },
        icon: '<i class="fa-solid fa-calendar-days"></i>',
    }
];

/**
 * 兴趣爱好数据
 */
const interestsData = [
    {
        text: { zh: "喜欢玩的游戏", en: "Favorite Games" },
        icon: '<i class="fa-solid fa-gamepad"></i>',
        desc: { zh: "绝区零、Apex Legends、Minecraft 和一些视觉小说", en: "Zenless Zone Zero, Apex Legends, Minecraft and some visual novels" },
    },
    {
        text: { zh: "喜欢吃的食物", en: "Favorite Foods" },
        icon: '<i class="fa-solid fa-burger"></i>',
        desc: { zh: "汉堡、炸鸡、土豆和冰淇淋，以及香草和牛奶口味的东西", en: "Hamburgers, fried chicken, potatoes and ice cream, as well as things flavored with vanilla and milk" },
    },
    {
        text: { zh: "喜欢做的事情", en: "Favorite Hobbies" },
        icon: '<i class="fa-solid fa-dumbbell"></i>',
        desc: { zh: "UI、前端、字体和 Logo 设计", en: "UI, front-end, typography and logo design" },
    }
];

/**
 * 项目数据
 * @type {Array<{text: {zh: string, en: string}, icon: string, desc: {zh: string, en: string}}>}
 */
const projectsData = [
    {
        text: { zh: "Fonttier", en: "Fonttier" },
        icon: '<i class="fa-solid fa-font"></i>',
        desc: { zh: "一个个人字体设计品牌", en: "A personal typography design brand" }
    },
    {
        text: { zh: "Furski", en: "Furski" },
        icon: '<i class="fa-solid fa-mobile"></i>',
        desc: { zh: "一个使用 Material You 设计的 e962 与 e621 第三方安卓 app", en: "An E-962 & E-621 third-party android app that use Material You design." }
    },
    {
        text: { zh: "WordCraft", en: "WordCraft" },
        icon: '<i class="fa-solid fa-file-word"></i>',
        desc: { zh: "一个造语单词生成器", en: "A conlang words generator" }
    },
];

/**
 * 技术数据
 * @type {Array<{text: {zh: string, en: string}, icon: string, desc: {zh: string, en: string}}>}
 */
const techData = [
    {
        text: { zh: "Figma / 即时设计", en: "Figma / JS.Design" },
        icon: '<i class="fa-solid fa-bezier-curve"></i>',
        desc: { zh: "矢量图标及UI设计工具", en: "Vector icon and UI design tool" }
    },
    {
        text: { zh: "HTML5 & CSS3", en: "HTML5 & CSS3" },
        icon: '<i class="fa-brands fa-html5"></i>',
        desc: { zh: "Web前端基础", en: "Web frontend basics" }
    },
    {
        text: { zh: "JavaScript", en: "JavaScript" },
        icon: '<i class="fa-brands fa-js"></i>',
        desc: { zh: "前端脚本语言", en: "Frontend scripting language" }
    },
    {
        text: { zh: "AndroLua", en: "AndroLua" },
        icon: '<i class="fa-solid fa-code"></i>',
        desc: { zh: "简单应用开发框架", en: "Simple app development framework" }
    }
];

/**
 * 通讯渠道数据
 * @type {Array<{text: {zh: string, en: string}, icon: string, desc: {zh: string, en: string}}>}
 */
const commsData = [
    {
        text: { zh: "胡斯凯Husky", en: "胡斯凯Husky" },
        icon:  '<i class="fa-brands fa-bilibili"></i>',
        desc: { zh: "哔哩哔哩", en: "BiliBili" },

        onClick: function (item, index, context) {
            window.open('https://space.bilibili.com/66560652', '_blank');
            console.log(`打开哔哩哔哩页面`);
        }
    },
    {
        text: { zh: "@HHusky0314", en: "@HHusky0314" },
        icon: '<i class="fa-brands fa-twitter"></i>',
        desc: { zh: "X（推特）", en: "X (Twitter)" },

        onClick: function (item, index, context) {
            window.open('https://x.com/HHusky0314', '_blank');
            console.log(`打开 X 页面`);
        }
    },
    {
        text: { zh: "SiberiaHusky", en: "SiberiaHusky" },
        icon: '<i class="fa-brands fa-github"></i>',
        desc: { zh: "GitHub", en: "GitHub" },

        onClick: function (item, index, context) {
            window.open('https://github.com/SiberiaHusky', '_blank');
            console.log(`打开 GitHub 页面`);
        }
    },
    {
        text: { zh: "胡斯凯Husky", en: "胡斯凯Husky" },
        icon: '<i class="fa-brands fa-facebook"></i>',
        desc: { zh: "脸书", en: "Facebook" },

        onClick: function (item, index, context) {
            window.open('https://www.facebook.com/profile.php?id=100060712148438', '_blank');
            console.log(`打开脸书页面`);
        }
    },
    {
        text: { zh: "胡斯凯", en: "胡斯凯" },
        icon: '<i class="fa-brands fa-instagram"></i>',
        desc: { zh: "Instagram", en: "Instagram" },

        onClick: function (item, index, context) {
            window.open('https://www.instagram.com/invites/contact/?i=1lma9xhiy30g3', '_blank');
            console.log(`打开脸书页面`);
        }
    },
    {
        text: { zh: "mail#hooskai.top", en: "mail#hooskai.top" },
        icon: '<i class="fa-solid fa-at"></i>',
        desc: { zh: "电子邮件", en: "Email" }
    },
];

// 初始化事件监听
document.addEventListener('DOMContentLoaded', () => {
    // 1. 检测浏览器语言并设置默认语言（立即执行）
    detectAndSetBrowserLanguage();

    // 页面导航
    document.querySelectorAll('[data-page]').forEach(item => {
        item.addEventListener('click', () => {
            switchPage(item.dataset.page);
            // 如果是移动端，点击后关闭菜单
            if (window.innerWidth <= 768) {
                document.getElementById('mobile-menu').classList.remove('open');
                document.getElementById('mobile-menu-overlay').classList.remove('active');
            }
        });
    });

    // 语言切换按钮 - 现在切换语言而不是检测语言
    document.getElementById('lang-toggle').addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'zh' : 'en';
        setLanguage(newLang);
    });

    // 初始化关机功能
    initShutdown();

    // 初始化移动端菜单覆盖层功能
    initMobileMenuOverlay();

    // 更新时间
    updateTime();
    setInterval(updateTime, 1000);

    // 初始化3D列表（在语言检测之后）
    if (document.querySelector('[data-page="home"]').classList.contains('active')) {
        init3DList('nav-slider', 'nav-status', navigationData);
        init3DList('interests-slider', 'interests-status', interestsData);
    }
});