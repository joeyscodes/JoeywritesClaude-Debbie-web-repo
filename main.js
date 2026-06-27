/* ============================================================
   DEBBIE'S SUITES & APARTMENTS — Main JavaScript
   Premium Luxury Hotel Website
   ============================================================ */

'use strict';

/* ── Preloader ── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 2000);
});

/* Body overflow hidden during load */
document.body.style.overflow = 'hidden';

/* ── Generate Hero Particles ── */
function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    const size = Math.random() * 4 + 2;
    span.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(span);
  }
}

/* ── Navbar Scroll Behaviour ── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Mobile Nav Toggle ── */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.nav-mobile');
  const mobileLinks = document.querySelectorAll('.nav-mobile a');

  if (!toggle || !mobileMenu) return;

  toggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Staggered delay based on sibling index
        const siblings = [...entry.target.parentElement.children];
        const index = siblings.indexOf(entry.target);
        const delay = Math.min(index * 80, 400);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ── Animated Counters ── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ── Testimonials Slider ── */
function initTestimonialsSlider() {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const dots  = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');

  let current = 0;
  let perSlide = getPerSlide();
  let total = Math.ceil(cards.length / perSlide);
  let autoTimer;

  function getPerSlide() {
    return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
  }

  function goTo(index) {
    current = (index + total) % total;
    const offset = current * (100 / perSlide) * perSlide;
    track.style.transform = `translateX(-${(current * 100 / total)}%)`;

    // Actually move by card width
    const cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 0;
    track.style.transform = `translateX(-${current * perSlide * cardWidth}px)`;

    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }
  function stopAuto() { clearInterval(autoTimer); }

  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

  // Recalc on resize
  window.addEventListener('resize', () => {
    perSlide = getPerSlide();
    total = Math.ceil(cards.length / perSlide);
    goTo(0);
  });

  goTo(0);
  startAuto();
}

/* ── Gallery Filter & Lightbox ── */
function initGallery() {
  /* Filter buttons */
  const filterBtns = document.querySelectorAll('.filter-btn, .gallery-filter .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.opacity = show ? '1' : '0';
        item.style.transform = show ? 'scale(1)' : 'scale(0.9)';
        item.style.display = show ? 'block' : 'none';
      });
    });
  });

  /* Lightbox */
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img-wrap img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn  = lightbox.querySelector('.lightbox-prev');
  const nextBtn  = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;
  const visibleItems = () => [...galleryItems].filter(i => i.style.display !== 'none');

  function openLightbox(index) {
    const items = visibleItems();
    if (!items[index]) return;
    currentIndex = index;
    const img = items[index].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    if (lightboxCaption) lightboxCaption.textContent = img.alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  if (prevBtn) prevBtn.addEventListener('click', () => openLightbox((currentIndex - 1 + visibleItems().length) % visibleItems().length));
  if (nextBtn) nextBtn.addEventListener('click', () => openLightbox((currentIndex + 1) % visibleItems().length));

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn && prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn && nextBtn.click();
  });
}

/* ── FAQ Accordion ── */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => i.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });

  /* Category filter */
  const catBtns = document.querySelectorAll('.faq-cat-btn');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.category === cat;
        item.style.display = show ? 'block' : 'none';
      });
    });
  });
}

/* ── Room Filter (Accommodation page) ── */
function initRoomFilter() {
  const btns = document.querySelectorAll('.rooms-filter .filter-btn');
  const cards = document.querySelectorAll('.room-detail-card');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.type === filter;
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.display = show ? 'flex' : 'none';
          if (show) {
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            });
          }
        }, 200);
      });
    });
  });
}

/* ── Booking Form ── */
function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  const checkin  = form.querySelector('#checkin');
  const checkout = form.querySelector('#checkout');
  if (checkin)  checkin.min  = today;
  if (checkout) checkout.min = today;

  checkin && checkin.addEventListener('change', () => {
    if (checkout) checkout.min = checkin.value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    // Show loading state
    const btn = form.querySelector('.form-submit');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
    btn.disabled = true;

    // Simulate submission (Formspree will handle real submit)
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled = false;
      showBookingConfirmation();
      form.reset();
    }, 1800);
  });
}

function validateForm(form) {
  let valid = true;
  const required = form.querySelectorAll('[required]');
  required.forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#e74c3c';
      field.style.boxShadow   = '0 0 0 3px rgba(231,76,60,0.12)';
      valid = false;
      setTimeout(() => {
        field.style.borderColor = '';
        field.style.boxShadow   = '';
      }, 3000);
    }
  });
  return valid;
}

