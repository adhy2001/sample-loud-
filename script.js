/* ========================================
   LOUD IMC - Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initAOS();
    initCounters();
    initContactForm();
    initParticles();
    initSliderDuplicate();
    initHeroTitleSlider();
    initEmailJS();
});

/* Navbar scroll effect */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* AOS (Animate On Scroll) */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            offset: 50,
            once: true
        });
    }
}

/* Counter animation */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target')) || 0;
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(updateCounter);
}

/* Contact form */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        const formData = new FormData(form);

        sendEmail(formData)
            .then(() => {
                btn.textContent = 'Message Sent!';
                form.reset();
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 2000);
            })
            .catch((error) => {
                console.error('Email send failed:', error);
                btn.textContent = 'Error! Try again.';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 2000);
            });
    });
}

/* Hero particles effect */
function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const particleCount = 30;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(245, 158, 11, ${Math.random() * 0.4 + 0.15});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 15}s linear infinite;
        `;
        container.appendChild(particle);
        particles.push(particle);
    }

    // Add keyframes if not present
    if (!document.getElementById('particleStyles')) {
        const style = document.createElement('style');
        style.id = 'particleStyles';
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
                25% { transform: translate(20px, -30px) scale(1.1); opacity: 0.8; }
                50% { transform: translate(-15px, 20px) scale(0.9); opacity: 0.5; }
                75% { transform: translate(10px, 10px) scale(1.05); opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
    }
}

/* Hero title slide / fade between two titles */
function initHeroTitleSlider() {
    const titles = document.querySelectorAll('.hero-title-slider .hero-title');
    if (!titles.length) return;

    let index = 0;
    const interval = 5000;

    function showNext() {
        titles[index].classList.remove('hero-title-active');
        index = (index + 1) % titles.length;
        titles[index].classList.add('hero-title-active');
    }

    setInterval(showNext, interval);
}

/* Duplicate slider items for seamless loop */
function initSliderDuplicate() {
    const track = document.querySelector('.logo-slider');
    if (!track) return;

    const items = track.innerHTML;
    track.innerHTML = items + items;
}

/* Initialize EmailJS */
function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init('ccfQDRGlwLw9SQUgK'); // Public Key
    }
}

/* Send email via EmailJS */
function sendEmail(formData) {
    const templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    return emailjs.send('service_3tsy1wk', 'template_6vy4lo5', templateParams);
}
