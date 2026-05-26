import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaFire, FaVolumeUp, FaVolumeMute, FaPlay, FaPause, FaStop, FaMagic } from "react-icons/fa";
import "./aiCampfire.css";

const PRESET_STORIES = [
  {
    id: "mohan-tiger",
    title: "Legend of the Mohan Tiger",
    icon: "🐯",
    prompt: "The legendary Mohan Man-Eating Bengal Tiger deep in the sal forests of Corbett.",
    description: "A chilling historical narrative of Jim Corbett lying in wait at midnight."
  },
  {
    id: "machan-night",
    title: "Machan Night Watch",
    icon: "🛖",
    prompt: "Sitting alertly on a frail wooden forest machan at night as a leopard stalks below.",
    description: "A suspenseful shikar-style watch under the pale Kumaon moonlight."
  },
  {
    id: "elephant-call",
    title: "Midnight Elephant Call",
    icon: "🐘",
    prompt: "A massive wild tusker elephant leading a migration herd across the Ramganga riverbed at dusk.",
    description: "A majestic, adventurous glimpse of Kumaon's true ancient rulers."
  },
  {
    id: "corbett-legacy",
    title: "Jim Corbett's Legacy",
    icon: "📖",
    prompt: "The conservation legacy of Jim Corbett and how local hunters became protectors of Kumaon.",
    description: "An atmospheric, heartwarming historical tale of forest wisdom."
  }
];

const MODES = [
  { id: "Suspenseful & Thrilling", label: "Suspenseful & Thrilling 🕯️" },
  { id: "Adventurous & Bold", label: "Adventurous & Bold 🎒" },
  { id: "Mysterious & Spooky", label: "Mysterious & Spooky 👻" },
  { id: "Warm & Heartwarming", label: "Warm & Heartwarming 🔥" }
];

const getApiUrl = (path) => {
  const base =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : "https://junglesafari-s1dr.onrender.com";
  return `${base}${path}`;
};

