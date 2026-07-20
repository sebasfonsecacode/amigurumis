/* =========================================
   AMIGURUMI LANDING - JS optimizado
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. CONTADORES REGRESIVOS
       ========================================= */
    const createCountdown = (endDate, prefix) => {
        const update = () => {
            const diff = endDate - new Date();
            if (diff <= 0) {
                ['d', 'h', 'm', 's'].forEach(u => {
                    const el = document.getElementById(`${prefix}-${u}`);
                    if (el) el.textContent = '00';
                });
                return;
            }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            ['d', 'h', 'm', 's'].forEach((u, i) => {
                const el = document.getElementById(`${prefix}-${u}`);
                if (el) el.textContent = String([d, h, m, s][i]).padStart(2, '0');
            });
        };
        update();
        setInterval(update, 1000);
    };

    const offerEnd = new Date();
    offerEnd.setHours(offerEnd.getHours() + 22);
    offerEnd.setMinutes(offerEnd.getMinutes() + 43);
    createCountdown(offerEnd, 'c1');
    createCountdown(offerEnd, 'c2');

    /* =========================================
       2. CONTADOR "VENDIDOS EN 24H" (dinámico)
       ========================================= */
    const stockEl = document.querySelector('.urgency-stock');
    if (stockEl) {
        setInterval(() => {
            const num = 87 + Math.floor(Math.random() * 10) - 5;
            stockEl.innerHTML = `✅ <strong>${num} e-books</strong> vendidos en las últimas 24h`;
        }, 8000);
    }

    /* =========================================
       2.1 SCARCITY - Cupos disponibles (decreciente)
       ========================================= */
    let spotsRemaining = 27;
    const spotsEl = document.getElementById('hero-spots');
    if (spotsEl) {
        setInterval(() => {
            // Decrementar aleatoriamente cada 30-60 segundos
            if (Math.random() < 0.3 && spotsRemaining > 5) {
                spotsRemaining--;
                spotsEl.textContent = spotsRemaining;
            }
        }, 25000);
    }

    /* =========================================
       2.2 SCARCITY - Visores en vivo (aleatorio)
       ========================================= */
    const viewersEls = document.querySelectorAll('.viewers-count');
    if (viewersEls.length > 0) {
        setInterval(() => {
            const num = 8 + Math.floor(Math.random() * 12);
            viewersEls.forEach(el => {
                el.textContent = num;
            });
        }, 7000);
    }

    /* =========================================
       3. BOTÓN FLOTANTE
       ========================================= */
    const floatingCta = document.getElementById('floatingCta');
    window.addEventListener('scroll', () => {
        floatingCta?.classList.toggle('visible', window.scrollY > 600);
    });

    /* =========================================
       4. MODAL - Solo si NO compra en 2 minutos
       ========================================= */
    const exitModal = document.getElementById('exitModal');
    const bsModal = exitModal ? new bootstrap.Modal(exitModal, { backdrop: true, keyboard: true }) : null;
    let modalShown = false;
    let userClickedCTA = false;

    setTimeout(() => {
        if (!userClickedCTA && !modalShown) {
            console.log('⏰ 2 min sin compra → mostrar modal');
            modalShown = true;
            bsModal?.show();
        } else {
            console.log('✅ Usuario ya hizo click o ya vio modal');
        }
    }, 2 * 60 * 1000);

    /* =========================================
       5. SCROLL REVEAL
       ========================================= */
    const revealEls = document.querySelectorAll('.ebook-img, .cat-card, .bonus-card, .product-box, .testimonial, .gb-circle, .bonus-value, .benefit-item, .step-item, .scarcity-bar, .guarantee-final-img');
    revealEls.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach(el => observer.observe(el));

    /* =========================================
       6. SMOOTH SCROLL
       ========================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const pos = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: pos, behavior: 'smooth' });
            }
        });
    });

    /* =========================================
       7. EBOOK 3D TILT
       ========================================= */
    const ebook = document.querySelector('.ebook-img');
    if (ebook) {
        ebook.addEventListener('mousemove', (e) => {
            const r = ebook.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            ebook.style.transform = `perspective(1000px) rotateX(${-y/30}deg) rotateY(${x/30}deg) rotate(-2deg)`;
        });
        ebook.addEventListener('mouseleave', () => {
            ebook.style.transform = 'rotate(-2deg)';
        });
    }

    /* =========================================
       8. TRACKING DE CLICKS EN CTA
       ========================================= */
    document.querySelectorAll('a[href*="hotmart.com"]').forEach(btn => {
        btn.addEventListener('click', () => {
            userClickedCTA = true;
            console.log('🛒 CTA click:', btn.href);
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click_cta', { event_category: 'Hotmart', event_label: btn.textContent.trim() });
            }
            if (typeof fbq !== 'undefined') {
                fbq('track', 'InitiateCheckout');
            }
        });
    });

    /* =========================================
       9. VIDEO TRACKING
       ========================================= */
    const video = document.querySelector('.local-video');
    video?.addEventListener('play', () => {
        if (typeof gtag !== 'undefined') gtag('event', 'video_play', { event_category: 'Engagement' });
        if (typeof fbq !== 'undefined') fbq('track', 'ViewContent');
    });

    console.log('%c🧶 Landing cargada - Modal: 2 min sin click en CTA', 'font-size:16px;font-weight:bold;color:#4FD1D1;');
});
