// Explore.jsx
// After (Correct)
import Why from "../Why/Why"; // Correct import path for Why component
import React from "react";
import { useNavigate } from "react-router-dom";

import "./explore.css";
export default function Explore() {
  const navigate = useNavigate(); 
  return (
    <section className="explore">
      <section className="sectionOne">
        <div className="safari-content">
          <h1>Safari Tour Experiences</h1>
          <h4>Immersive Adventures</h4>
          <p>
            Our main adventure is the Jeep Safari, exclusively available within
            the Corbett National Park Zone. This is the most popular way to
            experience the park, allowing you to traverse its vast landscapes
            and see wildlife in their natural habitat. Explore a total forest
            area of 1318.54 sq km , where the dense moist deciduous forest
            consists of sal, haldu, peepal, rohini, and mango trees. The
            landscape is shaped by the Kosi and Ramganga rivers , with
            temperatures reaching a maximum of 40°C in summer and a minimum of
            8°C in winter
          </p>
        </div>

        <video
          src="https://www.pexels.com/download/video/28167731/"
          autoPlay
          loop
          muted
          playsInline
          className="safari-video"
        ></video>
      </section>

      <section className="sectionTwo">
        <h1>Locations</h1>

        <div className="service-cards">
          <div className="service-card">
            <img
              src="https://corbettresort.in/echronpanel/images/img-lib/large/17019370750.jpg"
              alt="Expert Guide"
              className="service-img"
            />
            <h4>Bijrani Zone</h4>
            <h2>A Tiger Sighting Hotspot</h2>
            <p>
              Bijrani is considered one of the best zones for tiger sightings.
              Visitors also have a high chance of spotting sloth bears, herds of
              elephants, and various types of deer, including chital, sambar,
              and hog deer.
            </p>
          </div>

          <div className="service-card">
            <img
              src="https://jimcorbettonline.com/assets/images/JhirnaZone.jpg"
              alt="Sustainability Priority"
              className="service-img"
            />
            <h4>Jhirna</h4>
            <h2>Open 365 Days a Year</h2>
            <p>
              Jhirna offers excellent opportunities for spotting sloth bears and
              wild elephants. It is also a great place to see nilgai, chital,
              and other deer species. While tigers are present, sloth bears are
              a more frequent major sighting.
            </p>
          </div>

          <div className="service-card">
            <img
              src="https://travelsetu.com/apps/uploads/new_destinations_photos/destination/2023/12/16/f03ad356067287e4bc84e70b903f29d0_1000x1000.jpg"
              alt="Customized Packages"
              className="service-img"
            />
            <h4>Dhikala</h4>
            <h2>The Heart of the Park</h2>
            <p>
              Dhikala is famous for sightings of herds of elephants and the rare
              hog deer. It also offers excellent opportunities to spot the
              Bengal tiger, spotted deer, and a wide variety of grassland birds
              and raptors.
            </p>
          </div>
        </div>

        {/* ✅ Button is outside and below all cards */}
        <button onClick={() => navigate("/Locations")} className="explore-btn">
          Explore Tours
        </button>
      </section>

      <Why />
    </section>
  );
}
