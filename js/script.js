/* ========================================
   BROKE N BUILT SERVICES - MAIN JAVASCRIPT
   ======================================== */

// ===== DOCUMENT READY =====
document.addEventListener('DOMContentLoaded', () => {

  // Initialize branding FIRST so data-count attributes are correct
  initBranding();

  // Initialize ALL modules right away (no need to wait for projects)
  initPreloader();
  initNavigation();
  initCounterAnimation();
  initProjectFilters();
  initTestimonialCarousel();
  initContactForm();
  initChatbot();
  initBackToTop();
  initSmoothScroll();
  initAOS();

  // Load projects asynchronously — doesn't block anything
  loadProjects();

});

// ========================================
// PRELOADER
// ========================================
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Hide preloader after a short delay for smooth transition
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 1200);

  // Also hide on window load as backup
  window.addEventListener('load', () => {
    if (!preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
    }
  });

  // Emergency fallback: force hide after 3 seconds no matter what
  setTimeout(() => {
    if (!preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
      // Hard hide after transition completes
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 800);
    }
  }, 3000);
}

// ========================================
// NAVIGATION
// ========================================
function initNavigation() {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!header) return;

  // Hamburger toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
  }

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      navMenu?.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });

  // Header scroll effect
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    updateActiveNavLink();

    lastScroll = currentScroll;
  });

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

// ========================================
// AOS - ANIMATE ON SCROLL INIT
// ========================================
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic',
    });
  }

  // Refresh AOS on any dynamic content changes
  window.addEventListener('load', () => {
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  });
}

// ========================================
// COUNTER ANIMATION
// ========================================
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-num, .hero-stat-number');

  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-count')) || 0;
        animateCounter(counter, target);
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
  const duration = 2000;
  const steps = 60;
  const stepDuration = duration / steps;
  let current = 0;
  const increment = target / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, stepDuration);
}

// ========================================
// BRANDING (Load from config.js)
// ========================================
function initBranding() {
  if (typeof SITE_CONFIG === 'undefined') return;

  const config = SITE_CONFIG;

  // Update company address if provided
  const addressEls = document.querySelectorAll('#company-address, #footer-address');
  if (config.contact.address && config.contact.address !== '[Your Company Address Here]') {
    addressEls.forEach(el => { el.textContent = config.contact.address; });
  }

  // Update working hours
  const hoursEl = document.querySelector('.contact-info-item:last-child p');
  if (hoursEl) hoursEl.textContent = config.contact.hours;

  // Update WhatsApp link
  const waLink = document.querySelector('.whatsapp-float');
  if (waLink && config.contact.phoneRaw) {
    waLink.href = `https://wa.me/${config.contact.phoneRaw}`;
  }

  // Update logo image if configured
  if (config.branding.logoType === 'image' && config.branding.logoImage) {
    const logoContainers = document.querySelectorAll('.logo-icon');
    logoContainers.forEach(container => {
      // Replace icon with image
      const icon = container.querySelector('i');
      if (icon) {
        const img = document.createElement('img');
        img.src = config.branding.logoImage;
        img.alt = config.company.name;
        img.className = 'logo-img';
        img.style.cssText = 'max-height: 40px; width: auto; display: block;';
        img.onerror = function() {
          const fallbackIcon = document.createElement('i');
          fallbackIcon.className = 'fas fa-hammer';
          this.replaceWith(fallbackIcon);
        };
        icon.replaceWith(img);
      }
    });

    // Update preloader icon too
    const loaderIcon = document.querySelector('.loader-icon');
    if (loaderIcon) {
      const icon = loaderIcon.querySelector('i');
      if (icon) {
        const img = document.createElement('img');
        img.src = config.branding.logoImage;
        img.alt = config.company.name;
        img.className = 'logo-img-loader';
        img.style.cssText = 'max-height: 60px; width: auto; display: block;';
        img.onerror = function() {
          const fallbackIcon = document.createElement('i');
          fallbackIcon.className = 'fas fa-hammer';
          this.replaceWith(fallbackIcon);
        };
        icon.replaceWith(img);
      }
    }
  }

  // Update footer year
  const footerYear = document.querySelector('.footer-bottom p');
  if (footerYear) {
    const year = new Date().getFullYear();
    footerYear.innerHTML = footerYear.innerHTML.replace('2025', year);
  }



  // Update hero stats from config - runs BEFORE counter animation starts
  if (config.stats) {
    // Map config keys to data-count elements
    const statMappings = [
      { keyword: 'year', value: config.stats.years },
      { keyword: 'project', value: config.stats.projects },
      { keyword: ['client', 'happy', 'satisfi'], value: config.stats.satisfaction },
      { keyword: ['team', 'expert', 'member'], value: config.stats.teamMembers },
    ];

    document.querySelectorAll('[data-count]').forEach(el => {
      const parentText = el.closest('.hero-stat-item, .stat-card')?.textContent?.toLowerCase() || '';

      for (const mapping of statMappings) {
        const keywords = Array.isArray(mapping.keyword) ? mapping.keyword : [mapping.keyword];
        for (const kw of keywords) {
          if (parentText.includes(kw)) {
            el.setAttribute('data-count', mapping.value);
            break;
          }
        }
      }
    });
  }
}

