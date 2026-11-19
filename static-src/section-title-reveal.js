(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const selectors = document.documentElement.classList.contains('embedded')
    ? ['.hero h1', '.section-head h2']
    : [
    '#intro .section-heading',
    '#case .case-heading h2',
    '#company-apps .ledger-copy h2',
    '#card-terminals .terminal-heading h2',
    '#barcode .terminal-heading h2',
    '.why-head h2'
  ];
  const titles = document.querySelectorAll(selectors.join(','));
  if (!titles.length) return;
  titles.forEach(title => title.classList.add('section-title-reveal'));
  document.documentElement.classList.add('section-title-motion');
  if (window.frameElement && window.parent !== window) {
    let pending = false;
    const check = () => {
      pending = false;
      const frameTop = window.frameElement.getBoundingClientRect().top;
      titles.forEach(title => {
        const rect = title.getBoundingClientRect();
        title.classList.toggle('is-visible', frameTop + rect.top < parent.innerHeight * .88 && frameTop + rect.bottom > 76);
      });
    };
    const schedule = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(check);
    };
    parent.addEventListener('scroll', schedule, { passive: true });
    parent.addEventListener('resize', schedule);
    schedule();
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.intersectionRatio >= .16));
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.16 });
  titles.forEach(title => observer.observe(title));
})();
