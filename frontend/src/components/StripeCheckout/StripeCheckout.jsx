// frontend/src/components/StripeCheckout/StripeCheckout.jsx
import React, { useState } from "react";
import { FaLock, FaCreditCard, FaRegCalendarAlt, FaKey, FaTimes, FaSpinner, FaCheckCircle } from "react-icons/fa";
import "./stripeCheckout.css";

export default function StripeCheckout({ isOpen, onClose, onSuccess, amount, bookingDetails }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState(bookingDetails?.fullName || "");
  
  const [status, setStatus] = useState("idle"); // idle | processing | success

  if (!isOpen) return null;

  // Format Card Number (adds spaces every 4 digits)
  const handleCardChange = (e) => {
    let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    let matches = value.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || "";
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(" "));
    } else {
      setCardNumber(value);
    }
  };

  // Format Expiry Date (adds '/' between MM and YY)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (value.length >= 2) {
      setExpiry(`${value.substring(0, 2)} / ${value.substring(2, 4)}`);
    } else {
      setExpiry(value);
    }
  };

  const handlePaySubmit = (e) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, "").length < 16) {
      alert("Please enter a valid 16-digit card number!");
      return;
    }
    if (expiry.length < 7) {
      alert("Please enter card expiry date!");
      return;
    }
    if (cvc.length < 3) {
      alert("Please enter 3-digit CVC!");
      return;
    }

    // Trigger processing simulation
    setStatus("processing");

    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2500);
  };

  return (
    <div className="stripe-backdrop">
      <div className="stripe-modal animate-slide-up">
        {/* Header with Stripe Purple Gradient */}
        <div className="stripe-header">
          <div className="stripe-logo-area">
            <span className="stripe-badge">STRIPE SANDBOX</span>
            <h2>💳 Secure Checkout</h2>
          </div>
          <button className="stripe-close" onClick={onClose} disabled={status !== "idle"}>
            <FaTimes />
          </button>
        </div>

        {status === "idle" && (
          <form onSubmit={handlePaySubmit} className="stripe-form">
            {/* Amount Summary banner */}
            <div className="stripe-summary">
              <div>
                <small>Booking for {bookingDetails?.fullName || "Safari Traveler"}</small>
                <h4>{bookingDetails?.zone || "Jim Corbett"} Safari Ride</h4>
              </div>
              <div className="stripe-amount-text">
                Rs. {amount}
              </div>
            </div>

            <div className="stripe-form-group">
              <label>Name on Card</label>
              <div className="stripe-input-wrapper">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
            </div>

            <div className="stripe-form-group">
              <label>Card Number</label>
              <div className="stripe-input-wrapper">
                <FaCreditCard className="stripe-icon" />
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardChange}
                  maxLength="19"
                  placeholder="4242 4242 4242 4242"
                  required
                />
              </div>
            </div>

            <div className="stripe-row">
              <div className="stripe-form-group">
                <label>Expiration Date</label>
                <div className="stripe-input-wrapper">
                  <FaRegCalendarAlt className="stripe-icon" />
                  <input
                    type="text"
                    value={expiry}
                    onChange={handleExpiryChange}
                    maxLength="7"
                    placeholder="MM / YY"
                    required
                  />
                </div>
              </div>

              <div className="stripe-form-group">
                <label>CVC Code</label>
                <div className="stripe-input-wrapper">
                  <FaKey className="stripe-icon" />
                  <input
                    type="password"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ""))}
                    maxLength="3"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="stripe-pay-btn">
              <FaLock style={{ marginRight: "8px" }} /> Pay Rs. {amount}
            </button>

            <small className="stripe-ssl-notice">
              🛡️ Secured via Stripe SSL 256-bit sandbox encryption.
            </small>
          </form>
        )}

        {/* ⏳ PROCESSING ANIMATION STATE */}
        {status === "processing" && (
          <div className="stripe-status-overlay">
            <FaSpinner className="stripe-spinner" size={45} />
            <h3>Authorizing Transaction...</h3>
            <p>Communicating with your credit card issuer. Please do not close or reload this secure window.</p>
          </div>
        )}

        {/* ✅ SUCCESS OVERLAY STATE */}
        {status === "success" && (
          <div className="stripe-status-overlay success">
            <FaCheckCircle className="stripe-success-checkmark" size={55} />
            <h3>Payment Successful!</h3>
            <p>Receipt sent to {bookingDetails?.email || "your email"}. Redirecting you shortly...</p>
          </div>
        )}
      </div>
    </div>
  );
}
