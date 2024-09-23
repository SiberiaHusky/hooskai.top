document.addEventListener('DOMContentLoaded', function () {
    var lang = navigator.language || navigator.userLanguage; // 获取浏览器语言
    lang = lang.split('-')[0]; // 获取语言代码

    // 获取 text-fit
    var text_fit = document.getElementById('text-fit');

    // 获取 text-container
    var text_container = document.getElementById('text-container');

    // 获取当前页面的完整URL
    var url = window.location.href;

    // 提取URL中的路径部分
    var path = window.location.pathname;

    // 尝试从路径中提取文件名
    var filename = path.split('/').pop();

    // 如果路径为空，则默认文件名为'index'，否则提取文件名
    if (filename === '') {
        filename = 'index';
    } else {
        filename = filename.split('.')[0];
    }

    if (lang === 'zh') {
        // 设置页面的 title 属性
        if (filename === 'index') {
            document.title = '胡斯凯的足迹';
            var slogan = '用无数设计 留下我的足迹'
        } else if (filename === 'about') {
            document.title = '关于 - 胡斯凯的足迹';
            var slogan = '关于我的各种故事'
        } else if (filename === 'links') {
            document.title = '朋友们 - 胡斯凯的足迹';
            var slogan = '他们即是我的整个世界'
        } else {
            document.title = '404 - 胡斯凯的足迹';
            var slogan = '无法找到你所请求的页面'
        }

        document.getElementById('zh').style.display = 'block';
        document.getElementById('en').style.display = 'none';

        var elementIcp = document.getElementById('icp');
        if (elementIcp) {
            elementIcp.style.display = 'block';
        }
        // 设置html标签的lang属性
        document.documentElement.lang = 'zh-CN';
    }

    else {
        // 设置页面的 title 属性
        if (filename === 'index') {
            document.title = 'Husky\'s Footprints';
            var slogan = 'With countless designs  leave my footprints'
        } else if (filename === 'about') {
            document.title = 'About - Husky\'s Footprints';
            var slogan = 'About my various stories'
        } else if (filename === 'links') {
            document.title = 'Friends - Husky\'s Footprints';
            var slogan = 'They are my whole world'
        } else {
            document.title = '404 - Husky\'s Footprints';
            var slogan = 'Cannot find the page you requested'
        }

        document.getElementById('zh').style.display = 'none';
        document.getElementById('en').style.display = 'block';

        var elementIcp = document.getElementById('icp');
        if (elementIcp) {
            elementIcp.style.display = 'none';
        }
        // 设置html标签的lang属性
        document.documentElement.lang = 'en';
    }

    // 修改 text-fit 的文本内容
    text_fit.textContent = slogan || 'With countless designs  leave my footprints'
    // 修改 text-container 的 data-texts 属性
    text_container.dataset.texts = slogan || 'With countless designs  leave my footprints'
});