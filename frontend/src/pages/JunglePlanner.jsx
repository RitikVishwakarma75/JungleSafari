// frontend/src/pages/JunglePlanner.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUserFriends, FaMapMarkedAlt, FaCompass, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import "./junglePlanner.css";

const getApiUrl = (path) => {
  const base =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : "https://junglesafari-s1dr.onrender.com";
  return `${base}${path}`;
};

export default function JunglePlanner() {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(3);
  const [groupType, setGroupType] = useState("Family with Kids");
  const [interests, setInterests] = useState(["Tiger Spotting", "Photography"]);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [itinerary, setItinerary] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  const groupOptions = [
    { label: "Solo Adventurer", icon: "🤠" },
    { label: "Romantic Couple", icon: "👩‍❤️‍👨" },
    { label: "Family with Kids", icon: "👨‍👩‍👧‍👦" },
    { label: "Photography Expedition", icon: "📸" },
    { label: "Senior Citizens", icon: "👵" },
  ];

  const interestOptions = [
    "Tiger Spotting",
    "Bird Watching",
    "Wilderness Camping",
    "Landscape Sightseeing",
    "Night Bonfires",
  ];

  const loadingMessages = [
    "Tracking tiger movements in Bijrani...",
    "Querying local naturalist trail logs...",
    "Assessing Kosi riverbed crossing safety...",
    "Evaluating weather forecast schedules...",
    "Designing optimal photography schedules...",
  ];

  const handleInterestToggle = (val) => {
    if (interests.includes(val)) {
      setInterests(interests.filter((i) => i !== val));
    } else {
      setInterests([...interests, val]);
    }
  };

  const handlePackCheck = (idx) => {
    setCheckedItems({ ...checkedItems, [idx]: !checkedItems[idx] });
  };

  const generateItinerary = async () => {
    if (interests.length === 0) {
      alert("Please select at least one interest!");
      return;
    }

    try {
      setLoading(true);
      setLoadingStep(0);

      // Rotate loading messages
      const loadingInterval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);

      const res = await fetch(getApiUrl("/api/ai/planner"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration,
          groupType,
          interests: interests.join(", "),
        }),
      });

      clearInterval(loadingInterval);

      if (!res.ok) throw new Error("Planner failed");
      const data = await res.json();
      setItinerary(data);
    } catch (err) {
      console.error("AI Planner error, generating dynamic client itinerary fallback.");
      // HEURISTIC PLANNER FALLBACK
      setItinerary(getMockPlannerResult(duration, groupType, interests));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="planner-container">
      {/* Intro Hero */}
      <div className="planner-hero">
        <h1>✨ AI Jungle Planner</h1>
        <p>Harness the power of artificial intelligence to generate a bespoke safari itinerary for Jim Corbett.</p>
      </div>

      {/* Input Panels */}
      {!itinerary && !loading && (
        <div className="planner-card input-card animate-fade-in">
          {/* Duration Choice */}
          <div className="input-group">
            <h3>
              <FaCalendarAlt className="grp-icon" /> Select Trip Duration
            </h3>
            <div className="duration-slider-container">
              <span className="duration-label">{duration} Days</span>
              <input
                type="range"
                min="1"
                max="5"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="custom-slider"
              />
              <div className="slider-ticks">
                <span>1d</span>
                <span>2d</span>
                <span>3d</span>
                <span>4d</span>
                <span>5d</span>
              </div>
            </div>
          </div>

          {/* Group Composition */}
          <div className="input-group">
            <h3>
              <FaUserFriends className="grp-icon" /> Group Composition
            </h3>
            <div className="group-grid">
              {groupOptions.map((opt) => (
                <div
                  key={opt.label}
                  className={`group-chip ${groupType === opt.label ? "active" : ""}`}
                  onClick={() => setGroupType(opt.label)}
                >
                  <span className="chip-emoji">{opt.icon}</span>
                  <span className="chip-text">{opt.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interests selection */}
          <div className="input-group">
            <h3>
              <FaCompass className="grp-icon" /> Primary Adventures & Interests
            </h3>
            <div className="interest-grid">
              {interestOptions.map((val) => (
                <label key={val} className={`interest-checkbox-label ${interests.includes(val) ? "checked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={interests.includes(val)}
                    onChange={() => handleInterestToggle(val)}
                    style={{ display: "none" }}
                  />
                  <span className="checkbox-box"></span>
                  {val}
                </label>
              ))}
            </div>
          </div>

          <button className="generate-plan-btn" onClick={generateItinerary}>
            🚀 Generate My AI Custom Plan
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="planner-loading-card">
          <div className="radar-spinner">
            <div className="radar-circle"></div>
            <div className="radar-circle circle-2"></div>
            <div className="radar-circle circle-3"></div>
          </div>
          <h3>Consulting Corbett Trails AI Naturalist</h3>
          <p className="loading-message-text">"{loadingMessages[loadingStep]}"</p>
        </div>
      )}

      {/* ITINERARY RESULT DISPLAY */}
      {itinerary && !loading && (
        <div className="itinerary-result-wrapper animate-slide-up">
          <div className="itinerary-nav-header">
            <button className="back-to-planner-btn" onClick={() => setItinerary(null)}>
              ⬅️ Edit Preferences
            </button>
            <button className="book-safari-btn" onClick={() => navigate("/Booking")}>
              Proceed to Safari Booking ➡️
            </button>
          </div>

          {/* Result Header */}
          <div className="result-header-card">
            <span className="result-badge">Custom AI Itinerary</span>
            <h2>{itinerary.title}</h2>
            <p className="result-overview">{itinerary.overview}</p>
          </div>

          {/* Day-by-Day Timeline */}
          <div className="timeline-container">
            <h3>🗺️ Daily Expedition Timeline</h3>
            <div className="timeline-line">
              {itinerary.itinerary.map((dayPlan) => (
                <div className="timeline-day-card" key={dayPlan.day}>
                  <div className="day-number-bubble">Day {dayPlan.day}</div>
                  
                  <div className="day-slots-grid">
                    <div className="day-slot">
                      <span className="slot-badge morning">🌅 Morning Session</span>
                      <p>{dayPlan.morning}</p>
                    </div>

                    <div className="day-slot">
                      <span className="slot-badge afternoon">☀️ Afternoon Session</span>
                      <p>{dayPlan.afternoon}</p>
                    </div>

                    <div className="day-slot">
                      <span className="slot-badge evening">🌌 Evening Session</span>
                      <p>{dayPlan.evening}</p>
                    </div>
                  </div>

                  <div className="day-tip-box">
                    <strong>💡 AI Local Tip:</strong> {dayPlan.tips}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Packing & Safety Dual Grid */}
          <div className="plan-extras-grid">
            {/* Packing Checklist */}
            <div className="planner-card packing-card">
              <h3>📋 AI Smart Packing Checklist</h3>
              <p>Tick off items as you pack them into your bag!</p>
              <ul className="packing-list">
                {itinerary.packingList.map((item, idx) => (
                  <li
                    key={idx}
                    className={`packing-item ${checkedItems[idx] ? "completed" : ""}`}
                    onClick={() => handlePackCheck(idx)}
                  >
                    <span className="check-box-indicator">
                      {checkedItems[idx] && <FaCheck size={10} />}
                    </span>
                    <span className="item-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety Guidelines */}
            <div className="planner-card safety-card">
              <h3>
                <FaExclamationTriangle className="safety-warning-icon" /> Safety Guidelines
              </h3>
              <p>Strict sanctuary regulations to follow for your group composition.</p>
              <ul className="safety-list">
                {itinerary.safetyGuidelines.map((item, idx) => (
                  <li key={idx} className="safety-item">
                    <span className="warning-dot"></span>
                    <span className="item-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------
// MOCK PLANNER RESULT GENERATOR
// --------------------------------------------------------------------------
function getMockPlannerResult(duration, groupType, interests) {
  const days = parseInt(duration) || 3;
  
  const itinerary = [];
  for (let i = 1; i <= days; i++) {
    itinerary.push({
      day: i,
      morning: i === 1 
        ? "Resort check-in followed by a refreshing Kumaoni welcome lunch." 
        : `Early Morning Jeep Safari in the wildlife-dense ${i === 2 ? "Bijrani" : "Jhirna"} Zone. Tracking big predator footprints along mud tracks.`,
      afternoon: i === days 
        ? "Checkout procedures and packaging bags for departure drive." 
        : "Visiting the Jim Corbett Heritage Museum and purchasing local spices and handicrafts at Dhangarhi.",
      evening: i === days 
        ? "Final photoshoots and road journey back with memories." 
        : `Guided birdwatching stroll along the pristine Kosi River stream followed by a cozy stargazing bonfire.`,
      tips: i === 1 
        ? "Wear fully covered clothes to guard against insect bites near riverbeds."
        : "Carry small binocular devices and a highly protective camera dust cover.",
    });
  }

  return {
    title: `The Ultimate ${interests.join(" & ")} Corbett Expedition`,
    overview: `This customized ${days}-day itinerary is exclusively crafted for your group (${groupType}) emphasizing ${interests.join(", ")}. It details prime game-reserve outings optimized for optimal wildlife spotting chances while protecting standard safety thresholds.`,
    itinerary,
    packingList: [
      "Camera lens dusting kit (Essential for photography)",
      "Khaki/Forest-green trousers and earth-colored shirts",
      "Sturdy walking boots / field sneakers",
      "Wide-brimmed jungle hat & eco water bottle",
      "Personal sunblock cream & bug spray",
    ],
    safetyGuidelines: [
      "Remain inside the open-top metal cabin frame of your Jeep at all times.",
      "Avoid wearing yellow or red outfits; strictly stick to camouflage colors.",
      "Keep standard voice tones and absolute pin-drop silence near animal clusters.",
    ],
  };
}
