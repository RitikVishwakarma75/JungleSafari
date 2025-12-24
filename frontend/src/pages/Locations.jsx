import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./location.css";
import CorbettMap, { MAP_ZONES } from "../components/CorbettMap";
import { STAYS } from "../assets/data/stays";

export default function Locations() {
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState(null);

  /* ✅ SAFE + FIXED FILTER */
  const nearbyStays = selectedZone
    ? STAYS.filter(
        (stay) =>
          stay.zone.trim().toLowerCase() ===
          selectedZone.name.trim().toLowerCase()
      )
    : [];

  const zones = [
    {
      name: "Dhikala Zone",
      image:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/27/34/a1/caption.jpg?w=1400&h=-1&s=1",
      desc: "Dhikala is the heart of Jim Corbett National Park — famous for grasslands, elephants and tigers.",
      features: [
        "Best for Tiger Sightings",
        "Canter & Jeep Safari",
        "Forest Rest House",
      ],
    },
    {
      name: "Bijrani Zone",
      image: "https://jim-corbett-gov.in/images/bijrani-lodge.jpg",
      desc: "Bijrani is a photographer’s paradise with sal forests and open meadows.",
      features: ["Rich Flora & Fauna", "Open Grasslands", "Morning Safari"],
    },
    {
      name: "Jhirna Zone",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJj0-wH_cMnreQq6LVC-MhRAL2uAzGEk4tLg&s",
      desc: "Open all year, great for birds, bears and elephants.",
      features: ["Open All Year", "Birdwatching", "Elephants"],
    },
    {
      name: "Dhela Zone",
      image:
        "https://www.corbetttigerreserve.co.in/images/corbett-budget-tour.jpg",
      desc: "Peaceful zone with scenic safari trails.",
      features: ["Peaceful Route", "Scenic Trails", "Less Crowded"],
    },
    {
      name: "Durga Devi Zone",
      image: "https://t.eucdn.in/tourism/lg/durga-devi-gate-4125670.webp",
      desc: "Hilly terrain, leopards and fishing cats.",
      features: ["Hilly Landscape", "Leopards", "Bird Photography"],
    },
    {
      name: "Garjiya Zone",
      image:
        "https://www.corbett-national-park.com/socialimg/garjia-temple.jpg",
      desc: "New zone with river belts, perfect for families.",
      features: ["New Safari Zone", "River Belts", "Family Friendly"],
    },
    {
      name: "Sitabani Zone",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Jb4CVq3pJ1f6hcsFfozuMMbUFo3D9kApuw&s",
      desc: "Buffer zone with mythological significance.",
      features: ["Buffer Zone", "Mythology", "Birdwatching"],
    },
    {
      name: "Phato Zone",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBCwRluUKN2Llf_a13O8EEf4uX2HZCH1cg7w&s",
      desc: "Largest zone with dense greenery and wildlife.",
      features: ["Largest Zone", "High Tiger Sightings", "Forest Rest House"],
    },
  ];

  /* ✅ ZONE → MAP SYNC */
  const handleViewOnMap = (zoneName) => {
    const mapZone = MAP_ZONES.find(
      (z) => z.name.trim().toLowerCase() === zoneName.trim().toLowerCase()
    );

    if (mapZone) setSelectedZone(mapZone);

    document
      .querySelector(".map-wrapper")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="zones-page">
      {/* HERO */}
      <div className="zones-hero">
        <div className="overlay"></div>
        <div className="hero-text">
          <h1>Discover the Wilderness</h1>
          <p>Each zone of Corbett has its own wild story.</p>
        </div>
      </div>

      {/* INTRO */}
      <div className="zones-intro">
        <div className="intro-text">
          <h2>Where Every Zone Tells a Story</h2>
          <p>
            From tiger roars to bird calls, Corbett offers unforgettable
            experiences for every explorer.
          </p>
        </div>
        <div className="intro-image">
          <img
            src="https://images.news9live.com/wp-content/uploads/2024/03/Jim-Corbett-Reserve.jpg?w=802&enlarge=true"
            alt="Corbett Landscape"
          />
        </div>
      </div>

      {/* MAP */}
      <CorbettMap selectedZone={selectedZone} />

      {/* STAYS SECTION */}
      {selectedZone && (
        <section className="stays-section">
          <h2>Stays Near {selectedZone.name}</h2>
          <p>Handpicked resorts and lodges close to your safari zone</p>

          <div className="stays-grid">
            {nearbyStays.map((stay) => (
              <div className="stay-card" key={stay.id}>
                <h3>{stay.name}</h3>
                <p className="price">💰 {stay.price}</p>
                <p className="rating">⭐ {stay.rating}</p>
                <button className="book-btn">Book Stay</button>
              </div>
            ))}

            {nearbyStays.length === 0 && (
              <p className="no-stays">No stays listed for this zone yet.</p>
            )}
          </div>
        </section>
      )}

      {/* ZONES GRID */}
      <div className="zones-grid">
        <h2>Explore the Zones</h2>
        <div className="zones-list">
          {zones.map((zone, i) => (
            <div className="zone-card" key={i}>
              <img src={zone.image} alt={zone.name} className="zone-img" />
              <div className="zone-info">
                <h3>{zone.name}</h3>
                <p>{zone.desc}</p>
                <ul>
                  {zone.features.map((f, idx) => (
                    <li key={idx}>🌿 {f}</li>
                  ))}
                </ul>
                <button
                  className="book-btn"
                  onClick={() => handleViewOnMap(zone.name)}
                >
                  View on Map
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="zones-cta">
        <h2>Answer the Call of the Jungle</h2>
        <p>Your adventure awaits in Jim Corbett National Park.</p>
        <button onClick={() => navigate("/Booking")} className="cta-btn">
          Plan Your Safari Now
        </button>
      </div>
    </section>
  );
}
