/* ========================================
   BROKE N BUILT SERVICES - CONFIGURATION
   ========================================
   Edit this file to customize your branding!
   ======================================== */

const SITE_CONFIG = {
  // ----- COMPANY INFO -----
  company: {
    name: 'Broke N Built',
    suffix: 'SERVICES',
    tagline: 'Building Dreams, One Space at a Time',
    fullName: 'Broke N Built Services',
  },

  // ----- CONTACT INFO -----
  contact: {
    email: 'brokenbuiltservices@gmail.com',
    phone: '+91 70193 00855',
    phoneRaw: '917019300855', // For WhatsApp link (no + or spaces)
    address: '#8, Adibyraveshwara Nilaya, 3rd Floor, Green Wood Street, Cheemasandra, Virgonagar Post, Bangalore-560049',
    hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
  },

  // ----- BRANDING -----
  branding: {
    // Logo: Set to 'icon' to use the hammer icon, or provide an image path
    // Example: logoImage: 'images/logo.png'
    logoType: 'image', // 'icon' or 'image'
    logoImage: 'images/logo.png', // Your logo file
    favicon: '', // e.g., 'images/favicon.ico'
  },

  // ----- SOCIAL MEDIA -----
  social: {
    facebook: '#',
    instagram: '#',
    linkedin: '#',
    youtube: '#',
    whatsapp: 'https://wa.me/917019300855',
  },

  // ----- HERO STATS -----
  stats: {
    years: 5,
    projects: 50,
    satisfaction: 98,
    teamMembers: 15,
  },

  // ----- DATA SOURCE -----
  // 'local' = uses data/projects.json (static)
  // 'storage' = uses localStorage (editable via admin panel)
  dataSource: 'local',

  // ----- EMAILJS (Contact Form Email Notifications) -----
  // Sign up free at https://www.emailjs.com/ to get these keys
  // Then share them with me to configure!
  emailjs: {
    publicKey: '',      // Your EmailJS Public Key (from Account > API Keys)
    serviceID: '',      // Your Email Service ID (e.g., 'service_abc123')
    templateID: '',     // Your Email Template ID (e.g., 'template_xyz789')
    enabled: false,     // Set to true once keys are configured
  },
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}
