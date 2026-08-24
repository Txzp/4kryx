(function () {

    /* ── Prevent copy / selection ── */
    document.addEventListener('copy',        e => e.preventDefault());
    document.addEventListener('cut',         e => e.preventDefault());
    document.addEventListener('selectstart', e => e.preventDefault());
    document.addEventListener('dragstart',   e => e.preventDefault());

    /* ── Detect phone only (NOT touchscreen laptops ≥ 1024px) ── */
    const isPhone = (
        window.matchMedia('(hover: none) and (pointer: coarse)').matches
        || navigator.maxTouchPoints > 0
    ) && window.innerWidth <= 768;

    /* ── Default browser cursor ── */

    /* ── Ambient snow background ── */
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    if (canvas && ctx) {
        function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        resize();
        window.addEventListener('resize', resize);
        const flakes = Array.from({ length: 150 }, () => ({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.8, speed: Math.random() * 1.1 + 0.35,
            drift: Math.random() * 0.5 - 0.25, alpha: Math.random() * 0.55 + 0.2
        }));
        (function snowLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            flakes.forEach(f => {
                f.y += f.speed; f.x += f.drift;
                if (f.y > canvas.height + 6) { f.y = -6; f.x = Math.random() * canvas.width; }
                if (f.x < -6) f.x = canvas.width + 6;
                if (f.x > canvas.width + 6) f.x = -6;
                ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,' + f.alpha + ')'; ctx.fill();
            });
            requestAnimationFrame(snowLoop);
        })();
    }

    /* ── Enter overlay ── */
    const overlay = document.getElementById('enterOverlay');
    const audio   = document.getElementById('bgAudio');
    const mIcon   = document.getElementById('musicIcon');
    let   musicOn = false;

    function tryPlayMusic() {
        if (!audio || musicOn) return;
        audio.volume = 0.18;
        audio.play().then(() => {
            musicOn = true;
            if (mIcon) mIcon.className = 'fas fa-volume-high';
        }).catch(() => {});
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            overlay.classList.add('fade-out');
            tryPlayMusic();
            setTimeout(() => {
                if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 700);
        });
    }

    /* ── About panel toggle ── */
    const aboutBtn   = document.getElementById('aboutBtn');
    const aboutPanel = document.getElementById('aboutPanel');
    const aboutClose = document.getElementById('aboutClose');

    if (aboutBtn && aboutPanel) {
        aboutBtn.addEventListener('click', () => {
            aboutPanel.classList.toggle('panel-open');
        });
    }
    if (aboutClose && aboutPanel) {
        aboutClose.addEventListener('click', () => {
            aboutPanel.classList.remove('panel-open');
        });
    }

    /* ── Music toggle ── */
    const mToggle = document.getElementById('musicToggle');
    if (mToggle) {
        mToggle.addEventListener('click', () => {
            if (!audio) return;
            musicOn = !musicOn;
            if (mIcon) mIcon.className = musicOn ? 'fas fa-volume-high' : 'fas fa-volume-xmark';
            if (musicOn) {
                audio.volume = 0.18;
                audio.play().catch(() => {});
            } else {
                audio.pause();
            }
        });
    }


    /* ── "developer | creator" typewriter ── */
    const devTypedEl = document.getElementById('devTyped');
    const DEV_TEXT   = 'developer | creator';
    let   dIdx       = 0;
    let   dDeleting  = false;

    function devTick() {
        if (!devTypedEl) return;
        if (!dDeleting) {
            dIdx++;
            devTypedEl.textContent = DEV_TEXT.slice(0, dIdx);
            if (dIdx >= DEV_TEXT.length) {
                dDeleting = true;
                setTimeout(devTick, 2800);
                return;
            }
            setTimeout(devTick, 85);
        } else {
            dIdx--;
            devTypedEl.textContent = DEV_TEXT.slice(0, dIdx);
            if (dIdx <= 0) {
                dDeleting = false;
                setTimeout(devTick, 700);
                return;
            }
            setTimeout(devTick, 48);
        }
    }
    setTimeout(devTick, 300);

    /* ── Scroll reveal — IntersectionObserver ── */
    const revealEls = document.querySelectorAll('.scroll-reveal');
    if (revealEls.length) {
        const revealIO = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { root: document.getElementById('siteWrapper'), threshold: 0.15 });
        revealEls.forEach(el => revealIO.observe(el));
    }


    /* ── Scroll dots — IntersectionObserver ── */
    const sections = document.querySelectorAll('.section');
    const dots     = document.querySelectorAll('.scroll-dot');

    if (sections.length && dots.length) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = [...sections].indexOf(entry.target);
                    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
                }
            });
        }, { root: document.getElementById('siteWrapper'), threshold: 0.55 });

        sections.forEach(s => io.observe(s));

        /* Dot click → scroll to that section */
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const idx = parseInt(dot.dataset.section, 10);
                scrollToSection(idx);
            });
        });
    }

    /* ── Visitor counter ── */
    (function () {
        const KEY = 'vuid_4kryx';
        let vid = localStorage.getItem(KEY);
        if (!vid) {
            vid = (crypto.randomUUID
                ? crypto.randomUUID()
                : Date.now().toString(36) + Math.random().toString(36).slice(2)
            );
            localStorage.setItem(KEY, vid);
        }

        fetch('/api/visitors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: vid }),
        })
        .then(r => r.json())
        .then(data => {
            const el = document.getElementById('visitorCount');
            if (el && data.count !== undefined) {
                el.textContent = data.count.toLocaleString();
            }
        })
        .catch(() => {});
    })();

})();

/* ── Global: scroll to section by index ── */
function scrollToSection(idx) {
    const wrapper  = document.getElementById('siteWrapper');
    const sections = wrapper ? wrapper.querySelectorAll('.section') : [];
    if (sections[idx]) {
        sections[idx].scrollIntoView({ behavior: 'smooth' });
    }
}

