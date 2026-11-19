// The homepage uses native scrolling. Keep only navigation behavior here.
const serviceToggle = document.querySelector('.nav-toggle');
const serviceGroup = document.querySelector('.nav-group');

serviceToggle?.addEventListener('click', () => {
  const open = serviceGroup.classList.toggle('is-open');
  serviceToggle.setAttribute('aria-expanded', String(open));
});

document.addEventListener('click', (event) => {
  if (!serviceGroup?.contains(event.target)) {
    serviceGroup?.classList.remove('is-open');
    serviceToggle?.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    serviceGroup?.classList.remove('is-open');
    serviceToggle?.setAttribute('aria-expanded', 'false');
  }
});

document.querySelectorAll('.nav a, .submenu a').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelector('.nav')?.classList.remove('open');
    const menu = document.querySelector('.mobile-menu');
    menu?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-label', '메뉴 열기');
    serviceGroup?.classList.remove('is-open');
    serviceToggle?.setAttribute('aria-expanded', 'false');
  });
});

const hero = document.querySelector('.motion-hero');
const subtitle = hero?.querySelector('.centered-hero-subtitle');
const subtitleFull = subtitle?.querySelector('.subtitle-full');
const subtitleTyped = subtitle?.querySelector('.subtitle-typed');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const typingEnabled = Boolean(subtitleFull && subtitleTyped && !reducedMotion);
const characters = typingEnabled ? Array.from(subtitleFull.textContent.trim()) : [];
let typingDelay;
let typingStep;

if (typingEnabled) subtitle.classList.add('typing-enabled');

function stopTyping() {
  clearTimeout(typingDelay);
  clearTimeout(typingStep);
  if (typingEnabled) {
    subtitleTyped.textContent = '';
    subtitle.classList.remove('is-typing-pending', 'is-typing-active');
  }
}

function startTyping() {
  if (!typingEnabled) return;
  stopTyping();
  subtitle.classList.add('is-typing-pending');
  typingDelay = setTimeout(() => {
    subtitle.classList.remove('is-typing-pending');
    subtitle.classList.add('is-typing-active');
    let index = 0;
    const typeNext = () => {
      subtitleTyped.textContent = characters.slice(0, ++index).join('');
      if (index < characters.length) typingStep = setTimeout(typeNext, 72);
      else subtitle.classList.remove('is-typing-active');
    };
    typeNext();
  }, 2450);
}

if (hero && 'IntersectionObserver' in window) {
  let observedOnce = false;
  let wasVisible = false;
  const heroObserver = new IntersectionObserver(([entry]) => {
    const visible = entry.intersectionRatio >= 0.12;
    document.body.classList.toggle('past-hero', !entry.isIntersecting && entry.boundingClientRect.bottom <= 0);
    if (visible && !wasVisible) {
      hero.classList.remove('hero-awaiting-reentry');
      startTyping();
    } else if (!visible && wasVisible) {
      hero.classList.add('hero-awaiting-reentry');
      stopTyping();
    } else if (!visible && !observedOnce) {
      hero.classList.add('hero-awaiting-reentry');
    }
    observedOnce = true;
    wasVisible = visible;
  }, {threshold: [0, 0.12]});
  heroObserver.observe(hero);
} else {
  startTyping();
}