export default function AiCampfire() {
  const { tenantSlug } = useParams();
  const navigate = useNavigate();
  const [tenantConfig, setTenantConfig] = useState(null);

  // User Selections
  const [selectedPreset, setSelectedPreset] = useState("mohan-tiger");
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedMode, setSelectedMode] = useState("Suspenseful & Thrilling");

  // Output States
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Web Speech API references
  const [synth, setSynth] = useState(null);
  const [utterance, setUtterance] = useState(null);
  const [speechRate, setSpeechRate] = useState(0.85); // slower pace for suspenseful narrator effect

  // Fetch dynamic tenant configs
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
        console.warn("Failed parsing cached config in campfire, refetching...", err);
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
        console.error("Failed to load tenant configurations:", err);
      }
    };
    fetchTenant();
  }, [tenantSlug]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSynth(window.speechSynthesis);
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getBrandName = () => {
    if (tenantConfig && tenantConfig.name) return tenantConfig.name;
    if (!tenantSlug) return "Corbett Trails";
    return tenantSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const handleGenerateStory = async () => {
    // Cancel any ongoing speaking
    if (synth) {
      synth.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }

    setLoading(true);
    setStory("");
    
    // Determine active prompt
    let activePrompt = customPrompt.trim();
    if (!activePrompt) {
      const preset = PRESET_STORIES.find((s) => s.id === selectedPreset);
      activePrompt = preset ? preset.prompt : "A wild tiger sighting story";
    }

    try {
      const res = await fetch(getApiUrl("/api/ai/campfire"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: activePrompt, mode: selectedMode })
      });

      if (!res.ok) throw new Error("Failed to load campfire narrative");
      const data = await res.json();
      setStory(data.story);
      
      // Auto speak once loaded
      setTimeout(() => {
        handleStartSpeech(data.story);
      }, 300);

    } catch (err) {
      console.error(err);
      alert("Campfire logs dampened! Failed to generate story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Speech Controls ---
  const handleStartSpeech = (textToSpeak) => {
    if (!synth || !textToSpeak) return;

    // Cancel anything active
    synth.cancel();

    // Remove Kumaoni bracket expressions like [crackling branches] for clean voice output
    const cleanText = textToSpeak.replace(/\[.*?\]/g, "");

    const newUtterance = new SpeechSynthesisUtterance(cleanText);
    
    // Look for a suitable deep/naturalist sounding English voice
    const voices = synth.getVoices();
    // Prefer Google UK English Male, Microsoft David, or any English male voice
    const preferredVoice = voices.find(
      (v) =>
        v.name.toLowerCase().includes("google uk english male") ||
        v.name.toLowerCase().includes("google us english male") ||
        (v.lang.startsWith("en") && v.name.toLowerCase().includes("male"))
    ) || voices.find((v) => v.lang.startsWith("en"));

    if (preferredVoice) {
      newUtterance.voice = preferredVoice;
    }

    newUtterance.rate = speechRate;
    newUtterance.pitch = 0.9; // deeper pitch for naturalist effect

    newUtterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    newUtterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    setUtterance(newUtterance);
    synth.speak(newUtterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    if (!synth) return;
    if (isPlaying && !isPaused) {
      synth.pause();
      setIsPaused(true);
    } else if (isPlaying && isPaused) {
      synth.resume();
      setIsPaused(false);
    }
  };

  const handleStopSpeech = () => {
    if (!synth) return;
    synth.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Helper to parse sound effects brackets to styled elements
  const formatStoryText = (fullText) => {
    if (!fullText) return "";
    const parts = fullText.split(/(\[.*?\])/g);
    return parts.map((part, index) => {
      if (part.startsWith("[") && part.endsWith("]")) {
        return (
          <span key={index} className="story-sound-fx">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <section className="campfire-page">
      {/* Dynamic Background Glowing Embers */}
      <div className="campfire-starry-bg"></div>
      <div className="campfire-embers-container">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="amber-ember"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 4}s`,
              transform: `scale(${0.5 + Math.random() * 1})`
            }}
          ></span>
        ))}
      </div>

      <div className="campfire-header no-print">
        <span className="ai-badge">Gemini AI Sighting Narrator</span>
        <h1>AI Campfire Stories</h1>
        <p>
          Gather around the virtual fireplace at {getBrandName()}. Experience immersive, fully narrated shikar chronicles and legends of the Kumaon forest.
        </p>
      </div>

      <div className="campfire-main-layout">
        {/* LEFT COLUMN: THE VISUALIZER AND AUDIO READER */}
        <div className="campfire-player-column">
          <div className="campfire-visualizer-card">
            {/* The crackling visual campfire */}
            <div className={`campfire-container ${loading ? "loading-fire" : isPlaying && !isPaused ? "roaring-fire" : "calm-fire"}`}>
              {/* Flame layers */}
              <div className="flame red-flame"></div>
              <div className="flame orange-flame"></div>
              <div className="flame yellow-flame"></div>
              <div className="flame white-flame"></div>
              
              {/* Wooden logs */}
              <div className="campfire-logs">
                <div className="log log-left"></div>
                <div className="log log-right"></div>
              </div>
              <div className="campfire-ground-shadow"></div>
            </div>

            {/* Narration voice console */}
            {story && (
              <div className="narrator-voice-console animate-fade-in">
                <div className="narrator-status">
                  <div className={`narrator-avatar ${isPlaying && !isPaused ? "pulsing" : ""}`}>🗣️</div>
                  <div>
                    <h5>Kumaoni Naturalist Guide</h5>
                    <p>{isPlaying ? (isPaused ? "Story Paused..." : "Narrating Story...") : "Speech Standby"}</p>
                  </div>
                </div>

                <div className="console-buttons">
                  {isPlaying ? (
                    <>
                      <button className="console-btn pause-btn" onClick={handlePauseResume} title="Pause/Resume">
                        {isPaused ? <FaPlay /> : <FaPause />} {isPaused ? "Resume" : "Pause"}
                      </button>
                      <button className="console-btn stop-btn" onClick={handleStopSpeech} title="Stop Speech">
                        <FaStop /> Stop
                      </button>
                    </>
                  ) : (
                    <button className="console-btn speak-btn" onClick={() => handleStartSpeech(story)} title="Narrate Story">
                      <FaVolumeUp /> Speak Out Loud
                    </button>
                  )}
                </div>

                <div className="speed-selector">
                  <label>Narrator Speed: {speechRate}x</label>
                  <input
                    type="range"
                    min="0.6"
                    max="1.2"
                    step="0.05"
                    value={speechRate}
                    onChange={(e) => {
                      const newRate = parseFloat(e.target.value);
                      setSpeechRate(newRate);
                      if (isPlaying) {
                        handleStartSpeech(story);
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* THE NARRATED STORY BOARD */}
          <div className="campfire-story-card">
            {loading ? (
              <div className="story-board-loading">
                <div className="fire-spinner">🔥</div>
                <h3>Stoking the Fire...</h3>
                <p>Gemini AI is crafting a highly atmospheric, immersive wilderness chronicle. Hold on tight.</p>
              </div>
            ) : story ? (
              <div className="story-board-content animate-fade-in">
                <div className="story-board-header">
                  <h4>📖 The Forest Chronicle</h4>
                  <span className="style-badge">{selectedMode}</span>
                </div>
                <div className="story-text-body">
                  {formatStoryText(story)}
                </div>
              </div>
            ) : (
              <div className="story-board-empty">
                <h3>The Fire is Quiet</h3>
                <p>Select a Kumaoni legend or write your own prompt on the right, then light the campfire to hear the forest speak.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PRESET LEGENDS & CONTROLS */}
        <div className="campfire-controls-column">
          <div className="control-card">
            <h3>1. Choose a Kumaon Legend</h3>
            <p className="subtitle">Select one of our verified forest logs or legendary events.</p>

            <div className="preset-grid">
              {PRESET_STORIES.map((item) => (
                <div
                  key={item.id}
                  className={`preset-card ${selectedPreset === item.id && !customPrompt ? "active" : ""}`}
                  onClick={() => {
                    setSelectedPreset(item.id);
                    setCustomPrompt("");
                  }}
                >
                  <div className="preset-card-icon">{item.icon}</div>
                  <div className="preset-card-body">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="custom-prompt-input-group">
              <label>Or Starlight Custom Prompt</label>
              <textarea
                value={customPrompt}
                onChange={(e) => {
                  setCustomPrompt(e.target.value);
                  setSelectedPreset("");
                }}
                placeholder="Ask Gemini to tell a specific story (e.g. A wild bear sighting at night near Jhirna zone while crossing a river nullah...)"
                rows={3}
              />
            </div>
          </div>

          <div className="control-card">
            <h3>2. Select Narration Style</h3>
            <p className="subtitle">Choose the atmosphere and storytelling technique.</p>

            <div className="mode-selector-grid">
              {MODES.map((mode) => (
                <button
                  key={mode.id}
                  className={`mode-btn ${selectedMode === mode.id ? "active" : ""}`}
                  onClick={() => setSelectedMode(mode.id)}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <button className="light-fire-btn" onClick={handleGenerateStory} disabled={loading}>
            <FaFire className="flame-magic-icon" />
            {loading ? "Stoking Campfire..." : "Light Fire & Narrate Story"}
          </button>
        </div>
      </div>
    </section>
  );
}
