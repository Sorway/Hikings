window.addEventListener('load', function() {
    document.querySelector('.loading-screen').style.display = 'none';
    document.querySelectorAll('.container').forEach(function(container) {
        container.style.display = 'flex';
    });
});