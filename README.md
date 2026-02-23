<div align="center">

# 🪔 Prodip Login (প্রদীপ লগইন)
**An interactive login interface where a lamp controls the form visibility**

A creative UI experiment that blends interaction design with modern frontend technologies.

🔗 **Live Demo:** https://prodip-login.vercel.app/
</div>

---

## 📖 About

**Prodip Login** (প্রদীপ means *lamp* in Bengali) is a creative login interface where the visibility of the authentication form is controlled by a table lamp.

The page initially loads in darkness. When the user pulls or clicks the lamp rope, the light turns on and the login card appears with smooth animations and light effects. Turning the lamp off hides the interface again.

This project focuses on creative UI thinking, animation design, and clean component architecture using modern web technologies.

---

## 🎯 Purpose

This project was built to showcase:

* Creative UI/UX beyond traditional login forms
* Interactive animation with React
* Component-based architecture and state management
* Type-safe development using TypeScript
* Production-ready frontend deployment

---

## ✨ Key Features

* Lamp ***ON/OFF*** toggle using rope interaction
* Light beam and glow effects
* Smooth login card animation (fade & scale)
* Dark-themed modern UI
* Login, Sign Up, and Forgot Password flows
* Password strength indicator
* Show/Hide password option
* Error and success visual feedback
* Lamp state persistence using **localStorage**
* **Keyboard shortcut :** (Space to toggle lamp)
* **Fully optimized for mobile, tablet, and desktop screens.**

---

## 🛠 Tech Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* Lucide Icons
* HTML Canvas (particle effects)
* SVG (lamp illustration)

---

## 🚀 Installation & Setup

### Prerequisites

* Node.js 18+
* npm or yarn
---
## Clone the repository
 ```bash
git clone https://github.com/faysalmahmudprem/prodip-login.git
```
## Install dependencies
 ```bash
cd prodip-login
npm install
```

## Start the development server (Run locally)
 ```bash
npm run dev
```
## Build for production
 ```bash
npm run build
```

## Preview 
**When off -** 
<img width="1619" height="910" alt="image" src="https://github.com/user-attachments/assets/4bda5d85-b59e-434d-8f6e-2a264a378c71" />
**When lamp is ON**
<img width="1643" height="905" alt="image" src="https://github.com/user-attachments/assets/597490a9-a2e2-4a94-ad4f-aa8cc4422685" />

---

## 📁 Project Structure

```bash
prodip-login/
├── src/
│   ├── components/
│   │   ├── Lamp.tsx        # SVG Interaction & Rope Logic
│   │   ├── LightBeam.tsx   # Canvas Particles & Glow
│   │   └── LoginCard.tsx   # Form States & Validation
│   ├── App.tsx             # State Coordinator
│   └── main.tsx            # Entry Point
├── public/                 # Static Assets
└── tailwind.config.js      # Custom Theme Config
```
---

## 🎨 Design Highlights

* Dark-first modern interface
* Smooth transitions (300–700ms)
* GPU-optimized animations (transform & opacity)
* Responsive layout for desktop, tablet, and mobile

---
Made with 💚 by [Faysal Mahmud Prem](https://github.com/faysalmahmudprem)
