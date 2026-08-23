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

    /* ── Custom cursor — desktop only ── */
    const cursor = document.getElementById('customCursor');
    let cursorVisible = false;
    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;

    if (!isPhone && cursor) {
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = e.clientX + 'px';
            cursor.style.top  = e.clientY + 'px';
            if (!cursorVisible) {
                cursor.style.opacity = '1';
                cursorVisible = true;
            }
        });
    } else if (cursor) {
        cursor.style.display = 'none';
    }

    /* ── Ambient snow — soft drift influenced by cursor position ── */
    const canvas = document.getElementById('bgCanvas');
    const ctx    = canvas ? canvas.getContext('2d') : null;

    if (canvas && ctx) {
        let windTarget = 0;
        let wind = 0;
        function resize() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);
        document.addEventListener('mousemove', e => {
            windTarget = (e.clientX / window.innerWidth - 0.5) * 0.85;
        });

        function rand(a, b) { return Math.random() * (b - a) + a; }
        class Snowflake {
            constructor() { this.reset(true); }
            reset(initial) {
                this.x = rand(0, canvas.width);
                this.y = initial ? rand(0, canvas.height) : rand(-28, -4);
                this.radius = rand(1.1, 2.7);
                this.speed = rand(0.45, 1.35);
                this.sway = rand(0.008, 0.022);
                this.phase = rand(0, Math.PI * 2);
                this.alpha = rand(0.3, 0.78);
            }
            update() {
                this.y += this.speed;
                this.phase += this.sway;
                this.x += Math.sin(this.phase) * 0.22 + wind;
                if (this.y > canvas.height + 8) this.reset(false);
                if (this.x < -8) this.x = canvas.width + 8;
                if (this.x > canvas.width + 8) this.x = -8;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,' + this.alpha + ')';
                ctx.fill();
            }
        }
        const snowflakes = Array.from({ length: 145 }, () => new Snowflake());
        (function loop() {
            wind += (windTarget - wind) * 0.018;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            snowflakes.forEach(flake => { flake.update(); flake.draw(); });
            requestAnimationFrame(loop);
        })();
    }

    /* ── Click / tap ripple ── */
    function spawnTapRipple(x, y) {
        const ring = document.createElement('div');
        ring.className = 'tap-ripple';
        ring.style.left = x + 'px';
        ring.style.top  = y + 'px';
        document.body.appendChild(ring);
        ring.addEventListener('animationend', () => ring.remove());

        const cross = document.createElement('div');
        cross.className = 'tap-cross';
        cross.style.left = x + 'px';
        cross.style.top  = y + 'px';
        cross.textContent = '✦';
        document.body.appendChild(cross);
        cross.addEventListener('animationend', () => cross.remove());
    }

    if (isPhone) {
        document.addEventListener('touchstart', e => {
            const t = e.touches[0];
            if (t) spawnTapRipple(t.clientX, t.clientY);
        }, { passive: true });
    } else {
        document.addEventListener('click', e => {
            spawnTapRipple(e.clientX, e.clientY);
        });
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

    /* ── Live EST clock ── */
    function updateClock() {
        const tz = 'America/New_York';
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', {
            timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        });
        const dateStr = now.toLocaleDateString('en-US', {
            timeZone: tz, weekday: 'short', month: 'short', day: 'numeric'
        });
        const tzClock = document.getElementById('tzClock');
        const tzDate  = document.getElementById('tzDate');
        if (tzClock) tzClock.textContent = timeStr;
        if (tzDate)  tzDate.textContent  = dateStr;
    }
    updateClock();
    setInterval(updateClock, 1000);

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

    /* ── Scroll parallax on angel text ── */
    const siteWrapper = document.getElementById('siteWrapper');
    const angelEl     = document.querySelector('.hero-angel');

    if (siteWrapper && angelEl) {
        siteWrapper.addEventListener('scroll', () => {
            const progress = Math.min(siteWrapper.scrollTop / window.innerHeight, 1);
            angelEl.style.transform   = `translateY(${-progress * 22}px)`;
            angelEl.style.opacity     = String(1 - progress * 0.55);
            angelEl.style.letterSpacing = `${0.06 + progress * 0.14}em`;
        }, { passive: true });
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

