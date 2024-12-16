const images = document.querySelectorAll('.gallery-image');
const modal = document.querySelector('.image-modal');
const modalImg = document.getElementById('modal-img');
const closeModal = document.querySelector('.close');
const body = document.body;

images.forEach(image => {
    image.addEventListener('click', function() {
        modal.style.display = 'flex';
        modalImg.src = this.src;
        body.classList.add('no-scroll');
    });
});

// Fermer le modal lorsqu'on clique sur le bouton "fermer"
closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
    body.classList.remove('no-scroll');
});

// Fermer le modal en cliquant en dehors de l'image
modal.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
        body.classList.remove('no-scroll');
    }
});