/* ========================================
   BROKE N BUILT - ADMIN PANEL JAVASCRIPT
   ======================================== */

// ----- CONFIGURATION -----
const ADMIN_CONFIG = {
  defaultPassword: 'Venki@1981',
  storageKey: 'bnb_projects',
  sessionKey: 'bnb_admin_session',
  netlifyTokenKey: 'bnb_netlify_token',
  defaultNetlifyToken: 'nfp_H19XaVqcrjyx2XgPG4WBBNya9Rc7rV4Vf83d',
  siteId: 'd952d78b-a81c-47f8-b634-fe126c709703',
  displayName: 'Venkatesh Reddy G',
};

// ========================================
// PAGE INIT
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop();

  // Initialize logo from config
  initAdminLogo();

  if (currentPage === 'index.html' || currentPage === '' || currentPage === 'admin/') {
    initLoginPage();
  } else if (currentPage === 'dashboard.html') {
    checkAuth();
    initDashboard();
  }
});

// ========================================
// ADMIN LOGO (Load from config)
// ========================================
function initAdminLogo() {
  if (typeof SITE_CONFIG === 'undefined') return;
  const config = SITE_CONFIG;

  if (config.branding.logoType === 'image' && config.branding.logoImage) {
    // Fix the path - admin is in /admin/ so we need to go up one level
    const logoPath = '../' + config.branding.logoImage;
    document.querySelectorAll('.admin-logo i, .sidebar-logo i').forEach(icon => {
      const img = document.createElement('img');
      img.src = logoPath;
      img.alt = config.company.name;
      img.style.cssText = 'height: 36px; width: auto; display: block;';
      icon.replaceWith(img);
    });
  }
}

// ========================================
// AUTHENTICATION
// ========================================
function initLoginPage() {
  const loginForm = document.getElementById('loginForm');
  const loginStatus = document.getElementById('loginStatus');

  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value.trim();

    if (!password) {
      showLoginStatus('error', 'Please enter the admin password.');
      return;
    }

    // Get stored password or use default
    const storedPassword = localStorage.getItem('bnb_admin_password') || ADMIN_CONFIG.defaultPassword;

    if (password === storedPassword) {
      // Set session
      localStorage.setItem(ADMIN_CONFIG.sessionKey, 'authenticated');
      showLoginStatus('success', 'Login successful! Redirecting...');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    } else {
      showLoginStatus('error', 'Invalid password. Please try again.');
    }
  });
}

function showLoginStatus(type, message) {
  const status = document.getElementById('loginStatus');
  if (!status) return;
  status.className = `form-status ${type}`;
  status.textContent = message;
  status.style.display = 'block';
}

function checkAuth() {
  const session = localStorage.getItem(ADMIN_CONFIG.sessionKey);
  if (session !== 'authenticated') {
    window.location.href = 'index.html';
  }
}

// ----- CHANGE PASSWORD (optional) -----
function changePassword() {
  const current = prompt('Enter current password:');
  if (!current) return;

  const stored = localStorage.getItem('bnb_admin_password') || ADMIN_CONFIG.defaultPassword;
  if (current !== stored) {
    alert('Current password is incorrect.');
    return;
  }

  const newPass = prompt('Enter new password:');
  if (!newPass || newPass.length < 4) {
    alert('Password must be at least 4 characters.');
    return;
  }

  const confirm = prompt('Confirm new password:');
  if (newPass !== confirm) {
    alert('Passwords do not match.');
    return;
  }

  localStorage.setItem('bnb_admin_password', newPass);
  alert('Password changed successfully!');
}

// ========================================
// DASHBOARD
// ========================================
let projects = [];

function initDashboard() {
  loadProjects();
  setupNavigation();
  setupTabSwitching();
  setupLogout();
  setupInquiries();
  renderCurrentTab();
}

function loadProjects() {
  // Try localStorage first
  const stored = localStorage.getItem(ADMIN_CONFIG.storageKey);
  if (stored) {
    try {
      projects = JSON.parse(stored);
      return;
    } catch (e) {
      console.warn('Failed to parse stored projects');
    }
  }

  // Fallback: load from JSON file
  fetchProjectsFromFile();
}

