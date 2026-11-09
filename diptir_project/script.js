document.documentElement.classList.add('js');

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const chips = document.querySelectorAll('.chip');
const cards = document.querySelectorAll('[data-category]');
const revealItems = document.querySelectorAll('.reveal');
const form = document.querySelector('.contact-form');
const yearEl = document.getElementById('year');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (chips.length) {
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;

      chips.forEach((button) => {
        const active = button === chip;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });

      cards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.category === filter;
        card.style.display = matches ? '' : 'none';
      });
    });
  });
}

if (revealItems.length) {
  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observerInstance.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

if (form) {
  const statusBox = form.querySelector('.form-status');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const fields = form.querySelectorAll('input, select, textarea');
    let isValid = true;

    fields.forEach((field) => {
      const isRequired = field.hasAttribute('required');
      if (isRequired && !field.value.trim()) {
        isValid = false;
        field.setAttribute('aria-invalid', 'true');
      } else {
        field.setAttribute('aria-invalid', 'false');
      }
    });

    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value && !emailField.checkValidity()) {
      isValid = false;
      emailField.setAttribute('aria-invalid', 'true');
    }

    const consent = form.querySelector('input[name="consent"]');
    if (!consent || !consent.checked) {
      isValid = false;
    }

    if (!isValid) {
      if (statusBox) {
        statusBox.textContent = 'Please complete all required fields before sending your message.';
        statusBox.style.color = '#d62839';
      }
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
    }

    setTimeout(() => {
      if (statusBox) {
        statusBox.textContent = 'Your message has been received. Thank you for reaching out.';
        statusBox.style.color = '#006a4e';
      }
      form.reset();
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send message';
      }
    }, 800);
  });
}
