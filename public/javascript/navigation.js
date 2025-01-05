document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const stickyOffset = 50;

    window.addEventListener('scroll', () => {
        if (window.scrollY > stickyOffset) {
            nav.classList.add('sticky');
            nav.classList.remove('fixed');
        } else {
            nav.classList.remove('sticky');
            nav.classList.add('fixed');
        }
    });
});