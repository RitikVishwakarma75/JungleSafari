import React, { useState } from "react";
import "./Contact.css"; // Your existing CSS file
import Footer from "../Footer/Footer";
const Contact = () => {
  // State to hold all form field values
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  // Generic handler to update state on input change
  const handleChange = (e) => {
    // Uses the 'name' attribute of the input to update the correct state property
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the browser from reloading the page
    console.log("Submitting form with data:", form); // Good for debugging

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Check if the request was successful
      if (res.ok) {
        const data = await res.json();
        alert(data.message || "Message sent successfully!");
        // Optionally, clear the form after successful submission
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        // Handle server errors (e.g., 404, 500)
        alert("Submission failed. Please try again.");
      }
    } catch (err) {
      // Handle network errors
      alert("A server error occurred. Please try again later.");
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-content">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-description">
          Feel free to reach out to us for any inquiries or to start crafting
          your dream getaway. We are here to assist you.
        </p>

        {/* The onSubmit handler is attached to the form element */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName" /* Must match state property */
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName" /* Must match state property */
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email" /* Must match state property */
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone" /* Must match state property */
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message" /* Must match state property */
              rows="5"
              value={form.message}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
