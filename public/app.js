(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Modal open/close
  const modal = $('#contactModal');
  const openButtons = ['#openModalFromHero', '#openModalFloating'].map((s) => $(s));
  const closeBtn = $('#modalClose');
  const backdrop = modal.querySelector('.modal-backdrop');

  function openModal(){
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    $('#name').focus();
  }
  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
  openButtons.forEach((btn) => btn && btn.addEventListener('click', openModal));
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Hover underline already done in CSS

  // Contact form submission -> backend -> Telegram
  const form = $('#contactForm');
  const statusEl = $('#formStatus');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = 'Отправляю…';

    const projectTypes = [];
    if ($('#t-landing').checked) projectTypes.push('Лендинг');
    if ($('#t-shop').checked) projectTypes.push('Интернет-магазин');
    if ($('#t-support').checked) projectTypes.push('Поддержка');

    const payload = {
      name: $('#name').value.trim(),
      phone: $('#phone').value.trim(),
      email: $('#email').value.trim(),
      telegram: $('#telegram').value.trim(),
      projectTypes,
      acceptPolicy: $('#acceptPolicy').checked,
      message: $('#message').value.trim(),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'SEND_FAILED');
      statusEl.textContent = 'Отправлено! Я свяжусь с вами в Telegram.';
      form.reset();
      setTimeout(() => { statusEl.textContent = ''; closeModal(); }, 1200);
    } catch (err) {
      statusEl.textContent = 'Ошибка отправки. Попробуйте еще раз.';
    }
  });
})();
