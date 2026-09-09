const themeToggle = document.querySelector('.theme-toggle');
const preferredTheme = localStorage.getItem('theme');

if (preferredTheme === 'dark') document.body.classList.add('dark');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.filters .active').classList.remove('active');
    button.classList.add('active');
    document.querySelectorAll('.project-card').forEach((card) => {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.filter !== button.dataset.filter && card.dataset.category !== button.dataset.filter;
    });
  });
});

document.querySelector('#contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.name.value.trim();
  const message = form.elements.message.value.trim();
  const status = form.querySelector('.form-status');
  if (!name || !message) return;
  status.textContent = `Obrigado, ${name}! Sua mensagem foi registrada.`;
  form.reset();
});
