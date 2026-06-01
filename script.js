(function() {
    // Elementos del DOM
    const buttons = document.querySelectorAll('.nav-buttons button');
    const sections = document.querySelectorAll('.section');
    const topbar = document.getElementById('topbar');
    
    // Función para cambiar el botón activo
    function setActiveButton(targetId) {
        buttons.forEach(btn => {
            if (btn.dataset.target === targetId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Scroll suave con offset para la navbar fija
    function smoothScrollTo(element) {
        const offset = 80; // altura del header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    // Navegación por botones
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetId = button.dataset.target;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                setActiveButton(targetId);
                smoothScrollTo(targetSection);
                // Actualizar URL sin recargar
                history.pushState(null, '', `#${targetId}`);
            }
        });
    });
    
    // Detectar scroll para actualizar botón activo
    function updateActiveSectionOnScroll() {
        const scrollPosition = window.scrollY + 120; // offset para activar antes
        
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
    
    // Efecto navbar al hacer scroll
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            topbar.classList.add('scrolled');
        } else {
            topbar.classList.remove('scrolled');
        }
    }
    
    // Manejar hash en la URL al cargar
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
    
    // Event listeners
    window.addEventListener('scroll', () => {
        updateActiveSectionOnScroll();
        handleNavbarScroll();
    });
    
    window.addEventListener('load', () => {
        handleHashOnLoad();
        updateActiveSectionOnScroll();
        handleNavbarScroll();
    });
    
    // Cuando se cambia el hash manualmente
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
    
    // Intersection Observer para animar las tarjetas de proyectos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Aplicar estilos iniciales y observar cada tarjeta
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        observer.observe(card);
    });
})();
