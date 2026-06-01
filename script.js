const buttons = document.querySelectorAll('.nav-buttons button');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.dataset.target;
        const section = document.getElementById(targetId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const urlHash = window.location.hash.slice(1);
    if (urlHash) {
        const targetSection = document.getElementById(urlHash);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});