async function fetchProjectsFromFile() {
  try {
    const response = await fetch('../data/projects.json');
    if (response.ok) {
      const data = await response.json();
      projects = data.projects || [];
      saveToStorage(); // Cache in localStorage
    }
  } catch (e) {
    console.warn('Could not load projects.json, starting empty');
    projects = [];
  }
}

function saveToStorage() {
  localStorage.setItem(ADMIN_CONFIG.storageKey, JSON.stringify(projects));
}

function setupNavigation() {
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Handle internal navigation
      if (href === 'dashboard.html') {
        e.preventDefault();
        switchTab('dashboard');
      }
    });
  });

  // Sidebar toggle
  const toggleBtn = document.getElementById('sidebarToggle');
  const closeBtn = document.getElementById('sidebarClose');
  const sidebar = document.getElementById('adminSidebar');

  toggleBtn?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
  });

  closeBtn?.addEventListener('click', () => {
    sidebar?.classList.remove('open');
  });

  // Close sidebar on mobile when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar?.classList.contains('open')) {
      if (!sidebar.contains(e.target) && !toggleBtn?.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });
}

function setupTabSwitching() {
  // Check URL for tab parameter
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  if (tab === 'inquiries') {
    switchTab('inquiries');
  }
}

function switchTab(tab) {
  // Update sidebar active state
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
  });

  if (tab === 'inquiries') {
    document.querySelectorAll('.sidebar-link')[1]?.classList.add('active');
  } else {
    document.querySelectorAll('.sidebar-link')[0]?.classList.add('active');
  }

  // Show/hide tabs
  document.getElementById('tabDashboard').style.display = tab === 'dashboard' ? 'block' : 'none';
  document.getElementById('tabInquiries').style.display = tab === 'inquiries' ? 'block' : 'none';

  // Update title
  document.getElementById('pageTitle').textContent = tab === 'inquiries' ? 'Inquiries' : 'Dashboard';

  // Render
  renderCurrentTab();
}

function renderCurrentTab() {
  renderDashboardStats();
  renderRecentProjects();
}

// ========================================
// DASHBOARD STATS
// ========================================
function renderDashboardStats() {
  document.getElementById('totalProjects').textContent = projects.length;
  document.getElementById('featuredProjects').textContent = projects.filter(p => p.featured).length;

  const categories = new Set(projects.map(p => p.category));
  document.getElementById('categoryCount').textContent = categories.size;

  const source = localStorage.getItem(ADMIN_CONFIG.storageKey) ? 'Local Storage' : 'JSON File';
  document.getElementById('dataSource').textContent = source;
}

