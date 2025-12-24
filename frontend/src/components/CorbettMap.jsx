import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";

// Fix default marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ZONE COORDINATES (single source of truth)
export const MAP_ZONES = [
  { name: "Dhikala Zone", position: [29.531, 78.774] },
  { name: "Bijrani Zone", position: [29.512, 78.803] },
  { name: "Jhirna Zone", position: [29.437, 78.781] },
  { name: "Dhela Zone", position: [29.48, 78.72] },
  { name: "Durga Devi Zone", position: [29.662, 78.898] },
  { name: "Garjiya Zone", position: [29.52, 78.755] },
  { name: "Sitabani Zone", position: [29.47, 78.67] },
  { name: "Phato Zone", position: [29.56, 78.62] },
];

// Handles smooth zoom animation
function FlyToZone({ selectedZone }) {
  const map = useMap();

  useEffect(() => {
    if (selectedZone) {
      map.flyTo(selectedZone.position, 13, {
        duration: 1.5,
      });
    }
  }, [selectedZone, map]);

  return null;
}

export default function CorbettMap({ selectedZone }) {
  const markerRefs = useRef({});

  // Open popup automatically
  useEffect(() => {
    if (selectedZone && markerRefs.current[selectedZone.name]) {
      markerRefs.current[selectedZone.name].openPopup();
    }
  }, [selectedZone]);

  return (
    <section className="map-wrapper">
      <h2>Explore Corbett on Map</h2>
      <p>Click any zone card to zoom on map</p>

      <div className="map-box">
        <MapContainer
          center={[29.52, 78.78]}
          zoom={11}
          className="map-container"
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <FlyToZone selectedZone={selectedZone} />

          {MAP_ZONES.map((zone) => (
            <Marker
              key={zone.name}
              position={zone.position}
              ref={(ref) => (markerRefs.current[zone.name] = ref)}
            >
              <Popup>
                <strong>{zone.name}</strong>
                <br />
                Safari hotspot 🌿
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}
