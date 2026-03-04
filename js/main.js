document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));

    // Dynamic Code Rain Effect for Hero
    const codeStreamContainer = document.querySelector('.code-stream');
    
    function createCodeDrop() {
        const span = document.createElement('span');
        span.textContent = Math.random() > 0.5 ? '1' : '0';
        span.style.left = Math.random() * 100 + '%';
        span.style.animationDuration = (Math.random() * 2 + 1) + 's';
        span.style.opacity = Math.random();
        span.style.fontSize = (Math.random() * 0.5 + 0.5) + 'rem';
        
        codeStreamContainer.appendChild(span);

        setTimeout(() => {
            span.remove();
        }, 3000);
    }

    // Create drops periodically
    setInterval(createCodeDrop, 100);

    // Glitch Text Randomizer (Optional extra flair)
    const glitchText = document.querySelector('.glitch');
    if (glitchText) {
        setInterval(() => {
            const original = glitchText.getAttribute('data-text');
            // Occasionally scramble text
            if (Math.random() > 0.95) {
                glitchText.classList.add('scramble');
                setTimeout(() => glitchText.classList.remove('scramble'), 200);
            }
        }, 2000);
    }
});
