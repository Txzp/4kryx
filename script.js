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
    
    // Animación de números (colaboradores y visits)
    function animateNumbers() {
        // Colaboradores
        const collaborators = document.querySelectorAll('.stat-number-project');
        collaborators.forEach(stat => {
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
        
        // Visits
        const visits = document.querySelectorAll('.stat-visits');
        visits.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            let current = 0;
            const increment = target / 50;
            const updateNumber = () => {
                if (current < target) {
                    current += increment;
                    if (target >= 1000000) {
                        stat.textContent = (current / 1000000).toFixed(1) + 'M';
                    } else if (target >= 1000) {
                        stat.textContent = (current / 1000).toFixed(0) + 'k';
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                    requestAnimationFrame(updateNumber);
                } else {
                    if (target >= 1000000) {
                        stat.textContent = (target / 1000000).toFixed(1) + 'M';
                    } else if (target >= 1000) {
                        stat.textContent = (target / 1000).toFixed(0) + 'k';
                    } else {
                        stat.textContent = target;
                    }
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
    
    window.addEventListener('scroll', () => {
        updateActiveSectionOnScroll();
        handleNavbarScroll();
    });
    
    window.addEventListener('load', () => {
        updateActiveSectionOnScroll();
        handleNavbarScroll();
        animateNumbers();
    });
})();
