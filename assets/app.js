(() => {
  'use strict';
  const slides = [...document.querySelectorAll('.slide')];
  const previous = document.getElementById('prev');
  const next = document.getElementById('next');
  const counter = document.getElementById('counter');
  const progress = document.getElementById('progress');
  const fullscreen = document.getElementById('fullscreen');
  const notice = document.getElementById('notice');
  const dots = [...document.querySelectorAll('[data-slide]')];
  const notesButton = document.getElementById('notes');
  const notesDialog = document.getElementById('notes-dialog');
  const notesHeading = document.getElementById('notes-heading');
  const notesContent = document.getElementById('notes-content');
  let current = 0;

  function hashIndex() {
    const match = /^#slide-(\d+)$/.exec(location.hash);
    const number = match ? Number(match[1]) : 1;
    return Number.isInteger(number) && number >= 1 && number <= slides.length ? number - 1 : 0;
  }

  function show(index, updateHash = true) {
    index = Math.max(0, Math.min(slides.length - 1, index));
    const focusedSlide = document.activeElement.closest?.('.slide');
    const focusLeavesDisabledControl = (document.activeElement === next && index === slides.length - 1)
      || (document.activeElement === previous && index === 0);
    slides.forEach((slide, position) => {
      const inactive = position !== index;
      slide.hidden = inactive;
      slide.inert = inactive;
      slide.setAttribute('aria-hidden', String(inactive));
    });
    current = index;
    dots.forEach((dot, i) => dot.setAttribute('aria-current', i === current ? 'step' : 'false'));
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    progress.value = current + 1;
    progress.textContent = `${current + 1} із ${slides.length}`;
    const title = slides[current].querySelector('h1, h2').innerText.replace(/\s+/g, ' ').trim();
    document.title = `${current + 1}/${slides.length} · ${title} · EIP-7702`;
    if (updateHash && location.hash !== `#slide-${current + 1}`) {
      history.pushState(null, '', `#slide-${current + 1}`);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    if ((focusedSlide && focusedSlide !== slides[current]) || focusLeavesDisabledControl) {
      slides[current].focus({ preventScroll: true });
    }
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else notice.textContent = 'Цей браузер не підтримує повноекранний режим. Скористайтеся F11.';
    } catch {
      notice.textContent = 'Браузер не дозволив повноекранний режим. Скористайтеся F11.';
    }
  }

  function toggleNotes() {
    if (notesDialog.open) { notesDialog.close(); return; }
    notesHeading.textContent = `${current + 1}. ${slides[current].querySelector('h1, h2').innerText.replace(/\s+/g, ' ').trim()}`;
    notesContent.replaceChildren(slides[current].querySelector('.speaker-notes').content.cloneNode(true));
    notesDialog.showModal();
  }

  dots.forEach(dot => dot.addEventListener('click', () => show(Number(dot.dataset.slide) - 1)));
  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  fullscreen.addEventListener('click', toggleFullscreen);
  notesButton.addEventListener('click', toggleNotes);
  document.getElementById('close-notes').addEventListener('click', () => notesDialog.close());
  notesDialog.addEventListener('click', event => {
    if (event.target !== notesDialog) return;
    const bounds = notesDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) notesDialog.close();
  });
  window.addEventListener('hashchange', () => { if (notesDialog.open) notesDialog.close(); show(hashIndex(), false); });
  window.addEventListener('popstate', () => { if (notesDialog.open) notesDialog.close(); show(hashIndex(), false); });
  document.addEventListener('fullscreenchange', () => {
    const active = Boolean(document.fullscreenElement);
    fullscreen.setAttribute('aria-pressed', String(active));
    fullscreen.setAttribute('aria-label', active ? 'Вийти з повноекранного режиму' : 'Увімкнути повноекранний режим');
    fullscreen.textContent = active ? '⤢' : '⛶';
  });
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (notesDialog.open) {
      if (event.key.toLowerCase() === 'n') { event.preventDefault(); notesDialog.close(); }
      return;
    }
    if (event.key === ' ' && event.target.closest('a, button')) return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') { event.preventDefault(); show(current + 1); }
    else if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); show(current - 1); }
    else if (event.key === 'Home') { event.preventDefault(); show(0); }
    else if (event.key === 'End') { event.preventDefault(); show(slides.length - 1); }
    else if (event.key.toLowerCase() === 'f') { event.preventDefault(); toggleFullscreen(); }
    else if (event.key.toLowerCase() === 'n') { event.preventDefault(); toggleNotes(); }
  });

  show(hashIndex(), false);
  if (location.hash !== `#slide-${current + 1}`) history.replaceState(null, '', `#slide-${current + 1}`);
})();
