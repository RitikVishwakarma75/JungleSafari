import React, { useState, useEffect } from "react";
import Explore from "../Explore/Explore";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { FaCloudSun, FaThermometerHalf, FaTint, FaWind, FaRegClock } from "react-icons/fa";

const PARK_STATUSES = [
  { name: "Bijrani Zone", status: "Open", density: "High", alert: "🐅 Tiger spotted near water canal 1h ago!" },
  { name: "Dhikala Zone", status: "Closed", density: "Low", alert: "🌧️ Closed due to seasonal monsoons" },
  { name: "Jhirna Zone", status: "Open", density: "Moderate", alert: "🐻 Sloth Bear feeding tracks seen near gate" },
  { name: "Dhela Zone", status: "Open", density: "Moderate", alert: "🐘 Elephant herd crossing the main forest trail" },
  { name: "Durga Devi Zone", status: "Closed", density: "Low", alert: "🚧 Seasonal trail restoration in progress" },
  { name: "Garjiya Zone", status: "Open", density: "High", alert: "🐆 Leopard warning alerts near riverbanks" },
  { name: "Sitabani Zone", status: "Open", density: "Low", alert: "🦌 Massive Spotted Deer herd grazing in open fields" },
  { name: "Phato Zone", status: "Open", density: "Moderate", alert: "🦅 Golden Eagle nests spotted near tall tree tops" },
];

export default function Home() {
  const navigate = useNavigate();
  
  // Dynamic simulated weather
  const [weather, setWeather] = useState({
    temp: 31,
    humidity: 48,
    condition: "Sunny Intervals",
    wind: 14,
  });

  // Fluctuate weather slightly to simulate live tracking feed
  useEffect(() => {
    const timer = setInterval(() => {
      setWeather((prev) => ({
        ...prev,
        temp: prev.temp + (Math.random() > 0.5 ? 0.5 : -0.5),
        wind: Math.max(8, Math.min(22, prev.wind + (Math.random() > 0.5 ? 1 : -1))),
      }));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <section className="hero">
        <h1>DISCOVER THE WILD</h1>
        <p>
          Welcome to Corbett Trails, where the call of the jungle meets the
          rhythm of your heart. Nestled in the wilderness of Jim Corbett
          National Park, we design bespoke safari experiences that blend
          adventure, comfort, and authenticity.
        </p>

        <button onClick={() => navigate("/Booking")} className="heroBtn">
          Book Now...
        </button>
      </section>

      {/* 🌤️ LIVE STATUS BOARD & WEATHER WIDGET */}
      <section className="live-status-section">
        <div className="status-grid-wrapper">
          
          {/* Live Weather Card */}
          <div className="status-card weather-card">
            <div className="card-header">
              <FaCloudSun className="weather-header-icon" />
              <div>
                <h3>Corbett Weather</h3>
                <span className="live-pulse-badge">🔴 Live Simulation</span>
              </div>
            </div>
            
            <div className="weather-main-data">
              <span className="weather-temp">{weather.temp.toFixed(1)}°C</span>
              <span className="weather-desc">{weather.condition}</span>
            </div>

            <div className="weather-sub-metrics">
              <div className="metric-item">
                <FaThermometerHalf className="metric-icon" />
                <span>Feels Like: {(weather.temp + 1).toFixed(1)}°C</span>
              </div>
              <div className="metric-item">
                <FaTint className="metric-icon" />
                <span>Humidity: {weather.humidity}%</span>
              </div>
              <div className="metric-item">
                <FaWind className="metric-icon" />
                <span>Wind: {weather.wind} km/h</span>
              </div>
            </div>

            <div className="weather-footer">
              <FaRegClock /> <span>Last checked: Just now</span>
            </div>
          </div>

          {/* Zone Status Board */}
          <div className="status-card board-card">
            <div className="card-header">
              <h3>🐅 Corbett Park Status Board</h3>
              <span className="live-counter-badge">Active Zones: 6 / 8</span>
            </div>

            <div className="status-table-container">
              <table className="status-table">
                <thead>
                  <tr>
                    <th>Safari Zone</th>
                    <th>Gate Status</th>
                    <th>Visitor Density</th>
                    <th>Live Tracker Updates</th>
                  </tr>
                </thead>
                <tbody>
                  {PARK_STATUSES.map((zone) => (
                    <tr key={zone.name}>
                      <td className="zone-name">{zone.name}</td>
                      <td>
                        <span className={`status-pill ${zone.status.toLowerCase()}`}>
                          {zone.status === "Open" ? "🟢 OPEN" : "🔴 CLOSED"}
                        </span>
                      </td>
                      <td>
                        <span className={`density-pill ${zone.density.toLowerCase()}`}>
                          {zone.density}
                        </span>
                      </td>
                      <td className="zone-alert-text">{zone.alert}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      <Explore />
    </>
  );
}
