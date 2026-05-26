import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./header.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsMenuOpen(false);

  // Scrapes the current URL parts to see if a valid operator slug is present
  const pathParts = location.pathname.split("/").filter(Boolean);
  const isSlugPart = (part) => {
    const rootPages = [
      "about",
      "locations",
      "booking",
      "planner",
      "sightings",
      "campfire",
      "reviews",
      "team",
      "contact",
      "admin",
      "guide"
    ];
    return part && !rootPages.includes(part.toLowerCase());
  };

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

  const urlTenantSlug = pathParts[0] && isSlugPart(pathParts[0]) ? pathParts[0] : "";
  const tenantSlug = urlTenantSlug || (isAdminLoggedIn ? localStorage.getItem("adminTenantId") : "");
  
  const getTenantPath = (subPath) => {
    return tenantSlug ? `/${tenantSlug}${subPath}` : subPath;
  };

  const [tenantConfig, setTenantConfig] = useState(null);

  // Fetch dynamic tenant configs & inject branding styles dynamically
  useEffect(() => {
    if (!tenantSlug) {
      setTenantConfig(null);
      // Reset back to standard forest green primary color themes
      document.documentElement.style.setProperty('--primary-color', '#4caf50');
      document.documentElement.style.setProperty('--primary-hover', '#388e3c');
      document.title = "Corbett Trails - Premium Jim Corbett National Park Safari Booking";
      return;
    }

    const cachedKey = `tenant_config_${tenantSlug}`;
    const cached = sessionStorage.getItem(cachedKey);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        setTenantConfig(data);
        if (data.themeColor) {
          document.documentElement.style.setProperty('--primary-color', data.themeColor);
          document.documentElement.style.setProperty('--primary-hover', data.themeColor + 'dd');
        }
        document.title = `${data.name || tenantSlug} - Jim Corbett National Park Tour & Safari Booking`;
        return;
      } catch (err) {
        console.warn("Failed parsing cached tenant configuration, refetching...", err);
      }
    }

    const fetchTenant = async () => {
      try {
        const base =
          window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
            ? "http://localhost:5000"
            : "https://junglesafari-s1dr.onrender.com";
        const res = await fetch(`${base}/api/tenant/${tenantSlug}`);
        if (res.ok) {
          const data = await res.json();
          sessionStorage.setItem(cachedKey, JSON.stringify(data));
          setTenantConfig(data);
          if (data.themeColor) {
            // Inject primary brand theme custom properties dynamically!
            document.documentElement.style.setProperty('--primary-color', data.themeColor);
            document.documentElement.style.setProperty('--primary-hover', data.themeColor + 'dd');
          }
          document.title = `${data.name || tenantSlug} - Jim Corbett National Park Tour & Safari Booking`;
        }
      } catch (err) {
        console.error("Failed to load tenant configurations:", err);
      }
    };

    fetchTenant();
  }, [tenantSlug]);

  const getBrandName = () => {
    if (tenantConfig && tenantConfig.name) return tenantConfig.name;
    if (!tenantSlug) return "Corbett Trails";
    return tenantSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <header className="header">
      {/* Logo */}
      <Link to={getTenantPath("/")} className="logo" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
        {tenantConfig && tenantConfig.logo ? (
          tenantConfig.logo.startsWith("http") ? (
            <img
              src={tenantConfig.logo}
              alt="Logo"
              style={{
                height: "36px",
                width: "36px",
                objectFit: "contain",
                borderRadius: "6px",
                background: "#f8fafc",
                padding: "2px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.05)"
              }}
            />
          ) : (
            <span
              className="header-logo-emoji"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--primary-color, #4caf50)",
                color: "#fff",
                fontSize: "1.3rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                lineHeight: "1"
              }}
            >
              {tenantConfig.logo}
            </span>
          )
        ) : !tenantSlug ? (
          <span
            className="header-logo-emoji"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "var(--primary-color, #4caf50)",
              color: "#fff",
              fontSize: "1.3rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              lineHeight: "1"
            }}
          >
            🦁
          </span>
        ) : null}
        <h1>{getBrandName()}</h1>
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
          <NavLink to={getTenantPath("/")} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to={getTenantPath("/about")} onClick={closeMenu}>
            About
          </NavLink>
          <NavLink to={getTenantPath("/locations")} onClick={closeMenu}>
            Locations
          </NavLink>
          <NavLink to={getTenantPath("/booking")} onClick={closeMenu}>
            Safari Booking
          </NavLink>
          <NavLink to={getTenantPath("/planner")} onClick={closeMenu}>
            Jungle Planner
          </NavLink>
          <NavLink to={getTenantPath("/sightings")} onClick={closeMenu}>
            Live Sightings
          </NavLink>
          <NavLink to={getTenantPath("/campfire")} onClick={closeMenu}>
            🔥 AI Campfire
          </NavLink>
          <NavLink to={getTenantPath("/reviews")} onClick={closeMenu}>
            Reviews
          </NavLink>

          {/* ✅ MOBILE SAAS SIGNUP LINK (ROOT ONLY) */}
          {!tenantSlug && (
            <NavLink to="/saas-signup" className="mobile-only" onClick={closeMenu}>
              Launch SaaS 🚀
            </NavLink>
          )}

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
        {/* ✅ DESKTOP SAAS SIGNUP LINK (ROOT ONLY) */}
        {!tenantSlug && (
          <Link
            to="/saas-signup"
            className="saas-nav-btn"
            onClick={closeMenu}
            style={{
              background: "linear-gradient(135deg, #007bff, #0056b3)",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "0.85rem",
              fontWeight: 700,
              textDecoration: "none",
              marginRight: "10px",
              boxShadow: "0 4px 10px rgba(0, 123, 255, 0.25)",
              display: "inline-flex",
              alignItems: "center",
              transition: "transform 0.2s"
            }}
          >
            Launch SaaS 🚀
          </Link>
        )}

        <Link
          to={isAdminLoggedIn ? "/admin/dashboard" : "/admin/login"}
          className="admin-btn"
          onClick={closeMenu}
        >
          {isAdminLoggedIn ? "Dashboard" : "Admin"}
        </Link>

        <Link
          to={getTenantPath("/contact#contact-form")}
          className="headerBtn"
          onClick={closeMenu}
        >
          Contact us
        </Link>
      </div>
    </header>
  );
}
