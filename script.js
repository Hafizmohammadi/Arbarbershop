// ===== NAV MENU =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navLinks');

function setNavOpen(isOpen) {
    navMenu.classList.toggle('open', isOpen);
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

navToggle.addEventListener('click', () => {
    setNavOpen(!navMenu.classList.contains('open'));
});

navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => setNavOpen(false));
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) setNavOpen(false);
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    const scrollY = window.scrollY;
    const navHeight = 70;
    let current = sections[0].id;

    sections.forEach(section => {
        if (scrollY >= section.offsetTop - navHeight - 1) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// ===== HERO ARROW =====
document.querySelector('.hero-arrow').addEventListener('click', () => {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
});

// ===== EMAILJS =====
emailjs.init('QDMidID7hnycWGx7Y');

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.submit-btn');
    const data = Object.fromEntries(new FormData(form));

    const result = await emailjs.send('service_28fnjhd', 'template_97vlqtd', {
        full_name: `${data['First Name']} ${data['Last Name']}`,
        phone: '',
        email: data['Email'] || 'Not provided',
        service: data['Subject'] || 'Contact Form',
        date: '',
        time: '',
        notes: data['Message'] || 'No message'
    });

    if (result.status === 200) {
        btn.textContent = 'Sent!';
        btn.style.background = '#2a7a2a';
        setTimeout(() => {
            btn.textContent = 'Submit';
            btn.style.background = '';
            form.reset();
        }, 2500);
    }
});

// ===== PORTFOLIO RING =====
(() => {
    const ring = document.getElementById('portfolioRing');
    const wrap = document.getElementById('portfolioRingWrap');
    const arrowLeft = document.getElementById('ringArrowLeft');
    const arrowRight = document.getElementById('ringArrowRight');
    if (!ring || !wrap) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const speed = 9; // degrees per second, default auto-spin
    const boostSpeed = 140; // degrees per second, while an arrow is held

    let angle = 0;
    let lastTime = null;
    let hovering = false;
    let dragging = false;
    let dragStartX = 0;
    let dragStartAngle = 0;
    let boostDirection = 0; // -1 left, 1 right, 0 none

    function tick(time) {
        if (lastTime === null) lastTime = time;
        const dt = (time - lastTime) / 1000;
        lastTime = time;

        if (dragging) {
            // angle is set directly by pointermove while dragging
        } else if (boostDirection !== 0) {
            angle += boostSpeed * boostDirection * dt;
        } else if (!hovering && !reduceMotion) {
            angle += speed * dt;
        }

        ring.style.transform = `rotateY(${angle}deg)`;
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    wrap.addEventListener('pointerenter', () => { hovering = true; });
    wrap.addEventListener('pointerleave', () => { hovering = false; });

    wrap.addEventListener('pointerdown', (e) => {
        dragging = true;
        dragStartX = e.clientX;
        dragStartAngle = angle;
        ring.classList.add('is-dragging');
        wrap.setPointerCapture(e.pointerId);
    });

    wrap.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        angle = dragStartAngle + (e.clientX - dragStartX) * 0.3;
    });

    function endDrag() {
        dragging = false;
        ring.classList.remove('is-dragging');
    }
    wrap.addEventListener('pointerup', endDrag);
    wrap.addEventListener('pointercancel', endDrag);

    // ---- Speed-up arrows ----
    function bindArrow(btn, direction) {
        if (!btn) return;

        function start(e) {
            e.stopPropagation();
            e.preventDefault();
            boostDirection = direction;
            btn.classList.add('is-active');
            if (e.pointerId !== undefined) btn.setPointerCapture(e.pointerId);
        }

        function stop(e) {
            if (e) e.stopPropagation();
            boostDirection = 0;
            btn.classList.remove('is-active');
        }

        btn.addEventListener('pointerdown', start);
        btn.addEventListener('pointerup', stop);
        btn.addEventListener('pointercancel', stop);
        btn.addEventListener('pointerleave', stop);

        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                boostDirection = direction;
                btn.classList.add('is-active');
            }
        });
        btn.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' || e.key === ' ') stop();
        });
        btn.addEventListener('blur', () => stop());
    }

    bindArrow(arrowLeft, -1);
    bindArrow(arrowRight, 1);
})();

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        document.querySelectorAll('.faq-item.is-open').forEach(open => {
            open.classList.remove('is-open');
            open.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
            item.classList.add('is-open');
            question.setAttribute('aria-expanded', 'true');
        }
    });
});

// ===== REVIEWS CAROUSEL =====
(() => {
    const wrap = document.querySelector('.reviews-track-wrap');
    const track = document.getElementById('reviewsTrack');
    const prevBtn = document.getElementById('reviewsPrev');
    const nextBtn = document.getElementById('reviewsNext');
    if (!wrap || !track || !prevBtn || !nextBtn) return;

    function step() {
        const card = track.querySelector('.review-card');
        if (!card) return 300;
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        return card.getBoundingClientRect().width + gap;
    }

    prevBtn.addEventListener('click', () => {
        wrap.scrollBy({ left: -step(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        wrap.scrollBy({ left: step(), behavior: 'smooth' });
    });
})();
