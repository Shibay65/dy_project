document.documentElement.classList.add('js');

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const chips = document.querySelectorAll('.chip');
const cards = document.querySelectorAll('[data-category]');
const revealItems = document.querySelectorAll('.reveal');
const forms = document.querySelectorAll('.contact-form');
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

if (forms.length) {
  forms.forEach((form) => {
    const statusBox = form.querySelector('.form-status');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const fields = Array.from(form.querySelectorAll('input, select, textarea'));
      let firstInvalidField = null;

      fields.forEach((field) => {
        const isMissing = field.required && (
          field.type === 'checkbox' ? !field.checked : !field.value.trim()
        );
        const isInvalid = isMissing || !field.checkValidity();

        field.setAttribute('aria-invalid', String(isInvalid));
        if (isInvalid && !firstInvalidField) {
          firstInvalidField = field;
        }
      });

      if (firstInvalidField) {
        if (statusBox) {
          if (firstInvalidField.type === 'checkbox') {
            statusBox.textContent = 'Please agree to the consent statement before sending your message.';
          } else if (firstInvalidField.type === 'email' && firstInvalidField.value.trim()) {
            statusBox.textContent = 'Please enter a valid email address.';
          } else {
            statusBox.textContent = 'Please complete all required fields before sending your message.';
          }
          statusBox.style.color = '#d62839';
        }
        firstInvalidField.focus();
        return;
      }

      const submittedData = {
        name: form.elements.namedItem('name').value.trim(),
        email: form.elements.namedItem('email').value.trim(),
        subject: form.elements.namedItem('subject').value.trim(),
        message: form.elements.namedItem('message').value.trim()
      };
      const dialog = document.createElement('dialog');
      dialog.className = 'confirmation-dialog';
      dialog.setAttribute('aria-labelledby', 'confirmation-title');

      const content = document.createElement('div');
      content.className = 'confirmation-content';

      const heading = document.createElement('h2');
      heading.id = 'confirmation-title';
      heading.tabIndex = -1;
      heading.textContent = 'Message received';
      content.appendChild(heading);

      const successMessage = document.createElement('p');
      successMessage.className = 'confirmation-success';
      successMessage.textContent = 'Your message has been submitted successfully!';
      content.appendChild(successMessage);

      const details = document.createElement('dl');
      details.className = 'confirmation-details';
      [
        ['Name', submittedData.name],
        ['Email', submittedData.email],
        ['Subject', submittedData.subject],
        ['Message', submittedData.message]
      ].forEach(([label, value]) => {
        const row = document.createElement('div');
        row.className = 'confirmation-details__row';

        const term = document.createElement('dt');
        term.textContent = label;
        const description = document.createElement('dd');
        description.textContent = value;

        row.append(term, description);
        details.appendChild(row);
      });
      content.appendChild(details);

      const countdown = document.createElement('p');
      countdown.className = 'confirmation-countdown';
      countdown.setAttribute('aria-live', 'polite');
      content.appendChild(countdown);

      dialog.appendChild(content);
      document.body.appendChild(dialog);
      dialog.addEventListener('cancel', (cancelEvent) => cancelEvent.preventDefault());
      dialog.showModal();
      heading.focus();

      const returnAt = Date.now() + 10000;
      const updateCountdown = () => {
        const secondsLeft = Math.max(0, Math.ceil((returnAt - Date.now()) / 1000));
        countdown.textContent = `This page will close automatically in ${secondsLeft} second${secondsLeft === 1 ? '' : 's'}.`;
      };
      updateCountdown();

      const countdownInterval = window.setInterval(updateCountdown, 250);
      window.setTimeout(() => {
        window.clearInterval(countdownInterval);
        dialog.close();
        dialog.remove();
        form.reset();
        if (statusBox) {
          statusBox.textContent = 'Your message has been received. Thank you for reaching out.';
          statusBox.style.color = '#006a4e';
        }
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 10000);
    });
  });
}
