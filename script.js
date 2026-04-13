'use strict';

/* =========================================
   Communist Youth Union — Interactive JS
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Navbar scroll behaviour ──────────────────────────────
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    }, { passive: true });


    // ── 2. Mobile menu ──────────────────────────────────────────
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('mobile-open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-open');
            navToggle.classList.remove('open');
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            navLinks.classList.remove('mobile-open');
            navToggle.classList.remove('open');
        }
    });


    // ── 3. Hero particles ───────────────────────────────────────
    const particleContainer = document.getElementById('heroParticles');
    if (particleContainer) {
        const colours = ['rgba(196,30,58,', 'rgba(212,175,55,', 'rgba(255,255,255,'];
        for (let i = 0; i < 28; i++) {
            const p = document.createElement('span');
            const size = Math.random() * 4 + 1.5;
            const col  = colours[Math.floor(Math.random() * colours.length)];
            const dur  = Math.random() * 18 + 10;
            const delay = Math.random() * 10;
            p.style.cssText = `
                position:absolute;
                width:${size}px; height:${size}px;
                border-radius:50%;
                background:${col}${(Math.random() * 0.3 + 0.1)});
                top:${Math.random() * 100}%;
                left:${Math.random() * 100}%;
                animation: floatParticle ${dur}s ${delay}s linear infinite;
                pointer-events:none;
            `;
            particleContainer.appendChild(p);
        }
    }

    // Inject particle keyframe once
    injectCSS(`
        @keyframes floatParticle {
            0%   { transform: translate(0,0) scale(1); opacity:0; }
            10%  { opacity:1; }
            90%  { opacity:0.6; }
            100% { transform: translate(${rand(-80,80)}px, -120px) scale(0.3); opacity:0; }
        }
    `);


    // ── 4. Parallax hero ────────────────────────────────────────
    const heroParallax = document.getElementById('heroParallax');
    if (heroParallax) {
        window.addEventListener('scroll', () => {
            const offset = window.scrollY;
            if (offset < window.innerHeight * 1.5) {
                heroParallax.style.transform = `translateY(${offset * 0.35}px)`;
            }
        }, { passive: true });
    }


    // ── 5. Scroll-reveal animations ─────────────────────────────
    const animatedEls = document.querySelectorAll('[data-animate]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el    = entry.target;
            const delay = parseInt(el.dataset.delay || '0', 10);

            setTimeout(() => {
                el.classList.add('is-visible');
            }, delay);

            revealObserver.unobserve(el);
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    animatedEls.forEach(el => revealObserver.observe(el));


    // ── 6. Animated counters ────────────────────────────────────
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));

    function animateCounter(el) {
        const target   = parseInt(el.dataset.count, 10);
        const duration = target > 100 ? 2200 : 1600;
        const start    = performance.now();

        function update(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
                // Add '+' suffix for branches counter
                if (el.dataset.count === '15') {
                    el.textContent = '15+';
                }
            }
        }
        requestAnimationFrame(update);
    }


    // ── 7. Active nav link on scroll ────────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navAnchors.forEach(a => {
                    a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));

    injectCSS(`
        .nav-links a.active-link { color: var(--gold) !important; }
        .nav-links a.active-link::after { width: 100% !important; }
    `);


    // ── 8. Vision cards staggered entrance ──────────────────────
    const visionCards = document.querySelectorAll('.vision-card');
    const visionObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            visionCards.forEach((card, i) => {
                card.style.transition =
                    `opacity 0.6s ease ${i * 90}ms, transform 0.6s ease ${i * 90}ms`;
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
            visionObserver.disconnect();
        }
    }, { threshold: 0.1 });

    // Set initial state
    visionCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
    });

    const visionSection = document.getElementById('vision');
    if (visionSection) visionObserver.observe(visionSection);


    // ── 9. Activity cards stagger ───────────────────────────────
    const activityCards = document.querySelectorAll('.activity-card');
    const activityObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            activityCards.forEach((card, i) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, i * 80);
            });
            activityObserver.disconnect();
        }
    }, { threshold: 0.05 });

    activityCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const activitiesSection = document.getElementById('activities');
    if (activitiesSection) activityObserver.observe(activitiesSection);


    // ── 10. Gallery hover ripple effect ─────────────────────────
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.zIndex = '2';
        });
        item.addEventListener('mouseleave', () => {
            item.style.zIndex = '1';
        });
    });


    // ── 11. Smooth scroll for anchor links ──────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    // ── 12. Join form submission ─────────────────────────────────
    const joinForm   = document.getElementById('joinForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn  = joinForm?.querySelector('.btn-submit');

    if (joinForm) {
        joinForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name  = joinForm.querySelector('#name').value.trim();
            const phone = joinForm.querySelector('#phone').value.trim();
            const email = joinForm.querySelector('#email').value.trim();

            // Basic validation
            if (!name || !phone || !email) {
                showFormStatus('الرجاء تعبئة جميع الحقول المطلوبة.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showFormStatus('الرجاء إدخال بريد إلكتروني صحيح.', 'error');
                return;
            }

            // Loading state
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            hideFormStatus();

            // Simulate API call (replace with real endpoint)
            await sleep(1600);

            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');

            showFormStatus(
                `شكراً لك يا رفيق ${name}! 🎉 تم استلام طلب انتسابك بنجاح. سنتواصل معك قريباً على ${email}.`,
                'success'
            );

            joinForm.reset();

            // Hide status after 8 seconds
            setTimeout(hideFormStatus, 8000);
        });
    }

    function showFormStatus(msg, type) {
        if (!formStatus) return;
        formStatus.textContent = msg;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideFormStatus() {
        if (!formStatus) return;
        formStatus.style.display = 'none';
        formStatus.className = 'form-status';
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }


    // ── 13. Subtle section entrance lines ───────────────────────
    injectCSS(`
        .section { position: relative; }
        .stats-section { overflow: hidden; }
    `);


    // ── Helpers ─────────────────────────────────────────────────
    function injectCSS(css) {
        const s = document.createElement('style');
        s.textContent = css;
        document.head.appendChild(s);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

});
