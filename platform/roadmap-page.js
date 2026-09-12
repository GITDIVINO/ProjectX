(() => {
  'use strict';
  const slides = [...document.querySelectorAll('.slide')];
  const byId = id => document.getElementById(id);
  let current = 0;

  function show(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    byId('position').textContent = (current + 1) + ' / ' + slides.length;
    byId('previous').disabled = current === 0;
    byId('next').disabled = current === slides.length - 1;
  }

  function mode(guide) {
    byId('guide').hidden = !guide;
    byId('deck').hidden = guide;
    byId('deck-controls').hidden = guide;
    byId('show-guide').setAttribute('aria-pressed', String(guide));
    byId('show-deck').setAttribute('aria-pressed', String(!guide));
  }

  byId('previous').onclick = () => show(current - 1);
  byId('next').onclick = () => show(current + 1);
  byId('show-guide').onclick = () => mode(true);
  byId('show-deck').onclick = () => mode(false);
  byId('print').onclick = () => window.print();
  document.addEventListener('keydown', event => {
    if (byId('deck').hidden || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    const destinations = {
      ArrowRight: current + 1,
      ArrowLeft: current - 1,
      Home: 0,
      End: slides.length - 1
    };
    if (!Object.hasOwn(destinations, event.key)) return;
    event.preventDefault();
    show(destinations[event.key]);
  });
  show(0);
})();
