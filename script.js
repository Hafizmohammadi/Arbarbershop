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

// ===== SQUARE BOOKING =====
const SQUARE_BOOKING_URL = 'https://app.squareup.com/appointments/book/qewqoa9eyj42vj/LR55118FQB8CZ/start';

function openBooking() {
    window.open(SQUARE_BOOKING_URL, '_blank', 'noopener,noreferrer');
}

document.getElementById('navBookBtn').addEventListener('click', openBooking);
const heroBookBtn = document.getElementById('heroBookBtn');
if (heroBookBtn) heroBookBtn.addEventListener('click', openBooking);

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
        phone: data['Phone'] || 'Not provided',
        email: '',
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
