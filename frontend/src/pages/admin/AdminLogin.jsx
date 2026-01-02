// frontend/src/pages/admin/AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./adminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 Block login page if already logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://junglesafari-s1dr.onrender.com/api/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Save token (persistent login)
      localStorage.setItem("adminToken", data.token);

      // 🔥 Force reload so Header updates instantly
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError("Server error");
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="admin-actions">
        <Link to="/admin/forgot-password">Forgot Password?</Link>
      </div>
    </div>
  );
}
