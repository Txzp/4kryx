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
                smoothScrollTo(projectsSection);
                setActiveButton('projects');
            }
        });
    }
    
    // Scroll activo
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
    
    // Animación de números (visits)
    function animateNumbers() {
        const stats = document.querySelectorAll('.stat-number-project');
        stats.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            let current = 0;
            const increment = target / 50;
            const updateNumber = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target.toLocaleString();
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
    
    // Hash URL
    function handleHashOnLoad() {
        const urlHash = window.location.hash.slice(1);
        if (urlHash) {
            const targetSection = document.getElementById(urlHash);
            if (targetSection) {
                setTimeout(() => {
                    smoothScrollTo(targetSection);
                    setActiveButton(urlHash);
                }, 100);
            }
        }
    }
    
    // Observer para tarjetas
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        cardObserver.observe(card);
    });
    
    // Event listeners
    window.addEventListener('scroll', () => {
        updateActiveSectionOnScroll();
        handleNavbarScroll();
    });
    
    window.addEventListener('load', () => {
        handleHashOnLoad();
        updateActiveSectionOnScroll();
        handleNavbarScroll();
        animateNumbers();
        setupRotatingText();
    });
    
    window.addEventListener('hashchange', () => {
        const urlHash = window.location.hash.slice(1);
        if (urlHash) {
            const targetSection = document.getElementById(urlHash);
            if (targetSection) {
                smoothScrollTo(targetSection);
                setActiveButton(urlHash);
            }
        }
    });
})();
