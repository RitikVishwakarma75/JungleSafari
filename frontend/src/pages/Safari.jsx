import { useState } from "react";

export default function Safari() {
  const [form, setForm] = useState({
    name: "",
    date: "",
    zone: "Bijrani",
    vehicle: "Jeep",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://junglesafari-s1dr.onrender.com/api/booking",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert("Server error! Try again.");
    }
  };

  return (
    <div className="safari-page">
      <h1>Book Your Safari</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br />

        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <br />

        <label>Zone:</label>
        <select name="zone" value={form.zone} onChange={handleChange}>
          <option>Bijrani</option>
          <option>Dhikala</option>
          <option>Jhirna</option>
          <option>Dhela</option>
        </select>
        <br />

        <label>Vehicle Type:</label>
        <select name="vehicle" value={form.vehicle} onChange={handleChange}>
          <option>Jeep</option>
          <option>Canter</option>
        </select>
        <br />

        <button type="submit">Book Safari</button>
      </form>
    </div>
  );
}
