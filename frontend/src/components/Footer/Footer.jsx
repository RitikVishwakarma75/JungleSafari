import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const footerRef = useRef(null);

  // ✅ Scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("footer-visible");
        }
      },
      { threshold: 0.2 }
    );

    if (footerRef.current) observer.observe(footerRef.current);
  }, []);

 const handleSubmit = async (e) => {
   e.preventDefault();

   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   if (!emailRegex.test(email)) {
     setEmailError(true);
     setTimeout(() => setEmailError(false), 600);
     return;
   }

   try {
     const res = await fetch("http://localhost:5000/api/newsletter", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ email }),
     });

     const data = await res.json();

     if (!res.ok) {
       alert(data.message || "Subscription failed ❌");
       return;
     }

     alert(data.message || "Subscribed successfully 🌿");
     setEmail("");
     setSubscribe(false);
   } catch (error) {
     alert("Server not responding. Try again later 🚫");
   }
 };


  return (
    <footer ref={footerRef} className="footer-container footer-hidden">
      <div className="footer-left">
        <h2 className="footer-logo">Corbett Trails</h2>

        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={emailError ? "email-error" : email ? "email-valid" : ""}
          />

          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={subscribe}
              onChange={(e) => setSubscribe(e.target.checked)}
              required
            />
            <label>Yes, subscribe me *</label>
          </div>

          <button type="submit" className="submit-newsletter-btn">
            Submit
          </button>
        </form>
      </div>

      <div className="footer-right">
        <div className="contact-info">
          <p>📞 +91 9756879998</p>
          <p>📧 thecorbettnaturelist@gmail.com</p>
          <p>Ramnagar, Uttarakhand, India</p>
        </div>

        <div className="legal-info">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/team">Team</Link>
        </div>

        <p className="copyright">
          © 2025 Wild Destination. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
