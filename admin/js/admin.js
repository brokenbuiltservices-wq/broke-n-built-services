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
let inquiries = [];

function initDashboard() {
  setupNavigation();
  setupTabSwitching();
  setupLogout();
  setupInquiries();
  renderCurrentTab();
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
  updateDashboardStats();
}

// ========================================
// DASHBOARD STATS
// ========================================
function updateDashboardStats() {
  const localInquiries = loadLocalInquiries();
  const total = localInquiries.length;

  // Update total count
  const dashboardCount = document.getElementById('inquiryCountDashboard');
  if (dashboardCount) dashboardCount.textContent = total;

  // Calculate new this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newThisWeek = localInquiries.filter(inq => {
    const date = new Date(inq.created_at || 0);
    return date >= oneWeekAgo;
  }).length;

  const newCount = document.getElementById('newInquiriesCount');
  if (newCount) newCount.textContent = newThisWeek;
}

// ========================================
// INQUIRIES
// ========================================

function setupInquiries() {
  const refreshBtn = document.getElementById('refreshInquiries');

  // Fetch inquiries immediately
  fetchInquiries();

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

  // Load from localStorage (saved when form is submitted)
  const localInquiries = loadLocalInquiries();

  if (localInquiries.length > 0) {
    inquiries = localInquiries;
    renderInquiryResults(inquiries, tableBody, emptyState, status, countEl);
  } else {
    tableBody.innerHTML = '';
    emptyState.style.display = 'block';
    status.textContent = 'No inquiries yet. Submissions will appear here once people fill out the contact form.';
    status.style.color = '#6b7280';
    countEl.textContent = '0';

    const badge = document.getElementById('inquiryBadge');
    if (badge) {
      badge.textContent = '0';
      badge.style.display = 'none';
    }
  }

  // Update dashboard stats
  updateDashboardStats();
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
  status.textContent = `Showing ${inquiries.length} inquiry(ies)`;
  status.style.color = '#10b981';

  renderInquiries(inquiries);
}

function renderInquiries(submissions) {
  const tableBody = document.getElementById('inquiriesBody');
  if (!tableBody) return;

  // Sort by most recent first
  const sorted = [...submissions].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  tableBody.innerHTML = sorted.map(sub => {
    const data = sub.data || sub;
    const name = data.name || '—';
    const email = data.email || '—';
    const phone = data.phone || data['contact-number'] || '—';
    const service = data.service || '—';
    const message = data.message || data.description || '—';
    const date = sub.created_at ? new Date(sub.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
    const inquiryId = sub.id || '';

    return `
    <tr>
      <td><strong>${escapeHtml(name)}</strong></td>
      <td><a href="mailto:${escapeHtml(email)}" class="inquiry-email">${escapeHtml(email)}</a></td>
      <td>${escapeHtml(phone)}</td>
      <td><span class="category-badge">${escapeHtml(service)}</span></td>
      <td class="inquiry-message" title="${escapeHtml(message)}">${escapeHtml(message.length > 50 ? message.substring(0, 50) + '...' : message)}</td>
      <td style="font-size:0.8rem;color:#888;white-space:nowrap;">${date}</td>
      <td>
        <button onclick="deleteInquiry('${escapeHtml(inquiryId)}')" class="btn-delete" title="Delete inquiry" style="background:#fee2e2;color:#ef4444;border:none;border-radius:6px;padding:6px 10px;cursor:pointer;font-size:0.8rem;transition:all 0.2s;" onmouseover="this.style.background='#ef4444';this.style.color='#fff'" onmouseout="this.style.background='#fee2e2';this.style.color='#ef4444'">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `}).join('');
}

// ========================================
// DELETE INQUIRY
// ========================================
function deleteInquiry(id) {
  if (!id) {
    showToast('Cannot delete: missing inquiry ID', 'error');
    return;
  }

  if (!confirm('Are you sure you want to delete this inquiry? This cannot be undone.')) return;

  try {
    const stored = localStorage.getItem('bnb_inquiries');
    if (!stored) return;

    let allInquiries = JSON.parse(stored);
    if (!Array.isArray(allInquiries)) return;

    const beforeCount = allInquiries.length;
    allInquiries = allInquiries.filter(inq => inq.id !== id);

    if (allInquiries.length === beforeCount) {
      showToast('Inquiry not found', 'error');
      return;
    }

    localStorage.setItem('bnb_inquiries', JSON.stringify(allInquiries));
    inquiries = allInquiries;

    showToast('Inquiry deleted successfully', 'success');

    // Refresh the display
    const tableBody = document.getElementById('inquiriesBody');
    const emptyState = document.getElementById('inquiriesEmpty');
    const status = document.getElementById('inquiryStatus');
    const countEl = document.getElementById('inquiryCount');
    renderInquiryResults(inquiries, tableBody, emptyState, status, countEl);
    updateDashboardStats();

  } catch (e) {
    showToast('Error deleting inquiry: ' + e.message, 'error');
  }
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
window.deleteInquiry = deleteInquiry;
