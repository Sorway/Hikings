const buttons = document.querySelectorAll('.nav-btn');
const slides = document.querySelectorAll('.images-slide');
const contents = document.querySelectorAll('.content');
let currentSlide = 0;
let interval;

const updateSlide = (index) => {
    buttons.forEach((button, i) => {
        button.classList.toggle('active', i === index);
        slides[i].classList.toggle('active', i === index);
        contents[i].classList.toggle('active', i === index);
    });
    currentSlide = index;
};

const autoChangeSlide = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide(currentSlide);
};

const resetAutoSlide = () => {
    clearInterval(interval);
    startAutoSlide();
};

const startAutoSlide = () => {
    interval = setInterval(autoChangeSlide, 5000);
};

buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        updateSlide(index);
        resetAutoSlide();
    });
});

startAutoSlide();