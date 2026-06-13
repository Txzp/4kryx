(function () {

    /* ── Prevent copy / selection ── */
    document.addEventListener('copy',        e => e.preventDefault());
    document.addEventListener('cut',         e => e.preventDefault());
    document.addEventListener('selectstart', e => e.preventDefault());
    document.addEventListener('dragstart',   e => e.preventDefault());

    /* ── Custom cursor (DOM element) ── */
    const cursor = document.getElementById('customCursor');
    let cursorVisible = false;

    /* ── Canvas particles follow cursor ── */
    const canvas = document.getElementById('bgCanvas');
    const ctx    = canvas.getContext('2d');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursor) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top  = e.clientY + 'px';
            if (!cursorVisible) {
                cursor.style.opacity = '1';
                cursorVisible = true;
            }
        }
    });

    /* ── Particle rain — brighter, denser, cursor-following ── */
    const SYMBOLS = ['✦', '✧', '*', '❄', '+', '·', '✶', '⁕', '❋', '✼'];
    function rand(a, b) { return Math.random() * (b - a) + a; }

    class Particle {
        constructor() { this.reset(true); }
        reset(init) {
            const spread = rand(-180, 180);
            this.x      = init ? rand(0, canvas.width) : mouseX + spread;
            this.y      = init ? rand(0, canvas.height) : mouseY - rand(10, 70);
            this.size   = rand(9, 22);
            this.sym    = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            this.speedY = rand(0.55, 1.8);
            this.speedX = rand(-0.35, 0.35);
            this.rot    = rand(0, Math.PI * 2);
            this.rotSpd = rand(-0.016, 0.016);
            /* Brighter alpha range */
            this.alpha  = rand(0.22, 0.72);
            this.aDir   = rand(0.004, 0.011) * (Math.random() > 0.5 ? 1 : -1);
            this.aMin   = 0.15;
            this.aMax   = 0.82;
            this.scale  = rand(0.7, 1.4);
        }
        update() {
            this.y     += this.speedY;
            this.x     += this.speedX;
            this.rot   += this.rotSpd;
            this.alpha += this.aDir;
            if (this.alpha > this.aMax || this.alpha < this.aMin) this.aDir *= -1;
            if (this.y > canvas.height + 40) this.reset(false);
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot);
            ctx.scale(this.scale, this.scale);
            ctx.globalAlpha  = this.alpha;
            ctx.fillStyle    = '#ffffff';
            ctx.font         = `${this.size}px serif`;
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.sym, 0, 0);
            ctx.restore();
        }
    }

    /* More particles for a dense rain */
    const particles = Array.from({ length: 120 }, () => new Particle());

    (function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    })();

    /* ── 3D Parallax tilt — card follows mouse in real time ── */
    const cardScene   = document.getElementById('cardScene');
    const profileCard = document.getElementById('profileCard');

    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;
    let cardHovering = false;
    let tiltRAF = null;

    function animateTilt() {
        /* Lerp — fast when hovering, slow spring return when not */
        const lerpFactor = cardHovering ? 0.10 : 0.055;
        currentRotX += (targetRotX - currentRotX) * lerpFactor;
        currentRotY += (targetRotY - currentRotY) * lerpFactor;

        const stillMoving = Math.abs(currentRotX) > 0.02 || Math.abs(currentRotY) > 0.02;

        if (profileCard) {
            profileCard.style.transform =
                `rotateY(${currentRotY.toFixed(2)}deg) rotateX(${currentRotX.toFixed(2)}deg) scale(${cardHovering ? 1.015 : 1})`;
        }

        if (cardHovering || stillMoving) {
            tiltRAF = requestAnimationFrame(animateTilt);
        } else {
            /* Fully back to normal — clear inline style */
            if (profileCard) profileCard.style.transform = '';
            tiltRAF = null;
        }
    }

    function startTilt() {
        if (!tiltRAF) tiltRAF = requestAnimationFrame(animateTilt);
    }

    if (cardScene && profileCard) {
        /* Remove any CSS transition — JS lerp handles smoothness */
        profileCard.style.transition = 'box-shadow 0.4s ease';

        cardScene.addEventListener('mouseenter', () => {
            cardHovering = true;
            profileCard.classList.add('hovered');
            startTilt();
        });

        cardScene.addEventListener('mousemove', e => {
            const rect     = cardScene.getBoundingClientRect();
            const centerX  = rect.left + rect.width  / 2;
            const centerY  = rect.top  + rect.height / 2;
            const normX    = (e.clientX - centerX) / (rect.width  / 2); /* -1 … 1 */
            const normY    = (e.clientY - centerY) / (rect.height / 2); /* -1 … 1 */

            targetRotY =  normX * 22;   /* max ±22° left-right */
            targetRotX = -normY * 13;   /* max ±13° up-down    */
        });

        cardScene.addEventListener('mouseleave', () => {
            cardHovering = false;
            targetRotX = 0;
            targetRotY = 0;
            profileCard.classList.remove('hovered');
            startTilt(); /* keep animating until card springs back */
        });
    }

    /* ── Click To Enter overlay ── */
    const overlay  = document.getElementById('enterOverlay');
    const enterBtn = document.getElementById('enterBtn');
    const audio    = document.getElementById('bgAudio');
    const mIcon    = document.getElementById('musicIcon');
    let   musicOn  = false;

    function tryPlayMusic() {
        if (!audio || musicOn) return;
        audio.volume = 0.18;
        audio.play().then(() => {
            musicOn = true;
            if (mIcon) mIcon.className = 'fas fa-volume-high';
        }).catch(() => {});
    }

    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            overlay.classList.add('fade-out');
            tryPlayMusic();
            setTimeout(() => {
                if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 700);
        });
    }

    /* ── Typewriter for name ── */
    const nameEl = document.getElementById('typedName');
    const NAME   = 'angel';
    let ni = 0;

    function typeName() {
        if (!nameEl) return;
        if (ni <= NAME.length) {
            nameEl.textContent = NAME.slice(0, ni);
            ni++;
            setTimeout(typeName, 105);
        }
    }
    setTimeout(typeName, 500);

    /* ── Tabs ── */
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const panel = document.getElementById('tab-' + btn.dataset.tab);
            if (panel) panel.classList.add('active');
        });
    });

    /* ── Visitor counter ── */
    fetch('/api/visitors', { method: 'POST' })
        .then(r => r.json())
        .then(data => {
            const el = document.getElementById('visitorCount');
            if (!el) return;
            const target = data.count || 0;
            const step   = Math.max(1, Math.floor(target / 40));
            let count    = 0;
            const t = setInterval(() => {
                count = Math.min(count + step, target);
                el.textContent = count.toLocaleString();
                if (count >= target) clearInterval(t);
            }, 35);
        })
        .catch(() => {});

    /* ── Music toggle button ── */
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

})();
