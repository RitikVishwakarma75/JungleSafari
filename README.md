# 🌴 JungleSafari SaaS — Multi-Tenant Wildlife Adventure Engine

<div align="center">
  <img src="https://img.shields.io/badge/Architecture-Multi--Tenant_SaaS-green?style=for-the-badge" alt="Multi-Tenant SaaS Badge" />
  <img src="https://img.shields.io/badge/AI_Engine-Gemini_1.5_Flash-orange?style=for-the-badge" alt="Gemini AI Engine Badge" />
  <img src="https://img.shields.io/badge/Tech_Stack-MERN-blue?style=for-the-badge" alt="MERN Tech Stack Badge" />
</div>

---

Welcome to **JungleSafari**, a premium, state-of-the-art multi-tenant SaaS platform built to empower wildlife tour operators, naturalist agencies, and national park guides. Out-of-the-box, it integrates advanced **Google Gemini AI** capabilities to deliver hyper-personalized, immersive safari experiences.

---

## 🌟 Core Highlights

### 🚀 Multi-Tenant SaaS Architecture
* **Dynamic Branding & Themes**: Operators register through an onboarding portal. Once onboarded, the system fetches their brand settings (logos, address, and unique theme color keys) and dynamically injects them into the UI using CSS Custom Properties (`--primary-color`, `--primary-hover`).
* **Unified Routing**: Clean, semantic URL slug matching `/corbett-trails/booking` maps seamlessly to dynamic configurations, allowing hundreds of custom booking channels on a single codebase.

### 🧠 Google Gemini AI Integrations
1. **🔥 Immersive Campfire Narrator** (`AiCampfire.jsx`): Crafts rich, atmospheric, suspenseful stories of Kumaon forest legends. Synthesizes an interactive audio stream using the Web Speech API, with automatic regex-based sound-effect filter cleanups and custom speed configurations.
2. **🗺️ Dynamic Jungle Itinerary Planner** (`JunglePlanner.jsx`): Analyzes group dynamics, visit duration, and personal interests to curate the ultimate day-by-day expedition layout.
3. **📊 Sighting Probability Predictor** (`Sightings.jsx`): Uses advanced logic models calibrated for seasonal trends, weather patterns, and regional animal frequencies to forecast real-time sighting metrics.
4. **👁️ Wildlife Vision Scanner** (`ChatBot.jsx`): Uses Gemini Vision capabilities to instantly scan safari photos, identifying species and providing detailed ecological details.
5. **💬 Natural Conversational Booking Agent** (`ChatBot.jsx`): Guides guests in planning their ride by extracting booking parameters organically from a standard chat conversation.

### ✉️ Resilient Dual-Channel Dispatcher
* **High Availability**: Features a failover mail pipeline that leverages SendGrid as the primary dispatcher and Nodemailer as an automatic fallback, complete with local sandbox previews.

---

## 📁 Repository Directory Structure

```plaintext
JungleSafari/
├── backend/                   # Node.js + Express API Gateway
│   ├── controllers/           # Request handlers & logic
│   ├── middlewares/           # JWT authentications & common utilities
│   ├── models/                # MongoDB (Mongoose) dynamic schemas
│   ├── routes/                # Endpoint mapping (AI, Tenants, Bookings)
│   ├── utils/                 # Gemini API client, auto-admin, & mailers
│   └── package.json           # Backend dependencies
│
└── frontend/                  # React + Vite Client Application
    ├── public/                # Static assets & icons
    ├── src/
    │   ├── components/        # Dynamic Header, Chatbot, & Home blocks
    │   ├── pages/             # Booking forms, AI Campfire, Live Sightings
    │   ├── App.jsx            # Multi-Tenant routing dispatcher
    │   ├── index.css          # Design system stylesheet
    │   └── main.jsx           # Client mounting
    └── package.json           # Frontend packages
```

---

## 🛠️ Quick Start & Setup

### Prerequisites
* **Node.js** (v18 or higher)
* **MongoDB** (local or Atlas cluster)
* **Google Gemini API Key**

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environmental settings inside a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/junglesafari
   JWT_SECRET=your_super_secret_jwt_key
   ADMIN_INVITE_CODE=SAFARI_ADMIN_2026
   GEMINI_API_KEY=your_google_gemini_api_key_here
   SENDGRID_API_KEY=your_sendgrid_key_optional
   FRONTEND_URL=http://localhost:5173
   ```
4. Fire up the development server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the Vite development compiler:
   ```bash
   npm run dev
   ```

---

## 🎨 Premium Style Tokens

Our design is fully calibrated to mimic the warmth and mystery of a forest campfire under a starlight sky.
* **Warm Embers**: Glowing gradients (`linear-gradient(135deg, #e65100, #ff8f00)`) representing high-fidelity flame visualizers.
* **Starry Night Haze**: Premium glassmorphism modules utilizing backdrop filters (`backdrop-filter: blur(12px)`) with ultra-fine, border highlights.
* **Forest Accents**: Harmonious HSL colors that adapt to dynamic brand overrides on the fly.
