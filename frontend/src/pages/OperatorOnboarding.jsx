import React, { useState } from "react";
import "./operatorOnboarding.css";
import { FaBuilding, FaLink, FaPalette, FaCheckCircle, FaRocket } from "react-icons/fa";

const getApiUrl = (path) => {
  const base =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : "https://junglesafari-s1dr.onrender.com";
  return `${base}${path}`;
};

export default function OperatorOnboarding() {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    email: "",
    phone: "",
    themeColor: "#4caf50",
    plan: "Starter",
  });

  const [loading, setLoading] = useState(false);
  const [registeredTenant, setRegisteredTenant] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "slug") {
      // Formats the slug cleanly into a URL-friendly slug in real-time
      const formattedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9-\s]/g, "") // Allow alphanumeric, hyphens, spaces
        .replace(/\s+/g, "-");        // Convert spaces to hyphens
      setForm({ ...form, slug: formattedSlug });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validateField = (name, value) => {
    if (!value) return null;
    if (name === "name") return value.trim().length >= 3;
    if (name === "slug") return value.trim().length >= 3;
    if (name === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (name === "phone") return /^\d{10}$/.test(value.replace(/[-()\s]/g, ""));
    return null;
  };

  const renderValidationIndicator = (name) => {
    const isValid = validateField(name, form[name]);
    if (isValid === null) return null;
    return isValid ? (
      <span className="input-validation-status valid" style={{ color: "#81c784", fontWeight: "bold", marginLeft: "8px", fontSize: "0.8rem" }}>✓ Valid</span>
    ) : (
      <span className="input-validation-status invalid" style={{ color: "#ef5350", fontWeight: "bold", marginLeft: "8px", fontSize: "0.8rem" }}>✗ Invalid format</span>
    );
  };

  const getInputClass = (name) => {
    const isValid = validateField(name, form[name]);
    if (isValid === null) return "";
    return isValid ? "input-valid" : "input-invalid";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.slug) {
      setError("Please specify a unique brand slug.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(getApiUrl("/api/tenant"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to register operator.");
      }

      const data = await res.json();
      setRegisteredTenant(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFullBookingUrl = (slug) => {
    return `${window.location.origin}/${slug}/booking`;
  };

  const getFullPlannerUrl = (slug) => {
    return `${window.location.origin}/${slug}/planner`;
  };

  return (
    <section className="onboarding-page">
      <div className="onboarding-hero">
        <div className="overlay"></div>
        <div className="hero-text">
          <h1>Dynamic Tenant Onboarding</h1>
          <p>Instantly launch, brand, and configure your own custom wildlife safari booking ecosystem.</p>
        </div>
      </div>

      <div className="onboarding-container">
        {!registeredTenant ? (
          <div className="glass-onboarding-card animate-fade-in">
            <div className="card-header-onboarding">
              <FaRocket className="rocket-icon" />
              <div>
                <h2>Create Your Operator Portal</h2>
                <p>Configure your brand details, primary styles, and instance parameters below.</p>
              </div>
            </div>

            {error && <div className="error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="onboarding-form">
              <div className="form-grid">
                <div className="form-group-saas">
                  <label><FaBuilding /> Operator Brand Name * {renderValidationIndicator("name")}</label>
                  <input
                    type="text"
                    name="name"
                    className={getInputClass("name")}
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Gir Forest Safaris"
                    required
                  />
                </div>

                <div className="form-group-saas">
                  <label><FaLink /> Custom Operator Slug * {renderValidationIndicator("slug")}</label>
                  <input
                    type="text"
                    name="slug"
                    className={getInputClass("slug")}
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="e.g. gir-safari"
                    required
                  />
                  <small className="saas-preview-text">
                    Live URL: <strong>{getFullBookingUrl(form.slug || "your-slug")}</strong>
                  </small>
                </div>

                <div className="form-group-saas">
                  <label>Operator Email * {renderValidationIndicator("email")}</label>
                  <input
                    type="email"
                    name="email"
                    className={getInputClass("email")}
                    value={form.email}
                    onChange={handleChange}
                    placeholder="e.g. support@girsafari.com"
                    required
                  />
                </div>

                <div className="form-group-saas">
                  <label>Contact Phone {renderValidationIndicator("phone")}</label>
                  <input
                    type="text"
                    name="phone"
                    className={getInputClass("phone")}
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 99999 88888"
                  />
                </div>

                <div className="form-group-saas">
                  <label><FaPalette /> Primary Brand Color Theme</label>
                  <div className="color-selector-wrapper">
                    <input
                      type="color"
                      name="themeColor"
                      className="brand-color-picker"
                      value={form.themeColor}
                      onChange={handleChange}
                    />
                    <span className="color-hex-label">{form.themeColor}</span>
                  </div>
                  <small className="saas-preview-text">
                    All buttons, navigation headers, and elements will dynamically align with this color theme!
                  </small>
                </div>

                <div className="form-group-saas">
                  <label>Select SaaS License Plan</label>
                  <select name="plan" value={form.plan} onChange={handleChange}>
                    <option value="Starter">Starter Plan ($49/mo)</option>
                    <option value="Professional">Professional Plan ($149/mo)</option>
                    <option value="Enterprise">Enterprise Plan ($499/mo)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="onboard-submit-btn" disabled={loading}>
                {loading ? "Initializing Brand Instance..." : "Launch Operator Instance"}
              </button>
            </form>
          </div>
        ) : (
          <div className="glass-onboarding-card success-card-saas animate-fade-in">
            <div className="success-header-saas">
              <FaCheckCircle className="check-success-icon" />
              <h2>Instance Initiated Successfully!</h2>
              <p>Your custom tour operator instance for <strong>{registeredTenant.name}</strong> is live and operational.</p>
            </div>

            <div className="instance-details-list">
              <div className="detail-item-saas">
                <span className="detail-label">Brand Slug:</span>
                <span className="detail-value font-mono">{registeredTenant.slug}</span>
              </div>
              <div className="detail-item-saas">
                <span className="detail-label">Brand Color:</span>
                <span className="detail-value flex-align">
                  <span className="color-swatch-saas" style={{ backgroundColor: registeredTenant.themeColor }}></span>
                  {registeredTenant.themeColor}
                </span>
              </div>
              <div className="detail-item-saas">
                <span className="detail-label">Billing Plan:</span>
                <span className="detail-value font-bold text-green">{registeredTenant.plan || "Starter"}</span>
              </div>
            </div>

            <div className="saas-link-box">
              <h3>🔗 Your Scoped Brand Portals</h3>
              <p>Distribute these links immediately to customers and guides:</p>
              
              <div className="portal-links-wrapper">
                <div className="link-item-saas">
                  <div className="link-info-saas">
                    <strong>1. Branded Safari Booking Portal</strong>
                    <span>For customer safari ticket purchases and seat reservations</span>
                  </div>
                  <a href={getFullBookingUrl(registeredTenant.slug)} target="_blank" rel="noopener noreferrer" className="saas-action-link-btn">
                    Open Booking Portal
                  </a>
                </div>

                <div className="link-item-saas">
                  <div className="link-info-saas">
                    <strong>2. Branded AI Jungle Planner</strong>
                    <span>Gemini AI powered itinerary planning tailored to your brand</span>
                  </div>
                  <a href={getFullPlannerUrl(registeredTenant.slug)} target="_blank" rel="noopener noreferrer" className="saas-action-link-btn">
                    Open AI Planner
                  </a>
                </div>

                <div className="link-item-saas">
                  <div className="link-info-saas">
                    <strong>3. Admin Operations Panel</strong>
                    <span>Monitor dynamic stats, process payments, and dispatch QR passes</span>
                  </div>
                  <a href="/admin/login" target="_blank" rel="noopener noreferrer" className="saas-action-link-btn secondary-saas-btn">
                    Open Admin Dashboard
                  </a>
                </div>
              </div>
            </div>

            <button onClick={() => setRegisteredTenant(null)} className="onboard-reset-btn">
              Register Another Brand
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
