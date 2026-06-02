(function() {
    const buttons = document.querySelectorAll('.nav-buttons button');
    const sections = document.querySelectorAll('.section');
    const topbar = document.getElementById('topbar');
    const exploreBtn = document.getElementById('exploreBtn');
    
    const rotatingWords = ['Scripts', 'Bypasses', 'Systems', 'Games'];
    let wordIndex = 0;
    const rotatingElement = document.querySelector('.rotating-text');
    
    if (rotatingElement) {
        setInterval(() => {
            wordIndex = (wordIndex + 1) % rotatingWords.length;
            rotatingElement.style.opacity = '0';
            setTimeout(() => {
                rotatingElement.textContent = rotatingWords[wordIndex];
                rotatingElement.style.opacity = '1';
            }, 300);
        }, 2000);
    }
    
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
        if (button.dataset.target) {
            button.addEventListener('click', () => {
                const targetId = button.dataset.target;
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    setActiveButton(targetId);
                    smoothScrollTo(targetSection);
                    history.pushState(null, '', `#${targetId}`);
                }
            });
        }
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
    
    function animateNumbers() {
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
    
    function changeLanguage(lang) {
        if (lang === 'en') {
            document.getElementById('about').querySelector('.section-label').textContent = '▸ about me / who I am';
            document.getElementById('about').querySelector('h2').innerHTML = '"I\'m <span class="highlight">4kryx</span> — a developer and creator focused on building <span class="highlight">extraordinary things</span>"';
            document.getElementById('about').querySelector('.detail-text').textContent = 'I spend my time working on Roblox, VS Code, GitHub, crafting experiences and tools that push boundaries. Passionate about innovation and clean code.';
            document.getElementById('projects').querySelector('.section-label').textContent = '▸ featured work';
            document.querySelector('.footer p').innerHTML = '4KRYX © 2025 — Developer & Creator | Built with passion | Made in Vs code to Vercel app';
        } else if (lang === 'es') {
            document.getElementById('about').querySelector('.section-label').textContent = '▸ sobre mí / quién soy';
            document.getElementById('about').querySelector('h2').innerHTML = '"Soy <span class="highlight">4kryx</span> — un desarrollador y creador enfocado en construir <span class="highlight">cosas extraordinarias</span>"';
            document.getElementById('about').querySelector('.detail-text').textContent = 'Paso mi tiempo trabajando en Roblox, VS Code, GitHub, creando experiencias y herramientas que superan límites. Apasionado por la innovación y el código limpio.';
            document.getElementById('projects').querySelector('.section-label').textContent = '▸ trabajos destacados';
            document.querySelector('.footer p').innerHTML = '4KRYX © 2025 — Desarrollador & Creador | Hecho con pasión | Hecho en Vs code a Vercel app';
        }
    }
    
    const langButtons = document.querySelectorAll('.dropdown-content a');
    langButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.dataset.lang;
            changeLanguage(lang);
        });
    });
    
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