// ========================================
// DYNAMIC PROJECT LOADING
// ========================================
async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  // If projects are already in the HTML, no need to dynamically load
  if (grid.children.length > 0) {
    // Make sure filters work with inline projects
    initProjectFilters();
    return;
  }

  let projects = [];

  // Try localStorage first (for admin panel edits)
  const stored = localStorage.getItem('bnb_projects');
  if (stored) {
    try { projects = JSON.parse(stored); } catch (e) {}
  }

  // Fallback to projects.json
  if (projects.length === 0) {
    try {
      const response = await fetch('data/projects.json');
      if (response.ok) {
        const data = await response.json();
        projects = data.projects || [];
      }
    } catch (e) {
      console.warn('Could not load projects.json');
    }
  }

  // Render projects dynamically
  if (projects.length > 0) {
    renderProjects(projects, grid);
    // Re-init filters for dynamically loaded projects
    initProjectFilters();
  }
}

function renderProjects(projects, grid) {
  grid.innerHTML = projects.map(project => `
    <div class="project-item" data-category="${escapeHtml(project.category)}">
      <div class="project-card">
        <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=500&q=80'" />
        <div class="project-overlay">
          <div class="project-info">
            <h4>${escapeHtml(project.title)}</h4>
            <p>${escapeHtml(project.description)}</p>
            <a href="#contact" class="project-link"><i class="fas fa-arrow-right"></i> Inquire About This Project</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// ========================================
// PROJECT FILTERS
// ========================================
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (filterBtns.length === 0) return;

  // Remove old listeners by cloning (prevents duplicates on re-init)
  filterBtns.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
  });

  // Re-query fresh buttons after cloning
  const freshBtns = document.querySelectorAll('.filter-btn');

  freshBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      freshBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      // Query project items dynamically (not cached)
      const projectItems = document.querySelectorAll('.project-item');

      projectItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });

      // Refresh AOS after filtering
      if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 400);
      }
    });
  });
}

// ========================================
// TESTIMONIAL CAROUSEL
// ========================================
function initTestimonialCarousel() {
  const track = document.getElementById('testimonialTrack');
  const dots = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');

  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let currentIndex = 0;
  let autoPlayInterval;

  // Create dots
  if (dots) {
    cards.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dots.appendChild(dot);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update dots
    if (dots) {
      dots.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % cards.length;
    goToSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    goToSlide(currentIndex);
  }

  // Event listeners
  prevBtn?.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });

  nextBtn?.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
      resetAutoPlay();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      resetAutoPlay();
    }
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAutoPlay();
    }
  }, { passive: true });

  // Auto-play
  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  // Pause on hover
  const carousel = document.querySelector('.testimonial-carousel');
  carousel?.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  carousel?.addEventListener('mouseleave', startAutoPlay);

  startAutoPlay();
}

// ========================================
// CONTACT FORM
// ========================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate form
    if (!validateForm(this)) return;

    // Show loading state
    submitBtn?.classList.add('loading');
    submitBtn?.setAttribute('disabled', 'true');
    formStatus.className = 'form-status';
    formStatus.style.display = 'none';

    // Collect form data
    const formData = new FormData(this);

    // Save inquiry to localStorage for admin panel access
    saveInquiryToLocalStorage(formData);

    // Open Gmail compose with inquiry details
    openGmailCompose(formData);

    // Show success message
    showFormStatus('success', '✅ Thank you! Your inquiry has been sent to Broke N Built Services. We will get back to you within 24 hours!');
    form.reset();

    submitBtn?.classList.remove('loading');
    submitBtn?.removeAttribute('disabled');
  });

  function validateForm(form) {
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const service = form.service.value;
    const message = form.message.value.trim();

    if (!name) {
      showFormStatus('error', 'Please enter your name.');
      form.name.focus();
      return false;
    }

    if (!email) {
      showFormStatus('error', 'Please enter your email address.');
      form.email.focus();
      return false;
    }

    if (!isValidEmail(email)) {
      showFormStatus('error', 'Please enter a valid email address.');
      form.email.focus();
      return false;
    }

    if (!phone) {
      showFormStatus('error', 'Please enter your contact number.');
      form.phone.focus();
      return false;
    }

    if (!service) {
      showFormStatus('error', 'Please select a service you are interested in.');
      form.service.focus();
      return false;
    }

    if (!message) {
      showFormStatus('error', 'Please describe your project in detail.');
      form.message.focus();
      return false;
    }

    return true;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormStatus(type, message) {
    formStatus.className = `form-status ${type}`;
    formStatus.textContent = message;
    formStatus.style.display = 'block';

    // Auto-hide success after 8 seconds
    if (type === 'success') {
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 8000);
    }
  }
}

// ========================================
// AI CHATBOT
// ========================================
function initChatbot() {
  const widget = document.getElementById('chatbotWidget');
  const toggle = document.getElementById('chatbotToggle');
  const minimize = document.getElementById('chatbotMinimize');
  const input = document.getElementById('chatbotInput');
  const send = document.getElementById('chatbotSend');
  const messages = document.getElementById('chatbotMessages');
  const quickReplies = document.querySelectorAll('.quick-reply');

  if (!widget) return;

  // Chatbot knowledge base
  const knowledgeBase = {
    services: {
      keywords: ['service', 'offer', 'do you', 'provide', 'work'],
      response: `We offer a complete range of renovation and construction services including:\n\n🔨 <b>Renovation Works</b> - Complete home & office transformations\n⚡ <b>Electrical & Plumbing</b> - Wiring, fittings & plumbing solutions\n🏗️ <b>False Ceiling Installation</b> - POP, gypsum & grid ceilings\n🎨 <b>Painting & Finishing</b> - Interior & exterior with premium paints\n🪵 <b>Flooring Solutions</b> - Tiles, marble, wooden & laminate\n🛠️ <b>Repair & Maintenance</b> - General repairs & preventive maintenance\n🚪 <b>Partition Works</b> - Gypsum, wooden & glass partitions\n🛋️ <b>Custom Interiors</b> - Wardrobes, cabinets & modular kitchens\n\nWhich service are you interested in? I'd be happy to tell you more!`
    },
    price: {
      keywords: ['price', 'cost', 'pricing', 'quote', 'estimate', 'how much', 'budget', 'rate', 'charges', 'fee', 'expensive', 'affordable', 'cheap'],
      response: `Great question! Our pricing varies based on the scope and complexity of your project. Here's what I can tell you:\n\n💰 We offer <b>free consultations and quotes</b> — no obligation!\n📋 Each project is customized to your needs and budget\n🏆 We use premium materials and skilled craftsmanship\n\nI'd recommend <b>scheduling a free consultation</b> so we can understand your project and provide an accurate estimate. Would you like to book one?`
    },
    time: {
      keywords: ['time', 'how long', 'duration', 'when', 'timeline', 'finish', 'deadline', 'take', 'complete'],
      response: `Project timelines depend on the scope of work, but here are some general estimates:\n\n🛋️ <b>Room Renovation</b>: 1-2 weeks\n🔨 <b>Full Home Renovation</b>: 4-8 weeks\n⚡ <b>Electrical/Plumbing</b>: 2-5 days\n🎨 <b>Painting</b>: 3-7 days\n🪵 <b>Flooring</b>: 3-10 days\n🚪 <b>Partitions & Ceilings</b>: 3-7 days\n\nWe pride ourselves on <b>on-time delivery</b> and keep you updated throughout the process!`
    },
    consultation: {
      keywords: ['consultation', 'book', 'appointment', 'meet', 'schedule', 'visit', 'site visit', 'call', 'discuss'],
      response: `I'd love to help you book a consultation! 🎉\n\nHere's what to do:\n\n📱 <b>Call us</b>: +91 70193 00855\n📧 <b>Email us</b>: brokenbuiltservices@gmail.com\n💬 <b>Fill the contact form</b> below on this page\n\nOr just tell me your name and preferred time, and I'll note it down for our team!`
    },
    experience: {
      keywords: ['experience', 'years', 'how many years', 'old', 'background', 'history', 'established', 'since'],
      response: `We're proud to say that <b>Broke N Built Services</b> has been delivering excellence for <b>over 5 years</b>! 🏆\n\n📊 <b>5+ Years</b> of industry experience\n🏗️ <b>50+ Projects</b> successfully completed\n😊 <b>98% Client Satisfaction</b> rate\n👷 <b>15+ Expert Team Members</b>\n\nOur track record speaks for itself. We'd love to add your project to our success stories!`
    },
    contact: {
      keywords: ['contact', 'email', 'phone', 'number', 'address', 'location', 'reach', 'get in touch', 'whatsapp'],
      response: generateContactResponse()
    },
    greeting: {
      keywords: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'hola', 'namaste'],
      response: `Hello! 👋 Welcome to <b>Broke N Built Services</b>!\n\nI'm your AI assistant, here to help you with:\n🔨 Information about our services\n💰 Pricing and estimates\n📅 Scheduling consultations\n💡 Answering any questions\n\nHow can I assist you today?`
    },
    thanks: {
      keywords: ['thank', 'thanks', 'appreciate', 'grateful', 'ty'],
      response: `You're very welcome! 😊 It's my pleasure to help.\n\nIf you have any more questions, feel free to ask. We're excited about the possibility of working with you on your project!\n\n🏗️ <b>Broke N Built Services</b> — Building Dreams, One Space at a Time.`
    }
  };

  // Toggle chatbot
  toggle?.addEventListener('click', () => {
    widget.classList.toggle('active');
    if (widget.classList.contains('active')) {
      input?.focus();
    }
  });

  // Minimize chatbot
  minimize?.addEventListener('click', () => {
    widget.classList.remove('active');
  });

  // Send message on button click
  send?.addEventListener('click', sendMessage);

  // Send message on Enter key
  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Quick reply buttons
  quickReplies.forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.dataset.query;
      const response = getBotResponse(query);
      addUserMessage(btn.textContent);
      setTimeout(() => addBotMessage(response), 500);
    });
  });

  function sendMessage() {
    const text = input?.value.trim();
    if (!text) return;

    addUserMessage(text);
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Process response after delay
    setTimeout(() => {
      hideTypingIndicator();
      const response = getBotResponse(text);
      addBotMessage(response);
    }, 800 + Math.random() * 600);
  }

  function addUserMessage(text) {
    if (!messages) return;

    const time = getCurrentTime();
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chatbot-message user';
    msgDiv.innerHTML = `
      <div class="message-content">${escapeHtml(text)}</div>
      <span class="message-time">${time}</span>
    `;
    messages.appendChild(msgDiv);
    scrollToBottom();
  }

  function addBotMessage(text) {
    if (!messages) return;

    const time = getCurrentTime();
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chatbot-message bot';
    msgDiv.innerHTML = `
      <div class="message-content">${text}</div>
      <span class="message-time">${time}</span>
    `;
    messages.appendChild(msgDiv);
    scrollToBottom();
  }

  function showTypingIndicator() {
    if (!messages) return;

    const indicator = document.createElement('div');
    indicator.className = 'chatbot-message bot typing-indicator';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = `
      <div class="message-content">
        <span class="typing-dots">
          <span>.</span><span>.</span><span>.</span>
        </span>
      </div>
    `;
    messages.appendChild(indicator);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
      indicator.remove();
    }
  }

  function generateContactResponse() {
    const address = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.contact.address)
      ? SITE_CONFIG.contact.address
      : 'Bangalore, India';
    return `Here's how you can reach us:\n\n📧 <b>Email</b>: brokenbuiltservices@gmail.com\n📞 <b>Phone</b>: +91 70193 00855\n📍 <b>Location</b>: ${address}\n💬 <b>WhatsApp</b>: Click the WhatsApp button on this page!\n\nWe're available <b>Mon-Sat, 9:00 AM - 7:00 PM</b>. Feel free to reach out anytime!`;
  }

  function getBotResponse(userInput) {
    const input = userInput.toLowerCase().trim();

    // Check for exact matches first
    for (const [key, data] of Object.entries(knowledgeBase)) {
      for (const keyword of data.keywords) {
        if (input.includes(keyword)) {
          return data.response;
        }
      }
    }

    // If no match found
    return `I'm not sure I understand fully. Could you please rephrase your question? 🤔\n\nHere are some things I can help with:\n🔨 Our <b>services</b>\n💰 <b>Pricing</b> information\n📅 <b>Booking</b> a consultation\n📞 <b>Contact</b> information\n\nOr feel free to ask me anything else about Broke N Built Services!`;
  }

  function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function scrollToBottom() {
    if (messages) {
      messages.scrollTop = messages.scrollHeight;
    }
  }

  // Auto-welcome message sequence
  setTimeout(() => {
    addBotMessage(`Hi there! 👋 Welcome to <b>Broke N Built Services</b>!\n\nI'm here to help you with any questions about our renovation services. Feel free to ask me anything! 🏠`);
  }, 2000);
}

