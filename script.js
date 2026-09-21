// ===== Menu mobile =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  navToggle.classList.toggle('open');
});

document.querySelectorAll('.nav-link, .btn-nav').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

// ===== Header com sombra ao rolar =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== Filtro do cardápio =====
const filtros = document.querySelectorAll('.filtro');
const dishes = document.querySelectorAll('.dish');

filtros.forEach(btn => {
  btn.addEventListener('click', () => {
    filtros.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    dishes.forEach(dish => {
      dish.classList.toggle('hide', dish.dataset.cat !== cat);
    });
  });
});

// ===== Animação de revelação ao rolar =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== Link ativo na navegação =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = 'inicio';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 140) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// ===== Formulário de reserva (demo) =====
const form = document.getElementById('form-reserva');
const formMsg = document.getElementById('form-msg');

form.addEventListener('submit', e => {
  e.preventDefault();
  formMsg.textContent = 'Reserva enviada! Entraremos em contato para confirmar. 🥢';
  form.reset();
  setTimeout(() => { formMsg.textContent = ''; }, 5000);
});