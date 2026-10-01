document.addEventListener('DOMContentLoaded', () => {
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby1ZyeEWBFjDreKrpWM-AG5J2Vns3ydxsh_bOha-eZN4zYfpbc__1-ulQhKThJtqiKF/exec';

  // Mobile navigation
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('mobile-open');
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove('mobile-open');
      }
    });

    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');

      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();

          const headerOffset = 90;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Registration
  const regForm = document.getElementById('registration-form');
  const successCard = document.getElementById('submission-success');
  const resetBtn = document.getElementById('btn-register-another');

  if (!regForm) return;

  const nameInput = document.getElementById('reg-fullname');
  const emailInput = document.getElementById('reg-email');
  const yearSelect = document.getElementById('reg-year');
  const courseInput = document.getElementById('reg-course');

  // Clear errors while typing
  [nameInput, emailInput, yearSelect, courseInput].forEach((input) => {
    if (!input) return;

    input.addEventListener('input', () => clearFieldError(input));
    input.addEventListener('change', () => clearFieldError(input));
  });

  // Submit registration
  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;

    const nameVal = nameInput ? nameInput.value.trim() : '';
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const yearVal = yearSelect ? yearSelect.value : '';
    const courseVal = courseInput ? courseInput.value.trim() : '';

    // Name validation
    if (!nameVal || nameVal.length < 2) {
      setFieldError(
        nameInput,
        'Please enter your full name (minimum 2 characters).'
      );
      isValid = false;
    } else {
      clearFieldError(nameInput);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailVal || !emailRegex.test(emailVal)) {
      setFieldError(
        emailInput,
        'Please enter a valid email address.'
      );
      isValid = false;
    } else {
      clearFieldError(emailInput);
    }

    // Year validation
    if (!yearVal) {
      setFieldError(
        yearSelect,
        'Please select your current academic year.'
      );
      isValid = false;
    } else {
      clearFieldError(yearSelect);
    }

    // Course validation
    if (!courseVal || courseVal.length < 2) {
      setFieldError(
        courseInput,
        'Please enter your program/course.'
      );
      isValid = false;
    } else {
      clearFieldError(courseInput);
    }

    if (!isValid) return;

    // Send data to Google Apps Script
    try {
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          name: nameVal,
          email: emailVal,
          year: yearVal,
          course: courseVal
        })
      });

      // Show submitted information
      const summaryName = document.getElementById('summary-name');
      const summaryEmail = document.getElementById('summary-email');
      const summaryYear = document.getElementById('summary-year');
      const summaryCourse = document.getElementById('summary-course');

      if (summaryName) summaryName.textContent = nameVal;
      if (summaryEmail) summaryEmail.textContent = emailVal;
      if (summaryYear) summaryYear.textContent = yearVal;
      if (summaryCourse) summaryCourse.textContent = courseVal;

      // Hide form and show success
      regForm.style.display = 'none';

      if (successCard) {
        successCard.style.display = 'block';
      }

      showCyberForgeToast(
        `Registration Confirmed! Welcome to CyberForge, ${nameVal}.`
      );

      if (window.innerWidth < 768 && successCard) {
        successCard.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }

    } catch (error) {
      console.error('Registration submission failed:', error);

      showCyberForgeToast(
        'Registration could not be submitted. Please try again.'
      );
    }
  });

  // Register another participant
  if (resetBtn && successCard) {
    resetBtn.addEventListener('click', () => {
      regForm.reset();

      regForm.querySelectorAll('.form-control').forEach((el) => {
        el.classList.remove('is-invalid');
      });

      regForm.querySelectorAll('.form-error').forEach((el) => {
        el.classList.remove('visible');
        el.textContent = '';
      });

      successCard.style.display = 'none';
      regForm.style.display = 'block';

      const firstInput = document.getElementById('reg-fullname');

      if (firstInput) {
        firstInput.focus();
      }
    });
  }
});

function setFieldError(field, message) {
  if (!field) return;

  field.classList.add('is-invalid');

  const errorContainer =
    field.parentElement.querySelector('.form-error');

  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.classList.add('visible');
  }
}

function clearFieldError(field) {
  if (!field) return;

  field.classList.remove('is-invalid');

  const errorContainer =
    field.parentElement.querySelector('.form-error');

  if (errorContainer) {
    errorContainer.textContent = '';
    errorContainer.classList.remove('visible');
  }
}

function showCyberForgeToast(message) {
  const existingToast = document.querySelector('.custom-toast');

  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');

  toast.className = 'custom-toast';

  const checkIcon = `
    <svg width="20" height="20" viewBox="0 0 24 24"
      fill="none"
      stroke="#5ec6ed"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `;

  toast.innerHTML = `${checkIcon}<span>${message}</span>`;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation =
      'slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';

    setTimeout(() => toast.remove(), 320);
  }, 4500);
}