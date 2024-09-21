// 获取所有的<a>标签
const links = document.querySelectorAll('a');

// 遍历这些链接
links.forEach(link => {
    // 检查链接是否包含targe属性
    if (link.hasAttribute('target')) {
        // 如果有targe属性，则添加.outerlink类
        link.classList.add('outerlink');
    }
});