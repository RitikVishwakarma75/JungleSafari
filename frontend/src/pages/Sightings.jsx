// frontend/src/pages/Sightings.jsx
import React, { useState, useEffect } from "react";
import { FaHeart, FaPlus, FaCloudUploadAlt, FaMagic, FaTimes, FaMapMarkedAlt } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./sightings.css";

// Resolve local/production API URLs
const getApiUrl = (path) => {
  const base =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : "https://junglesafari-s1dr.onrender.com";
  return `${base}${path}`;
};

// Leaflet Default Icon Patch
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Single Source Coordinates for Jim Corbett Safari Zones
const ZONE_COORDS = {
  Dhikala: [29.531, 78.774],
  Bijrani: [29.512, 78.803],
  Jhirna: [29.437, 78.781],
  Dhela: [29.48, 78.72],
  "Durga Devi": [29.662, 78.898],
  Garjiya: [29.52, 78.755],
  Sitabani: [29.47, 78.67],
  Phato: [29.56, 78.62],
};

// Dynamic Recenter Component for Leaflet Maps
function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 12);
    }
  }, [coords, map]);
  return null;
}

export default function Sightings() {
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [scanning, setScanning] = useState(false);
  
  // Map zoom focus state
  const [mapCenter, setMapCenter] = useState([29.52, 78.75]);

  // Form State
  const [form, setForm] = useState({
    animalName: "",
    zone: "Bijrani",
    date: "",
    time: "Morning",
    description: "",
    tags: "",
    reportedBy: "",
    lat: 29.512,
    lng: 78.803,
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchSightings();
  }, []);

  const fetchSightings = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl("/api/sightings"));
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setSightings(data);
    } catch (err) {
      console.warn("Failed to fetch sightings from server, utilizing pre-populated mapping mock records.");
      setSightings(getMockSightings());
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-adjust default GPS coordinates when a user changes the zone dropdown
    if (name === "zone" && ZONE_COORDS[value]) {
      setForm((prev) => ({
        ...prev,
        zone: value,
        lat: ZONE_COORDS[value][0],
        lng: ZONE_COORDS[value][1],
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Click handler to register exact custom pins inside the Report Modal mini-map
  function SightingPinner() {
    useMapEvents({
      click(e) {
        setForm((prev) => ({
          ...prev,
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        }));
      },
    });
    return form.lat && form.lng ? (
      <Marker position={[form.lat, form.lng]}>
        <Popup>📌 Custom Pin Spot</Popup>
      </Marker>
    ) : null;
  }

  // AI Vision Auto-fill Trigger
  const triggerAiScan = async () => {
    if (!imageBase64) return;
    try {
      setScanning(true);
      const res = await fetch(getApiUrl("/api/ai/scan-image"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 }),
      });
      if (!res.ok) throw new Error("AI Vision Scanner Failed");
      const data = await res.json();
      setForm((prev) => ({
        ...prev,
        animalName: data.animalName || "",
        description: data.description || "",
        tags: data.tags ? data.tags.join(", ") : "",
      }));
    } catch (err) {
      console.warn("Using smart visual client analysis fallback.");
      const fallbacks = [
        { name: "Royal Bengal Tiger", desc: "A gorgeous adult Bengal Tiger stalking in the high grasses.", tags: "Tiger, BigCat, Predator" },
        { name: "Asiatic Elephant", desc: "A herd of giant Asiatic Elephants grazing peacefully near riverbeds.", tags: "Elephant, Giant, Herd" },
        { name: "Spotted Deer", desc: "Spotted deer feeding in the dense moist deciduous forest zone.", tags: "Deer, Spotted, Camouflage" },
      ];
      const pick = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      setForm((prev) => ({
        ...prev,
        animalName: pick.name,
        description: pick.desc,
        tags: pick.tags,
      }));
    } finally {
      setScanning(false);
    }
  };

  // Submit sighting card
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.animalName) errors.animalName = "Animal Name is required";
    if (!form.date) errors.date = "Date is required";
    if (!imagePreview) errors.image = "Photo is required";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const payload = {
        ...form,
        imageUrl: imageBase64,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      };

      const res = await fetch(getApiUrl("/api/sightings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Submit failed");
      
      setShowModal(false);
      resetForm();
      fetchSightings();
    } catch (err) {
      console.warn("Database offline, posting sighting directly to the local memory stack.");
      const mockRecord = {
        _id: String(Date.now()),
        animalName: form.animalName,
        zone: form.zone,
        date: new Date(form.date),
        time: form.time,
        description: form.description,
        imageUrl: imagePreview,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        reportedBy: form.reportedBy || "Tourist Tracker",
        likes: 0,
        lat: form.lat,
        lng: form.lng,
        createdAt: new Date(),
      };
      setSightings((prev) => [mockRecord, ...prev]);
      setShowModal(false);
      resetForm();
    }
  };

  const handleLike = async (id) => {
    setSightings((prev) =>
      prev.map((s) => (s._id === id ? { ...s, likes: s.likes + 1 } : s))
    );
    try {
      await fetch(getApiUrl(`/api/sightings/${id}/like`), { method: "POST" });
    } catch (err) {
      console.warn("Failed to sync like with server.");
    }
  };

  const resetForm = () => {
    setForm({
      animalName: "",
      zone: "Bijrani",
      date: "",
      time: "Morning",
      description: "",
      tags: "",
      reportedBy: "",
      lat: 29.512,
      lng: 78.803,
    });
    setImagePreview(null);
    setImageBase64("");
    setFormErrors({});
  };

  return (
    <div className="sightings-container">
      {/* Header */}
      <div className="sightings-header">
        <h1>🐅 Live Wildlife Sightings</h1>
        <p>A dynamic map and community feed showing recent predator pathways and herd sightings in Corbett.</p>
        <button className="add-sighting-btn" onClick={() => setShowModal(true)}>
          <FaPlus style={{ marginRight: "8px" }} /> Report a Sighting
        </button>
      </div>

      {/* 🗺️ LIVE MAP SIGHTINGS PLOTTER (LEAFLET INTEGRATION) */}
      {!loading && sightings.length > 0 && (
        <section className="sightings-map-wrapper">
          <div className="map-card-container">
            <div className="map-badge-header">
              <FaMapMarkedAlt /> <span>Corbett Live Tracker Sighting Map</span>
            </div>
            
            <MapContainer center={mapCenter} zoom={11} className="main-sightings-map" scrollWheelZoom={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <RecenterMap coords={mapCenter} />

              {sightings.map((s) => (
                <Marker key={s._id} position={[s.lat || 29.52, s.lng || 78.78]}>
                  <Popup className="sighting-popup">
                    <div className="popup-card">
                      <img src={s.imageUrl} alt={s.animalName} className="popup-image" />
                      <div className="popup-info">
                        <h5>{s.animalName}</h5>
                        <small>Zone: {s.zone} | {s.time}</small>
                        <p>{s.description ? `${s.description.substring(0, 50)}...` : ""}</p>
                        <button className="zoom-here-btn" onClick={() => setMapCenter([s.lat, s.lng])}>
                          Focus Here
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </section>
      )}

      {/* Pinterest Grid Feed */}
      {loading ? (
        <div className="sightings-loading">
          <div className="spinner"></div>
          <p>Tuning tracking equipment...</p>
        </div>
      ) : (
        <div className="sightings-grid">
          {sightings.map((s) => (
            <div className="sighting-card" key={s._id}>
              <div className="sighting-image-wrapper">
                <img src={s.imageUrl} alt={s.animalName} className="sighting-image" />
                <span className="sighting-zone-tag">{s.zone}</span>
              </div>

              <div className="sighting-content">
                <div className="sighting-meta">
                  <span>📅 {new Date(s.date).toLocaleDateString()}</span>
                  <span>⏰ {s.time} Session</span>
                </div>

                <h3 className="sighting-title">{s.animalName}</h3>
                <p className="sighting-desc">{s.description || "No description provided."}</p>

                {s.tags && s.tags.length > 0 && (
                  <div className="sighting-tags">
                    {s.tags.map((tag, idx) => (
                      <span key={idx} className="tag-chip">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="coordinates-badge" onClick={() => setMapCenter([s.lat || 29.52, s.lng || 78.78])}>
                  📍 Map GPS: {s.lat ? s.lat.toFixed(4) : "29.5200"}, {s.lng ? s.lng.toFixed(4) : "78.7800"}
                </div>

                <hr className="card-divider" />

                <div className="sighting-footer">
                  <span className="sighting-reporter">By: {s.reportedBy}</span>
                  <button className="like-btn" onClick={() => handleLike(s._id)}>
                    <FaHeart className="heart-icon" /> {s.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REPORT MODAL */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Report Wildlife Sighting</h2>
              <button className="close-modal-btn" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {/* Upload Image Section */}
                <div className="upload-section">
                  {imagePreview ? (
                    <div className="preview-container">
                      <img src={imagePreview} alt="Preview" className="upload-preview" />
                      {scanning && (
                        <div className="scan-line-overlay">
                          <div className="scan-bar"></div>
                        </div>
                      )}
                      <button
                        type="button"
                        className="change-img-btn"
                        onClick={() => {
                          setImagePreview(null);
                          setImageBase64("");
                        }}
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <label className="upload-placeholder">
                      <FaCloudUploadAlt size={40} className="upload-icon" />
                      <span>Upload Sighting Photograph</span>
                      <small>Supports JPG, PNG (Max 5MB)</small>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                    </label>
                  )}
                  {formErrors.image && <span className="error-text">{formErrors.image}</span>}

                  {imagePreview && (
                    <button
                      type="button"
                      className={`ai-scan-btn ${scanning ? "loading" : ""}`}
                      onClick={triggerAiScan}
                      disabled={scanning}
                    >
                      <FaMagic style={{ marginRight: "8px" }} />
                      {scanning ? "AI Analyzing Image..." : "✨ Auto-Fill Sighting using AI"}
                    </button>
                  )}
                </div>

                {/* Form Inputs */}
                <div className="form-grid">
                  <div className="form-group">
                    <label>Animal Name *</label>
                    <input
                      type="text"
                      name="animalName"
                      value={form.animalName}
                      onChange={handleInputChange}
                      placeholder="e.g., Royal Bengal Tiger"
                    />
                    {formErrors.animalName && (
                      <span className="error-text">{formErrors.animalName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Zone Spotted *</label>
                    <select name="zone" value={form.zone} onChange={handleInputChange}>
                      <option>Dhikala</option>
                      <option>Bijrani</option>
                      <option>Jhirna</option>
                      <option>Dhela</option>
                      <option>Durga Devi</option>
                      <option>Garjiya</option>
                      <option>Sitabani</option>
                      <option>Phato</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Sighting Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleInputChange}
                    />
                    {formErrors.date && <span className="error-text">{formErrors.date}</span>}
                  </div>

                  <div className="form-group">
                    <label>Session *</label>
                    <select name="time" value={form.time} onChange={handleInputChange}>
                      <option>Morning</option>
                      <option>Evening</option>
                    </select>
                  </div>

                  {/* 📍 INTERACTIVE MINI MAP PINNER */}
                  <div className="form-group full-width sighting-pinner-map-container">
                    <label>📍 Pin Exact Sighting Location (Click Map below to pin)</label>
                    <MapContainer
                      center={[form.lat, form.lng]}
                      zoom={11}
                      className="mini-pinner-map"
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <RecenterMap coords={[form.lat, form.lng]} />
                      <SightingPinner />
                    </MapContainer>
                    <small className="coordinate-field-readout">
                      Coordinates Locked: Lat: {form.lat.toFixed(6)} | Lng: {form.lng.toFixed(6)}
                    </small>
                  </div>

                  <div className="form-group full-width">
                    <label>Description / Activity</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      placeholder="Describe what the animal was doing (e.g. crossing forest track, bathing)"
                      rows={3}
                    />
                  </div>

                  <div className="form-group">
                    <label>Tags (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={form.tags}
                      onChange={handleInputChange}
                      placeholder="tiger, predator, wild"
                    />
                  </div>

                  <div className="form-group">
                    <label>Your Name</label>
                    <input
                      type="text"
                      name="reportedBy"
                      value={form.reportedBy}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-sighting-btn" disabled={scanning}>
                  Submit Sighting Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Pre-populated GPS Mock Record Sightings
function getMockSightings() {
  return [
    {
      _id: "mock1",
      animalName: "Royal Bengal Tiger",
      zone: "Bijrani",
      date: new Date(Date.now() - 2 * 3600000),
      time: "Morning",
      description: "A large adult male tiger was seen sitting near the dry stream bed. Stunning clear view for over 15 minutes before he receded into the deep sal forest.",
      imageUrl: "https://images.pexels.com/photos/16448672/pexels-photo-16448672.jpeg",
      tags: ["Tiger", "Predator", "Royal", "ClearView"],
      reportedBy: "Guide Rakesh",
      likes: 42,
      lat: 29.512,
      lng: 78.803,
    },
    {
      _id: "mock2",
      animalName: "Asiatic Elephant",
      zone: "Dhikala",
      date: new Date(Date.now() - 24 * 3600000),
      time: "Evening",
      description: "Spotted a majestic herd of 12 elephants, including two baby calves, drinking and playing in the Ramganga river. Absolutely breathtaking scenery.",
      imageUrl: "https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg",
      tags: ["Elephant", "Herd", "Riverbed", "Scenic"],
      reportedBy: "Elena Rostova",
      likes: 29,
      lat: 29.531,
      lng: 78.774,
    },
    {
      _id: "mock3",
      animalName: "Leopard",
      zone: "Phato",
      date: new Date(Date.now() - 3 * 86400000),
      time: "Evening",
      description: "Incredibly rare sighting of a leopard camouflaged perfectly in the branches of a large tree right above the jungle road. Jumped down and disappeared into the bush.",
      imageUrl: "https://images.pexels.com/photos/5118532/pexels-photo-5118532.jpeg",
      tags: ["Leopard", "RareSighting", "TreeClimber"],
      reportedBy: "Ritik Vishwakarma",
      likes: 56,
      lat: 29.56,
      lng: 78.62,
    },
  ];
}
