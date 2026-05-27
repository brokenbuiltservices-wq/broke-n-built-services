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

  // ----- WEB3FORMS (Contact Form Email Notifications) -----
  // Sign up free at https://web3forms.com/ to get your access key
  // 250 free submissions/month — forwards form data to your email
  web3forms: {
    accessKey: 'e3dc125b-4ea7-41bf-b699-43b9da758508',  // Your Web3Forms Access Key
    enabled: true,      // Set to true once key is configured
  },

  // ----- EMAILJS (Deprecated — replaced by Web3Forms) -----
  emailjs: {
    enabled: false,
  },
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}
