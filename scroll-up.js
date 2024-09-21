document.addEventListener('DOMContentLoaded', function () {
    // 获取按钮元素
    var scrollUpButton = document.getElementById('btn-scroll-up');

    if (scrollUpButton) {
        // 监听滚动事件
        window.addEventListener('scroll', function () {
            // 当页面滚动超过某个阈值时（例如100像素），显示按钮
            if (window.scrollY > 100) {
                scrollUpButton.style.scale = 1;
            } else {
                scrollUpButton.style.scale = 0;
            }
        });

        // 点击按钮向上滚动到顶部
        scrollUpButton.addEventListener('click', function () {
            // 使用 window.scrollTo 将页面滚动到顶部
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // 平滑滚动
            });
        });
    }
});