import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const footerRef = useRef(null);

  const location = useLocation();
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

  const tenantSlug = pathParts[0] && isSlugPart(pathParts[0]) ? pathParts[0] : "";
  const [tenantConfig, setTenantConfig] = useState(null);

  useEffect(() => {
    if (!tenantSlug) {
      setTenantConfig(null);
      return;
    }

    const cachedKey = `tenant_config_${tenantSlug}`;
    const cached = sessionStorage.getItem(cachedKey);
    if (cached) {
      try {
        setTenantConfig(JSON.parse(cached));
        return;
      } catch (err) {
        console.warn("Failed parsing cached config in footer, refetching...", err);
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
        }
      } catch (err) {
        console.error("Failed to load tenant configurations in footer:", err);
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

  const getPhone = () => {
    if (tenantConfig && tenantConfig.phone) return tenantConfig.phone;
    return "+91 9756879998";
  };

  const getEmail = () => {
    if (tenantConfig && tenantConfig.email) return tenantConfig.email;
    return "thecorbettnaturelist@gmail.com";
  };

  const getAddress = () => {
    if (tenantConfig && tenantConfig.address) return tenantConfig.address;
    return "Ramnagar, Uttarakhand, India";
  };

  // ✅ Scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("footer-visible");
        }
      },
      { threshold: 0.2 }
    );

    if (footerRef.current) observer.observe(footerRef.current);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError(true);
      setTimeout(() => setEmailError(false), 600);
      return;
    }

    try {
      const base =
        window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
          ? "http://localhost:5000"
          : "https://junglesafari-s1dr.onrender.com";
      const res = await fetch(
        `${base}/api/newsletter`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Subscription failed ❌");
        return;
      }

      alert(data.message || "Subscribed successfully 🌿");
      setEmail("");
      setSubscribe(false);
    } catch (error) {
      alert("Server not responding. Try again later 🚫");
    }
  };


   return (
    <footer ref={footerRef} className="footer-container footer-hidden">
      <div className="footer-left">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          {tenantConfig && tenantConfig.logo ? (
            tenantConfig.logo.startsWith("http") ? (
              <img src={tenantConfig.logo} alt="Logo" style={{ height: "36px", width: "36px", objectFit: "contain", borderRadius: "50%", background: "#fff", padding: "2px", border: "1px solid rgba(0,0,0,0.1)" }} />
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "50%", background: "#1a3a2d", color: "#f3edde", fontSize: "1.2rem" }}>{tenantConfig.logo}</span>
            )
          ) : !tenantSlug ? (
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "50%", background: "#1a3a2d", color: "#f3edde", fontSize: "1.2rem" }}>🦁</span>
          ) : null}
          <h2 className="footer-logo" style={{ margin: 0, fontSize: "1.8rem" }}>{getBrandName()}</h2>
        </div>

        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={emailError ? "email-error" : email ? "email-valid" : ""}
          />

          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={subscribe}
              onChange={(e) => setSubscribe(e.target.checked)}
              required
            />
            <label>Yes, subscribe me *</label>
          </div>

          <button type="submit" className="submit-newsletter-btn">
            Submit
          </button>
        </form>
      </div>

      <div className="footer-right">
        <div className="contact-info">
          <p>📞 {getPhone()}</p>
          <p>📧 {getEmail()}</p>
          <p>📍 {getAddress()}</p>
        </div>

        <div className="legal-info">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/team">Team</Link>
        </div>

        <p className="copyright">
          © {new Date().getFullYear()} {getBrandName()}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
