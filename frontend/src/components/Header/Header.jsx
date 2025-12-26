// frontend/src/components/Header/Header.jsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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

          {/* Admin (mobile) */}
          <NavLink
            to="/admin/login"
            className="admin-mobile"
            onClick={closeMenu}
          >
            Admin Login
          </NavLink>
        </nav>
      </div>

      {/* Right side buttons */}
      <div className="header-actions">
        {/* ✅ Direct Admin Login */}
        <Link to="/admin/login" className="admin-btn" onClick={closeMenu}>
          Admin
        </Link>

        {/* Contact */}
        <Link to="/contact" className="headerBtn" onClick={closeMenu}>
          Contact us
        </Link>
      </div>
    </header>
  );
}
