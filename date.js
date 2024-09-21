document.addEventListener('DOMContentLoaded', function () {
    // 获取当前年份
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();

    // 查找.this-year元素并设置其文本为当前年份
    if (document.querySelector('.this-year')) {
        document.querySelector('.this-year').textContent = currentYear;
    }

    // 设置起始日期为2007年3月14日
    const startDate = new Date(2007, 2, 14); // 注意月份是从0开始的，所以2代表3月

    // 计算从起始日期到今天的年数
    let years = currentYear - startDate.getFullYear();

    // 如果今天的日期早于起始日期的对应日（即3月14日），则减去一年
    if (currentYear > startDate.getFullYear() && (currentMonth < startDate.getMonth() || (currentMonth === startDate.getMonth() && currentDay < startDate.getDate()))) {
        years--;
    }

    // 查找所有具有类名.age的元素
    let ageElements = document.querySelectorAll('.age');

    // 遍历这些元素
    ageElements.forEach(function (element) {
        // 设置每个元素的文本内容为计算出的年数
        element.textContent = years;
    });
});