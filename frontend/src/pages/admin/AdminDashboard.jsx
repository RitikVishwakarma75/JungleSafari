// frontend/src/pages/admin/AdminDashboard.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./adminDashboard.css";
import BookingsGraph from "./BookingsGraph";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  // 🔒 Protect dashboard + fetch bookings
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetch("https://junglesafari-s1dr.onrender.com/api/admin/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load bookings");
        setLoading(false);
      });
  }, [navigate]);

  // 🔄 Update booking status
  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("adminToken");

    try {
      const res = await fetch(
        `https://junglesafari-s1dr.onrender.com/api/admin/bookings/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const updatedBooking = await res.json();

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? updatedBooking : b))
      );
    } catch {
      alert("Failed to update status");
    }
  };

  // 🗑️ Delete booking
  const deleteBooking = async (id) => {
    const token = localStorage.getItem("adminToken");

    if (!window.confirm("Delete this booking permanently?")) return;

    try {
      await fetch(
        `https://junglesafari-s1dr.onrender.com/api/admin/bookings/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
          <h1>Admin Dashboard</h1>
          <p className="subtitle">Manage safari bookings</p>

          <section className="stats">
            <div className="stat-card">
              <span>Total Bookings</span>
              <h2>{bookings.length}</h2>
            </div>
            <div className="stat-card">
              <span>Status</span>
              <h2 className="active">Live</h2>
            </div>
          </section>

          {/* 🔍 FILTER BAR */}
          <div className="filter-bar">
            {["all", "pending", "approved", "completed", "cancelled"].map(
              (s) => (
                <button
                  key={s}
                  className={filter === s ? "active-filter" : ""}
                  onClick={() => setFilter(s)}
                >
                  {s}
                </button>
              )
            )}
          </div>
        </div>

        <div className="right-panel">
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
          <BookingsGraph count={filteredBookings.length} />
        </div>
      </header>

      {loading && <div className="loader"></div>}
      {error && <p className="error">{error}</p>}

      {!loading && filteredBookings.length === 0 && (
        <p className="empty">No bookings available</p>
      )}

      {filteredBookings.length > 0 && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Zone</th>
                <th>Date</th>
                <th>Visitors</th>
                <th>Safari</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((b, i) => (
                <tr
                  key={b._id}
                  className={getDayTag(b.date)}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <td>{b.fullName}</td>
                  <td>{b.email}</td>
                  <td>{b.zone}</td>

                  <td>
                    {new Date(b.date).toLocaleDateString()}
                    {getDayTag(b.date) && (
                      <span className={`day-tag ${getDayTag(b.date)}`}>
                        {getDayTag(b.date)}
                      </span>
                    )}
                  </td>

                  <td>{b.visitors}</td>
                  <td>
                    <span className="tag">{b.safariType}</span>
                  </td>

                  <td>
                    <span className={`status ${b.status}`}>{b.status}</span>
                  </td>

                  <td>
                    {b.status === "pending" && (
                      <>
                        <button
                          className="approve-btn"
                          onClick={() => updateStatus(b._id, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => updateStatus(b._id, "cancelled")}
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {b.status === "approved" && (
                      <button
                        className="complete-btn"
                        onClick={() => updateStatus(b._id, "completed")}
                      >
                        Complete
                      </button>
                    )}

                    {(b.status === "completed" || b.status === "cancelled") && (
                      <>
                        <span>{b.status === "completed" ? "✔" : "✖"}</span>
                        <button
                          className="delete-btn"
                          onClick={() => deleteBooking(b._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
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
