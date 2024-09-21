const directions = ['up', 'down', 'left', 'right'];
let isPaused = false;

document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('text-container');
    if (!container) return;
    const texts = container.getAttribute('data-texts').split('');
    let elements = [];

    function createTextElement(text) {
        const element = document.createElement('div');
        element.className = 'text';
        element.textContent = text;
        container.appendChild(element);
        return element;
    }

    function togglePause() {
        isPaused = !isPaused;
        if (isPaused) {
            console.log('Paused');
        } else {
            console.log('Resumed');
        }
    }

    function moveElement(element) {
        if (isPaused) return;
    
        let rect = element.getBoundingClientRect();
        let currentX = rect.left - container.getBoundingClientRect().left;
        let currentY = rect.top - container.getBoundingClientRect().top;
    
        const containerRect = container.getBoundingClientRect();
    
        const direction = directions[Math.floor(Math.random() * directions.length)];
        let newX, newY;
        let step = 100;
        switch (direction) {
            case 'up':
                newY = Math.max(0, currentY - step);
                newX = currentX;
                break;
            case 'down':
                newY = Math.min(containerRect.height - element.offsetHeight, currentY + step);
                newX = currentX;
                break;
            case 'left':
                newX = Math.max(0, currentX - step);
                newY = currentY;
                break;
            case 'right':
                newX = Math.min(containerRect.width - element.offsetWidth, currentX + step);
                newY = currentY;
                break;
        }
    
        const animationDuration = Math.random() * 5 + 2;
        element.style.transition = `all ${animationDuration}s ease-in-out`;
        element.style.left = `${newX}px`;
        element.style.top = `${newY}px`;
    
        setTimeout(() => {
            if (!isPaused) {
                moveElement(element);
            }
        }, animationDuration * 1000);
    }

    function startMoving() {
        elements.forEach(element => {
            moveElement(element);
        });
    }

    texts.forEach(text => {
        const element = createTextElement(text);
        element.style.left = `${Math.random() * (container.offsetWidth - element.offsetWidth)}px`;
        element.style.top = `${Math.random() * (container.offsetHeight - element.offsetHeight)}px`;
        elements.push(element);
    });

    startMoving();

    container.addEventListener('mouseenter', function () {
        togglePause();
        elements.forEach((element, index) => {
            element.style.transition = 'all 1s ease-in-out';
            element.style.left = `${(index * element.offsetWidth) + (container.offsetWidth / 2) - (elements.length * element.offsetWidth / 2)}px`; // 居中对齐
            element.style.top = '50%'; // 垂直居中
        });
    });

    container.addEventListener('mouseleave', function () {
        togglePause();
        startMoving();
    });
});