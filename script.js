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

// ===== EMAILJS =====
emailjs.init('QDMidID7hnycWGx7Y');

// ===== SUPABASE =====
const db = supabase.createClient(
    'https://apmkmwzgjohiqlgdvwmy.supabase.co',
    'sb_publishable_vlbdS8RncVPTdF9mk0zvJA_u5rO-cmi'
);

const dateInput = bookingForm.querySelector('input[name="Preferred Date"]');
const timeSelect = bookingForm.querySelector('select[name="Preferred Time"]');

dateInput.addEventListener('change', async () => {
    const date = dateInput.value;
    if (!date) return;

    Array.from(timeSelect.options).forEach(opt => {
        opt.disabled = false;
        opt.textContent = opt.textContent.replace(' (Booked)', '');
    });

    const { data, error } = await db
        .from('booking')
        .select('preferred_time')
        .eq('preferred_date', date);

    console.log('Booked slots:', data, 'Error:', error);

    if (data) {
        data.forEach(booking => {
            const opt = Array.from(timeSelect.options).find(o => o.textContent.trim() === booking.preferred_time);
            if (opt) {
                opt.disabled = true;
                opt.textContent += ' (Booked)';
            }
        });
    }
});

bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = bookingForm.querySelector('.booking-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Booking...';

    const data = Object.fromEntries(new FormData(bookingForm));

    // Double-check the slot is still available before inserting
    const { data: existing } = await db
        .from('booking')
        .select('preferred_time')
        .eq('preferred_date', data['Preferred Date'])
        .eq('preferred_time', data['Preferred Time']);

    if (existing && existing.length > 0) {
        alert('Sorry, that time slot was just taken. Please pick a different time.');
        dateInput.dispatchEvent(new Event('change'));
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm Booking';
        return;
    }

    const { error } = await db.from('booking').insert({
        full_name: data['Full Name'],
        phone: data['Phone'],
        email: data['Email'],
        service: data['Service'],
        preferred_date: data['Preferred Date'],
        preferred_time: data['Preferred Time'],
        notes: data['Notes']
    });

    if (error) {
        alert('Something went wrong saving your booking. Please try again or call us directly.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm Booking';
        return;
    }

    const emailParams = {
        full_name: data['Full Name'],
        phone: data['Phone'],
        email: data['Email'],
        service: data['Service'],
        date: data['Preferred Date'],
        time: data['Preferred Time'],
        notes: data['Notes'] || 'None'
    };

    try {
        await emailjs.send('service_28fnjhd', 'template_97vlqtd', emailParams);
        if (data['Email']) {
            await emailjs.send('service_28fnjhd', 'template_guutl08', emailParams);
        }
    } catch (emailErr) {
        alert('EmailJS error: ' + JSON.stringify(emailErr));
    }

    bookingForm.style.display = 'none';
    bookingSuccess.classList.add('show');
});

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
