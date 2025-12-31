import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import "./ChatBot.css";

const STEPS = [
  {
    key: "fullName",
    label: "Full Name",
    question: "What’s your full name?",
    type: "input",
  },
  {
    key: "email",
    label: "Email",
    question: "Your email address?",
    type: "input",
  },
  { key: "phone", label: "Phone", question: "Phone number?", type: "input" },
  {
    key: "zone",
    label: "Zone",
    question: "Choose a safari zone",
    type: "options",
    options: [
      "Dhikala",
      "Bijrani",
      "Jhirna",
      "Dhela",
      "Durga Devi",
      "Garjiya",
      "Sitabani",
      "Phato",
    ],
  },
  { key: "date", label: "Date", question: "Select visit date", type: "date" },
  {
    key: "visitors",
    label: "Visitors",
    question: "Number of visitors?",
    type: "options",
    options: ["1", "2", "3", "4", "5", "6+"],
  },
  {
    key: "safariType",
    label: "Safari Type",
    question: "Choose safari type",
    type: "options",
    options: ["Jeep Safari", "Canter Safari", "Elephant Safari"],
  },
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [booking, setBooking] = useState({});
  const [mode, setMode] = useState("chat"); // chat | preview | final
  const [showCard, setShowCard] = useState(false);

  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! I can help you book a safari ride." },
    { from: "bot", text: STEPS[0].question },
  ]);

  const chatEndRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mode]);

  useEffect(() => {
    if (mode === "final") {
      setTimeout(() => setShowCard(true), 600);
    }
  }, [mode]);

  const resetChat = () => {
    setIsOpen(false);
    setStep(0);
    setInput("");
    setBooking({});
    setMode("chat");
    setShowCard(false);
    setMessages([
      { from: "bot", text: "👋 Hi! I can help you book a safari ride." },
      { from: "bot", text: STEPS[0].question },
    ]);
  };

  const validate = (key, value) => {
    if (!value) return "This field is required.";
    if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Please enter a valid email.";
    if (key === "phone" && !/^[6-9]\d{9}$/.test(value))
      return "Please enter a valid 10-digit phone number.";
    return null;
  };

  const handleAnswer = (value) => {
    const current = STEPS[step];
    const error = validate(current.key, value);

    if (error) {
      setMessages((p) => [...p, { from: "bot", text: `❌ ${error}` }]);
      return;
    }

    // user answer
    setMessages((p) => [...p, { from: "user", text: value }]);
    const updated = { ...booking, [current.key]: value };
    setBooking(updated);
    setInput("");

    if (step < STEPS.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      setTimeout(() => {
        setMessages((p) => [
          ...p,
          { from: "bot", text: STEPS[nextStep].question },
        ]);
      }, 400);
    } else {
      showPreview(updated);
    }
  };

  const showPreview = (data) => {
    setMode("preview");
    setMessages((p) => [
      ...p,
      {
        from: "bot",
        text: "🧾 Please review your details. Click any to edit.",
      },
    ]);
  };

  const editField = (index) => {
    setMode("chat");
    setStep(index);
    setMessages((p) => [...p, { from: "bot", text: STEPS[index].question }]);
  };

  const confirmBooking = async () => {
    await fetch("http://localhost:5000/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...booking, source: "chatbot" }),
    });
    setMode("final");
  };

  const downloadCard = async () => {
    const canvas = await html2canvas(cardRef.current, { scale: 2 });
    const link = document.createElement("a");
    link.download = "Safari-Booking-Receipt.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const current = STEPS[step];

  return (
    <>
      {!isOpen && (
        <div className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          🤖
        </div>
      )}

      {isOpen && (
        <div className="chatbot">
          <div className="chat-header">
            🦁 Safari Assistant
            <span className="close-btn" onClick={resetChat}>
              ✖
            </span>
          </div>

          <div className="chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.from}`}>
                {m.text}
              </div>
            ))}

            {mode === "chat" && current.type === "input" && (
              <input
                className="text-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type here..."
                onKeyDown={(e) => e.key === "Enter" && handleAnswer(input)}
              />
            )}

            {mode === "chat" && current.type === "date" && (
              <input
                type="date"
                className="date-input"
                onChange={(e) => handleAnswer(e.target.value)}
              />
            )}

            {mode === "chat" && current.type === "options" && (
              <div className="options">
                {current.options.map((opt) => (
                  <button key={opt} onClick={() => handleAnswer(opt)}>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {mode === "preview" && (
              <div className="preview">
                {STEPS.map((s, i) => (
                  <p key={s.key} onClick={() => editField(i)}>
                    <strong>{s.label}:</strong> {booking[s.key]} ✏️
                  </p>
                ))}
                <button className="confirm-btn" onClick={confirmBooking}>
                  Confirm Booking
                </button>
              </div>
            )}

            {mode === "final" && showCard && (
              <div className="booking-card" ref={cardRef}>
                <h2>🌿 Safari Booking Receipt</h2>
                {STEPS.map((s) => (
                  <p key={s.key}>
                    <span>{s.label}</span>
                    <strong>{booking[s.key]}</strong>
                  </p>
                ))}
                <button className="download-btn" onClick={downloadCard}>
                  ⬇️ Download
                </button>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>
      )}
    </>
  );
}
