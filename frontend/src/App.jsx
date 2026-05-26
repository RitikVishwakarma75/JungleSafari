// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";
import AdminResetPassword from "./pages/admin/AdminResetPassword";
import Contact from "./components/Contact/Contact";
import ChatBot from "./components/ChatBot/ChatBot";


import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import About from "./pages/About";
// import Explore from "./components/Explore/Explore";
import Locations from "./pages/Locations";
import Booking from "./pages/Booking";
import Reviews from "./pages/Reviews";
import Team from "./pages/Team";
import JunglePlanner from "./pages/JunglePlanner";
import Sightings from "./pages/Sightings";
import GuidePortal from "./pages/GuidePortal";
import OperatorOnboarding from "./pages/OperatorOnboarding";
import AiCampfire from "./pages/AiCampfire";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      {/* <Explore /> */}

      <Routes>
        <Route path="/" element={<Home />} />

        {/* ✅ ADMIN AUTH */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route
          path="/admin/forgot-password"
          element={<AdminForgotPassword />}
        />
        <Route
          path="/admin/reset-password/:token"
          element={<AdminResetPassword />}
        />

        {/* MOBILE GUIDE PORTAL */}
        <Route path="/guide/portal" element={<GuidePortal />} />

        {/* SAAS ONBOARDING PORTAL */}
        <Route path="/saas-signup" element={<OperatorOnboarding />} />

        {/* EXISTING ROUTES & MULTI-TENANT SAAS ROUTING */}
        <Route path="/:tenantSlug" element={<Home />} />

        <Route path="/about" element={<About />} />
        <Route path="/:tenantSlug/about" element={<About />} />

        <Route path="/locations" element={<Locations />} />
        <Route path="/:tenantSlug/locations" element={<Locations />} />
        
        <Route path="/booking" element={<Booking />} />
        <Route path="/:tenantSlug/booking" element={<Booking />} />
        
        <Route path="/planner" element={<JunglePlanner />} />
        <Route path="/:tenantSlug/planner" element={<JunglePlanner />} />
        
        <Route path="/sightings" element={<Sightings />} />
        <Route path="/:tenantSlug/sightings" element={<Sightings />} />

        <Route path="/campfire" element={<AiCampfire />} />
        <Route path="/:tenantSlug/campfire" element={<AiCampfire />} />

        <Route path="/team" element={<Team />} />
        <Route path="/:tenantSlug/team" element={<Team />} />

        <Route path="/reviews" element={<Reviews />} />
        <Route path="/:tenantSlug/reviews" element={<Reviews />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/:tenantSlug/contact" element={<Contact />} />
      </Routes>
      <ChatBot />
    </BrowserRouter>
  );
}
