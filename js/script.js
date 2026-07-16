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

    document.querySelectorAll('.about__card, .contact__card, .menu-category').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // ==================== LAZY LOAD IMAGES ====================

    const lazyImages = document.querySelectorAll('.photo img');

    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    img.addEventListener('load', function() {
                        this.classList.remove('lazy');
                        this.classList.add('loaded');
                    });
                    imgObserver.unobserve(img);
                }
            });
        }, { rootMargin: '200px 0px' });

        lazyImages.forEach(img => {
            const src = img.getAttribute('src');
            if (src) {
                img.setAttribute('data-src', src);
                img.removeAttribute('src');
                img.classList.add('lazy');
            }
            imgObserver.observe(img);
        });
    } else {
        lazyImages.forEach(img => {
            img.classList.add('loaded');
        });
    }

    // ==================== LIGHTBOX ====================

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox__img');
    const lightboxClose = document.querySelector('.lightbox__close');
    const lightboxOverlay = document.querySelector('.lightbox__overlay');
    const lightboxName = document.querySelector('.lightbox__name');
    const lightboxDesc = document.querySelector('.lightbox__desc');
    const lightboxPrice = document.querySelector('.lightbox__price');

    if (lightbox && lightboxImg && lightboxClose && lightboxOverlay) {
        document.querySelectorAll('.card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function(e) {
                e.stopPropagation();
                const img = this.querySelector('.photo img');
                const name = this.querySelector('.name');
                const desc = this.querySelector('.desc');
                const price = this.querySelector('.price');
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                }
                if (name) lightboxName.textContent = name.textContent;
                if (desc) lightboxDesc.textContent = desc.textContent;
                if (price) lightboxPrice.textContent = price.textContent;
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

    // ==================== SCROLL TO TOP ====================

    const scrollTopBtn = document.getElementById('scrollTop');

    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});
