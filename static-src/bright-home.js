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
if (hero && 'IntersectionObserver' in window) {
  const heroObserver = new IntersectionObserver(([entry]) => {
    document.body.classList.toggle('past-hero', !entry.isIntersecting && entry.boundingClientRect.bottom <= 0);
  });
  heroObserver.observe(hero);
}
