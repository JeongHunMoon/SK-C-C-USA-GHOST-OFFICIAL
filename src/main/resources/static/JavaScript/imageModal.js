// imageModal.js

document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.section_top_image');

    images.forEach(function (image) {
        image.addEventListener('click', function () {
            createModal(this.src);
        });
    });

    document.addEventListener('click', function (event) {
        const modal = document.getElementById('imageModal');
        if (event.target === modal) {
            closeModal();
        }
    });
});

function createModal(src) {
    const modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.classList.add('show');

    const expandedImage = document.createElement('img');
    expandedImage.classList.add('expanded-image');
    expandedImage.src = src;

    const closeModalButton = document.createElement('span');
    closeModalButton.classList.add('closeModal');
    closeModalButton.innerHTML = '&times;';
    closeModalButton.addEventListener('click', closeModal);

    modal.appendChild(closeModalButton);
    modal.appendChild(expandedImage);

    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.removeChild(modal);
    }
}
