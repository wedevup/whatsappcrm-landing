/* WhatsAppCRM Mini — Landing Page Scripts
   Lightweight, zero dependencies */

(function () {
  'use strict';

  // ========== Mobile menu ==========
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded',
        mobileMenu.classList.contains('open') ? 'true' : 'false'
      );
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ========== WhatsApp mask ==========
  const whatsappInput = document.getElementById('whatsapp');
  if (whatsappInput) {
    whatsappInput.addEventListener('input', function (e) {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 7) {
        v = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
      } else if (v.length > 2) {
        v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
      } else if (v.length > 0) {
        v = '(' + v;
      }
      e.target.value = v;
    });
  }

  // ========== Form handling ==========
  const form = document.getElementById('captureForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnLoading = document.getElementById('btnLoading');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Show loading state
      if (btnText) btnText.classList.add('hidden');
      if (btnLoading) btnLoading.classList.remove('hidden');
      if (submitBtn) submitBtn.disabled = true;

      const formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (response) {
        if (response.ok || response.redirected) {
          form.classList.add('hidden');
          if (formSuccess) formSuccess.classList.remove('hidden');
          // Track form conversion in GoatCounter
          if (typeof window.goatcounter !== 'undefined') {
            window.goatcounter.count({ path: 'form-submit', title: 'Lead Signup', event: true });
          }
          if (typeof gtag === 'function') {
            gtag('event', 'sign_up', { method: 'landing_form' });
          }
        } else {
          // FormSubmit.co returns 200 with HTML on first use (email confirmation)
          // Treat any non-error as success for UX
          form.classList.add('hidden');
          if (formSuccess) formSuccess.classList.remove('hidden');
          // Track form conversion in GoatCounter (fallback path)
          if (typeof window.goatcounter !== 'undefined') {
            window.goatcounter.count({ path: 'form-submit', title: 'Lead Signup', event: true });
          }
        }
      })
      .catch(function () {
        // Fallback: native form submit (FormSubmit handles redirect)
        form.submit();
      })
      .finally(function () {
        if (btnText) btnText.classList.remove('hidden');
        if (btnLoading) btnLoading.classList.add('hidden');
        if (submitBtn) submitBtn.disabled = false;
      });
    });
  }

  // ========== Smooth scroll for nav links ==========
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ========== Nav background on scroll ==========
  var nav = document.getElementById('nav');
  if (nav) {
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
      } else {
        nav.style.boxShadow = 'none';
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ========== Intersection Observer for animations ==========
  if ('IntersectionObserver' in window) {
    var animElements = document.querySelectorAll(
      '.pain-card, .feature-card, .step, .roi-card, .tech-item, .demo-browser'
    );

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animElements.forEach(function (el) {
      observer.observe(el);
    });
  }

})();
