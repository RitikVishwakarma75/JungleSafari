// Home.jsx
import Explore from "../Explore/Explore";
import "./home.css";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

export default function Home() {
  const navigate = useNavigate(); // 2. Initialize the hook

  return (
    <>
      <section className="hero">
        <h1>DISCOVER THE WILD</h1>
        <p>
          Welcome to Corbett Trails, where the call of the jungle meets the
          rhythm of your heart. Nestled in the wilderness of Jim Corbett
          National Park, we design bespoke safari experiences that blend
          adventure, comfort, and authenticity.
        </p>

        {/* 3. Use the navigate function onClick */}
        <button onClick={() => navigate("/Booking")} className="heroBtn">
          Book Now...
        </button>
      </section>
      <Explore />
    </>
  );
}
