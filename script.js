// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
});

navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
    });
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
    const navHeight = 62;
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

// ===== BOOKING MODAL =====
const modal = document.getElementById('bookingModal');
const navBookBtn = document.getElementById('navBookBtn');
const modalClose = document.getElementById('modalClose');
const bookingForm = document.getElementById('bookingForm');
const bookingSuccess = document.getElementById('bookingSuccess');
const closeSuccess = document.getElementById('closeSuccess');

function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
        bookingForm.style.display = '';
        bookingForm.reset();
        bookingSuccess.classList.remove('show');
    }, 300);
}

navBookBtn.addEventListener('click', openModal);

const heroBookBtn = document.getElementById('heroBookBtn');
if (heroBookBtn) heroBookBtn.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
closeSuccess.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
});

bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(bookingForm));
    const response = await fetch('https://formspree.io/f/xaqkjaoj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        bookingForm.style.display = 'none';
        bookingSuccess.classList.add('show');
    }
});

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('.submit-btn');
    const original = btn.textContent;
    btn.textContent = 'Sent!';
    btn.style.background = '#2a7a2a';
    setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        e.target.reset();
    }, 2500);
});