function showBookingConfirmation() {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* ── Contact Form ── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #2E7D46, #1A5C2A)';
      form.reset();
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1600);
  });
}

/* ── Modal Close ── */
function initModals() {
  const overlays = document.querySelectorAll('.modal-overlay');
  overlays.forEach(overlay => {
    const closeBtn = overlay.querySelector('.modal-close');
    const closeAny = overlay.querySelectorAll('[data-modal-close]');

    if (closeBtn) closeBtn.addEventListener('click', () => closeModal(overlay));
    closeAny.forEach(el => el.addEventListener('click', () => closeModal(overlay)));
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(overlay); });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(closeModal);
    }
  });
}

function closeModal(overlay) {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Gallery Mosaic (Homepage preview) ── */
function initMosaicGallery() {
  const items = document.querySelectorAll('.mosaic-item');
  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      // Open lightbox if present, or just animate
      const img = item.querySelector('img');
      if (!img) return;
    });
  });
}

/* ── Back to Top ── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Cookie Banner ── */
function initCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  const btn    = document.querySelector('.cookie-btn');
  if (!banner) return;

  const accepted = localStorage.getItem('debbie-cookie-ok');
  if (!accepted) {
    setTimeout(() => banner.classList.add('visible'), 3000);
  }

  if (btn) {
    btn.addEventListener('click', () => {
      banner.classList.remove('visible');
      localStorage.setItem('debbie-cookie-ok', '1');
    });
  }
}

/* ── Active Nav Link ── */
function initActiveNav() {
  const links = document.querySelectorAll('.nav-links a');
  const path  = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ── Parallax Hero ── */
function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const offset = window.scrollY;
    heroBg.style.transform = `scale(1.08) translateY(${offset * 0.25}px)`;
  }, { passive: true });
}

/* ── Smooth Anchor Scroll ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── Legal Page TOC Active State ── */
function initLegalTOC() {
  const sections = document.querySelectorAll('.legal-content h2[id]');
  const navLinks = document.querySelectorAll('.legal-nav a');
  if (!sections.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
}

/* ── Check-in Date Validation ── */
function initDateValidation() {
  const checkinInputs  = document.querySelectorAll('input[type="date"][id*="checkin"], input[name*="checkin"]');
  const checkoutInputs = document.querySelectorAll('input[type="date"][id*="checkout"], input[name*="checkout"]');

  const today = new Date().toISOString().split('T')[0];
  checkinInputs.forEach(inp => { inp.min = today; });
  checkoutInputs.forEach(inp => { inp.min = today; });

  checkinInputs.forEach((inp, i) => {
    inp.addEventListener('change', () => {
      if (checkoutInputs[i]) checkoutInputs[i].min = inp.value;
    });
  });
}

/* ── Image Lazy Loading Enhancement ── */
function initLazyImages() {
  const images = document.querySelectorAll('img[data-src]');
  if (!('IntersectionObserver' in window)) {
    images.forEach(img => { img.src = img.dataset.src; });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  images.forEach(img => observer.observe(img));
}

/* ── Booking Modal Trigger (Book Now Buttons) ── */
function initBookNowButtons() {
  const bookBtns = document.querySelectorAll('[data-action="book"]');
  bookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const roomType = btn.dataset.room || '';
      const selectEl = document.getElementById('room-type');
      if (selectEl && roomType) {
        // Pre-fill room type
        [...selectEl.options].forEach(opt => {
          if (opt.value === roomType || opt.text.toLowerCase().includes(roomType.toLowerCase())) {
            opt.selected = true;
          }
        });
      }
      // Navigate to booking page
      window.location.href = 'booking.html';
    });
  });
}

/* ── Typewriter Effect for Hero ── */
function initTypewriter() {
  const el = document.querySelector('[data-typewriter]');
  if (!el) return;

  const words = el.dataset.typewriter.split('|');
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const word = words[wordIndex];
    if (deleting) {
      el.textContent = word.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = word.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = deleting ? 60 : 100;

    if (!deleting && charIndex === word.length) {
      delay = 2000;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ── Initialize Everything ── */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initMobileNav();
  initScrollReveal();
  initCounters();
  initTestimonialsSlider();
  initGallery();
  initFAQ();
  initRoomFilter();
  initBookingForm();
  initContactForm();
  initModals();
  initMosaicGallery();
  initBackToTop();
  initCookieBanner();
  initActiveNav();
  initParallax();
  initSmoothScroll();
  initLegalTOC();
  initDateValidation();
  initLazyImages();
  initBookNowButtons();
  initTypewriter();
});
                 
