/* ACM NMIMS Indore Student Chapter - Central UI Logic */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Responsive Navbar Toggle
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('mobile-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove('mobile-open');
      }
    });

    // Close menu when clicking links (mobile)
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // 2. Dynamic Nav-link Active State
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop() || 'index.html';

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 3. Simulated Contact / Newsletter Form Submissions
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        showToast(`Thank you! "${emailInput.value}" has been subscribed to our newsletter.`);
        emailInput.value = '';
      }
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = contactForm.querySelector('input[placeholder="Full Name"]') || contactForm.querySelector('input[name="fullname"]');
      const emailInput = contactForm.querySelector('input[placeholder="Email Address"]') || contactForm.querySelector('input[name="email"]');
      
      const name = nameInput ? nameInput.value : 'there';
      
      showToast(`Success! Thank you, ${name}. Your message has been sent. We'll get back to you soon.`);
      contactForm.reset();
    });
  }
});

// Toast Notification Utility
function showToast(message) {
  // Remove existing toast if any
  const existingToast = document.querySelector('.custom-toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  toast.innerText = message;
  
  // Custom temporary styling
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#081625',
    color: '#f8fafc',
    border: '1px solid #5ec6ed',
    padding: '16px 24px',
    borderRadius: '12px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    zIndex: '1000',
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
    maxWidth: '350px'
  });

  // Add slideIn animation dynamically
  const styleSheet = document.createElement('style');
  styleSheet.innerText = `
    @keyframes slideIn {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(styleSheet);

  document.body.appendChild(toast);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
