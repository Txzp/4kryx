(function() {
    const navButtons = document.querySelectorAll('.nav-buttons button[data-target]');
    const sections = document.querySelectorAll('.section');
    const topbar = document.getElementById('topbar');
    const exploreBtn = document.getElementById('exploreBtn');

    let currentLang = 'es';

    const rotatingWordsMap = {
        en: ['Scripts', 'Bypasses', 'Systems', 'Games'],
        es: ['Scripts', 'Bypasses', 'Sistemas', 'Juegos']
    };
    let wordIndex = 0;
    const rotatingElement = document.querySelector('.rotating-text');

    if (rotatingElement) {
        setInterval(() => {
            wordIndex = (wordIndex + 1) % rotatingWordsMap[currentLang].length;
            rotatingElement.style.opacity = '0';
            setTimeout(() => {
                rotatingElement.textContent = rotatingWordsMap[currentLang][wordIndex];
                rotatingElement.style.opacity = '1';
            }, 300);
        }, 2000);
    }

    function setActiveButton(targetId) {
        navButtons.forEach(btn => {
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

    navButtons.forEach(button => {
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
        currentLang = lang;

        document.querySelectorAll('[data-en][data-es]').forEach(el => {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = el.dataset[lang];
            } else {
                el.textContent = el.dataset[lang];
            }
        });

        if (rotatingElement) {
            wordIndex = 0;
            rotatingElement.textContent = rotatingWordsMap[lang][0];
        }

        const langFlag = document.getElementById('langFlag');
        const langLabel = document.getElementById('langLabel');
        const checkEn = document.getElementById('check-en');
        const checkEs = document.getElementById('check-es');
        const optEn = document.getElementById('opt-en');
        const optEs = document.getElementById('opt-es');

        if (lang === 'en') {
            langFlag.textContent = '🇬🇧';
            langLabel.textContent = 'English';
            checkEn.innerHTML = '<i class="fas fa-check"></i>';
            checkEs.innerHTML = '';
            optEn.classList.add('active-lang');
            optEs.classList.remove('active-lang');
            document.documentElement.lang = 'en';
        } else {
            langFlag.textContent = '🇪🇸';
            langLabel.textContent = 'Español';
            checkEn.innerHTML = '';
            checkEs.innerHTML = '<i class="fas fa-check"></i>';
            optEn.classList.remove('active-lang');
            optEs.classList.add('active-lang');
            document.documentElement.lang = 'es';
        }

        const dropdown = document.getElementById('langDropdown');
        dropdown.classList.remove('open');
    }

    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');

    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('open');
    });

    document.addEventListener('click', () => {
        langDropdown.classList.remove('open');
    });

    langDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            changeLanguage(btn.dataset.lang);
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
        changeLanguage('es');
    });
})();
