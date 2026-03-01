document.addEventListener('DOMContentLoaded', function () {

    // =============================================
    // I18N — INTERNATIONALIZATION ENGINE
    // =============================================
    const SUPPORTED_LANGS = ['pt', 'en', 'es', 'fr', 'it'];
    const LANG_FLAGS = { pt: '🇧🇷', en: '🇬🇧', es: '🇪🇸', fr: '🇫🇷', it: '🇮🇹' };

    let currentLang = 'pt';
    let typedInstance = null;

    function detectLanguage() {
        // Priority: 1) localStorage, 2) browser language, 3) default (pt)
        const saved = localStorage.getItem('lang');
        if (saved && SUPPORTED_LANGS.includes(saved)) return saved;

        const browserLang = navigator.language || navigator.userLanguage || 'pt';
        const shortLang = browserLang.split('-')[0].toLowerCase();

        if (SUPPORTED_LANGS.includes(shortLang)) return shortLang;
        return 'pt';
    }

    function applyTranslations(lang) {
        if (!translations || !translations[lang]) return;
        const t = translations[lang];
        currentLang = lang;
        localStorage.setItem('lang', lang);

        // Update HTML lang attribute
        document.documentElement.lang = lang === 'pt' ? 'pt-br' : lang;

        // Translate elements with data-i18n (textContent)
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.textContent = t[key];
        });

        // Translate elements with data-i18n-html (innerHTML — for bold/spans)
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (t[key]) el.innerHTML = t[key];
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (t[key]) el.placeholder = t[key];
        });

        // Update current flag in selector
        const flagEl = document.getElementById('lang-current-flag');
        if (flagEl) flagEl.textContent = LANG_FLAGS[lang] || '🌐';

        // Mark active language in dropdown
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.lang === lang);
        });

        // Restart typing effect with new strings
        restartTypingEffect(lang);
    }

    function restartTypingEffect(lang) {
        const t = translations[lang];
        if (!t) return;

        const typingElement = document.getElementById('typing-effect');
        if (!typingElement || typeof Typed === 'undefined') return;

        // Destroy old instance
        if (typedInstance) {
            typedInstance.destroy();
        }

        typingElement.textContent = '';

        const strings = JSON.parse(t.typing_strings);

        typedInstance = new Typed('#typing-effect', {
            strings: strings,
            typeSpeed: 45,
            backSpeed: 25,
            backDelay: 2000,
            startDelay: 300,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }

    // Language Selector UI
    const langSelectorBtn = document.getElementById('lang-selector-btn');
    const langDropdown = document.getElementById('lang-dropdown');

    if (langSelectorBtn && langDropdown) {
        langSelectorBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('visible');
        });

        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.addEventListener('click', () => {
                const lang = opt.dataset.lang;
                applyTranslations(lang);
                langDropdown.classList.remove('visible');
            });
        });

        // Close dropdown on outside click
        document.addEventListener('click', () => {
            langDropdown.classList.remove('visible');
        });
    }

    // Initialize language
    const detectedLang = detectLanguage();
    applyTranslations(detectedLang);

    // =============================================
    // THEME TOGGLE
    // =============================================
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark-theme');
    }
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const theme = document.documentElement.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
    });

    // =============================================
    // MOBILE MENU
    // =============================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // =============================================
    // NAVBAR SCROLL EFFECT
    // =============================================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // =============================================
    // ACTIVE NAV LINK HIGHLIGHT
    // =============================================
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

    sections.forEach(section => navObserver.observe(section));

    // =============================================
    // SCROLL REVEAL ANIMATIONS
    // =============================================
    const sectionElements = document.querySelectorAll('.section');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                const cards = entry.target.querySelectorAll(
                    '.project-card, .skill-card, .stat-card, .language-card, .timeline-item'
                );
                cards.forEach((card, index) => {
                    const delay = parseInt(card.dataset.delay || index) * 100;
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, delay);
                });
            }
        });
    }, { threshold: 0.08 });

    sectionElements.forEach(section => sectionObserver.observe(section));

    // =============================================
    // TIMELINE ITEMS ANIMATION
    // =============================================
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => timelineObserver.observe(item));

    // =============================================
    // STATS COUNTER ANIMATION
    // =============================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.getElementById('stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateCounters() {
        statNumbers.forEach(num => {
            const target = parseInt(num.dataset.target);
            const suffix = num.dataset.suffix || '';
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                num.textContent = Math.floor(current) + suffix;
            }, 16);
        });
    }

    // =============================================
    // LANGUAGE BARS ANIMATION
    // =============================================
    const langFills = document.querySelectorAll('.lang-fill');

    const langObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.lang-fill');
                fills.forEach((fill, index) => {
                    setTimeout(() => {
                        fill.style.width = fill.dataset.level + '%';
                    }, index * 200);
                });
                langObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const langSection = document.getElementById('languages');
    if (langSection) {
        langObserver.observe(langSection);
    }

    // =============================================
    // BACK TO TOP BUTTON
    // =============================================
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            backToTopButton.classList.toggle('visible', window.scrollY > 400);
        });
    }

    // =============================================
    // CONTACT FORM (Web3Forms)
    // =============================================
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const t = translations[currentLang] || translations.pt;
            const formData = new FormData(form);
            formData.set('access_key', '16ec7e46-8ddb-4992-99ef-187214c00a94');
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            formStatus.innerHTML = t.form_sending;
            formStatus.style.color = 'var(--accent-secondary)';

            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
                .then(async (response) => {
                    const data = await response.json();
                    if (response.status === 200) {
                        formStatus.innerHTML = t.form_success;
                        formStatus.style.color = 'var(--accent-success)';
                    } else {
                        formStatus.innerHTML = data.message || t.form_error;
                        formStatus.style.color = 'var(--accent-tertiary)';
                    }
                })
                .catch(() => {
                    formStatus.innerHTML = t.form_error;
                    formStatus.style.color = 'var(--accent-tertiary)';
                })
                .finally(() => {
                    if (submitBtn) submitBtn.disabled = false;
                    form.reset();
                    setTimeout(() => {
                        formStatus.innerHTML = '';
                    }, 6000);
                });
        });
    }

    // =============================================
    // PARALLAX EFFECT ON HERO (subtle)
    // =============================================
    const heroContent = document.querySelector('.hero-content');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (heroContent && !prefersReducedMotion) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                const translateY = scrolled * 0.3;
                const opacity = 1 - (scrolled / window.innerHeight) * 0.6;
                heroContent.style.transform = `translateY(${translateY}px)`;
                heroContent.style.opacity = opacity;
            }
        });
    }
});