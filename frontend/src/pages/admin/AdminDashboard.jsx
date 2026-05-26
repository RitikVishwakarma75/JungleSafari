// frontend/src/pages/admin/AdminDashboard.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./adminDashboard.css";
import BookingsGraph from "./BookingsGraph";
import { FaSignOutAlt, FaMapMarkedAlt, FaDollarSign, FaUserCheck, FaRoute, FaUserClock } from "react-icons/fa";

const getApiUrl = (path) => {
  const base =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : "https://junglesafari-s1dr.onrender.com";
  return `${base}${path}`;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [tenantName, setTenantName] = useState("SaaS Operator");
  const [tenantId, setTenantId] = useState("corbett-trails");

  // 🔒 Protect dashboard + fetch bookings & guides
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    const loadDashboardData = async () => {
      try {
        // 1. Fetch Bookings
        const bookingsRes = await fetch(getApiUrl("/api/admin/bookings"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!bookingsRes.ok) throw new Error("Unauthorized");
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);

        // 2. Fetch Guides (For dropdown assignment)
        const guidesRes = await fetch(getApiUrl("/api/guide"));
        if (guidesRes.ok) {
          const guidesData = await guidesRes.json();
          setGuides(guidesData);
        }

        // 3. Fetch Tenant configuration for brand name
        const savedTenantId = localStorage.getItem("adminTenantId") || "corbett-trails";
        setTenantId(savedTenantId);
        try {
          const tenantRes = await fetch(getApiUrl(`/api/tenant/${savedTenantId}`));
          if (tenantRes.ok) {
            const tenantData = await tenantRes.json();
            if (tenantData && tenantData.name) {
              setTenantName(tenantData.name);
            }
          }
        } catch (tenantErr) {
          console.warn("Failed to load tenant configurations:", tenantErr);
        }
      } catch (err) {
        setError("Failed to load dashboard parameters");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  // 🔄 Update booking status or guide assignment
  const updateBookingDetails = async (id, fields) => {
    const token = localStorage.getItem("adminToken");

    try {
      const res = await fetch(getApiUrl(`/api/admin/bookings/${id}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fields),
      });

      if (!res.ok) throw new Error("Update failed");
      const updatedBooking = await res.json();

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? updatedBooking : b))
      );
    } catch {
      alert("Failed to update booking fields");
    }
  };

  // 🗑️ Delete booking
  const deleteBooking = async (id) => {
    const token = localStorage.getItem("adminToken");

    if (!window.confirm("Delete this booking permanently?")) return;

    try {
      await fetch(getApiUrl(`/api/admin/bookings/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch {
      alert("Failed to delete booking");
    }
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/";
  };

  // 📈 Analytics Calculations
  const getGrossRevenue = () => {
    return bookings
      .filter((b) => b.status === "approved" || b.status === "completed")
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  };

  const getPendingCount = () => {
    return bookings.filter((b) => b.status === "pending").length;
  };

  // 🔍 Filter logic
  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  // 📅 Today / Tomorrow logic
  const getDayTag = (date) => {
    const today = new Date();
    const bookingDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);

    const diff = bookingDate - today;

    if (diff === 0) return "today";
    if (diff === 86400000) return "tomorrow";
    return null;
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="left-panel">
          <h1>{tenantName} Dashboard</h1>
          <p className="subtitle">Operational control center for reservations, payments, and naturalists.</p>

          <section className="stats">
            <div className="stat-card revenue-stat animate-fade-in">
              <div className="stat-icon-wrapper"><FaDollarSign /></div>
              <div>
                <span>Gross Revenue</span>
                <h2>Rs. {getGrossRevenue().toLocaleString()}</h2>
              </div>
            </div>
            <div className="stat-card bookings-stat animate-fade-in">
              <div className="stat-icon-wrapper"><FaRoute /></div>
              <div>
                <span>Total Bookings</span>
                <h2>{bookings.length} Permits</h2>
              </div>
            </div>
            <div className="stat-card pending-stat animate-fade-in">
              <div className="stat-icon-wrapper"><FaUserClock /></div>
              <div>
                <span>Pending Approvals</span>
                <h2 className={getPendingCount() > 0 ? "text-orange" : ""}>{getPendingCount()}</h2>
              </div>
            </div>
            <div className="stat-card guides-stat animate-fade-in">
              <div className="stat-icon-wrapper"><FaUserCheck /></div>
              <div>
                <span>Active Guides</span>
                <h2>{guides.length} Naturalists</h2>
              </div>
            </div>
          </section>

          {/* 🔗 BRANDED WEBSITE LINKS FOR ADMIN */}
          <div className="branded-links-card" style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "25px",
            marginTop: "20px",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
          }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", color: "#81c784", display: "flex", alignItems: "center", gap: "8px", fontWeight: "700" }}>
              🔗 Your Scoped Website Portals
            </h3>
            <p style={{ margin: "0 0 15px 0", fontSize: "0.85rem", color: "#cbd5e1", lineHeight: "1.4" }}>
              These are your unique, white-labeled client website links. Share these with your customers to accept bookings!
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "15px" }}>
              {[
                { label: "Branded Client Home Portal", path: "" },
                { label: "Safari Booking Engine", path: "/booking" },
                { label: "AI Jungle Planner", path: "/planner" }
              ].map((link, idx) => {
                const getBrandedUrl = (subPath) => {
                  if (tenantId === "corbett-trails") {
                    return `${window.location.origin}${subPath}`;
                  }
                  return `${window.location.origin}/${tenantId}${subPath}`;
                };
                const fullUrl = getBrandedUrl(link.path);
                return (
                  <div key={idx} style={{ background: "rgba(0,0,0,0.25)", padding: "12px 15px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <strong style={{ fontSize: "0.85rem", color: "#fff", letterSpacing: "0.5px" }}>{link.label}</strong>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="text"
                        readOnly
                        value={fullUrl}
                        style={{
                          flexGrow: 1,
                          background: "rgba(0,0,0,0.35)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "4px",
                          padding: "6px 10px",
                          color: "#81c784",
                          fontSize: "0.8rem",
                          fontFamily: "monospace",
                          outline: "none"
                        }}
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(fullUrl);
                          alert("Link copied to clipboard! 📋");
                        }}
                        style={{
                          background: "#81c784",
                          border: "none",
                          borderRadius: "4px",
                          padding: "6px 12px",
                          color: "#1e293b",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          cursor: "pointer",
                          transition: "opacity 0.2s"
                        }}
                        onMouseOver={(e) => e.target.style.opacity = 0.9}
                        onMouseOut={(e) => e.target.style.opacity = 1}
                      >
                        Copy
                      </button>
                    </div>
                    <a href={fullUrl} target="_blank" rel="noopener noreferrer" style={{ alignSelf: "flex-start", fontSize: "0.75rem", color: "#60a5fa", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: "600" }}>
                      Open Portal ↗
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🔍 FILTER BAR */}
          <div className="filter-bar">
            {["all", "pending", "approved", "completed", "cancelled"].map((s) => (
              <button
                key={s}
                className={filter === s ? "active-filter" : ""}
                onClick={() => setFilter(s)}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="right-panel">
          <button className="logout-btn" onClick={logout}>
            <FaSignOutAlt /> Sign Out
          </button>
          <BookingsGraph count={filteredBookings.length} />
        </div>
      </header>

      {loading && <div className="loader"></div>}
      {error && <p className="error">{error}</p>}

      {!loading && filteredBookings.length === 0 && (
        <p className="empty">No bookings match this filter state</p>
      )}

      {!loading && filteredBookings.length > 0 && (
        <div className="table-card animate-fade-in">
          <table>
            <thead>
              <tr>
                <th>Visitor Details</th>
                <th>Safari Setup</th>
                <th>Schedule Date</th>
                <th>Pricing Total</th>
                <th>Selected Seats</th>
                <th>Naturalist Guide</th>
                <th>Current Status</th>
                <th>Operations</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((b, i) => (
                <tr
                  key={b._id}
                  className={getDayTag(b.date)}
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <td className="text-left font-bold">
                    <span className="primary-text">{b.fullName}</span>
                    <br />
                    <small className="secondary-text">{b.email} | {b.phone}</small>
                  </td>
                  <td>
                    <span className="safari-pill-tag">{b.safariType}</span>
                    <br />
                    <small className="zone-subtext"><FaMapMarkedAlt /> {b.zone} Zone</small>
                  </td>

                  <td className="font-bold">
                    {new Date(b.date).toLocaleDateString("en-US", { day: '2-digit', month: 'short', year: 'numeric' })}
                    {getDayTag(b.date) && (
                      <span className={`day-tag ${getDayTag(b.date)}`}>
                        {getDayTag(b.date)}
                      </span>
                    )}
                  </td>

                  <td className="font-bold price-highlight">Rs. {(b.totalPrice || 0).toLocaleString()}</td>
                  <td className="font-mono">{b.selectedSeats && b.selectedSeats.length > 0 ? b.selectedSeats.join(", ") : "N/A (Canter)"}</td>
                  
                  <td>
                    <select
                      className="guide-assign-dropdown"
                      value={b.assignedGuide || ""}
                      onChange={(e) => updateBookingDetails(b._id, { assignedGuide: e.target.value || null })}
                    >
                      <option value="">-- No Guide Assigned --</option>
                      {guides.map((g) => (
                        <option key={g._id} value={g.name}>
                          {g.name} ({g.assignedVehicle ? g.assignedVehicle.split(" ")[0] : "Gypsy"})
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <span className={`status ${b.status}`}>{b.status}</span>
                  </td>

                  <td>
                    <div className="action-buttons-group">
                      {b.status === "pending" && (
                        <>
                          <button
                            className="approve-btn"
                            onClick={() => updateBookingDetails(b._id, { status: "approved" })}
                          >
                            Approve
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() => updateBookingDetails(b._id, { status: "cancelled" })}
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {b.status === "approved" && (
                        <button
                          className="complete-btn"
                          onClick={() => updateBookingDetails(b._id, { status: "completed" })}
                        >
                          Complete Tour
                        </button>
                      )}

                      {(b.status === "completed" || b.status === "cancelled") && (
                        <>
                          <span className="status-indicator-icon">{b.status === "completed" ? "🟢" : "🔴"}</span>
                          <button
                            className="delete-btn"
                            onClick={() => deleteBooking(b._id)}
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
