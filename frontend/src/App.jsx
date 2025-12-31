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
import Team from "./pages/team";

import "./app.css";

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

        {/* EXISTING ROUTES */}
        <Route path="/about" element={<About />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/team" element={<Team />} />
        <Route path="/reviews" element={<Reviews />} />

        <Route path="/contact" element={<Contact />} />
      </Routes>
      <ChatBot />
    </BrowserRouter>
  );
}
