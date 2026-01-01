import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "./header.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  // 🔁 Sync with admin login/logout
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken");
      setIsAdminLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <header className="header">
      {/* Logo */}
      <Link to="/" className="logo" onClick={closeMenu}>
        <h1>Corbett Trails</h1>
      </Link>

      {/* Hamburger */}
      <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* Nav */}
      <div className={`nav-container ${isMenuOpen ? "active" : ""}`}>
        <nav>
          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>
          <NavLink to="/locations" onClick={closeMenu}>
            Locations
          </NavLink>
          <NavLink to="/booking" onClick={closeMenu}>
            Safari Booking
          </NavLink>
          <NavLink to="/reviews" onClick={closeMenu}>
            Reviews
          </NavLink>

          {/* ✅ MOBILE ADMIN BUTTON (ALWAYS VISIBLE) */}
          <NavLink
            to={isAdminLoggedIn ? "/admin/dashboard" : "/admin/login"}
            className="admin-mobile"
            onClick={closeMenu}
          >
            {isAdminLoggedIn ? "Dashboard" : "Admin"}
          </NavLink>
        </nav>
      </div>

      {/* Desktop right buttons */}
      <div className="header-actions">
        <Link
          to={isAdminLoggedIn ? "/admin/dashboard" : "/admin/login"}
          className="admin-btn"
          onClick={closeMenu}
        >
          {isAdminLoggedIn ? "Dashboard" : "Admin"}
        </Link>

        <Link
          to="/contact#contact-form"
          className="headerBtn"
          onClick={closeMenu}
        >
          Contact us
        </Link>
      </div>
    </header>
  );
}
