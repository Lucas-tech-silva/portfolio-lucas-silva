document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initLazyLoading();
  initContactForm();
});

function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  function toggleNav() {
    navLinks.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
    body.classList.toggle('no-scroll');
    burger.setAttribute('aria-expanded', navLinks.classList.contains('nav-active'));
  }

  burger?.addEventListener('click', toggleNav);

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('nav-active')) toggleNav();
    });
  });
  
  document.addEventListener('click', (event) => {
    const isClickInsideNav = navLinks.contains(event.target);
    const isClickOnBurger = burger.contains(event.target);

    if (!isClickInsideNav && !isClickOnBurger && navLinks.classList.contains('nav-active')) {
      toggleNav();
    }
  });

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  const elementsToAnimate = document.querySelectorAll('.skill-card, .project-card, .section-title');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  animatedElements.forEach(el => observer.observe(el));
  elementsToAnimate.forEach(el => {
    if (!el.classList.contains('animate-on-scroll')) {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    }
  });
}

function initLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
        img.setAttribute('width', '600');
        img.setAttribute('height', '400');
      }
    });
  }
}

function initContactForm() {
  const form = document.getElementById('formulario-contato');
  const submitButton = document.getElementById('btn-submit');
  const successMessage = document.getElementById('success-message');
  if (!form || !submitButton || !successMessage) return;

  const showError = (field, msg) => {
    let error = field.parentNode.querySelector('.error-message');
    if (!error) {
      error = document.createElement('div');
      error.className = 'error-message';
      Object.assign(error.style, {
        color: '#ff4d4f',
        fontSize: '0.85em',
        marginTop: '4px',
        fontWeight: '500'
      });
      field.parentNode.appendChild(error);
    }
    error.textContent = msg;
    field.style.borderColor = '#ff4d4f';
  };

  const clearErrors = () => {
    form.querySelectorAll('.error-message').forEach(e => e.remove());
    form.querySelectorAll('input, textarea').forEach(f => f.style.borderColor = '');
  };

  const resetSuccess = () => {
    successMessage.style.display = 'none';
    submitButton.style.display = 'inline-block';
    submitButton.disabled = false;
  };

  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      const error = field.parentNode.querySelector('.error-message');
      if (error) error.remove();
      field.style.borderColor = '';
      if (successMessage.style.display === 'block' || successMessage.style.display === 'inline-block') resetSuccess();
    });
  });

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitButton.disabled) return;

    clearErrors();

    const formData = new FormData(form);
    let firstError = null;
    let hasError = false;

    for (const [name, value] of formData.entries()) {
      const field = form.querySelector(`[name="${name}"]`);
      if (!value.trim()) {
        const messages = {
          name: 'Digite seu nome completo.',
          email: 'Digite o seu e-mail.',
          subject: 'Digite o assunto que deseja tratar.',
          message: 'Por favor, escreva a sua mensagem.'
        };
        showError(field, messages[name] || 'Este campo é obrigatório.');
        if (!firstError) firstError = field;
        hasError = true;
      } else if (name === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
        showError(field, 'Ops! Parece que o e-mail está inválido.');
        if (!firstError) firstError = field;
        hasError = true;
      }
    }

    if (hasError) {
      firstError.focus();
      return;
    }

    submitButton.disabled = true;
    form.reset();
    submitButton.style.display = 'none';
    successMessage.style.display = 'inline-block';

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData
      });

      if (!response.ok) {
        submitButton.disabled = false;
        resetSuccess();
        return;
      }

      setTimeout(() => {
        resetSuccess();
      }, 1700);

    } catch {
      submitButton.disabled = false;
      resetSuccess();
    }
})};
  
function resetSuccess() {
    submitButton.style.display = 'inline-block';
    successMessage.style.display = 'none';
    submitButton.disabled = false;
}

function toggleTheme() {
  if (document.body.getAttribute('data-theme') === 'dark') {
    document.body.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
}

document.getElementById('mobile-theme-toggle').addEventListener('click', toggleTheme);

if (localStorage.getItem('theme') === 'dark') {
  document.body.setAttribute('data-theme', 'dark');
}

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
    if (link.getAttribute('href').substring(1) === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
});

