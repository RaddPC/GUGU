// ============================================
// GUGU MARKETING — interacciones
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // Año dinámico en el footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Menú móvil
  const burger = document.getElementById('burger');
  const links = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const isOpen = links.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(isOpen));
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Contador animado de estadísticas (solo al entrar en pantalla)
  const stats = document.querySelectorAll('.stat__num');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateCount = (el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const isDecimal = el.dataset.decimal === 'true';
    const duration = 1400;
    const start = performance.now();

    if (prefersReducedMotion) {
      el.textContent = (isDecimal ? target.toFixed(1) : Math.round(target)) + suffix;
      return;
    }

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = target * eased;
      el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window && stats.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
  } else {
    stats.forEach(animateCount);
  }

  // Formulario de contacto (demo: sin backend conectado)
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = form.nombre.value.trim();
      const email = form.email.value.trim();

      if (!nombre || !email) {
        status.textContent = 'Por favor completa nombre y correo.';
        status.style.color = '#B00020';
        return;
      }

      // Aquí se conectaría un endpoint real (Formspree, backend propio, etc.)
      status.textContent = `¡Gracias, ${nombre}! Te escribimos pronto a ${email}.`;
      status.style.color = '#0B0B0C';
      form.reset();
    });
  }

});
