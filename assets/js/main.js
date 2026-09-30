// ============================================================
// Hannah M. Daniel Portfolio — shared interactions
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initReveal();
  initHeroHeadline();
  initMarquee();
  initLightboxGalleries();
  initWorkCarousel();
});

/* ---------- Selected Work carousel (Home page) ---------- */
function initWorkCarousel() {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.work-carousel-slide'));
  const dots = Array.from(carousel.querySelectorAll('[data-carousel-dots] .work-carousel-dot'));
  const prevBtn = carousel.querySelector('[data-carousel-prev]');
  const nextBtn = carousel.querySelector('[data-carousel-next]');
  let index = slides.findIndex((s) => s.classList.contains('is-active'));
  if (index < 0) index = 0;

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('is-active', n === index));
    dots.forEach((d, n) => d.classList.toggle('is-active', n === index));
  }

  prevBtn && prevBtn.addEventListener('click', () => show(index - 1));
  nextBtn && nextBtn.addEventListener('click', () => show(index + 1));
  dots.forEach((dot, n) => dot.addEventListener('click', () => show(n)));

  // swipe support
  let touchStartX = 0;
  carousel.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
  carousel.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 40) diff > 0 ? show(index - 1) : show(index + 1);
  });
}


/* ---------- Mobile nav toggle ---------- */
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Gentle fade-up reveal on scroll ---------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((el) => observer.observe(el));
}

/* ---------- Home hero animated headline (bottom two lines only) ---------- */
function initHeroHeadline() {
  const el = document.querySelector('[data-hero-rotator]');
  if (!el) return;

  const states = JSON.parse(el.getAttribute('data-states'));
  let index = 0;
  const lineTop = el.querySelector('.hero-rotator-line1');
  const lineBottom = el.querySelector('.hero-rotator-line2');

  function render(i) {
    lineTop.textContent = states[i][0];
    lineBottom.textContent = states[i][1];
  }

  render(0);

  setInterval(() => {
    el.classList.add('is-fading');
    setTimeout(() => {
      index = (index + 1) % states.length;
      render(index);
      el.classList.remove('is-fading');
    }, 350);
  }, 3200);
}

/* ---------- Research focus marquee (pause on hover) ---------- */
function initMarquee() {
  const tracks = document.querySelectorAll('[data-marquee-track]');
  tracks.forEach((track) => {
    // Duplicate content once for seamless loop
    track.innerHTML += track.innerHTML;
  });
}

/* ---------- Lightbox for Impact page image galleries ---------- */
function initLightboxGalleries() {
  const galleries = document.querySelectorAll('[data-gallery]');
  if (!galleries.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close gallery">&times;</button>
    <button class="lightbox-prev" aria-label="Previous image">&larr;</button>
    <img src="" alt="" />
    <button class="lightbox-next" aria-label="Next image">&rarr;</button>
  `;
  document.body.appendChild(lightbox);

  const imgEl = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentGallery = [];
  let currentIndex = 0;

  function open(gallery, index) {
    currentGallery = gallery;
    currentIndex = index;
    updateImage();
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function updateImage() {
    const item = currentGallery[currentIndex];
    imgEl.src = item.src;
    imgEl.alt = item.alt || '';
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function next() {
    currentIndex = (currentIndex + 1) % currentGallery.length;
    updateImage();
  }

  function prev() {
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    updateImage();
  }

  closeBtn.addEventListener('click', close);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  galleries.forEach((galleryEl) => {
    const thumbs = Array.from(galleryEl.querySelectorAll('[data-gallery-item]'));
    const items = thumbs.map((t) => ({
      src: t.getAttribute('data-full') || t.querySelector('img').src,
      alt: t.querySelector('img').alt,
    }));

    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', () => open(items, i));
      thumb.setAttribute('tabindex', '0');
      thumb.setAttribute('role', 'button');
      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(items, i);
        }
      });
    });
  });

  // basic swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  lightbox.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? prev() : next();
    }
  });
}
