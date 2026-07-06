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

  // Formulario de contacto → envía los datos por WhatsApp
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  // ⚠️ Reemplaza este número por el WhatsApp Business real de GUGU Marketing
  // Formato: código de país + número, sin +, espacios ni guiones (ej. Colombia: 57 3001234567)
  const WHATSAPP_NUMBER = '573015122607';

  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = form.nombre.value.trim();
      const email = form.email.value.trim();
      const empresa = form.empresa.value.trim();
      const whatsapp = form.whatsapp.value.trim();

      if (!nombre || !email) {
        status.textContent = 'Por favor completa nombre y correo.';
        status.style.color = '#B00020';
        return;
      }

      // Arma el mensaje con los datos del formulario
      let mensaje = `Hola GUGU Marketing, quiero mas informacion.\n`;
      mensaje += `Nombre: ${nombre}\n`;
      mensaje += `Correo: ${email}\n`;
      if (empresa) mensaje += `Empresa: ${empresa}\n`;
      if (whatsapp) mensaje += `WhatsApp: ${whatsapp}\n`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;

      status.textContent = `¡Gracias, ${nombre}! Te llevamos a WhatsApp para confirmar tus necesidades digitales...`;
      status.style.color = '#0B0B0C';

      // Abre WhatsApp con el mensaje ya redactado
      window.open(url, '_blank', 'noopener');

      form.reset();
    });
  }

});
