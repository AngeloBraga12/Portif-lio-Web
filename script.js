const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
  document.body.classList.add('light');
}

function updateThemeButton() {
  if (!(themeToggle instanceof HTMLButtonElement)) return;
  const isLight = document.body.classList.contains('light');
  themeToggle.setAttribute('aria-label', isLight ? 'Ativar tema escuro' : 'Ativar tema claro');
  themeToggle.setAttribute('aria-pressed', String(!isLight));
}

updateThemeButton();

themeToggle?.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  updateThemeButton();
});

const filterButtons = document.querySelectorAll('.filters [data-filter]');
const projectCards = document.querySelectorAll('.project-card[data-category]');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    projectCards.forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  });
});

const revealItems = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const parallaxItems = document.querySelectorAll('[data-parallax]');
const scrollProgress = document.querySelector('.scroll-progress');
if (scrollProgress || (parallaxItems.length && !reduceMotion.matches)) {
  let framePending = false;
  const updateScrollEffects = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    scrollProgress?.style.setProperty('--scroll-progress', `${Math.min(100, progress).toFixed(2)}%`);

    if (!reduceMotion.matches) {
      parallaxItems.forEach((item) => {
        const bounds = item.getBoundingClientRect();
        const distanceFromCenter = window.innerHeight / 2 - (bounds.top + bounds.height / 2);
        const speed = Number(item.dataset.parallax) || 0;
        const offset = Math.max(-54, Math.min(54, distanceFromCenter * speed));
        item.style.setProperty('--parallax-y', `${offset.toFixed(1)}px`);
      });
    }
    framePending = false;
  };

  const queueScrollEffects = () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateScrollEffects);
  };

  window.addEventListener('scroll', queueScrollEffects, { passive: true });
  window.addEventListener('resize', queueScrollEffects, { passive: true });
  window.addEventListener('load', queueScrollEffects, { once: true });
  updateScrollEffects();
}

const contactForm = document.querySelector('#contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const name = form.elements.name.value.trim();
  const message = form.elements.message.value.trim();
  const status = form.querySelector('.form-status');

  if (!name || !message) return;
  status.textContent = `Obrigado, ${name}! Este formulário é demonstrativo e não envia dados para um servidor.`;
  form.reset();
});