// ========================================
// SAVE INQUIRY TO LOCAL STORAGE (for admin panel)
// ========================================
function saveInquiryToLocalStorage(formData) {
  try {
    const inquiry = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      phone: formData.get('phone') || '',
      service: formData.get('service') || '',
      message: formData.get('message') || '',
      created_at: new Date().toISOString(),
      source: 'local'
    };

    // Get existing inquiries
    let inquiries = [];
    const stored = localStorage.getItem('bnb_inquiries');
    if (stored) {
      try { inquiries = JSON.parse(stored); } catch (e) {}
    }

    // Add new inquiry
    inquiries.unshift(inquiry);

    // Keep only last 100 inquiries
    if (inquiries.length > 100) {
      inquiries = inquiries.slice(0, 100);
    }

    localStorage.setItem('bnb_inquiries', JSON.stringify(inquiries));
  } catch (e) {
    console.warn('Could not save inquiry to localStorage:', e);
  }
}

// ========================================
// OPEN GMAIL COMPOSE (No third-party services)
// ========================================
function openGmailCompose(formData) {
  // Check if email notifications are enabled
  if (typeof SITE_CONFIG === 'undefined' || !SITE_CONFIG.emailNotifications || !SITE_CONFIG.emailNotifications.enabled) {
    return; // Not configured — silently skip
  }

  const recipientEmail = SITE_CONFIG.emailNotifications.email;
  if (!recipientEmail) return;

  // Collect form data
  const name = formData.get('name') || 'Not provided';
  const email = formData.get('email') || 'Not provided';
  const phone = formData.get('phone') || 'Not provided';
  const service = formData.get('service') || 'Not provided';
  const message = formData.get('message') || 'Not provided';

  const adminUrl = window.location.origin + '/admin/dashboard.html';

  // Build email body
  const subject = `New Inquiry from ${name} - ${service}`;
  const body = `New Inquiry Received

From: ${name}
Email: ${email}
Phone: ${phone}
Service: ${service}

Message:
${message}

---
View all inquiries in admin dashboard:
${adminUrl}`;

  // Open Gmail compose with pre-filled details
  // This opens a new tab/window with a Gmail compose draft
  // URL format: https://mail.google.com/mail/?view=cm&fs=1&to=...&su=...&body=...
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.open(gmailUrl, '_blank');

  console.log('Gmail compose opened for inquiry from', name);
}

// ========================================
// BACK TO TOP
// ========================================
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ========================================
// ADD TYPING DOTS CSS
// ========================================
const style = document.createElement('style');
style.textContent = `
  .no-scroll {
    overflow: hidden;
  }

  .typing-dots span {
    animation: typingDot 1.4s infinite both;
    font-size: 1.5rem;
    line-height: 0;
    margin: 0 1px;
  }

  .typing-dots span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing-dots span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typingDot {
    0%, 80%, 100% { opacity: 0; }
    40% { opacity: 1; }
  }

  .project-item {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
`;
document.head.appendChild(style);
