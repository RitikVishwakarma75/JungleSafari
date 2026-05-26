import "./about.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function About() {
  const navigate = useNavigate(); 
  const { tenantSlug } = useParams();
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
        console.warn("Failed parsing cached config in about, refetching...", err);
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
        console.error("Failed to load tenant configurations in about:", err);
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

  const handlePlanSafari = () => {
    if (tenantSlug) {
      navigate(`/${tenantSlug}/booking`);
    } else {
      navigate("/booking");
    }
  };

  return (
    <section className="about-page">
      {/* HERO SECTION */}
      <div className="about-hero">
        <div className="overlay"></div>
        <div className="hero-text">
          <h1>Step Into the Wild</h1>
          <p>Experience Nature Like Never Before with {getBrandName()}</p>
        </div>
      </div>

      {/* INTRO SECTION */}
      <div className="about-intro">
        <div className="intro-text">
          <h2>Our Story</h2>
          <p>
            Born in the heart of the wilderness, {getBrandName()} was founded by a
            team of explorers and dreamers who wanted to bring the raw beauty of
            nature closer to those who crave adventure. From the deep roars of
            the tiger to the golden hues of the jungle dawn, every safari with
            us is more than a journey — it’s a story waiting to be lived.
          </p>

          <h2>Our Vision</h2>
          <p>
            We aim to redefine travel by blending thrill with sustainability.
            Our safaris are designed to protect the ecosystem while giving you a
            once-in-a-lifetime experience in the wild.
          </p>
        </div>

        <div className="intro-image">
          <img
            src="https://images.pexels.com/photos/16444276/pexels-photo-16444276.jpeg"
            alt="Safari jeep in jungle"
            loading="lazy"
          />
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="about-highlights">
        <h2>Why Choose {getBrandName()}?</h2>
        <div className="highlights-grid">
          <div className="highlight-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/616/616490.png"
              alt="Guide Icon"
              loading="lazy"
            />
            <h3>Expert Guides</h3>
            <p>
              Our guides are seasoned explorers who know the jungle’s whispers —
              from footprints in the dust to calls in the night.
            </p>
          </div>

          <div className="highlight-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3076/3076743.png"
              alt="Luxury Icon"
              loading="lazy"
            />
            <h3>Luxury in the Wild</h3>
            <p>
              Sleep under a million stars in eco-lodges that blend comfort with
              raw wilderness. Adventure never felt this cozy.
            </p>
          </div>

          <div className="highlight-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2343/2343081.png"
              alt="Eco Friendly Icon"
              loading="lazy"
            />
            <h3>Eco-Friendly Tours</h3>
            <p>
              Every journey supports wildlife conservation and local
              communities. Travel that gives back to nature.
            </p>
          </div>

          <div className="highlight-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/706/706195.png"
              alt="Beverage Icon"
              loading="lazy"
            />
            <h3>Beverage & Dining</h3>
            <p>
              Relish refreshing drinks and local delicacies crafted with love —
              whether it’s sunrise coffee by the river or a moonlit dinner in
              the jungle.
            </p>
          </div>

          <div className="highlight-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2920/2920239.png"
              alt="Photography Icon"
              loading="lazy"
            />
            <h3>Wildlife Photography</h3>
            <p>
              Capture the magic of the wild with our photography guides —
              perfect lighting, perfect timing, and the perfect shot of your
              adventure.
            </p>
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="about-cta">
        <h2>Join the Call of the Wild</h2>
        <p>
          The jungle awaits — full of mystery, magic, and life. Pack your bags,
          follow your instincts, and let {getBrandName()} guide your next
          unforgettable journey.
        </p>
        <button className="cta-btn" onClick={handlePlanSafari}>
          Plan Your Safari
        </button>
      </div>
    </section>
  );
}
