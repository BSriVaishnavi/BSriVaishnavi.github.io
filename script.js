const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const revealElements = document.querySelectorAll('.reveal');
const statNumbers = document.querySelectorAll('.stat-number');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const selected = button.dataset.filter;

    projectCards.forEach((card) => {
      const categories = (card.dataset.category || '').split(' ');
      const shouldShow = selected === 'all' || categories.includes(selected);
      card.classList.toggle('hidden', !shouldShow);
    });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealElements.forEach((el) => revealObserver.observe(el));

const animateNumber = (element) => {
  const rawTarget = element.dataset.target;
  const target = Number(rawTarget);
  const duration = 1400;
  const startTime = performance.now();

  const step = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const currentValue = target * (1 - Math.pow(1 - progress, 3));

    if (String(rawTarget).includes('.')) {
      element.textContent = currentValue.toFixed(2);
    } else {
      element.textContent = Math.round(currentValue).toString();
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = rawTarget;
    }
  };

  requestAnimationFrame(step);
};

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.8 }
);

statNumbers.forEach((number) => statsObserver.observe(number));
