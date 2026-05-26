import React, { useState, useEffect } from "react";
import "./booking.css";
import { useNavigate, useParams } from "react-router-dom";
import { FaMagic, FaCheckCircle, FaSpinner } from "react-icons/fa";
import StripeCheckout from "../components/StripeCheckout/StripeCheckout";

const getApiUrl = (path) => {
  const base =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : "https://junglesafari-s1dr.onrender.com";
  return `${base}${path}`;
};

export default function Booking() {
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
        console.warn("Failed parsing cached config in booking, refetching...", err);
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
        console.error("Failed to load tenant configurations in booking:", err);
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
  
  // State for form fields
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    zone: "",
    date: "",
    visitors: "",
    safariType: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [completedBooking, setCompletedBooking] = useState(null);

  // 🔮 AI Sighting Predictor States
  const [prediction, setPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);

  // 💳 Stripe Sandbox Checkout States
  const [isStripeOpen, setIsStripeOpen] = useState(false);

  // 🛞 Jeep Seat Selector States
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Reset selected seats when visitors or safariType changes
  useEffect(() => {
    setSelectedSeats([]);
  }, [form.visitors, form.safariType]);

  const handleSeatClick = (seatId) => {
    const maxSelected = parseInt(form.visitors) || 1;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length < maxSelected) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        setSelectedSeats([...selectedSeats.slice(1), seatId]);
      }
    }
  };

  const getBasePrice = () => {
    if (form.safariType === "Jeep Safari") return 3500;
    if (form.safariType === "Canter Safari") return 1200 * (parseInt(form.visitors) || 1);
    if (form.safariType === "Elephant Safari") return 2500 * (parseInt(form.visitors) || 1);
    return 0;
  };

  const getSeatPremiumPrice = () => {
    const premiums = { S1: 2500, S2: 1500, S3: 1500, S4: 800, S5: 800, S6: 800 };
    return selectedSeats.reduce((sum, seatId) => sum + (premiums[seatId] || 0), 0);
  };

  const calculateTotalPrice = () => {
    return getBasePrice() + (form.safariType === "Jeep Safari" ? getSeatPremiumPrice() : 0);
  };

  // Update form fields dynamically
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateField = (name, value) => {
    if (!value) return null; // not typed yet
    if (name === "fullName") return value.trim().length >= 3;
    if (name === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (name === "phone") return /^\d{10}$/.test(value.replace(/[-()\s]/g, ""));
    if (name === "visitors") return Number(value) >= 1 && Number(value) <= 6;
    if (name === "zone" || name === "safariType" || name === "date") return value !== "";
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

  // Trigger Sighting Predictor when Zone & Date change
  useEffect(() => {
    if (form.zone && form.date) {
      triggerSightingPrediction(form.zone, form.date);
    }
  }, [form.zone, form.date]);

  const triggerSightingPrediction = async (zone, date) => {
    try {
      setPredicting(true);
      const res = await fetch(getApiUrl("/api/ai/predict-sighting"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zone, date }),
      });

      if (!res.ok) throw new Error("Prediction call failed");
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      console.warn("Prediction server request failed, resolving local mock prediction.");
      setPrediction(getMockSightingPrediction(zone, date));
    } finally {
      setPredicting(false);
    }
  };

  // Intercept Form submission to invoke Stripe Checkout
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🚀 [Booking] Submit triggered. Form values:", form);
    
    // Check if seats match visitor count for Jeep Safari
    if (form.safariType === "Jeep Safari" && selectedSeats.length !== (parseInt(form.visitors) || 1)) {
      console.warn("⚠️ [Booking] Seat count mismatch for Jeep Safari!");
      alert(`Please select exactly ${form.visitors || 1} seat(s) on the interactive Gypsy vehicle before proceeding to checkout!`);
      return;
    }

    const price = calculateTotalPrice();
    console.log("💰 [Booking] Calculated price:", price);

    if (price > 0) {
      console.log("💳 [Booking] Opening Stripe Sandbox Checkout modal...");
      setIsStripeOpen(true);
    } else {
      console.log("🪵 [Booking] Free booking detected. Submitting straight to DB...");
      submitBookingToDatabase();
    }
  };

  const submitBookingToDatabase = async () => {
    const payload = {
      ...form,
      selectedSeats,
      totalPrice: calculateTotalPrice(),
      tenantId: tenantSlug || "corbett-trails",
    };
    console.log("📡 [Booking] Sending booking payload to backend:", payload);

    try {
      const url = getApiUrl("/api/booking");
      console.log("🌐 [Booking] Target endpoint URL:", url);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("📬 [Booking] Backend responded with status:", res.status, "ok:", res.ok);

      if (res.ok) {
        const data = await res.json();
        console.log("🎉 [Booking] Booking completed successfully! Data:", data);
        setCompletedBooking(data.booking);
        setForm({
          fullName: "",
          email: "",
          phone: "",
          zone: "",
          date: "",
          visitors: "",
          safariType: "",
          message: "",
        });
        setSelectedSeats([]);
        setPrediction(null);
        setSubmitted(true);
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error("❌ [Booking] Server rejected submission:", errData);
        alert("Booking submission failed. Please try again.");
      }
    } catch (err) {
      console.error("🚨 [Booking] Network/API call crashed! Error:", err);
      alert("A server error occurred. Please try later.");
    }
  };

  return (
    <section className="booking-page">
      {/* HERO */}
      <div className="booking-hero">
        <div className="overlay"></div>
        <div className="hero-text">
          <h1>Book Your {getBrandName()} Safari</h1>
          <p>
            Choose your zone, dates, and safari type for an unforgettable
            wildlife adventure.
          </p>
        </div>
      </div>

      {/* INTRO */}
      <div className="booking-intro">
        <div className="intro-text">
          <h2>Your Jungle Adventure Awaits</h2>
          <p>
            Plan your safari with ease. Whether you seek tigers in Dhikala,
            serene walks in Sitabani, or the wild charm of Phato, our booking
            form lets you reserve your spot in minutes.
          </p>
        </div>
        <div className="intro-image">
          <img
            src="https://images.news9live.com/wp-content/uploads/2024/03/Jim-Corbett-Reserve.jpg?w=802&enlarge=true"
            alt="Corbett Landscape"
          />
        </div>
      </div>

      {/* SECTION HEADER */}
      <div className="booking-section-header no-print">
        <h2>Reserve Your Safari</h2>
        <p>Fill out the form below to confirm your adventure.</p>
      </div>

      {/* BOOKING FORM & AI PREDICTOR WRAPPER */}
      <div className="booking-main-content">
        <div className="booking-container">
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name * {renderValidationIndicator("fullName")}</label>
              <input
                type="text"
                name="fullName"
                className={getInputClass("fullName")}
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address * {renderValidationIndicator("email")}</label>
              <input
                type="email"
                name="email"
                className={getInputClass("email")}
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number * {renderValidationIndicator("phone")}</label>
              <input
                type="tel"
                name="phone"
                className={getInputClass("phone")}
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="form-group">
              <label>Select Safari Zone * {renderValidationIndicator("zone")}</label>
              <select
                name="zone"
                className={getInputClass("zone")}
                value={form.zone}
                onChange={handleChange}
                required
              >
                <option value="">Choose a Zone</option>
                <option value="Dhikala">Dhikala Zone</option>
                <option value="Bijrani">Bijrani Zone</option>
                <option value="Jhirna">Jhirna Zone</option>
                <option value="Dhela">Dhela Zone</option>
                <option value="Durga Devi">Durga Devi Zone</option>
                <option value="Garjiya">Garjiya Zone</option>
                <option value="Sitabani">Sitabani Zone</option>
                <option value="Phato">Phato Zone</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date of Visit * {renderValidationIndicator("date")}</label>
              <input
                type="date"
                name="date"
                className={getInputClass("date")}
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Number of Visitors (Max 6) * {renderValidationIndicator("visitors")}</label>
              <input
                type="number"
                name="visitors"
                min="1"
                max="6"
                className={getInputClass("visitors")}
                value={form.visitors}
                onChange={handleChange}
                placeholder="Number of visitors"
                required
              />
            </div>

             <div className="form-group">
              <label>Preferred Safari Type *</label>
              <select
                name="safariType"
                value={form.safariType}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Jeep Safari">Jeep Safari</option>
                <option value="Canter Safari">Canter Safari</option>
                <option value="Elephant Safari">Elephant Safari</option>
              </select>
            </div>

            {/* 🛞 VISUAL JEEP SEAT SELECTOR */}
            {form.safariType === "Jeep Safari" && (
              <div className="jeep-seat-selector-wrapper animate-fade-in">
                <label>🛞 Interactive 4x4 Jeep Seat Selector</label>
                <p className="seat-helper-text">
                  Choose exactly <strong>{form.visitors || 1}</strong> seat(s) on the open-top Gypsy layout.
                </p>

                <div className="jeep-cabin-grid">
                  {/* Front Row (Driver + Premium Sighting Seat) */}
                  <div className="cabin-row front-row">
                    <div className="seat driver disabled">👤 Staff</div>
                    <div
                      className={`seat ${selectedSeats.includes("S1") ? "selected" : "premium"}`}
                      onClick={() => handleSeatClick("S1")}
                      title="Seat S1: Front Row Sighting Seat (+Rs 2,500)"
                    >
                      S1 <br /> <small>+Rs 2.5k</small>
                    </div>
                  </div>

                  {/* Middle Row (Standard Seats) */}
                  <div className="cabin-row middle-row">
                    <div
                      className={`seat ${selectedSeats.includes("S2") ? "selected" : ""}`}
                      onClick={() => handleSeatClick("S2")}
                      title="Seat S2: Middle Row Seat (+Rs 1,500)"
                    >
                      S2 <br /> <small>+Rs 1.5k</small>
                    </div>
                    <div
                      className={`seat ${selectedSeats.includes("S3") ? "selected" : ""}`}
                      onClick={() => handleSeatClick("S3")}
                      title="Seat S3: Middle Row Seat (+Rs 1,500)"
                    >
                      S3 <br /> <small>+Rs 1.5k</small>
                    </div>
                  </div>

                  {/* Back Row (Bouncy/Budget Seats) */}
                  <div className="cabin-row back-row">
                    <div
                      className={`seat ${selectedSeats.includes("S4") ? "selected" : ""}`}
                      onClick={() => handleSeatClick("S4")}
                      title="Seat S4: Back Row Seat (+Rs 800)"
                    >
                      S4 <br /> <small>+Rs 800</small>
                    </div>
                    <div
                      className={`seat ${selectedSeats.includes("S5") ? "selected" : ""}`}
                      onClick={() => handleSeatClick("S5")}
                      title="Seat S5: Back Row Seat (+Rs 800)"
                    >
                      S5 <br /> <small>+Rs 800</small>
                    </div>
                    <div
                      className={`seat ${selectedSeats.includes("S6") ? "selected" : ""}`}
                      onClick={() => handleSeatClick("S6")}
                      title="Seat S6: Back Row Seat (+Rs 800)"
                    >
                      S6 <br /> <small>+Rs 800</small>
                    </div>
                  </div>
                </div>

                <div className="seats-legend">
                  <span className="legend-item"><span className="legend-box available"></span> Standard</span>
                  <span className="legend-item"><span className="legend-box premium-box"></span> Premium</span>
                  <span className="legend-item"><span className="legend-box selected-box"></span> Selected</span>
                </div>
              </div>
            )}

            {/* 💰 DYNAMIC PRICING BREAKDOWN */}
            {form.safariType && (
              <div className="price-breakdown-card animate-fade-in">
                <h4>💳 Pricing Breakdown Summary</h4>
                <div className="price-line">
                  <span>Base Safari Booking:</span>
                  <span>Rs. {getBasePrice()}</span>
                </div>
                {form.safariType === "Jeep Safari" && selectedSeats.length > 0 && (
                  <div className="price-line">
                    <span>Premium Seat Premiums ({selectedSeats.join(", ")}):</span>
                    <span>Rs. {getSeatPremiumPrice()}</span>
                  </div>
                )}
                <hr className="price-divider" />
                <div className="price-line total-price">
                  <span>Estimated Total:</span>
                  <span>Rs. {calculateTotalPrice()}</span>
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Special Requests</label>
              <textarea
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                placeholder="Any special requests?"
              ></textarea>
            </div>

            <button type="submit" className="book-btn">
              Confirm Booking
            </button>

            {submitted && (
              <div className="success-message">
                ✅ Your Safari Booking is Confirmed!
              </div>
            )}
          </form>
        </div>

        {/* 🔮 AI SIGHTING PREDICTOR DISPLAY */}
        <div className="booking-predictor-container">
          <div className="predictor-card">
            <div className="predictor-card-header">
              <FaMagic className="predictor-magic-icon" />
              <h3>AI Sighting Forecast</h3>
            </div>
            
            {!form.zone || !form.date ? (
              <div className="predictor-empty-state">
                <div className="compass-icon-wrapper">
                  <div className="compass-pulse-ring"></div>
                  <div className="compass-pulse-ring-outer"></div>
                  <div className="compass-icon">🧭</div>
                </div>
                <h4>Ready to Forecast Wildlife?</h4>
                <p>Pick a safari zone and visit date to trigger our AI Wildlife Probability Forecast.</p>
              </div>
            ) : predicting ? (
              <div className="predictor-loading-state">
                <FaSpinner className="spin-loading" size={30} />
                <h4>Running AI Simulation...</h4>
                <p>Analyzing weather, recent guide sighting reports, and active migration logs in {form.zone}.</p>
              </div>
            ) : prediction ? (
              <div className="predictor-results animate-fade-in">
                <div className="prediction-summary-box">
                  <span className="summary-badge">Gemini AI Synthesis</span>
                  <p>{prediction.summary}</p>
                </div>

                <h4>🐾 Spotted Probability Rates</h4>
                
                <div className="prediction-rates-list">
                  {Object.entries(prediction.predictions).map(([animal, percent]) => (
                    <div className="rate-item" key={animal}>
                      <div className="rate-info">
                        <span className="rate-animal">{animal === "SlothBear" ? "Sloth Bear" : animal}</span>
                        <span className="rate-percent">{percent}%</span>
                      </div>
                      <div className="rate-progress-bar">
                        <div 
                          className={`rate-progress-fill ${percent > 70 ? 'high' : percent > 40 ? 'medium' : 'low'}`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="prediction-disclaimer">
                  <FaCheckCircle className="disclaimer-check" />
                  <span>Verified with local tracking logs. Sighting success depends on guide paths.</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="booking-cta">
        <h2>Answer the Call of the Wild</h2>
        <p>
          Adventure, serenity, and the roar of the jungle await. Step into the wilderness today.
        </p>
        <button
          className="cta-btn"
          onClick={() => {
            if (tenantSlug) navigate(`/${tenantSlug}/contact#contact-form`);
            else navigate("/contact#contact-form");
          }}
        >
          Contact Our Team
        </button>
      </div>

      <StripeCheckout
        isOpen={isStripeOpen}
        onClose={() => setIsStripeOpen(false)}
        onSuccess={() => {
          setIsStripeOpen(false);
          submitBookingToDatabase();
        }}
        amount={calculateTotalPrice()}
        bookingDetails={form}
      />

      {completedBooking && (
        <div className="ticket-modal-overlay">
          <div className="ticket-modal-card animate-slide-up print-section">
            <div className="ticket-modal-header no-print">
              <h2>🎟️ Official Booking Confirmation</h2>
              <p>Your Jungle Safari booking has been approved and paid successfully!</p>
            </div>
            
            {/* The Ticket Pass */}
            <div className="official-ticket-pass" id="printable-safari-pass">
              <div className="ticket-pass-header">
                <div className="ticket-pass-logo">
                  <h3>JUNGLE SAFARI</h3>
                  <span>{getBrandName()} Entry Permit</span>
                </div>
                <div className="ticket-pass-badge">
                  OFFICIAL PASS
                </div>
              </div>
              
              <div className="ticket-pass-body">
                <div className="ticket-meta">
                  <div className="meta-col">
                    <small>PASSENGER NAME</small>
                    <strong>{completedBooking.fullName}</strong>
                  </div>
                  <div className="meta-col">
                    <small>PERMIT STATUS</small>
                    <strong className="status-approved">APPROVED</strong>
                  </div>
                </div>

                <div className="ticket-meta">
                  <div className="meta-col">
                    <small>SAFARI ZONE</small>
                    <strong>{completedBooking.zone} Zone</strong>
                  </div>
                  <div className="meta-col">
                    <small>SAFARI DATE</small>
                    <strong>{new Date(completedBooking.date).toLocaleDateString()}</strong>
                  </div>
                </div>

                <div className="ticket-meta">
                  <div className="meta-col">
                    <small>SAFARI TYPE & SEATS</small>
                    <strong>{completedBooking.safariType} {completedBooking.selectedSeats && completedBooking.selectedSeats.length > 0 ? `(Seats: ${completedBooking.selectedSeats.join(', ')})` : ''}</strong>
                  </div>
                  <div className="meta-col">
                    <small>VISITORS</small>
                    <strong>{completedBooking.visitors} Guest(s)</strong>
                  </div>
                </div>

                <div className="ticket-meta">
                  <div className="meta-col">
                    <small>TOTAL PAID</small>
                    <strong className="price-bold">Rs. {completedBooking.totalPrice}</strong>
                  </div>
                  <div className="meta-col">
                    <small>BOOKING ID</small>
                    <strong>#{completedBooking._id}</strong>
                  </div>
                </div>
                
                <div className="ticket-pass-divider">
                  <div className="divider-circle left"></div>
                  <div className="divider-line"></div>
                  <div className="divider-circle right"></div>
                </div>

                <div className="ticket-pass-footer">
                  <div className="qr-pass-container">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(completedBooking._id)}`} 
                      alt="Pass QR Code" 
                      className="qr-pass-img"
                    />
                    <small>Scan at Forest Entrance Gate</small>
                  </div>
                  <div className="guidelines-pass-container">
                    <h4>📝 Gate Entry Guidelines</h4>
                    <ul>
                      <li>Reach designated zone entry gate 30 mins before schedule.</li>
                      <li>Produce photo ID matching <strong>{completedBooking.fullName}</strong>.</li>
                      <li>This pass represents a valid digital booking permit.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="ticket-modal-actions no-print">
              <button 
                className="btn-action print-btn" 
                onClick={() => window.print()}
              >
                🖨️ Print Ticket / Save PDF
              </button>
              <button 
                className="btn-action close-btn" 
                onClick={() => {
                  setCompletedBooking(null);
                  setSubmitted(false);
                }}
              >
                Close & Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// --------------------------------------------------------------------------
// MOCK SIGHTING PREDICTION GENERATOR
// --------------------------------------------------------------------------
function getMockSightingPrediction(zone, date) {
  const visitMonth = date ? new Date(date).getMonth() : new Date().getMonth();
  
  let tigerBase = 40;
  let elephantBase = 50;
  let leopardBase = 15;
  let bearBase = 10;
  let deerBase = 90;

  const normZone = zone.toLowerCase();
  if (normZone.includes("bijrani")) { tigerBase += 25; bearBase += 5; }
  else if (normZone.includes("dhikala")) { elephantBase += 35; tigerBase += 15; }
  else if (normZone.includes("jhirna")) { bearBase += 45; elephantBase += 10; }
  
  if (visitMonth >= 2 && visitMonth <= 5) {
    tigerBase += 15;
    elephantBase -= 10;
  }

  const finalTiger = Math.min(99, Math.max(15, tigerBase + Math.floor(Math.random() * 5)));
  const finalElephant = Math.min(99, Math.max(20, elephantBase + Math.floor(Math.random() * 5)));
  const finalLeopard = Math.min(92, Math.max(8, leopardBase + Math.floor(Math.random() * 5)));
  const finalBear = Math.min(90, Math.max(5, bearBase + Math.floor(Math.random() * 5)));
  const finalDeer = Math.min(99, Math.max(70, deerBase + Math.floor(Math.random() * 5)));

  return {
    summary: `Local tracks indicate high activity near water-bodies in ${zone} zone due to favorable clear morning conditions. Guided 4x4 paths are highly favored for sighting predators.`,
    predictions: {
      Tiger: finalTiger,
      Elephant: finalElephant,
      Leopard: finalLeopard,
      SlothBear: finalBear,
      Deer: finalDeer,
    }
  };
}
