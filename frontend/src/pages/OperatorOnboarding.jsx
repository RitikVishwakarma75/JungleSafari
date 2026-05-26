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
    logoType: "preset",
    logoPreset: "🦁",
    logoCustomUrl: "",
    logo: "🦁",
    address: "",
    plan: "Starter",
    password: "",
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
    } else if (name === "logoCustomUrl") {
      setForm({ ...form, logoCustomUrl: value, logo: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleLogoTypeChange = (type) => {
    const finalLogo = type === "preset" ? form.logoPreset : form.logoCustomUrl;
    setForm({ ...form, logoType: type, logo: finalLogo });
  };

  const handlePresetSelect = (presetVal) => {
    setForm({ ...form, logoPreset: presetVal, logo: presetVal });
  };

  const validateField = (name, value) => {
    if (!value) return null;
    if (name === "name") return value.trim().length >= 3;
    if (name === "slug") return value.trim().length >= 3;
    if (name === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (name === "phone") return /^\d{10}$/.test(value.replace(/[-()\s]/g, ""));
    if (name === "password") return value.length >= 6;
    if (name === "address") return value.trim().length >= 5;
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
                  <label>Secure Admin Password * {renderValidationIndicator("password")}</label>
                  <input
                    type="password"
                    name="password"
                    className={getInputClass("password")}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Set password for your admin dashboard"
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

                {/* --- UNIQUE COMPANY PHYSICAL ADDRESS --- */}
                <div className="form-group-saas" style={{ gridColumn: "1 / -1" }}>
                  <label>🏢 Unique Company Address * {renderValidationIndicator("address")}</label>
                  <input
                    type="text"
                    name="address"
                    className={getInputClass("address")}
                    value={form.address}
                    onChange={handleChange}
                    placeholder="e.g. Near Gir National Park, Sasan Gir, Junagadh, Gujarat - 362135"
                    required
                  />
                  <small className="saas-preview-text">
                    This unique physical address will display on your branded footer and contact pages.
                  </small>
                </div>

                {/* --- BRAND LOGO SELECTION --- */}
                <div className="form-group-saas" style={{ gridColumn: "1 / -1", border: "1px solid rgba(255,255,255,0.1)", padding: "18px", borderRadius: "10px", background: "rgba(255,255,255,0.02)" }}>
                  <label style={{ fontWeight: "bold", fontSize: "1rem", display: "block", marginBottom: "12px", color: "#e2e8f0" }}>🎨 Choose Your Brand Logo</label>
                  
                  <div className="logo-type-tabs" style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                    <button
                      type="button"
                      className={`saas-tab-btn ${form.logoType === "preset" ? "active" : ""}`}
                      onClick={() => handleLogoTypeChange("preset")}
                      style={{
                        padding: "8px 16px",
                        border: "1px solid var(--primary-color, #4caf50)",
                        background: form.logoType === "preset" ? "var(--primary-color, #4caf50)" : "transparent",
                        color: "#fff",
                        borderRadius: "20px",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        transition: "all 0.3s"
                      }}
                    >
                      Wildlife Icon Preset
                    </button>
                    <button
                      type="button"
                      className={`saas-tab-btn ${form.logoType === "custom" ? "active" : ""}`}
                      onClick={() => handleLogoTypeChange("custom")}
                      style={{
                        padding: "8px 16px",
                        border: "1px solid var(--primary-color, #4caf50)",
                        background: form.logoType === "custom" ? "var(--primary-color, #4caf50)" : "transparent",
                        color: "#fff",
                        borderRadius: "20px",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        transition: "all 0.3s"
                      }}
                    >
                      Custom Logo Image URL
                    </button>
                  </div>

                  {form.logoType === "preset" ? (
                    <div>
                      <div className="logo-presets-grid" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        {[
                          { label: "Lion Pride", val: "🦁" },
                          { label: "Tiger Tracks", val: "🐯" },
                          { label: "Jumbo Safaris", val: "🐘" },
                          { label: "Deer Trails", val: "🦌" },
                          { label: "Eagle Eye", val: "🦅" }
                        ].map((preset) => (
                          <div
                            key={preset.val}
                            onClick={() => handlePresetSelect(preset.val)}
                            className={`logo-preset-item ${form.logoPreset === preset.val ? "selected" : ""}`}
                            style={{
                              padding: "12px 20px",
                              borderRadius: "8px",
                              border: form.logoPreset === preset.val ? "2px solid var(--primary-color, #4caf50)" : "1px solid rgba(255,255,255,0.15)",
                              background: form.logoPreset === preset.val ? "rgba(255,255,255,0.08)" : "transparent",
                              cursor: "pointer",
                              textAlign: "center",
                              transition: "all 0.2s",
                              flex: "1 0 100px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center"
                            }}
                          >
                            <span style={{ fontSize: "2rem", marginBottom: "4px" }}>{preset.val}</span>
                            <span style={{ fontSize: "0.75rem", fontWeight: "bold" }}>{preset.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        name="logoCustomUrl"
                        className={getInputClass("logoCustomUrl")}
                        value={form.logoCustomUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/assets/my-company-logo.png"
                        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#fff" }}
                      />
                      <small className="saas-preview-text">
                        Provide a link to a transparent PNG or SVG logo image (looks best on light headers).
                      </small>
                    </div>
                  )}

                  {/* Logo Live Preview */}
                  <div style={{ marginTop: "15px", display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: "0.8rem", color: "#bbb" }}>Logo Live Preview:</span>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "42px", height: "42px", borderRadius: "50%", background: "#fff", border: "2px solid var(--primary-color, #4caf50)", color: "#333", fontSize: "1.6rem" }}>
                      {form.logoType === "preset" ? (
                        form.logoPreset
                      ) : form.logoCustomUrl ? (
                        <img src={form.logoCustomUrl} alt="Logo" style={{ width: "26px", height: "26px", objectFit: "contain" }} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerText = '❓' }} />
                      ) : (
                        "❓"
                      )}
                    </div>
                  </div>
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
                <span className="detail-label">Brand Logo:</span>
                <span className="detail-value flex-align" style={{ gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "50%", background: "#fff", border: "1px solid #ddd", color: "#333", fontSize: "1.2rem" }}>
                    {registeredTenant.logo && registeredTenant.logo.startsWith("http") ? (
                      <img src={registeredTenant.logo} alt="Logo" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
                    ) : (
                      registeredTenant.logo || "🦁"
                    )}
                  </div>
                  <span className="font-mono">{registeredTenant.logo || "Default (🦁)"}</span>
                </span>
              </div>
              <div className="detail-item-saas">
                <span className="detail-label">Physical Address:</span>
                <span className="detail-value font-bold">{registeredTenant.address || "Not Specified"}</span>
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
                    <span>Login using Email: <strong>{registeredTenant.email}</strong> and your secure chosen Password</span>
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
