const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const backToTop = document.querySelector('.back-to-top');
const year = document.querySelector('#year');
const reveals = document.querySelectorAll('.reveal');
const statNumbers = document.querySelectorAll('.stat-number');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('.form-status');
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

year.textContent = new Date().getFullYear();

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('portfolio-theme', theme);
  themeIcon.textContent = theme === 'light' ? '☀' : '☾';
}

const savedTheme = localStorage.getItem('portfolio-theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
setTheme(savedTheme || systemTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.dataset.theme;
  setTheme(currentTheme === 'light' ? 'dark' : 'light');
});

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  body.classList.toggle('menu-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

reveals.forEach((el) => {
  if (prefersReducedMotion) {
    el.classList.add('visible');
  } else {
    revealObserver.observe(el);
  }
});

function animateStat(numberElement) {
  const target = Number(numberElement.dataset.count);
  const duration = target > 100 ? 1400 : 900;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    numberElement.textContent = Math.round(target * eased).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateStat(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

statNumbers.forEach((stat) => statObserver.observe(stat));

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    projectCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hide', !matches);
    });
  });
});

function updateActiveNav() {
  const sections = [...document.querySelectorAll('main section[id]')];
  const current = sections
    .filter((section) => section.getBoundingClientRect().top <= 120)
    .pop();

  navLinks.forEach((link) => {
    link.classList.toggle('active', current && link.getAttribute('href') === `#${current.id}`);
  });
}

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 600);
  updateActiveNav();
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get('name').trim();
  const email = formData.get('email').trim();
  const message = formData.get('message').trim();

  if (!name || !email || !message) {
    formStatus.textContent = 'Please complete every field before sending.';
    return;
  }

  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const bodyText = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  window.location.href = `mailto:sowkey2mail@gmail.com?subject=${subject}&body=${bodyText}`;
  formStatus.textContent = 'Opening your email app...';
  contactForm.reset();
});

if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    cursorDot.style.left = `${event.clientX}px`;
    cursorDot.style.top = `${event.clientY}px`;
    cursorOutline.animate(
      { left: `${event.clientX}px`, top: `${event.clientY}px` },
      { duration: 380, fill: 'forwards' }
    );
  });

  document.querySelectorAll('a, button, input, textarea').forEach((item) => {
    item.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
    item.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
  });
}

updateActiveNav();