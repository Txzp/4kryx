(function() {
    // Elementos del DOM
    const buttons = document.querySelectorAll('.nav-buttons button');
    const sections = document.querySelectorAll('.section');
    const topbar = document.getElementById('topbar');
    const exploreBtn = document.getElementById('exploreBtn');
    
    function setActiveButton(targetId) {
        buttons.forEach(btn => {
            if (btn.dataset.target === targetId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    function smoothScrollTo(element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    // Navegación
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetId = button.dataset.target;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                setActiveButton(targetId);
                smoothScrollTo(targetSection);
                history.pushState(null, '', `#${targetId}`);
            }
        });
    });
    
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
