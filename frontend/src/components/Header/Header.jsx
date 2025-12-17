import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  // State to manage the mobile menu's visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to close the menu when a link is clicked
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      {/* Logo is now a link to the homepage */}
      <Link to="/" className="logo" onClick={closeMenu}>
        <h1>Corbett Trails</h1>
      </Link>

      {/* Hamburger Button (visible only on mobile) */}
      <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {/* The three bars of the icon */}
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* Navigation container - gets 'active' class when menu is open */}
      <div className={`nav-container ${isMenuOpen ? "active" : ""}`}>
        <nav>
          {/* Using NavLink to style the active page link */}
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
        </nav>
      </div>
      {/* Contact button is now a Link for better navigation */}
      <Link to="/contact" className="headerBtn" onClick={closeMenu}>
        Contact us
      </Link>
    </header>
  );
}
