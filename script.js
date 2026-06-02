(function() {
    const navButtons = document.querySelectorAll('.nav-buttons button[data-target]');
    const sections   = document.querySelectorAll('.section');
    const topbar     = document.getElementById('topbar');
    const exploreBtn = document.getElementById('exploreBtn');

    let currentLang = 'es';

    /* ── Rotating words ── */
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

    /* ── Nav ── */
    function setActiveButton(targetId) {
        navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.target === targetId));
    }
    function smoothScrollTo(el) {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
    }
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const t = document.getElementById(btn.dataset.target);
            if (t) { setActiveButton(btn.dataset.target); smoothScrollTo(t); history.pushState(null,'',`#${btn.dataset.target}`); }
        });
    });
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            const p = document.getElementById('projects');
            if (p) { smoothScrollTo(p); setActiveButton('projects'); }
        });
    }

    /* ── Scroll: active section ── */
    function updateActiveSectionOnScroll() {
        const sp = window.scrollY + 120;
        let cur = 'home';
        sections.forEach(s => { if (sp >= s.offsetTop && sp < s.offsetTop + s.offsetHeight) cur = s.id; });
        setActiveButton(cur);
    }
    function handleNavbarScroll() { topbar.classList.toggle('scrolled', window.scrollY > 50); }

    /* ── Scroll reveal ── */
    const animEls = document.querySelectorAll('.section-animate');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('is-leaving');
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
                entry.target.classList.add('is-leaving');
                setTimeout(() => entry.target.classList.remove('is-leaving'), 450);
            }
        });
    }, { threshold: 0.12 });
    animEls.forEach(el => revealObserver.observe(el));

    /* ── Typewriter for About Me quote ── */
    const quoteEl     = document.getElementById('typedQuote');
    const detailEl    = document.getElementById('detailText');
    let typedDone     = false;
    let typingTimeout = null;

    const quoteData = {
        es: [
            { text: '"Soy ',    cls: '' },
            { text: '4kryx',    cls: 'highlight' },
            { text: ' — un desarrollador y creador enfocado en construir ', cls: '' },
            { text: 'cosas extraordinarias',  cls: 'highlight' },
            { text: '"',        cls: '' }
        ],
        en: [
            { text: '"I\'m ',   cls: '' },
            { text: '4kryx',    cls: 'highlight' },
            { text: ' — a developer and creator focused on building ', cls: '' },
            { text: 'extraordinary things', cls: 'highlight' },
            { text: '"',        cls: '' }
        ]
    };

    function runTypewriter(lang) {
        if (!quoteEl) return;
        clearTimeout(typingTimeout);
        quoteEl.innerHTML = '';
        typedDone = false;

        const parts  = quoteData[lang];
        let pi = 0, ci = 0;
        let spans = [];

        // pre-create all spans
        parts.forEach(p => {
            const s = document.createElement('span');
            if (p.cls) s.className = p.cls;
            s.textContent = '';
            quoteEl.appendChild(s);
            spans.push(s);
        });

        // blinking cursor
        const cursor = document.createElement('span');
        cursor.className = 'type-cursor';
        cursor.textContent = '|';
        quoteEl.appendChild(cursor);

        function tick() {
            if (pi >= parts.length) {
                cursor.remove();
                typedDone = true;
                // fade in detail text
                if (detailEl) {
                    detailEl.textContent = detailEl.dataset[lang];
                    detailEl.classList.add('detail-visible');
                }
                return;
            }
            spans[pi].textContent += parts[pi].text[ci];
            ci++;
            if (ci >= parts[pi].text.length) { pi++; ci = 0; }
            typingTimeout = setTimeout(tick, 28);
        }
        typingTimeout = setTimeout(tick, 300);
    }

    // Trigger typewriter when about section enters view
    const aboutSection = document.getElementById('about');
    let aboutTyped = false;
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !aboutTyped) {
                aboutTyped = true;
                runTypewriter(currentLang);
            } else if (!entry.isIntersecting) {
                // Reset so it re-types when scrolled back
                aboutTyped = false;
                clearTimeout(typingTimeout);
                if (quoteEl) quoteEl.innerHTML = '';
                if (detailEl) detailEl.classList.remove('detail-visible');
            }
        });
    }, { threshold: 0.25 });
    if (aboutSection) aboutObserver.observe(aboutSection);

    /* ── 3D mouse-follow tilt on profile image ── */
    const imageFrame = document.getElementById('imageFrame');
    if (imageFrame) {
        imageFrame.addEventListener('mousemove', (e) => {
            const rect = imageFrame.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 to 0.5
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            const maxTilt = 22;
            const rotY =  x * maxTilt;
            const rotX = -y * maxTilt;
            imageFrame.style.transform = `perspective(700px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(1.06)`;
        });
        imageFrame.addEventListener('mouseleave', () => {
            imageFrame.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)';
        });
    }

    /* ── Number animations ── */
    function animateNumbers() {
        document.querySelectorAll('.stat-number-project').forEach(stat => {
            const target = parseInt(stat.dataset.target);
            let current = 0, inc = target / 50;
            const tick = () => { if (current < target) { current += inc; stat.textContent = Math.floor(current); requestAnimationFrame(tick); } else stat.textContent = target; };
            new IntersectionObserver((e,o) => { if (e[0].isIntersecting) { tick(); o.unobserve(e[0].target); } }, {threshold:.5}).observe(stat);
        });
        document.querySelectorAll('.stat-visits').forEach(stat => {
            const target = parseInt(stat.dataset.target);
            let current = 0, inc = target / 50;
            const fmt = v => target>=1000000?(v/1000000).toFixed(1)+'M':target>=1000?(v/1000).toFixed(0)+'k':Math.floor(v);
            const tick = () => { if (current < target) { current += inc; stat.textContent = fmt(current); requestAnimationFrame(tick); } else stat.textContent = fmt(target); };
            new IntersectionObserver((e,o) => { if (e[0].isIntersecting) { tick(); o.unobserve(e[0].target); } }, {threshold:.5}).observe(stat);
        });
    }

    /* ── Language ── */
    function changeLanguage(lang) {
        currentLang = lang;

        document.querySelectorAll('[data-en][data-es]').forEach(el => {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = el.dataset[lang];
            else el.textContent = el.dataset[lang];
        });

        if (rotatingElement) { wordIndex = 0; rotatingElement.textContent = rotatingWordsMap[lang][0]; }

        // Update detail text if already visible
        if (detailEl) detailEl.textContent = detailEl.dataset[lang];

        // Re-run typewriter in new language
        aboutTyped = false;
        clearTimeout(typingTimeout);
        if (quoteEl) quoteEl.innerHTML = '';
        if (detailEl) detailEl.classList.remove('detail-visible');
        if (aboutSection) {
            const rect = aboutSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                aboutTyped = true;
                runTypewriter(lang);
            }
        }

        const langDot   = document.getElementById('langDot');
        const langLabel = document.getElementById('langLabel');
        const checkEn   = document.getElementById('check-en');
        const checkEs   = document.getElementById('check-es');
        const optEn     = document.getElementById('opt-en');
        const optEs     = document.getElementById('opt-es');

        if (lang === 'en') {
            langDot.style.background = '#4a9fff';
            langDot.style.boxShadow  = '0 0 6px rgba(74,159,255,0.7)';
            langLabel.textContent = 'English';
            checkEn.innerHTML = '<i class="fas fa-check"></i>';
            checkEs.innerHTML = '';
            optEn.classList.add('active-lang');
            optEs.classList.remove('active-lang');
            document.documentElement.lang = 'en';
        } else {
            langDot.style.background = '#ff6b35';
            langDot.style.boxShadow  = '0 0 6px rgba(255,107,53,0.7)';
            langLabel.textContent = 'Spanish';
            checkEn.innerHTML = '';
            checkEs.innerHTML = '<i class="fas fa-check"></i>';
            optEn.classList.remove('active-lang');
            optEs.classList.add('active-lang');
            document.documentElement.lang = 'es';
        }
        document.getElementById('langDropdown').classList.remove('open');
    }

    const langBtn      = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    langBtn.addEventListener('click', e => { e.stopPropagation(); langDropdown.classList.toggle('open'); });
    document.addEventListener('click', () => langDropdown.classList.remove('open'));
    langDropdown.addEventListener('click', e => e.stopPropagation());
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', e => { e.preventDefault(); changeLanguage(btn.dataset.lang); });
    });

    /* ── YouTube Music ── */
    let ytPlayer    = null;
    let musicPlaying = false;
    let ytReady     = false;
    const musicBtn  = document.getElementById('musicBtn');
    const volSlider = document.getElementById('volumeSlider');

    function updateMusicBtn() {
        musicBtn.classList.toggle('playing', musicPlaying);
    }
    function tryPlay() {
        if (ytReady && ytPlayer) { ytPlayer.setVolume(parseInt(volSlider.value)); ytPlayer.playVideo(); musicPlaying = true; updateMusicBtn(); }
    }
    function tryPause() {
        if (ytReady && ytPlayer) { ytPlayer.pauseVideo(); musicPlaying = false; updateMusicBtn(); }
    }

    musicBtn.addEventListener('click', () => {
        if (musicPlaying) tryPause(); else tryPlay();
    });

    // Volume slider
    if (volSlider) {
        volSlider.addEventListener('input', () => {
            if (ytReady && ytPlayer) ytPlayer.setVolume(parseInt(volSlider.value));
        });
    }

    window.onYouTubeIframeAPIReady = function() {
        ytReady = true;
        ytPlayer = new YT.Player('yt-player', {
            height: '1', width: '1',
            videoId: '5isLsgNIu8A',
            playerVars: { autoplay:1, loop:1, playlist:'5isLsgNIu8A', controls:0, disablekb:1, iv_load_policy:3, modestbranding:1 },
            events: {
                onReady(event) {
                    event.target.setVolume(parseInt(volSlider ? volSlider.value : 18));
                    event.target.playVideo();
                    musicPlaying = true;
                    updateMusicBtn();
                },
                onStateChange(event) {
                    if (event.data === YT.PlayerState.ENDED) ytPlayer.playVideo();
                    else if (event.data === YT.PlayerState.PLAYING) { musicPlaying = true; updateMusicBtn(); }
                    else if (event.data === YT.PlayerState.PAUSED)  { musicPlaying = false; updateMusicBtn(); }
                }
            }
        });
    };

    const ytScript = document.createElement('script');
    ytScript.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(ytScript);

    // On first interaction try to play (browser autoplay block fallback)
    const firstInteract = () => {
        if (!musicPlaying && ytReady && ytPlayer) tryPlay();
        document.removeEventListener('click', firstInteract);
        document.removeEventListener('keydown', firstInteract);
    };
    document.addEventListener('click', firstInteract);
    document.addEventListener('keydown', firstInteract);

    /* ── Scroll listeners ── */
    window.addEventListener('scroll', () => { updateActiveSectionOnScroll(); handleNavbarScroll(); });

    /* ── Init ── */
    window.addEventListener('load', () => {
        updateActiveSectionOnScroll();
        handleNavbarScroll();
        animateNumbers();
        changeLanguage('es');
    });
})();
