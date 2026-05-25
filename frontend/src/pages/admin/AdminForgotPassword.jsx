// frontend/src/pages/admin/AdminForgotPassword.jsx
import { useState } from "react";
import "./adminForgotPassword.css";

const getApiUrl = (path) => {
  const base =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : "https://junglesafari-s1dr.onrender.com";
  return `${base}${path}`;
};

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await fetch(
        getApiUrl("/api/admin/forgot-password"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      // ✅ ALWAYS SAME MESSAGE (SECURE)
      setMessage(
        "If this email exists, a password reset link has been sent 📧"
      );
    } catch {
      setMessage(
        "If this email exists, a password reset link has been sent 📧"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-forgot">
      <div className="admin-forgot-card">
        <h2>Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {message && <p className="success">{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
