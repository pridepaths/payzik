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
});
