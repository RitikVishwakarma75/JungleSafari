// frontend/src/pages/GuidePortal.jsx
import React, { useState, useEffect } from "react";
import { FaUserCircle, FaTruck, FaPhone, FaCompass, FaCheckDouble, FaSignOutAlt, FaUnlockAlt, FaCalendarCheck } from "react-icons/fa";
import "./guidePortal.css";

const getApiUrl = (path) => {
  const base =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : "https://junglesafari-s1dr.onrender.com";
  return `${base}${path}`;
};

export default function GuidePortal() {
  const [guide, setGuide] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("guideToken") || null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    if (token) {
      fetchGuideSchedule();
      const savedGuide = localStorage.getItem("guideInfo");
      if (savedGuide) {
        setGuide(JSON.parse(savedGuide));
      }
    }
  }, [token]);

  const fetchGuideSchedule = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl("/api/guide/schedule"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) handleLogout();
        throw new Error("Failed to fetch schedule");
      }
      const data = await res.json();
      setSchedule(data);
    } catch (err) {
      console.warn("Could not load guide schedule from server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      setLoading(true);
      const res = await fetch(getApiUrl("/api/guide/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.message || "Invalid email or password");
        return;
      }

      localStorage.setItem("guideToken", data.token);
      localStorage.setItem("guideInfo", JSON.stringify(data.guide));
      setToken(data.token);
      setGuide(data.guide);
    } catch (err) {
      setLoginError("Server disconnected. Try email: guide@corbett.com, pass: guide123");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("guideToken");
    localStorage.removeItem("guideInfo");
    setToken(null);
    setGuide(null);
    setSchedule([]);
    resetLoginForm();
  };

  const resetLoginForm = () => {
    setEmail("");
    setPassword("");
    setLoginError("");
  };

  const handleCompleteRide = async (bookingId) => {
    try {
      // Optimistic update
      setSchedule((prev) => prev.filter((item) => item._id !== bookingId));

      const res = await fetch(getApiUrl(`/api/guide/booking/${bookingId}/checkin`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Complete ride failed");
      alert("Expedition completed! Safe returns!");
    } catch (err) {
      console.warn("Complete ride failed to synchronize with server.");
    }
  };

  return (
    <div className="guide-portal-container">
      {/* 🔐 AUTH LOGIN VIEW */}
      {!token ? (
        <div className="guide-login-card animate-slide-up">
          <div className="login-header">
            <FaUserCircle size={45} className="login-avatar" />
            <h2>Naturalist Guide Login</h2>
            <p>Access your daily safari tracking & scheduling portal</p>
          </div>

          <form onSubmit={handleLogin} className="guide-login-form">
            {loginError && <div className="login-error-box">{loginError}</div>}
            
            <div className="login-form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. guide@corbett.com"
                required
              />
            </div>

            <div className="login-form-group">
              <label>Security Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Verifying Credentials..." : "🔓 Unlock My Portal"}
            </button>

            <small className="demo-guide-helper">
              Demo Guide: <strong>guide@corbett.com</strong> / Pass: <strong>guide123</strong>
            </small>
          </form>
        </div>
      ) : (
        /* 📋 ASSIGNED SCHEDULE VIEW */
        <div className="guide-schedule-wrapper animate-fade-in">
          {/* Header Panel */}
          <div className="guide-profile-header">
            <div className="guide-info-summary">
              <h3>Welcome, {guide?.name || "Ramesh"}</h3>
              <div className="vehicle-badge">
                <FaTruck /> <span>{guide?.vehicle || "Gypsy UA-04-A-1234"}</span>
              </div>
            </div>
            <button className="logout-portal-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>

          {/* Schedule List */}
          <div className="schedule-body">
            <div className="section-title-wrapper">
              <FaCalendarCheck className="section-title-icon" />
              <h3>My Assigned Expeditions Today</h3>
            </div>

            {loading ? (
              <div className="schedule-loading">
                <div className="portal-spinner"></div>
                <p>Loading your routes...</p>
              </div>
            ) : schedule.length === 0 ? (
              <div className="empty-schedule-card">
                <div className="jungle-rest-icon">🌳</div>
                <h4>All Clear!</h4>
                <p>No active safari itineraries assigned to your Gypsy vehicle today. Enjoy the day off!</p>
              </div>
            ) : (
              <div className="schedule-cards-list">
                {schedule.map((ride) => (
                  <div className="schedule-card animate-slide-up" key={ride._id}>
                    <div className="card-top-bar">
                      <span className="ride-zone-pill">{ride.zone} Zone</span>
                      <span className="ride-session-tag">🌅 {ride.safariType}</span>
                    </div>

                    <div className="ride-core-details">
                      <h4>👤 {ride.fullName}</h4>
                      <p>👥 <strong>Visitors Count:</strong> {ride.visitors} Guest(s)</p>
                      {ride.selectedSeats && ride.selectedSeats.length > 0 && (
                        <p>🛞 <strong>Assigned Cabins:</strong> Seats {ride.selectedSeats.join(", ")}</p>
                      )}
                      <p>📅 <strong>Date:</strong> {new Date(ride.date).toLocaleDateString()}</p>
                    </div>

                    <div className="ride-action-bar">
                      <a href={`tel:${ride.phone}`} className="call-passenger-btn">
                        <FaPhone /> Call Guest
                      </a>
                      <button className="checkin-ride-btn" onClick={() => handleCompleteRide(ride._id)}>
                        <FaCheckDouble /> Mark Completed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
