document.addEventListener('DOMContentLoaded', () => {

    /* ─── Scroll Progress Bar ─── */
    const progressBar = document.getElementById('scroll-progress');
    const scrollTopBtn = document.getElementById('scroll-top');
    const header = document.getElementById('header');

    const onScroll = () => {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (progressBar) progressBar.style.width = `${(scrolled / total) * 100}%`;
        if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', scrolled > 400);
        if (header) header.classList.toggle('scrolled', scrolled > 60);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    /* ─── Scroll to Top ─── */
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ─── Hero Canvas — Particle Network ─── */
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, particles;
        const PARTICLE_COUNT = 70;
        const MAX_DIST = 140;
        const COLOR = '0, 255, 136';

        const resize = () => {
            W = canvas.width  = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        };

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x  = Math.random() * W;
                this.y  = Math.random() * H;
                this.vx = (Math.random() - 0.5) * 0.45;
                this.vy = (Math.random() - 0.5) * 0.45;
                this.r  = Math.random() * 1.6 + 0.6;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > W) this.vx *= -1;
                if (this.y < 0 || this.y > H) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${COLOR}, 0.7)`;
                ctx.fill();
            }
        }

        const init = () => {
            resize();
            particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
        };

        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MAX_DIST) {
                        const alpha = (1 - dist / MAX_DIST) * 0.22;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${COLOR}, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        };

        let animId;
        const animate = () => {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            animId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', () => { resize(); });

        init();
        animate();
    }

    /* ─── Cursor Glow ─── */
    const glow = document.getElementById('cursor-glow');
    if (glow) {
        window.addEventListener('pointermove', (e) => {
            glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        }, { passive: true });
    }

    /* ─── AOS (Intersection Observer) ─── */
    const aosElements = document.querySelectorAll('[data-aos]');
    const aosObserver = new IntersectionObserver((entries, io) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    aosElements.forEach(el => aosObserver.observe(el));

    /* ─── Typing Animation ─── */
    const typedEl = document.getElementById('typed-text');
    if (typedEl) {
        const phrases = [
            'Not your key, not your data.',
            'Encrypted before it leaves your device.',
            'Zero knowledge. Total control.',
            'Your vault. Your rules.',
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let deleting = false;
        let pause = false;

        const type = () => {
            const phrase = phrases[phraseIndex];
            if (!deleting) {
                typedEl.textContent = phrase.slice(0, charIndex + 1);
                charIndex++;
                if (charIndex === phrase.length) {
                    pause = true;
                    setTimeout(() => { pause = false; deleting = true; setTimeout(type, 60); }, 2200);
                    return;
                }
            } else {
                typedEl.textContent = phrase.slice(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    deleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                }
            }
            if (!pause) setTimeout(type, deleting ? 38 : 58);
        };

        setTimeout(type, 1200);
    }

    /* ─── Code Stream (hero lock) ─── */
    const stream = document.querySelector('.code-stream');
    const cryptoWords = ['AES-256', 'GCM', 'ARGON2ID', 'RSA-4096', 'NONCE', 'TAG', 'CHUNK', 'LOCKED', 'E2E', 'VAULT', 'OAEP', 'SHA256'];
    if (stream) {
        setInterval(() => {
            const drop = document.createElement('span');
            drop.className = 'code-drop';
            drop.textContent = cryptoWords[Math.floor(Math.random() * cryptoWords.length)];
            drop.style.left = `${Math.random() * 88 + 6}%`;
            drop.style.animationDuration = `${Math.random() * 2 + 1.8}s`;
            drop.style.fontSize = `${Math.random() * 0.3 + 0.6}rem`;
            stream.appendChild(drop);
            setTimeout(() => drop.remove(), 3000);
        }, 110);
    }

    /* ─── Counter Animation ─── */
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, io) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const node = entry.target;
            const target = Number(node.getAttribute('data-target')) || 0;
            const duration = 1600;
            const start = performance.now();
            const tick = (now) => {
                const ratio = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - ratio, 4);
                node.textContent = Math.floor(target * eased).toLocaleString();
                if (ratio < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.unobserve(node);
        });
    }, { threshold: 0.6 });
    counters.forEach(c => counterObserver.observe(c));

    /* ─── 3D Tilt on Hero Visual ─── */
    const tilt = document.getElementById('tilt-shell');
    if (tilt) {
        tilt.addEventListener('mousemove', (e) => {
            const rect = tilt.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            tilt.style.transform = `rotateX(${(-y * 16).toFixed(2)}deg) rotateY(${(x * 16).toFixed(2)}deg)`;
        });
        tilt.addEventListener('mouseleave', () => {
            tilt.style.transform = 'rotateX(0deg) rotateY(0deg)';
            tilt.style.transition = 'transform 0.6s ease';
        });
        tilt.addEventListener('mouseenter', () => {
            tilt.style.transition = 'transform 0.1s linear';
        });
    }

    /* ─── Magnetic Buttons ─── */
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    /* ─── Pipeline Scroll Progress ─── */
    const pipelineProgress = document.querySelector('.pipeline-progress');
    if (pipelineProgress) {
        const updatePipeline = () => {
            const track = pipelineProgress.parentElement;
            if (!track) return;
            const rect = track.getBoundingClientRect();
            const vh = window.innerHeight;
            const visible = Math.min(Math.max((vh - rect.top) / (rect.height + vh * 0.4), 0), 1);
            pipelineProgress.style.transform = `scaleY(${visible.toFixed(3)})`;
        };
        updatePipeline();
        window.addEventListener('scroll', updatePipeline, { passive: true });
        window.addEventListener('resize', updatePipeline);
    }

    /* ─── Chunk Animation ─── */
    const chunkItems = document.querySelectorAll('.chunk-item');
    if (chunkItems.length > 0) {
        let ci = 0;
        setInterval(() => {
            chunkItems.forEach(item => item.classList.remove('active'));
            chunkItems[ci].classList.add('active');
            ci = (ci + 1) % chunkItems.length;
        }, 500);
    }

    /* ─── Mobile Hamburger Menu ─── */
    const hamburger = document.getElementById('hamburger');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

    const closeMenu = () => {
        hamburger?.classList.remove('open');
        mobileOverlay?.classList.remove('open');
        document.body.style.overflow = '';
    };

    hamburger?.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        mobileOverlay?.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileOverlay?.addEventListener('click', (e) => {
        if (e.target === mobileOverlay) closeMenu();
    });

    mobileNavLinks.forEach(link => link.addEventListener('click', closeMenu));

    /* ─── Stat Bar Animation ─── */
    const statBars = document.querySelectorAll('.stat-bar-fill');
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.5 });
    statBars.forEach(bar => {
        bar.style.animationPlayState = 'paused';
        barObserver.observe(bar);
    });

});
