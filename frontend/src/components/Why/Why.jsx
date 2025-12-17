import React from "react";
import "./Why.css";
import Contact from "../Contact/Contact";

const Why = () => {
  return (
    <div className="why-choose-us-container">
      <div className="header-section">
        <h1>🏆 Why Choose Corbett Trails?</h1>
        <p className="subtitle">Unforgettable Safari Experiences</p>
      </div>

      <div className="features-list">
        {/* --- First Feature Item --- */}
        <div className="feature-item">
          <div className="feature-text">
            <h3>🐅 Authentic Encounters</h3>
            <p>
              Our Jeep Safaris offer genuine encounters with the wild heart of
              India. From the breathtaking sight of a Bengal tiger to the
              diverse ecosystems along the Ramganga river, we provide tailored
              experiences that immerse you in the natural wonders of Jim Corbett
              National Park.
            </p>
          </div>
          <div className="feature-image">
            <img
              src="https://images.pexels.com/photos/16448672/pexels-photo-16448672.jpeg"
              alt="Vintage camera on a green strap"
            />
          </div>
        </div>

        <hr className="separator" />

        {/* --- Second Feature Item --- */}
        <div className="feature-item">
          <div className="feature-text">
            <h3>Expert Local Guides</h3>
            <p>
              Our team is composed of experienced naturalists and guides who
              have grown up in the shadow of the Himalayas. Their deep knowledge
              of the park's terrain, animal behavior, and local Kumaoni culture
              ensures your safari is not just a tour, but an insightful and safe
              expeditiona connection to a way of life that still beats in
              harmony with nature.
            </p>
          </div>
          <div className="feature-image">
            <img
              src="https://static.wixstatic.com/media/11062b_7214bf520a8a467c985019e0e3abcef4~mv2.jpg/v1/fill/w_644,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Safari%20Tour.jpg"
              alt="Golden sunset sky with clouds"
            />
          </div>
        </div>

        <hr className="separator" />

        {/* --- Third Feature Item --- */}
        <div className="feature-item">
          <div className="feature-text">
            <h3>Sustainable & Responsible Tourism</h3>
            <p>
              We are committed to making a positive impact on the environment
              and the local community. By choosing Corbett Trails, you are
              supporting responsible tourism practices that contribute to
              wildlife conservation and ensure that the beauty of Corbett is
              preserved for future generations.
            </p>
          </div>
          <div className="feature-image">
            <img
              src="https://images.pexels.com/photos/5118532/pexels-photo-5118532.jpeg"
              alt="Close-up of a cheetah"
            />
          </div>
        </div>
      </div>

      <Contact />
    </div>
  );
};

export default Why;
