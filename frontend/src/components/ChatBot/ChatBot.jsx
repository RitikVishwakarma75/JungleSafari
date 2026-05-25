// frontend/src/components/ChatBot/ChatBot.jsx
import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { FaCheckCircle, FaRobot, FaTimes, FaSpinner, FaPaperPlane } from "react-icons/fa";
import "./ChatBot.css";

const getApiUrl = (path) => {
  const base =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : "https://junglesafari-s1dr.onrender.com";
  return `${base}${path}`;
};

const REQUIRED_FIELDS = [
  { key: "fullName", label: "Name", icon: "👤" },
  { key: "email", label: "Email", icon: "📧" },
  { key: "phone", label: "Phone", icon: "📞" },
  { key: "zone", label: "Zone", icon: "🌲" },
  { key: "date", label: "Date", icon: "📅" },
  { key: "visitors", label: "Guests", icon: "👥" },
  { key: "safariType", label: "Ride", icon: "🛞" },
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [booking, setBooking] = useState({
    fullName: null,
    email: null,
    phone: null,
    zone: null,
    date: null,
    visitors: null,
    safariType: null,
  });
  
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hello! I am your AI Safari Booking Assistant. Tell me what kind of adventure you are planning!" },
  ]);

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("chat"); // chat | preview | final
  const [showCard, setShowCard] = useState(false);

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
    setInput("");
    setBooking({
      fullName: null,
      email: null,
      phone: null,
      zone: null,
      date: null,
      visitors: null,
      safariType: null,
    });
    setMode("chat");
    setShowCard(false);
    setMessages([
      { from: "bot", text: "👋 Hello! I am your AI Safari Booking Assistant. Tell me what kind of adventure you are planning!" },
    ]);
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Add user message
    const updatedMessages = [...messages, { from: "user", text }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(getApiUrl("/api/ai/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) throw new Error("Chat fail");
      const data = await res.json();

      // Add bot response
      setMessages((prev) => [...prev, { from: "bot", text: data.responseText }]);

      // Merge extracted fields safely into booking state
      if (data.extractedData) {
        setBooking((prev) => {
          const next = { ...prev };
          Object.keys(data.extractedData).forEach((k) => {
            if (data.extractedData[k] !== null) {
              next[k] = data.extractedData[k];
            }
          });
          
          // Check if all fields are gathered to trigger preview mode
          const allGathered = REQUIRED_FIELDS.every((f) => next[f.key] !== null);
          if (allGathered) {
            setTimeout(() => setMode("preview"), 1000);
          }
          
          return next;
        });
      }
    } catch (err) {
      console.warn("AI Chat API offline, triggering smart offline parser.");
      // CLIENT-SIDE LOCAL MOCK PARSER
      handleOfflineBotReply(text, updatedMessages);
    } finally {
      setLoading(false);
    }
  };

  const handleOfflineBotReply = (userInput, history) => {
    // Basic heuristic to parse fields offline
    const nextBooking = { ...booking };
    const text = userInput.trim().toLowerCase();

    // Email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) nextBooking.email = emailMatch[0];

    // Phone (10 digit)
    const phoneMatch = text.match(/(?:\+?91)?[6-9]\d{9}/);
    if (phoneMatch) nextBooking.phone = phoneMatch[0].slice(-10);

    // Zone
    const zones = ["dhikala", "bijrani", "jhirna", "dhela", "durga devi", "garjiya", "sitabani", "phato"];
    zones.forEach((z) => {
      if (text.includes(z)) nextBooking.zone = z.charAt(0).toUpperCase() + z.slice(1);
    });

    // Date YYYY-MM-DD
    const dateMatch = text.match(/\d{4}-\d{2}-\d{2}/);
    if (dateMatch) nextBooking.date = dateMatch[0];

    // Guests
    if (text.match(/\b([1-5])\b/)) {
      nextBooking.visitors = text.match(/\b([1-5])\b/)[0];
    } else if (text.includes("6+")) {
      nextBooking.visitors = "6+";
    }

    // Ride Type
    if (text.includes("jeep")) nextBooking.safariType = "Jeep Safari";
    if (text.includes("canter")) nextBooking.safariType = "Canter Safari";
    if (text.includes("elephant")) nextBooking.safariType = "Elephant Safari";

    // Set Name if empty and not matching any other details
    if (!nextBooking.fullName && userInput.split(" ").length >= 2 && !userInput.includes("@") && !userInput.match(/\d/)) {
      nextBooking.fullName = userInput;
    }

    setBooking(nextBooking);

    // Determine chatbot next prompt based on missing items
    let reply = "";
    if (!nextBooking.fullName) {
      reply = `I'd love to help you book your safari! What is your full name?`;
    } else if (!nextBooking.email) {
      reply = `Thank you, ${nextBooking.fullName}! What email address should we send the confirmation tickets to?`;
    } else if (!nextBooking.phone) {
      reply = `Awesome. Can I get your 10-digit mobile number for immediate updates?`;
    } else if (!nextBooking.zone) {
      reply = `Great! Which safari zone do you prefer? (Dhikala, Bijrani, Jhirna, Dhela, Durga Devi, Sitabani, Phato)`;
    } else if (!nextBooking.date) {
      reply = `Perfect. Which date would you like to visit? (Please use YYYY-MM-DD format)`;
    } else if (!nextBooking.visitors) {
      reply = `Got it. How many visitors will be joining you? (Enter 1 to 5, or 6+)`;
    } else if (!nextBooking.safariType) {
      reply = `And lastly, which vehicle type: Jeep Safari, Canter Safari, or Elephant Safari?`;
    } else {
      reply = `Awesome! I have all details ready for booking. Let's review them below.`;
      setTimeout(() => setMode("preview"), 1000);
    }

    setMessages((prev) => [...prev, { from: "bot", text: reply }]);
  };

  const confirmBooking = async () => {
    try {
      await fetch(getApiUrl("/api/booking"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...booking, source: "chatbot" }),
      });
      setMode("final");
    } catch (err) {
      console.warn("API Offline to submit booking. Confirming offline card receipt.");
      setMode("final");
    }
  };

  const downloadCard = async () => {
    const canvas = await html2canvas(cardRef.current, { scale: 2 });
    const link = document.createElement("a");
    link.download = "Safari-Booking-Receipt.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <>
      {!isOpen && (
        <div className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <FaRobot size={24} />
          <span className="toggle-badge">AI</span>
        </div>
      )}

      {isOpen && (
        <div className="chatbot animate-slide-up">
          <div className="chat-header">
            <div className="header-info">
              <FaRobot className="robot-head" />
              <div>
                <h4>Safari Assistant</h4>
                <span className="ai-status">⚡ Gemini AI Active</span>
              </div>
            </div>
            <span className="close-btn" onClick={resetChat}>
              <FaTimes />
            </span>
          </div>

          {/* AI FIELD TRACKER */}
          {mode === "chat" && (
            <div className="chat-fields-tracker">
              {REQUIRED_FIELDS.map((f) => (
                <span 
                  key={f.key} 
                  className={`tracker-chip ${booking[f.key] !== null ? 'filled' : ''}`}
                  title={booking[f.key] ? `${f.label}: ${booking[f.key]}` : `Missing ${f.label}`}
                >
                  {f.icon} {booking[f.key] !== null ? "✓" : ""}
                </span>
              ))}
            </div>
          )}

          <div className="chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`msg-bubble ${m.from}`}>
                {m.from === "bot" && <div className="msg-avatar">🤖</div>}
                <div className="msg-text">{m.text}</div>
              </div>
            ))}

            {loading && (
              <div className="msg-bubble bot">
                <div className="msg-avatar">🤖</div>
                <div className="msg-text typing">
                  <FaSpinner className="spin-bot" /> Assistant is thinking...
                </div>
              </div>
            )}

            {mode === "preview" && (
              <div className="preview-receipt-card animate-fade-in">
                <h4>🧾 Confirm Your Safari Details</h4>
                <div className="receipt-items">
                  {REQUIRED_FIELDS.map((f) => (
                    <div className="receipt-row" key={f.key}>
                      <span className="row-label">{f.icon} {f.label}:</span>
                      <span className="row-value">{booking[f.key] || "Pending"}</span>
                    </div>
                  ))}
                </div>
                <button className="confirm-booking-btn" onClick={confirmBooking}>
                  Confirm & Secure Booking
                </button>
              </div>
            )}

            {mode === "final" && showCard && (
              <div className="booking-card" ref={cardRef}>
                <div className="receipt-banner">
                  <h2>🌿 Safari Receipt</h2>
                  <small>Jim Corbett National Park</small>
                </div>
                
                <div className="receipt-body">
                  {REQUIRED_FIELDS.map((f) => (
                    <div className="receipt-line" key={f.key}>
                      <span>{f.label}</span>
                      <strong>{booking[f.key]}</strong>
                    </div>
                  ))}
                  <div className="receipt-line status">
                    <span>Status</span>
                    <strong className="status-badge">PENDING APPROVAL</strong>
                  </div>
                </div>
                
                <button className="download-btn" onClick={downloadCard}>
                  ⬇️ Download Ticket Receipt
                </button>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {mode === "chat" && (
            <div className="chat-input-area">
              <input
                className="chat-text-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type details naturally (e.g. name, date)..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={loading}
              />
              <button 
                className="chat-send-btn" 
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
              >
                <FaPaperPlane />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
