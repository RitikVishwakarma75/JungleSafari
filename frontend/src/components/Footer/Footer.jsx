import React, { useState } from "react";
import Team from "../../pages/team";
import { useNavigate } from "react-router-dom";

import "./Footer.css"; // Make sure this path is correct for your CSS file

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribe, setSubscribe] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubscribeChange = (e) => {
    setSubscribe(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the email and subscribe status to your backend
    console.log("Newsletter Signup Data:", { email, subscribe });
    alert(`Thank you for subscribing, ${email}!`);
    setEmail(""); // Clear email field after submission
    setSubscribe(false); // Reset checkbox
  };

  return (
    <footer className="footer-container">
      <div className="footer-left">
        <h2 className="footer-logo">Corbett Trails</h2>

        <form className="newsletter-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newsletterEmail" className="sr-only">
              Email *
            </label>{" "}
            {/* sr-only for accessibility */}
            <input
              type="email"
              id="newsletterEmail"
              name="newsletterEmail"
              placeholder="Email *"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="subscribe"
              name="subscribe"
              checked={subscribe}
              onChange={handleSubscribeChange}
              required // If subscription is mandatory
            />
            <label htmlFor="subscribe">
              Yes, subscribe me to your newsletter. *
            </label>
          </div>
          <button type="submit" className="submit-newsletter-btn">
            Submit
          </button>
        </form>
      </div>

      <div className="footer-right">
        <div className="contact-info">
          <p>+91 9756879998</p>
          <p>thecorbettnaturelist@gmail.com</p>
          <p>
            Gaujani, Ramnagar, Nainital, Near Government School,
            <br />
            Uttarakhand, India 244715
          </p>
        </div>

        <div className="legal-info">
          <p>
            <a href="/privacy-policy">Privacy Policy</a>
          </p>
          <p>
            <a href="/team" onClick={() => navigate("/team")}>Teams</a>
          </p>
        </div>

        <div className="copyright-info">
          <p>
            &copy; Copyright © 2025 Wild Destination.
            <br />
            All rights reserved.{" "}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
