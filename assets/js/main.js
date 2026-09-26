/* ==========================================================================
   ONLINE MAGAZINE — EDITORIAL INTERACTIVE SCRIPT
   Vanilla JS ES6+ (No external framework dependencies)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeaderScroll();
  initScrollReveals();
  initBeerFilters();
  initInteractiveBrewingTabs();
  initTastingScales();
  initContactForm();
  initActiveNavLink();
  initParallaxEffects();
  initBackToTop();
});

/* --------------------------------------------------------------------------
   1. NAVIGATION & MOBILE OVERLAY
   -------------------------------------------------------------------------- */
function initNavigation() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const mobileCloseBtn = document.querySelector('.mobile-close-btn');
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');

  if (!hamburgerBtn || !mobileOverlay) return;

  function toggleMobileMenu(open) {
    const isOpen = open !== undefined ? open : !mobileOverlay.classList.contains('is-open');
    if (isOpen) {
      mobileOverlay.classList.add('is-open');
      hamburgerBtn.classList.add('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      mobileOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      mobileOverlay.classList.remove('is-open');
      hamburgerBtn.classList.remove('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      mobileOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  hamburgerBtn.addEventListener('click', () => toggleMobileMenu());
  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', () => toggleMobileMenu(false));
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // Close overlay on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileOverlay.classList.contains('is-open')) {
      toggleMobileMenu(false);
    }
  });

  // Close overlay on desktop resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && mobileOverlay.classList.contains('is-open')) {
      toggleMobileMenu(false);
    }
  });
}

/* --------------------------------------------------------------------------
   2. HEADER SCROLL STABILITY & SCROLLED STATE
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   3. HIGHLIGHT ACTIVE NAV LINK
   -------------------------------------------------------------------------- */
function initActiveNavLink() {
  let currentPath = window.location.pathname.split('/').pop();
  if (!currentPath || currentPath === '') {
    currentPath = 'index.html';
  }

  const allNavLinks = document.querySelectorAll('.nav-link, .mobile-menu-link, .footer-link');
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const cleanHref = href.split('#')[0].split('?')[0];

    if (cleanHref === currentPath || (currentPath === 'index.html' && (cleanHref === './' || cleanHref === ''))) {
      link.classList.add('active');
    } else if (cleanHref !== currentPath && (cleanHref === 'index.html' || cleanHref === 'brewery.html' || cleanHref === 'beers.html' || cleanHref === 'contact.html')) {
      link.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   3. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-stagger');

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   4. ARTICLES / STORIES PAGE — CATEGORY FILTER SYSTEM
   -------------------------------------------------------------------------- */
function initBeerFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const beerCards = document.querySelectorAll('.beer-catalog-item');

  if (filterBtns.length === 0 || beerCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      beerCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. ABOUT PAGE — INTERACTIVE EDITORIAL PROCESS TABS
   -------------------------------------------------------------------------- */
const editorialStagesData = {
  pitch: {
    title: '01 / TOPIC INVESTIGATION & PITCH',
    desc: 'Our writers and subject specialists track emerging breakthroughs, societal shifts, and cultural phenomenons. Each story begins with a rigorous pitch evaluated for nuance, timeliness, and reader value.',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop'
  },
  research: {
    title: '02 / FIELD REPORTING & INTERVIEWS',
    desc: 'Writers conduct on-the-ground reporting, in-depth interviews with industry pioneers, and exhaustive archival research. We cross-verify data models, primary source documents, and statistical surveys.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop'
  },
  narrative: {
    title: '03 / DRAFTING & LONG-FORM NARRATIVE',
    desc: 'Transforming complex data and human stories into compelling prose. Our writers balance rigorous analytical depth with clear, accessible, and literary editorial storytelling.',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop'
  },
  review: {
    title: '04 / FACT-CHECK & PEER REVIEW',
    desc: 'Every quote, statistic, and empirical claim undergoes rigorous fact-checking by dedicated editors. Complex technological and economic stories are reviewed by specialized academic consultants.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'
  },
  curation: {
    title: '05 / VISUAL CURATION & ART DIRECTION',
    desc: 'Our design and photo editors commission bespoke photography, infographic data visualizations, and custom typography treatments to elevate the reading experience.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop'
  },
  publish: {
    title: '06 / GLOBAL DIGITAL PUBLICATION',
    desc: 'The finished piece is published across our global digital magazine network, optimized for immersive long-form reading on desktop, tablet, and mobile devices worldwide.',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop'
  }
};

function initInteractiveBrewingTabs() {
  const tabBtns = document.querySelectorAll('.process-tab-btn');
  const titleEl = document.getElementById('process-stage-title');
  const descEl = document.getElementById('process-stage-desc');
  const imgEl = document.getElementById('process-stage-img');

  if (tabBtns.length === 0 || !titleEl || !descEl || !imgEl) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const stageKey = btn.getAttribute('data-stage');
      const data = editorialStagesData[stageKey];

      if (!data) return;

      // Smooth fade transition
      titleEl.style.opacity = '0';
      descEl.style.opacity = '0';
      imgEl.style.opacity = '0';

      setTimeout(() => {
        titleEl.textContent = data.title;
        descEl.textContent = data.desc;
        imgEl.src = data.image;

        titleEl.style.opacity = '1';
        descEl.style.opacity = '1';
        imgEl.style.opacity = '1';
      }, 250);
    });
  });
}

/* --------------------------------------------------------------------------
   6. EDITORIAL QUALITY BENCHMARKS ANIMATION
   -------------------------------------------------------------------------- */
function initTastingScales() {
  const scaleContainers = document.querySelectorAll('.scale-dots');

  if (scaleContainers.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const rating = parseInt(entry.target.getAttribute('data-rating') || '0', 10);
        const dots = entry.target.querySelectorAll('.scale-dot');
        
        dots.forEach((dot, index) => {
          if (index < rating) {
            setTimeout(() => {
              dot.classList.add('filled');
            }, index * 120);
          }
        });

        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  scaleContainers.forEach(container => observer.observe(container));
}

/* --------------------------------------------------------------------------
   7. CONTACT FORM VALIDATION & FEEDBACK
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      if (statusEl) {
        statusEl.className = 'form-status';
        statusEl.style.display = 'block';
        statusEl.style.backgroundColor = '#111827';
        statusEl.style.color = '#FFFFFF';
        statusEl.textContent = 'Please fill out all required fields before sending.';
      }
      return;
    }

    // Submit Simulation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'SENDING ENQUIRY...';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      if (statusEl) {
        statusEl.className = 'form-status success';
        statusEl.style.display = 'block';
        statusEl.textContent = 'THANK YOU! Your message and editorial enquiry has been sent to the Online Magazine editorial team. We will review and respond promptly.';
      }
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   8. SUBTLE MOUSE PARALLAX FOR ALL HERO IMAGES
   -------------------------------------------------------------------------- */
function initParallaxEffects() {
  const heroImages = document.querySelectorAll('.hero-img-wrap img');
  if (heroImages.length === 0) return;

  window.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.015;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.015;
    heroImages.forEach(img => {
      img.style.transform = `scale(1.06) translate(${moveX}px, ${moveY}px)`;
    });
  });
}

/* --------------------------------------------------------------------------
   9. BACK TO TOP BUTTON CONTROLLER
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  const toggleVisibility = () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
