(function() {

    /* ── Intro Screen — click anywhere to enter ── */
    const introScreen = document.getElementById('introScreen');
    let introDone = false;

    function dismissIntro() {
        if (introDone) return;
        introDone = true;
        introScreen.classList.add('intro-flash-bg');
        setTimeout(() => {
            introScreen.classList.add('intro-hidden');
            tryPlay();
            introScreen.addEventListener('transitionend', () => {
                introScreen.style.display = 'none';
            }, { once: true });
        }, 300);
    }

    if (introScreen) introScreen.addEventListener('click', dismissIntro);

    /* ── Visitor counter (IP-deduplicated on server) ── */
    fetch('/api/visitors', { method: 'POST' })
        .then(r => r.json())
        .then(data => {
            const el = document.getElementById('visitorCount');
            if (el) el.textContent = data.count.toLocaleString();
        })
        .catch(() => {});

    const navButtons = document.querySelectorAll('.nav-buttons button[data-target]');
    const sections   = document.querySelectorAll('.section');
    const topbar     = document.getElementById('topbar');
    const exploreBtn = document.getElementById('exploreBtn');

    /* ── Rotating words ── */
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
    let typingTimeout = null;

    const quoteParts = [
        { text: '"I\'m ',                   cls: '' },
        { text: 'Angel',                    cls: 'highlight' },
        { text: ' — a developer and creator focused on building ', cls: '' },
        { text: 'extraordinary things',     cls: 'highlight' },
        { text: '"',                         cls: '' }
    ];

    function runTypewriter() {
        if (!quoteEl) return;
        clearTimeout(typingTimeout);
        quoteEl.innerHTML = '';

        let pi = 0, ci = 0;
        const spans = quoteParts.map(p => {
            const s = document.createElement('span');
            if (p.cls) s.className = p.cls;
            s.textContent = '';
            quoteEl.appendChild(s);
            return s;
        });

        const cursor = document.createElement('span');
        cursor.className = 'type-cursor';
        cursor.textContent = '|';
        quoteEl.appendChild(cursor);

        function tick() {
            if (pi >= quoteParts.length) {
                cursor.remove();
                if (detailEl) detailEl.classList.add('detail-visible');
                return;
            }
            spans[pi].textContent += quoteParts[pi].text[ci];
            ci++;
            if (ci >= quoteParts[pi].text.length) { pi++; ci = 0; }
            typingTimeout = setTimeout(tick, 28);
        }
        typingTimeout = setTimeout(tick, 300);
    }

    const aboutSection = document.getElementById('about');
    let aboutTyped = false;
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !aboutTyped) {
                aboutTyped = true;
                runTypewriter();
            } else if (!entry.isIntersecting) {
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
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            imageFrame.style.transform = `perspective(700px) rotateY(${x*22}deg) rotateX(${-y*22}deg) scale(1.06)`;
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

    /* ── YouTube Background Music (no UI controls) ── */
    let ytPlayer      = null;
    let ytPlayerReady = false;
    let playOnReady   = false;

    function tryPlay() {
        if (!ytPlayerReady || !ytPlayer) { playOnReady = true; return; }
        try { ytPlayer.setVolume(18); ytPlayer.playVideo(); } catch(e) {}
    }

    window.addEventListener('error', (e) => {
        if (e.message && e.message.includes('postMessage')) e.stopImmediatePropagation();
    }, true);

    window.onYouTubeIframeAPIReady = function() {
        try {
            ytPlayer = new YT.Player('yt-player', {
                height: '1', width: '1',
                videoId: '5isLsgNIu8A',
                playerVars: { autoplay:0, loop:1, playlist:'5isLsgNIu8A', controls:0, disablekb:1, iv_load_policy:3, modestbranding:1 },
                events: {
                    onReady(event) {
                        try {
                            ytPlayerReady = true;
                            event.target.setVolume(18);
                            if (playOnReady) tryPlay();
                        } catch(e) {}
                    },
                    onStateChange(event) {
                        try {
                            if (event.data === YT.PlayerState.ENDED) ytPlayer.playVideo();
                        } catch(e) {}
                    }
                }
            });
        } catch(e) {}
    };

    const ytScript = document.createElement('script');
    ytScript.src = 'https://www.youtube.com/iframe_api';
    ytScript.onerror = function() {};
    document.head.appendChild(ytScript);

    /* ── Scroll listeners ── */
    window.addEventListener('scroll', () => { updateActiveSectionOnScroll(); handleNavbarScroll(); });

    /* ── Init ── */
    window.addEventListener('load', () => {
        updateActiveSectionOnScroll();
        handleNavbarScroll();
        animateNumbers();
    });
})();