// ========================================
// RECENT PROJECTS TABLE (Dashboard)
// ========================================
function renderRecentProjects() {
  const tbody = document.getElementById('recentProjectsBody');
  if (!tbody) return;

  const recent = [...projects].reverse().slice(0, 5);

  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#999;padding:30px;">No projects added yet. Edit data/projects.json to add projects.</td></tr>`;
    return;
  }

  tbody.innerHTML = recent.map(project => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:12px;">
          <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" class="project-thumb" onerror="this.src='https://via.placeholder.com/60x45?text=No+Image'" />
          <strong>${escapeHtml(project.title)}</strong>
        </div>
      </td>
      <td><span class="category-badge">${escapeHtml(project.category)}</span></td>
      <td>${project.featured ? '<span class="featured-badge"><i class="fas fa-star"></i></span>' : '<span style="color:#999;">—</span>'}</td>
      <td style="font-size:0.8rem;color:#888;">${project.date || '—'}</td>
    </tr>
  `).join('');
}





// ========================================
// INQUIRIES (Netlify Form Submissions)
// ========================================
let inquiries = [];

function setupInquiries() {
  const refreshBtn = document.getElementById('refreshInquiries');

  // Auto-configure with saved token or default token (silently)
  let savedToken = localStorage.getItem(ADMIN_CONFIG.netlifyTokenKey);
  
  // If no saved token, use the default one automatically
  if (!savedToken && ADMIN_CONFIG.defaultNetlifyToken) {
    localStorage.setItem(ADMIN_CONFIG.netlifyTokenKey, ADMIN_CONFIG.defaultNetlifyToken);
    savedToken = ADMIN_CONFIG.defaultNetlifyToken;
  }

  // Fetch inquiries immediately (silently)
  if (savedToken) {
    fetchInquiries();
  }

  // Refresh button
  refreshBtn?.addEventListener('click', fetchInquiries);

  // Listen for tab switch to inquiries to refresh
  document.querySelectorAll('.sidebar-link')[1]?.addEventListener('click', () => {
    setTimeout(fetchInquiries, 300);
  });
}

async function fetchInquiries() {
  const tableBody = document.getElementById('inquiriesBody');
  const emptyState = document.getElementById('inquiriesEmpty');
  const status = document.getElementById('inquiryStatus');
  const countEl = document.getElementById('inquiryCount');

  status.textContent = 'Loading inquiries...';
  status.style.color = '#6b7280';

  // First, try to load from localStorage (saved when form is submitted)
  const localInquiries = loadLocalInquiries();

  if (localInquiries.length > 0) {
    inquiries = localInquiries;
    renderInquiryResults(inquiries, tableBody, emptyState, status, countEl);
    // Also try to fetch from Netlify API in the background (don't block UI)
    fetchNetlifyInquiries(tableBody, emptyState, status, countEl);
    return;
  }

  // No local inquiries, try Netlify API
  await fetchNetlifyInquiries(tableBody, emptyState, status, countEl);
}

function loadLocalInquiries() {
  try {
    const stored = localStorage.getItem('bnb_inquiries');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return [];
}

async function fetchNetlifyInquiries(tableBody, emptyState, status, countEl) {
  const token = localStorage.getItem(ADMIN_CONFIG.netlifyTokenKey);
  if (!token) {
    // No local inquiries AND no token - show empty state
    if (inquiries.length === 0) {
      tableBody.innerHTML = '';
      emptyState.style.display = 'block';
      status.textContent = 'No inquiries yet. Submissions will appear here once people fill out the contact form.';
      status.style.color = '#6b7280';
    }
    return;
  }

  try {
    // First get the form ID for the Contact form
    const formsResponse = await fetch(`https://api.netlify.com/api/v1/sites/${ADMIN_CONFIG.siteId}/forms`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!formsResponse.ok) {
      // If Netlify API fails but we have local data, keep showing it
      if (inquiries.length === 0) {
        status.textContent = `Netlify API error (${formsResponse.status}). Using local storage only.`;
        status.style.color = '#f59e0b';
      }
      return;
    }

    const forms = await formsResponse.json();
    const contactForm = forms.find(f => f.name === 'Contact' || f.name === 'contact');

    if (!contactForm) {
      if (inquiries.length === 0) {
        status.textContent = 'No Contact form found on Netlify. Submissions from the website will appear here.';
        status.style.color = '#f59e0b';
        emptyState.style.display = 'block';
      }
      return;
    }

    // Fetch submissions for the Contact form
    const submissionsResponse = await fetch(`https://api.netlify.com/api/v1/forms/${contactForm.id}/submissions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!submissionsResponse.ok) {
      if (inquiries.length === 0) {
        status.textContent = `Netlify API error (${submissionsResponse.status}). Check your token.`;
        status.style.color = '#ef4444';
      }
      return;
    }

    const submissions = await submissionsResponse.json();
    
    // Merge Netlify submissions with local ones (deduplicate by email + date)
    const netlifyInquiries = (submissions || []).map(s => ({
      ...s,
      source: 'netlify'
    }));
    
    // Combine local + Netlify, remove duplicates
    const combined = mergeInquiries(inquiries, netlifyInquiries);
    inquiries = combined;

    renderInquiryResults(inquiries, tableBody, emptyState, status, countEl);

  } catch (err) {
    if (inquiries.length === 0) {
      status.textContent = `Note: ${err.message}. Showing locally saved inquiries.`;
      status.style.color = '#f59e0b';
    }
  }
}

function mergeInquiries(localInquiries, netlifyInquiries) {
  const seen = new Set();
  const merged = [];

  // Add all local inquiries first (newest first)
  localInquiries.forEach(inq => {
    const key = `${inq.email}-${inq.name}-${inq.created_at?.substring(0, 16)}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(inq);
    }
  });

  // Add Netlify inquiries that aren't already in local
  netlifyInquiries.forEach(inq => {
    const data = inq.data || {};
    const key = `${data.email}-${data.name}-${inq.created_at?.substring(0, 16)}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push({
        id: inq.id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        service: data.service || '',
        message: data.message || '',
        created_at: inq.created_at,
        source: 'netlify'
      });
    }
  });

  // Sort by date (newest first)
  merged.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  return merged;
}

function renderInquiryResults(inquiries, tableBody, emptyState, status, countEl) {
  // Update count badge
  countEl.textContent = inquiries.length;
  const badge = document.getElementById('inquiryBadge');
  if (badge) {
    badge.textContent = inquiries.length;
    badge.style.display = inquiries.length > 0 ? 'inline-flex' : 'none';
  }

  if (inquiries.length === 0) {
    tableBody.innerHTML = '';
    emptyState.style.display = 'block';
    status.textContent = 'No inquiries yet. Submissions will appear here once people fill out the contact form.';
    status.style.color = '#6b7280';
    return;
  }

  emptyState.style.display = 'none';
  const sourceInfo = inquiries.some(i => i.source === 'local') ? '(from website submissions)' : '(from Netlify)';
  status.textContent = `Showing ${inquiries.length} inquiry(ies) ${sourceInfo}`;
  status.style.color = '#10b981';

  renderInquiries(inquiries);
}

function renderInquiries(submissions) {
  const tableBody = document.getElementById('inquiriesBody');
  if (!tableBody) return;

  // Sort by most recent first
  const sorted = [...submissions].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  tableBody.innerHTML = sorted.map(sub => {
    // Handle both formats: Netlify (sub.data.field) and local (sub.field)
    const data = sub.data || sub;
    const name = data.name || '—';
    const email = data.email || '—';
    const phone = data.phone || data['contact-number'] || '—';
    const service = data.service || '—';
    const message = data.message || data.description || '—';
    const date = sub.created_at ? new Date(sub.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

    return `
    <tr>
      <td><strong>${escapeHtml(name)}</strong></td>
      <td><a href="mailto:${escapeHtml(email)}" class="inquiry-email">${escapeHtml(email)}</a></td>
      <td>${escapeHtml(phone)}</td>
      <td><span class="category-badge">${escapeHtml(service)}</span></td>
      <td class="inquiry-message" title="${escapeHtml(message)}">${escapeHtml(message.length > 50 ? message.substring(0, 50) + '...' : message)}</td>
      <td style="font-size:0.8rem;color:#888;white-space:nowrap;">${date}</td>
    </tr>
  `}).join('');
}



// ========================================
// LOGOUT
// ========================================
function setupLogout() {
  const logoutBtns = document.querySelectorAll('#logoutBtn, #logoutBtnTop');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Sign out of admin panel?')) {
        localStorage.removeItem(ADMIN_CONFIG.sessionKey);
        window.location.href = 'index.html';
      }
    });
  });
}

// ========================================
// TOAST NOTIFICATION
// ========================================
function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.admin-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `admin-toast ${type}`;
  toast.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: #ffffff;
    padding: 14px 24px;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    z-index: 999;
    animation: toastSlideIn 0.3s ease;
    font-family: 'Inter', sans-serif;
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ========================================
// ESCAPE HTML
// ========================================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Make functions globally accessible
window.switchTab = switchTab;
window.changePassword = changePassword;
