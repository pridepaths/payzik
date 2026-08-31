// Payzik site interactions: mobile nav + product dropdown + current year
document.addEventListener('DOMContentLoaded', function () {
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  var productDropdown = document.getElementById('productDropdown');
  var productToggle = document.getElementById('productToggle');
  var yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
  }

  // On mobile, tapping "Product" expands the dropdown inline instead of hover
  if (productToggle && productDropdown) {
    productToggle.addEventListener('click', function (e) {
      if (window.innerWidth <= 860) {
        e.preventDefault();
        productDropdown.classList.toggle('open');
      }
    });
  }

  // Close mobile menu after clicking a link
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 860) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        productDropdown.classList.remove('open');
      }
    });
  });

  // Smooth-scroll offset for sticky header
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          var headerH = document.querySelector('.site-header').offsetHeight;
          var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

  // Scroll-reveal: fade + slide up as sections and cards enter the viewport.
  // Hero content reveals immediately on load; everything else reveals a little
  // *before* it fully enters the viewport (positive bottom rootMargin) so the
  // motion feels smooth and anticipatory instead of a sudden pop-in.
  var heroTargets = document.querySelectorAll('.hero-copy, .hero-media');
  var scrollTargets = document.querySelectorAll(
    '.split-copy, .split-media, .why-matters, .feature-card, ' +
    '.capability-item, .benefits, .benefit-card, .trust-card, .get-started, .site-footer'
  );
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    heroTargets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = i * 120 + 'ms';
    });
    // Trigger on next frame so the browser paints the 0-opacity state first,
    // then animates in -- guarantees a visible fade+slide on page load.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        heroTargets.forEach(function (el) { el.classList.add('is-visible'); });
      });
    });
  }

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    scrollTargets.forEach(function (el, i) {
      el.classList.add('reveal');
      // small stagger for elements grouped in the same grid/row
      el.style.transitionDelay = (i % 6) * 70 + 'ms';
    });

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
    );

    scrollTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // ---- Request Demo modal ----
  var modal = document.getElementById('demoModal');
  var modalBody = document.getElementById('demoModalBody');
  var modalSuccess = document.getElementById('demoSuccess');
  var demoForm = document.getElementById('demoForm');
  var demoEmail = document.getElementById('demoEmail');
  var demoError = document.getElementById('demoError');
  var demoSubmit = document.getElementById('demoSubmit');
  var lastFocused = null;
  var lockedScrollY = 0;

  function openModal(e) {
    if (e) e.preventDefault();
    if (!modal) return;
    lastFocused = document.activeElement;

    // Robust scroll lock (plain overflow:hidden isn't reliable on iOS Safari):
    // pin the body in place at its current scroll position instead.
    lockedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = -lockedScrollY + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    // reset to form view each time it's opened
    modalBody.hidden = false;
    modalSuccess.hidden = true;
    demoError.hidden = true;
    setTimeout(function () {
      if (demoEmail) {
        try { demoEmail.focus({ preventScroll: true }); }
        catch (err) { /* older Safari: skip focus rather than jump the page */ }
      }
    }, 250);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    window.scrollTo(0, lockedScrollY);

    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.js-open-demo').forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });

  var demoModalClose = document.getElementById('demoModalClose');
  if (demoModalClose) demoModalClose.addEventListener('click', closeModal);

  var demoDone = document.getElementById('demoDone');
  if (demoDone) demoDone.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
  });

  if (demoForm) {
    demoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (demoEmail.value || '').trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        demoError.hidden = false;
        demoEmail.focus();
        return;
      }
      demoError.hidden = true;
      demoSubmit.disabled = true;
      demoSubmit.textContent = 'Sending…';

      var company = document.getElementById('demoCompany').value || '';

      fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, company: company }),
      })
        .catch(function () { /* still show success even if logging fails */ })
        .finally(function () {
          demoSubmit.disabled = false;
          demoSubmit.textContent = 'Request Demo';
          modalBody.hidden = true;
          modalSuccess.hidden = false;
          demoForm.reset();
        });
    });
  }
});
