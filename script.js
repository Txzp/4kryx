(function() {
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
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
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
                smoothScrollTo(projectsSection);
                setActiveButton('projects');
            }
        });
    }
    
    function updateActiveSectionOnScroll() {
        const scrollPosition = window.scrollY + 120;
        let currentSection = 'home';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section.id;
            }
        });
        setActiveButton(currentSection);
    }
    
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            topbar.classList.add('scrolled');
        } else {
            topbar.classList.remove('scrolled');
        }
    }
    
    // Animación de números
    function animateNumbers() {
        const stats = document.querySelectorAll('.stat-number-project');
        stats.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            let current = 0;
            const increment = target / 50;
            const updateNumber = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target;
                }
            };
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateNumber();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(stat);
        });
    }
    
    // Rotating text
    function setupRotatingText() {
        const words = ['Games', 'Systems', 'Bypasses', 'Scripts'];
        let index = 0;
        const rotatingElement = document.querySelector('.rotating-text');
        if (rotatingElement) {
            setInterval(() => {
                index = (index + 1) % words.length;
                rotatingElement.style.opacity = '0';
                setTimeout(() => {
                    rotatingElement.textContent = words[index];
                    rotatingElement.style.opacity = '1';
                }, 300);
            }, 2000);
        }
    }
    
    window.addEventListener('scroll', () => {
        updateActiveSectionOnScroll();
        handleNavbarScroll();
    });
    
    window.addEventListener('load', () => {
        updateActiveSectionOnScroll();
        handleNavbarScroll();
        animateNumbers();
        setupRotatingText();
    });
})();
