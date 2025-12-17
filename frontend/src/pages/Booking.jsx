import React, { useState } from "react";
import "./Booking.css";


export default function Booking() {
  // State for form fields
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    zone: "",
    date: "",
    visitors: "",
    safariType: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Update form fields dynamically
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        alert(data.message || "Booking request sent successfully!");
        setForm({
          fullName: "",
          email: "",
          phone: "",
          zone: "",
          date: "",
          visitors: "",
          safariType: "",
          message: "",
        });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
      } else {
        alert("Booking submission failed. Please try again.");
      }
    } catch (err) {
      alert("A server error occurred. Please try later.");
    }
  };

  return (
    <section className="booking-page">
      {/* HERO */}
      <div className="booking-hero">
        <div className="overlay"></div>
        <div className="hero-text">
          <h1>Book Your Corbett Safari</h1>
          <p>
            Choose your zone, dates, and safari type for an unforgettable
            wildlife adventure.
          </p>
        </div>
      </div>

      {/* INTRO */}
      <div className="booking-intro">
        <div className="intro-text">
          <h2>Your Jungle Adventure Awaits</h2>
          <p>
            Plan your safari with ease. Whether you seek tigers in Dhikala,
            serene walks in Sitabani, or the wild charm of Phato, our booking
            form lets you reserve your spot in minutes.
          </p>
        </div>
        <div className="intro-image">
          <img
            src="https://images.news9live.com/wp-content/uploads/2024/03/Jim-Corbett-Reserve.jpg?w=802&enlarge=true"
            alt="Corbett Landscape"
          />
        </div>
      </div>

      {/* BOOKING FORM */}
      <div className="booking-container">
        <h2>Reserve Your Safari</h2>
        <p>Fill out the form below to confirm your adventure.</p>
        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label>Select Safari Zone *</label>
            <select
              name="zone"
              value={form.zone}
              onChange={handleChange}
              required
            >
              <option value="">Choose a Zone</option>
              <option>Dhikala Zone</option>
              <option>Bijrani Zone</option>
              <option>Jhirna Zone</option>
              <option>Dhela Zone</option>
              <option>Durga Devi Zone</option>
              <option>Garjiya Zone</option>
              <option>Sitabani Zone</option>
              <option>Phato Zone</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date of Visit *</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Number of Visitors *</label>
            <input
              type="number"
              name="visitors"
              min="1"
              value={form.visitors}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Preferred Safari Type *</label>
            <select
              name="safariType"
              value={form.safariType}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option>Jeep Safari</option>
              <option>Canter Safari</option>
              <option>Elephant Safari</option>
            </select>
          </div>

          <div className="form-group">
            <label>Special Requests</label>
            <textarea
              name="message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              placeholder="Any special requests?"
            ></textarea>
          </div>

          <button type="submit" className="book-btn">
            Confirm Booking
          </button>

          {submitted && (
            <div className="success-message">
              ✅ Your Safari Booking is Confirmed!
            </div>
          )}
        </form>
      </div>

      {/* CTA */}
      <div className="booking-cta">
        <h2>Answer the Call of the Wild</h2>
        <p>
          Adventure, serenity, and the roar of the jungle await. Step into Jim
          Corbett National Park today.
        </p>
        <button className="cta-btn">Contact Our Team</button>
      </div>
    </section>
  );
}
