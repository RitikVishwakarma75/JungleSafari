import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./reviews.css";

export default function Reviews() {
  const { tenantSlug } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newReview, setNewReview] = useState({
    name: "",
    location: "",
    rating: 0,
    comment: "",
    avatar: "🦁", // default wildlife emoji
  });

  const getApiUrl = (path) => {
    const base =
      window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:5000"
        : "https://junglesafari-s1dr.onrender.com";
    return `${base}${path}`;
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl(`/api/reviews?tenantId=${tenantSlug || "corbett-trails"}`));
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [tenantSlug]);

  const handleChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleAvatarSelect = (emoji) => {
    setNewReview({ ...newReview, avatar: emoji });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !newReview.name ||
      !newReview.comment ||
      !newReview.location ||
      !newReview.rating ||
      newReview.rating === "0"
    ) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const res = await fetch(getApiUrl("/api/reviews"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newReview,
          tenantId: tenantSlug || "corbett-trails"
        })
      });

      if (res.ok) {
        const savedReview = await res.json();
        setReviews([savedReview, ...reviews]); // Prepend new review
        setNewReview({ name: "", location: "", rating: 0, comment: "", avatar: "🦁" });
        alert("Thank you for your wonderful review! 🌿");
      } else {
        alert("Failed to submit review. Please try again.");
      }
    } catch (err) {
      console.error("Submit Review Error:", err);
      alert("A network error occurred. Please try again.");
    }
  };

  const avatarPresets = [
    { emoji: "🦁", label: "Lion" },
    { emoji: "🐯", label: "Tiger" },
    { emoji: "🐘", label: "Elephant" },
    { emoji: "🦌", label: "Deer" },
    { emoji: "🐒", label: "Monkey" }
  ];

  return (
    <section className="reviews-page">
      {/* HERO SECTION */}
      <div className="reviews-hero">
        <div className="overlay"></div>
        <div className="hero-text">
          <h1>What Our Visitors Say</h1>
          <p>
            Real experiences from travelers exploring Jim Corbett National Park
          </p>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="reviews-container">
        <h2>Traveler Reviews</h2>
        {loading ? (
          <div className="reviews-skeleton-grid">
            {[...Array(3)].map((_, idx) => (
              <div className="review-card skeleton-card" key={idx}>
                <div className="reviewer-avatar skeleton-avatar"></div>
                <div className="review-content">
                  <div className="skeleton-line skeleton-title"></div>
                  <div className="skeleton-line skeleton-location"></div>
                  <div className="skeleton-line skeleton-comment"></div>
                  <div className="skeleton-line skeleton-rating"></div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#666" }}>Be the first to share your wild safari experience!</p>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div className="review-card" key={review._id || review.name}>
                <div className="reviewer-avatar">
                  {review.avatar || "🦁"}
                </div>
                <div className="review-content">
                  <h3>{review.name}</h3>
                  <p className="location">{review.location}</p>
                  <p className="comment">"{review.comment}"</p>
                  <p className="rating">
                    {"⭐".repeat(review.rating)} {"☆".repeat(5 - review.rating)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REVIEW FORM SECTION */}
      <div className="review-form-section">
        <h2>Share Your Adventure</h2>
        <form className="review-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={newReview.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Your Location"
            value={newReview.location}
            onChange={handleChange}
            required
          />

          {/* Wildlife Avatar Selector Grid */}
          <div style={{ margin: "5px 0" }}>
            <span className="avatar-selector-label">🐾 Choose Your Animal Avatar Logo:</span>
            <div className="avatar-selector-grid">
              {avatarPresets.map((preset) => (
                <div
                  key={preset.emoji}
                  className={`avatar-option-chip ${newReview.avatar === preset.emoji ? "selected" : ""}`}
                  onClick={() => handleAvatarSelect(preset.emoji)}
                >
                  <span className="emoji">{preset.emoji}</span>
                  <span className="label">{preset.label}</span>
                </div>
              ))}
            </div>
          </div>

          <select
            name="rating"
            value={newReview.rating}
            onChange={handleChange}
            required
          >
            <option value="0">Select Rating</option>
            <option value="5">⭐️⭐️⭐️⭐️⭐️</option>
            <option value="4">⭐️⭐️⭐️⭐️</option>
            <option value="3">⭐️⭐️⭐️</option>
            <option value="2">⭐️⭐️</option>
            <option value="1">⭐️</option>
          </select>
          <textarea
            name="comment"
            placeholder="Write your review..."
            value={newReview.comment}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit" className="cta-btn">
            Submit Review
          </button>
        </form>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
