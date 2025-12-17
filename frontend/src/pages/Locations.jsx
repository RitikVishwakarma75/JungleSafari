import "./location.css";
import { useNavigate } from "react-router-dom";

export default function Locations() {
  const navigate = useNavigate();
  const zones = [
    {
      name: "Dhikala Zone",
      image:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/27/34/a1/caption.jpg?w=1400&h=-1&s=1",
      desc: "Dhikala is the heart of Jim Corbett National Park — the largest and most iconic zone. Famous for its sweeping grasslands, roaming elephants, and the majestic Royal Bengal Tiger, Dhikala offers the purest essence of the wild.",
      features: [
        "Best for Tiger Sightings",
        "Canter & Jeep Safari Available",
        "Forest Rest House Stay Option",
      ],
    },
    {
      name: "Bijrani Zone",
      image: "https://jim-corbett-gov.in/images/bijrani-lodge.jpg",
      desc: "Bijrani is where wilderness meets serenity. Known for its diverse landscapes — from dense Sal forests to open meadows — it’s a photographer’s paradise, especially during golden-hour safaris.",
      features: [
        "Rich Flora & Fauna",
        "Open Grasslands",
        "Ideal for Morning Safari",
      ],
    },
    {
      name: "Jhirna Zone",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJj0-wH_cMnreQq6LVC-MhRAL2uAzGEk4tLg&s",
      desc: "Open throughout the year, Jhirna is a vibrant zone teeming with wildlife. Sloth bears, elephants, and exotic birds call this place home — making it perfect for those who crave nature in every season.",
      features: [
        "Open All Year",
        "Birdwatching Hotspot",
        "Frequent Elephant Sightings",
      ],
    },
    {
      name: "Dhela Zone",
      image:
        "https://www.corbetttigerreserve.co.in/images/corbett-budget-tour.jpg",
      desc: "The peaceful Dhela zone offers a serene mix of dense forest, grasslands, and thickets. It’s less crowded, making it perfect for travelers seeking calm, scenic safaris with a hint of tiger luck.",
      features: ["Peaceful Route", "Diverse Wildlife", "Scenic Safari Trails"],
    },
    {
      name: "Durga Devi Zone",
      image: "https://t.eucdn.in/tourism/lg/durga-devi-gate-4125670.webp",
      desc: "With hilly terrain and sparkling streams, Durga Devi is a treat for adventure lovers. Known for leopards and fishing cats, it’s the wild side of Corbett that photographers adore.",
      features: [
        "Hilly Landscape",
        "Leopards & Fishing Cats",
        "Perfect for Bird Photography",
      ],
    },
    {
      name: "Garjiya Zone",
      image:
        "https://www.corbett-national-park.com/socialimg/garjia-temple.jpg",
      desc: "Garjiya is the newest zone, offering untouched landscapes and calm river belts. Perfect for families and first-time visitors seeking a smooth introduction to Corbett’s wild charm.",
      features: ["New Safari Zone", "Beautiful River Belts", "Family Friendly"],
    },
    {
      name: "Sitabani Zone",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Jb4CVq3pJ1f6hcsFfozuMMbUFo3D9kApuw&s   ",
      desc: "Sitabani lies outside the main reserve but offers soul-soothing beauty. Known for its mythological link with Goddess Sita and calm surroundings, it’s perfect for birdwatching and peaceful drives.",
      features: [
        "Buffer Zone",
        "Mythological Significance",
        "Birdwatching Paradise",
      ],
    },
    {
      name: "Phato Zone",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBCwRluUKN2Llf_a13O8EEf4uX2HZCH1cg7w&s",
      desc: "The Phato Zone is Corbett’s newest and largest safari zone, located in the Terai West Forest. It offers dense greenery, abundant wildlife, and stunning views — including the Royal Bengal Tiger. deer, elephants, and diverse birds.",
      features: [
        "Largest Safari Zone (2,516.7 ha)",
        "High Tiger & Wildlife Sightings",
        "British-Era Forest Rest House",
      ],
    },
  ];

  return (
    <section className="zones-page">
      {/* HERO SECTION */}
      <div className="zones-hero">
        <div className="overlay"></div>
        <div className="hero-text">
          <h1>Discover the Wilderness</h1>
          <p>
            Jim Corbett National Park is divided into several magical zones —
            each with its own secrets, sounds, and stories.
          </p>
        </div>
      </div>

      {/* INTRO SECTION */}
      <div className="zones-intro">
        <div className="intro-text">
          <h2>Where Every Zone Tells a Story</h2>
          <p>
            From the deep roars echoing through Dhikala to the chirping symphony
            of Sitabani, every corner of Corbett brings you closer to nature’s
            heart. Whether you’re an explorer, a photographer, or a peace
            seeker, there’s a zone that matches your spirit.
          </p>
        </div>

        <div className="intro-image">
          <img
            src="https://images.news9live.com/wp-content/uploads/2024/03/Jim-Corbett-Reserve.jpg?w=802&enlarge=true"
            alt="Corbett Landscape"
          />
        </div>
      </div>

      {/* ZONES GRID SECTION */}
      <div className="zones-grid">
        <h2>Explore the Zones of Corbett</h2>
        <div className="zones-list">
          {zones.map((zone, index) => (
            <div className="zone-card" key={index}>
              <img src={zone.image} alt={zone.name} className="zone-img" />
              <div className="zone-info">
                <h3>{zone.name}</h3>
                <p>{zone.desc}</p>
                <ul>
                  {zone.features.map((f, i) => (
                    <li key={i}>🌿 {f}</li>
                  ))}
                </ul>
                <button className="book-btn">Book Safari</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="zones-cta">
        <h2>Answer the Call of the Jungle</h2>
        <p>
          The wild is calling — and your adventure awaits. Choose your zone,
          pack your camera, and join us for a journey into nature’s untamed
          beauty.
        </p>
        <button onClick={() => navigate("/Booking")} className="cta-btn">Plan Your Safari Now</button>
      </div>
    </section>
  );
}
