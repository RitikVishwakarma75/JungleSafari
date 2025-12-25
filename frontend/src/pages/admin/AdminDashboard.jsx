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

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetch("http://localhost:5000/api/admin/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
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

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="subtitle">Manage safari bookings</p>
          {/* Stats */}
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
        </div>

        <div className="right-panel">
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>

          {/* 👇 GRAPH BELOW LOGOUT */}
          <BookingsGraph count={bookings.length} />
        </div>
      </header>

      {/* Content */}
      {loading && <div className="loader"></div>}
      {error && <p className="error">{error}</p>}

      {!loading && bookings.length === 0 && (
        <p className="empty">No bookings available</p>
      )}

      {bookings.length > 0 && (
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
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={b._id} style={{ animationDelay: `${i * 0.04}s` }}>
                  <td>{b.fullName}</td>
                  <td>{b.email}</td>
                  <td>{b.zone}</td>
                  <td>{new Date(b.date).toLocaleDateString()}</td>
                  <td>{b.visitors}</td>
                  <td>
                    <span className="tag">{b.safariType}</span>
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
