document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('[data-aos]');
    const observer = new IntersectionObserver(
        (entries, io) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    io.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.16 }
    );
    animatedElements.forEach((el) => observer.observe(el));

    const stream = document.querySelector('.code-stream');
    const words = ['AES-256', 'GCM', 'ARGON2ID', 'RSA-4096', 'NONCE', 'TAG', 'CHUNK', 'LOCKED', 'E2E'];
    if (stream) {
        setInterval(() => {
            const drop = document.createElement('span');
            drop.className = 'code-drop';
            drop.textContent = words[Math.floor(Math.random() * words.length)];
            drop.style.left = `${Math.random() * 92 + 4}%`;
            drop.style.animationDuration = `${Math.random() * 1.7 + 1.6}s`;
            drop.style.fontSize = `${Math.random() * 0.35 + 0.62}rem`;
            stream.appendChild(drop);
            setTimeout(() => {
                drop.remove();
            }, 2600);
        }, 95);
    }

    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver(
        (entries, io) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }
                const node = entry.target;
                const target = Number(node.getAttribute('data-target')) || 0;
                const duration = 1500;
                const start = performance.now();
                const tick = (time) => {
                    const ratio = Math.min((time - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - ratio, 3);
                    node.textContent = Math.floor(target * eased).toLocaleString();
                    if (ratio < 1) {
                        requestAnimationFrame(tick);
                    }
                };
                requestAnimationFrame(tick);
                io.unobserve(node);
            });
        },
        { threshold: 0.65 }
    );
    counters.forEach((counter) => counterObserver.observe(counter));

    const tilt = document.getElementById('tilt-shell');
    if (tilt) {
        tilt.addEventListener('mousemove', (event) => {
            const rect = tilt.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            tilt.style.transform = `rotateX(${(-y * 14).toFixed(2)}deg) rotateY(${(x * 14).toFixed(2)}deg)`;
        });
        tilt.addEventListener('mouseleave', () => {
            tilt.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }

    const glow = document.querySelector('.cursor-glow');
    if (glow) {
        window.addEventListener('pointermove', (event) => {
            glow.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
        });
    }

    const magneticButtons = document.querySelectorAll('.magnetic');
    magneticButtons.forEach((button) => {
        button.addEventListener('mousemove', (event) => {
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            button.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });

    const progress = document.querySelector('.pipeline-progress');
    if (progress) {
        const updateProgress = () => {
            const track = progress.parentElement;
            if (!track) {
                return;
            }
            const rect = track.getBoundingClientRect();
            const vh = window.innerHeight;
            const visible = Math.min(Math.max((vh - rect.top) / (rect.height + vh * 0.4), 0), 1);
            progress.style.transform = `scaleY(${visible.toFixed(3)})`;
        };
        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
    }

    const chunkItems = document.querySelectorAll('.chunk-item');
    if (chunkItems.length > 0) {
        let chunkIndex = 0;
        setInterval(() => {
            chunkItems.forEach((item) => item.classList.remove('active'));
            chunkItems[chunkIndex].classList.add('active');
            chunkIndex = (chunkIndex + 1) % chunkItems.length;
        }, 520);
    }
});
