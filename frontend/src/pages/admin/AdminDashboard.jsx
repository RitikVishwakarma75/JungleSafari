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
