const themeToggle = document.querySelector('.theme-toggle');
const preferredTheme = localStorage.getItem('theme');

if (preferredTheme === 'dark') {
  document.body.classList.add('dark');
}

function updateThemeButton() {
  const isDark = document.body.classList.contains('dark');
  themeToggle.setAttribute('aria-label', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');
  themeToggle.setAttribute('aria-pressed', String(isDark));
}

updateThemeButton();

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeButton();
});

const filterButtons = document.querySelectorAll('.filters [data-filter]');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach((button) => {
  button.setAttribute('aria-pressed', String(button.classList.contains('active')));

  button.addEventListener('click', () => {
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    const filter = button.dataset.filter;

    projectCards.forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  });
});

const contactForm = document.querySelector('#contact-form');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const name = form.elements.name.value.trim();
  const message = form.elements.message.value.trim();
  const status = form.querySelector('.form-status');

  if (!name || !message) return;

  status.textContent = `Obrigado, ${name}! Este formulário é demonstrativo e não envia dados para um servidor.`;
  form.reset();
});
