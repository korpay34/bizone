(() => {
  const slider = document.querySelector('[data-case-slider]');
  if (!slider) return;

  const slides = [...slider.querySelectorAll('.case-image')];
  const buttons = [...slider.querySelectorAll('.case-slide-controls button')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let timer;
  let leaveTimer;
  let visible = false;

  function show(index) {
    if (index !== current) {
      window.clearTimeout(leaveTimer);
      slides.forEach(slide => slide.classList.remove('is-leaving'));
      slides[current].classList.add('is-leaving');
      slider.classList.add('has-changed');
      leaveTimer = window.setTimeout(() => slides.forEach(slide => slide.classList.remove('is-leaving')), 1100);
    }
    current = index;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
      slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    buttons.forEach((button, i) => {
      button.classList.toggle('is-active', i === index);
      if (i === index) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  }

  function stop() {
    window.clearInterval(timer);
    timer = undefined;
  }

  function start() {
    stop();
    if (!visible || document.hidden || reduceMotion.matches || slider.matches(':hover') || slider.matches(':focus-within')) return;
    timer = window.setInterval(() => show((current + 1) % slides.length), 3000);
  }

  buttons.forEach((button, index) => button.addEventListener('click', () => {
    show(index);
    start();
  }));
  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  slider.addEventListener('focusin', stop);
  slider.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', start);
  reduceMotion.addEventListener('change', start);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    start();
  }, { threshold: 0.2 }).observe(slider);

  show(0);
  slider.classList.add('is-ready');
})();
