# 🏠 Broke N Built Services

**Premium Renovation & Construction Company Website**

A professional, modern website for Broke N Built Services — a renovation company with 5+ years of experience and 50+ completed projects.

---

## 🚀 Quick Deploy (Free)

### Option 1: Deploy to Netlify (Recommended — takes 1 minute)

1. Go to [netlify.com](https://netlify.com) and create a free account
2. Drag and drop the **entire `Broke N Built Services` folder** onto the Netlify dashboard
3. Done! Your site will be live at `random-name.netlify.app`

### Option 2: Deploy to GitHub Pages

1. Push this folder to a GitHub repo
2. Go to Settings > Pages
3. Select "main" branch and "/" folder
4. Save — your site is live!

---

## ⚙️ Setup Guide

### 1. Enable the Contact Form (Required)

The contact form uses **[FormSubmit.co](https://formsubmit.co/)** (free, no account needed) to send inquiries to **brokenbuiltservices@gmail.com**.

**To enable it:**
1. Check your Gmail inbox for a verification email from FormSubmit.co
2. Click the verification link to activate the email forwarding
3. Done! Form submissions will now come directly to your email

### 2. Customize Branding

Edit **`js/config.js`** to set your:
- **Company address** — Replace `[Your Company Address Here]`
- **Social media links** — Update the URLs
- **Stats** — Adjust years, projects, satisfaction as needed

### 3. Add Your Logo

1. Place your logo image in the `images/` folder
2. In `js/config.js`, set:
   ```js
   branding: {
     logoType: 'image',
     logoImage: 'images/your-logo.png'
   }
   ```
3. The website will automatically use your image instead of the hammer icon

### 4. Change Admin Password

1. Open `admin/dashboard.html` by navigating to `yoursite.netlify.app/admin/`
2. Default password: **`admin123`**
3. Log in and change the password (click your avatar/badge area)

### 5. Manage Projects via Admin Panel

- Go to `yoursite.netlify.app/admin/`
- Log in with the admin password
- Add, edit, delete, and reorder projects
- Export/import project data as JSON backup

---

## 📁 Project Structure

```
├── index.html              # Main website
├── netlify.toml            # Deployment config
├── README.md               # This file
├── js/
│   ├── config.js           # ⚡ EDIT THIS for branding
│   └── script.js           # Website functionality
├── css/
│   └── styles.css          # Website styling
├── data/
│   └── projects.json       # Initial project data
├── admin/
│   ├── index.html          # Admin login
│   ├── dashboard.html      # Admin dashboard
│   ├── css/
│   │   └── admin.css       # Admin styling
│   └── js/
│       └── admin.js        # Admin functionality
└── images/                 # Logo & images folder
```

---

## ✨ Features

- **Responsive Design** — Works perfectly on mobile, tablet, and desktop
- **AI Chatbot** — Smart assistant that answers visitor questions
- **Portfolio Filter** — Visitors can filter projects by category
- **Admin Panel** — Manage projects with a beautiful dashboard
- **Contact Form** — Sends inquiries directly to your Gmail
- **WhatsApp Integration** — One-click chat button
- **Beautiful Animations** — Smooth scroll, counters, and micro-interactions

---

## 🛠️ Tech Stack

- HTML5, CSS3, JavaScript (Vanilla — no frameworks needed)
- [AOS](https://michalsnik.github.io/aos/) — Scroll animations
- [Font Awesome](https://fontawesome.com/) — Icons
- [FormSubmit](https://formsubmit.co/) — Form handling
- [Unsplash](https://unsplash.com/) — Stock images
- Hosted on [Netlify](https://netlify.com/) (free)

---

## 📞 Support

Email: brokenbuiltservices@gmail.com  
Phone: +91 70193 0085
