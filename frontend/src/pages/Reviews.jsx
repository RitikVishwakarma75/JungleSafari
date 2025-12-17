import { useState } from "react";
import "./reviews.css";

export default function Reviews() {
  const [reviews, setReviews] = useState([
    {
      name: "Rohit Sharma",
      location: "Delhi, India",
      rating: 5,
      comment:
        "An unforgettable experience! The Dhikala safari was breathtaking and our guide was incredibly knowledgeable.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Sneha Kapoor",
      location: "Mumbai, India",
      rating: 4,
      comment:
        "Loved the serene beauty of Jhirna and Garjiya zones. Perfect for family trips and photography.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Amit Verma",
      location: "Bangalore, India",
      rating: 5,
      comment:
        "Phato Zone was incredible! Dense greenery and high chances of spotting tigers. Definitely recommend the treehouse stay.",
      image: "https://randomuser.me/api/portraits/men/56.jpg",
    },
    {
      name: "Priya Singh",
      location: "Noida, India",
      rating: 4,
      comment:
        "Bijrani and Dhela zones are a photographer's dream. The staff made our safari experience seamless and enjoyable.",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  ]);

  const [newReview, setNewReview] = useState({
    name: "",
    location: "",
    rating: 0,
    comment: "",
  });

  const handleChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !newReview.name ||
      !newReview.comment ||
      !newReview.location ||
      !newReview.rating
    ) {
      alert("Please fill in all fields!");
      return;
    }

    const randomImg = `https://randomuser.me/api/portraits/${
      Math.random() > 0.5 ? "men" : "women"
    }/${Math.floor(Math.random() * 80)}.jpg`;

    setReviews([
      ...reviews,
      {
        ...newReview,
        image: randomImg,
        rating: parseInt(newReview.rating),
      },
    ]);

    setNewReview({ name: "", location: "", rating: 0, comment: "" });
  };

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
        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <div className="review-card" key={index}>
              <img
                src={review.image}
                alt={review.name}
                className="reviewer-img"
              />
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
          />
          <input
            type="text"
            name="location"
            placeholder="Your Location"
            value={newReview.location}
            onChange={handleChange}
          />
          <select
            name="rating"
            value={newReview.rating}
            onChange={handleChange}
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
          ></textarea>
          <button type="submit" className="cta-btn">
            Submit Review
          </button>
        </form>
      </div>
    </section>
  );
}
