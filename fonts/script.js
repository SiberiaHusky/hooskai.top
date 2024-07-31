document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        link.addEventListener('mouseover', function() {
            document.body.classList.add('blur-all');
            link.classList.add('highlight');
        });

        link.addEventListener('mouseout', function() {
            document.body.classList.remove('blur-all');
            link.classList.remove('highlight');
        });
    });
});
