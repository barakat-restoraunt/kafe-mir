document.addEventListener('DOMContentLoaded', () => {

    // ==================== LANGUAGE SWITCHING ====================

    const langBtns = document.querySelectorAll('.lang-btn');

    function switchLanguage(lang) {
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;

        document.querySelectorAll('[data-' + lang + ']').forEach(el => {
            const text = el.getAttribute('data-' + lang);
            if (text) el.textContent = text;
        });

        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
    });

    // ==================== SMOOTH SCROLL ====================

    const dropdown = document.querySelector('.nav-dropdown');
    const dropdownToggle = document.querySelector('.nav-dropdown__toggle');

    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (dropdown) dropdown.classList.toggle('active');
        });
    }

    document.addEventListener('click', function(e) {
        if (dropdown && !dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            if (anchor.classList.contains('nav-dropdown__toggle')) return;
            e.preventDefault();
            if (dropdown) dropdown.classList.remove('active');
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const isMobile = window.innerWidth <= 768;
                const offset = isMobile ? 120 : 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ==================== ACTIVE NAV LINK ====================

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    let ticking = false;

    function updateActiveNav() {
        const scrollY = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateActiveNav);
            ticking = true;
        }
    });

    // ==================== SCROLL REVEAL ====================

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.about__card, .contact__card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.5s ease';
        observer.observe(el);
    });

    // ==================== LIGHTBOX ====================

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox__img');
    const lightboxClose = document.querySelector('.lightbox__close');
    const lightboxOverlay = document.querySelector('.lightbox__overlay');

    if (lightbox && lightboxImg && lightboxClose && lightboxOverlay) {
        document.querySelectorAll('.photo img').forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                lightboxImg.src = this.src;
                lightboxImg.alt = this.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxOverlay.addEventListener('click', closeLightbox);

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

});
