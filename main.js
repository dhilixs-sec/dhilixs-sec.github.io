/**
 * Dhilipkumar N B - Portfolio Website Core JavaScript
 * Modern, clean, modular, and secure client-side script.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DOM Elements
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('backToTop');
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  // Modal elements
  const certModal = document.getElementById('certModal');
  const certModalClose = document.getElementById('certModalClose');
  const certModalImg = document.getElementById('certModalImg');
  const certModalTitle = document.getElementById('certModalTitle');
  const certModalIssuer = document.getElementById('certModalIssuer');
  const certModalDesc = document.getElementById('certModalDesc');
  const certModalId = document.getElementById('certModalId');
  const certModalDownload = document.getElementById('certModalDownload');

  // Contact form elements
  const contactForm = document.getElementById('contactForm');
  const copyEmailBtn = document.getElementById('copyEmailBtn');

  // 2. Mobile Menu Toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking on any navigation link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 3. Navbar Scroll Effect & Back-to-Top Button
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Navbar background blur/shrink
    if (scrollPos > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollPos > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active link highlighting based on scroll position
    highlightActiveNavLink();
  });

  // Back to Top button action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 4. Active Section Highlighting
  const sections = document.querySelectorAll('section[id]');
  function highlightActiveNavLink() {
    const scrollY = window.pageYOffset + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  }

  // 5. Hero Subtitle Dynamic Typing Effect
  const typeTarget = document.getElementById('typingHeadline');
  if (typeTarget) {
    const phrases = [
      'Aspiring AI & ML Developer',
      'CSE (AI & ML) Undergrad',
      'Python & C++ Programmer',
      'Intelligent Systems Enthusiast'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 90;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typeTarget.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 45;
      } else {
        typeTarget.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 95;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 1800; // Pause at end of phrase
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400; // Pause before typing new phrase
      }

      setTimeout(typeLoop, typeSpeed);
    }

    // Start typing after initial load
    setTimeout(typeLoop, 600);
  }

  // 6. Skills Category Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (filterButtons.length && skillCards.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        skillCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // 7. Certificate Modal Viewer
  const certData = {
    'saylor': {
      title: 'Saylor Academy Certificate',
      issuer: 'Saylor Academy Open Education Initiative',
      desc: 'Credential awarded for successful completion of comprehensive Computer Science and Technology foundations, demonstrating dedicated coursework, conceptual mastery, and disciplined exam performance.',
      id: 'SAY-CS-2026-DNB',
      imgSrc: 'assets/images/cert-saylor.svg',
      downloadSrc: 'assets/images/cert-saylor.svg'
    },
    'python': {
      title: 'Python Basics Certificate',
      issuer: 'Accredited Python Competency Board',
      desc: 'Certificate of competency validating fundamental proficiency in Python programming: variables, data structures, conditional control flow, iterative algorithms, functions, and problem-solving techniques.',
      id: 'PY-BASICS-2026-DNB',
      imgSrc: 'assets/images/cert-python.svg',
      downloadSrc: 'assets/images/cert-python.svg'
    }
  };

  const certTriggers = document.querySelectorAll('[data-cert-key]');
  if (certTriggers.length && certModal) {
    certTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const key = trigger.getAttribute('data-cert-key');
        const data = certData[key];

        if (data) {
          certModalTitle.textContent = data.title;
          certModalIssuer.textContent = data.issuer;
          certModalDesc.textContent = data.desc;
          certModalId.textContent = `Credential ID: ${data.id}`;
          certModalImg.src = data.imgSrc;
          certModalImg.alt = data.title;
          certModalDownload.href = data.downloadSrc;
          certModalDownload.setAttribute('download', `${data.title.replace(/\s+/g, '_')}.svg`);

          openModal(certModal);
        }
      });
    });

    if (certModalClose) {
      certModalClose.addEventListener('click', () => closeModal(certModal));
    }

    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeModal(certModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certModal.classList.contains('active')) {
        closeModal(certModal);
      }
    });
  }

  function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // 8. Copy Email to Clipboard Feature
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'dhilipkumar.nb.dev@example.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('📋 Email copied to clipboard!');
        const originalText = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = '<span>✓ Copied!</span>';
        setTimeout(() => {
          copyEmailBtn.innerHTML = originalText;
        }, 2200);
      }).catch(() => {
        showToast('Unable to copy automatically. Email: ' + email);
      });
    });
  }

  // 9. Contact Form Validation & Secure Feedback
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const subjectInput = document.getElementById('senderSubject');
      const messageInput = document.getElementById('senderMessage');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        showFieldError(nameInput, true);
        isValid = false;
      } else {
        showFieldError(nameInput, false);
      }

      // Validate Email (RFC regex)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        showFieldError(emailInput, true);
        isValid = false;
      } else {
        showFieldError(emailInput, false);
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        showFieldError(subjectInput, true);
        isValid = false;
      } else {
        showFieldError(subjectInput, false);
      }

      // Validate Message (min 10 chars)
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        showFieldError(messageInput, true);
        isValid = false;
      } else {
        showFieldError(messageInput, false);
      }

      if (!isValid) {
        showToast('⚠️ Please correct the highlighted errors in the form.');
        return;
      }

      // Simulate sending with loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending Message... ☕</span>';

      setTimeout(() => {
        // Sanitize strings for mailto fallback
        const name = encodeURIComponent(nameInput.value.trim());
        const subject = encodeURIComponent(`[Portfolio Inquiry] ${subjectInput.value.trim()}`);
        const body = encodeURIComponent(
          `Hello Dhilipkumar,\n\nName: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`
        );

        // Pre-build mailto URI as a direct fallback
        const mailtoUri = `mailto:dhilipkumar.nb.dev@example.com?subject=${subject}&body=${body}`;

        // Reset Form
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        showToast('✨ Thank you! Your message inquiry has been recorded.');

        // Prompt user if they want to dispatch directly via their email client
        setTimeout(() => {
          if (confirm('Would you like to open your default email client to send this message directly to Dhilipkumar?')) {
            window.location.href = mailtoUri;
          }
        }, 500);
      }, 1000);
    });

    // Real-time error removal on input
    const formFields = contactForm.querySelectorAll('.form-input, .form-textarea');
    formFields.forEach(field => {
      field.addEventListener('input', () => {
        showFieldError(field, false);
      });
    });
  }

  function showFieldError(field, isError) {
    if (isError) {
      field.classList.add('invalid');
    } else {
      field.classList.remove('invalid');
    }
  }

  // 10. Toast Notification System
  function showToast(msg) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = msg;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // 11. Intersection Observer for Scroll Animations
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealElements.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // 12. Safe Profile Photo Replacement Handler
  // Users can click the avatar card to test file upload preview locally
  const avatarCard = document.getElementById('profileAvatarImg');
  const avatarInput = document.getElementById('avatarUploadInput');

  if (avatarCard && avatarInput) {
    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          avatarCard.src = event.target.result;
          showToast('📸 Profile preview updated successfully!');
        };
        reader.readAsDataURL(file);
      }
    });
  }
});
