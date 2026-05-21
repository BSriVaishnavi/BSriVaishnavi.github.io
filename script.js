// Mobile nav
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');

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

// Project filters
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

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

// Expandable cards
document.querySelectorAll('.expandable-card').forEach((card) => {
  const btn = card.querySelector('.expand-btn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = card.dataset.expanded === 'true';
    card.dataset.expanded = String(!isExpanded);

    const label = btn.querySelector('.expand-label');
    if (label) {
      label.textContent = isExpanded ? getCollapseLabel(card) : 'Collapse';
    }
  });
});

function getCollapseLabel(card) {
  if (card.classList.contains('project-card')) return 'Details';
  if (card.classList.contains('skill-panel')) return 'See all';
  if (card.classList.contains('education-card')) return 'More details';
  if (card.classList.contains('coursework-card')) return 'See all courses';
  return 'Read more';
}

// Intersection observer for reveal animations
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Animated stat numbers
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

document.querySelectorAll('.stat-number').forEach((n) => statsObserver.observe(n));