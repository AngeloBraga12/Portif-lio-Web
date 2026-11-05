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

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const horizontalSections = document.querySelectorAll('[data-horizontal]');
const horizontalBreakpoint = window.matchMedia('(max-width: 780px)');
let queueScrollEffects = () => {};

function measureHorizontalSections() {
  const useTouchLayout = horizontalBreakpoint.matches || reduceMotion.matches;

  horizontalSections.forEach((section) => {
    const pin = section.querySelector('.horizontal-pin');
    const viewport = section.querySelector('.horizontal-window');
    const track = section.querySelector('.horizontal-track');
    if (!pin || !viewport || !track) return;

    if (useTouchLayout) {
      section.classList.remove('is-horizontal');
      section.style.removeProperty('height');
      section.style.setProperty('--horizontal-progress', '0%');
      section.removeAttribute('data-horizontal-travel');
      track.style.removeProperty('--horizontal-offset');
      viewport.scrollLeft = 0;
      return;
    }

    section.classList.add('is-horizontal');
    const travel = Math.max(0, track.scrollWidth - viewport.clientWidth);
    section.dataset.horizontalTravel = String(Math.ceil(travel));
    section.style.height = `${Math.ceil(pin.offsetHeight + travel)}px`;
  });
}

horizontalSections.forEach((section) => {
  const viewport = section.querySelector('.horizontal-window');
  const track = section.querySelector('.horizontal-track');
  const pin = section.querySelector('.horizontal-pin');
  if (!viewport || !track || !pin) return;

  section.addEventListener('focusin', (event) => {
    if (horizontalBreakpoint.matches || !section.classList.contains('is-horizontal')) return;
    const item = event.target.closest('.project-card, .gallery-grid figure');
    if (!item || !track.contains(item)) return;

    const itemBounds = item.getBoundingClientRect();
    const viewportBounds = viewport.getBoundingClientRect();
    if (itemBounds.left >= viewportBounds.left && itemBounds.right <= viewportBounds.right) return;

    const travel = Number(section.dataset.horizontalTravel) || 0;
    const scrollRange = Math.max(0, section.offsetHeight - pin.offsetHeight);
    const itemPosition = Math.max(0, Math.min(travel, item.offsetLeft - 18));
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const progress = travel ? itemPosition / travel : 0;
    window.scrollTo({ top: sectionTop + progress * scrollRange, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  });

  viewport.addEventListener('keydown', (event) => {
    if (horizontalBreakpoint.matches || !section.classList.contains('is-horizontal') || event.target !== viewport || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const travel = Number(section.dataset.horizontalTravel) || 0;
    const scrollRange = Math.max(0, section.offsetHeight - pin.offsetHeight);
    if (!travel || !scrollRange) return;

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const progress = Math.max(0, Math.min(1, (window.scrollY - sectionTop) / scrollRange));
    const step = Math.min(.3, viewport.clientWidth * .7 / travel);
    const nextProgress = Math.max(0, Math.min(1, progress + (event.key === 'ArrowRight' ? step : -step)));
    window.scrollTo({ top: sectionTop + nextProgress * scrollRange, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  });

  viewport.addEventListener('scroll', () => {
    if (!horizontalBreakpoint.matches) return;
    const travel = viewport.scrollWidth - viewport.clientWidth;
    const progress = travel > 0 ? (viewport.scrollLeft / travel) * 100 : 0;
    section.style.setProperty('--horizontal-progress', `${progress.toFixed(1)}%`);
  }, { passive: true });
});

measureHorizontalSections();
reduceMotion.addEventListener('change', () => {
  measureHorizontalSections();
  queueScrollEffects();
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

    measureHorizontalSections();
    queueScrollEffects();
  });
});

const revealItems = document.querySelectorAll('.reveal');
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

    horizontalSections.forEach((section) => {
      if (!section.classList.contains('is-horizontal')) return;
      const pin = section.querySelector('.horizontal-pin');
      const track = section.querySelector('.horizontal-track');
      if (!pin || !track) return;

      const travel = Number(section.dataset.horizontalTravel) || 0;
      const scrollRange = Math.max(0, section.offsetHeight - pin.offsetHeight);
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const sectionProgress = scrollRange ? Math.max(0, Math.min(1, (window.scrollY - sectionTop) / scrollRange)) : 0;
      track.style.setProperty('--horizontal-offset', `${(-travel * sectionProgress).toFixed(1)}px`);
      section.style.setProperty('--horizontal-progress', `${(sectionProgress * 100).toFixed(1)}%`);
    });

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

  queueScrollEffects = () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateScrollEffects);
  };

  window.addEventListener('scroll', queueScrollEffects, { passive: true });
  window.addEventListener('resize', () => {
    measureHorizontalSections();
    queueScrollEffects();
  }, { passive: true });
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
