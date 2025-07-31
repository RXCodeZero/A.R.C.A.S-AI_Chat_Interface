import React, { useState, useEffect, useRef } from "react";
import "./index.css";

function App() {
  const [chat, setChat] = useState("");
  const [model, setModel] = useState("gemini-2.0-flash");
  const [chatHistory, setChatHistory] = useState([]);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const ws = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000");

    ws.current.onopen = () => console.log("WebSocket connected");

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setLoading(false);

      if (msg.type === "response") {
        setIsTyping(true);
        animateTyping(msg.ans);
      } else if (msg.type === "error") {
        setChatHistory((prev) => [
          ...prev,
          { sender: "bot", text: "Error: " + msg.message }
        ]);
      }
    };

    return () => ws.current?.close();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, typingText]);

  const animateTyping = (fullText) => {
    setTypingText("");
    let index = 0;

    setLoading(false);       
    setIsTyping(true);

    const interval = setInterval(() => {
      setTypingText((prev) => prev + fullText.charAt(index));
      index++;

      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
        setChatHistory((prev) => [
          ...prev,
          { sender: "bot", text: fullText }
        ]);
        setTypingText("");
      }
    }, 20);
  };

  const handleSend = () => {
    if (!chat.trim()) return;

    if (ws.current.readyState === WebSocket.OPEN) {
      setChatHistory((prev) => [
        ...prev,
        { sender: "user", text: chat }
      ]);

      ws.current.send(JSON.stringify({ chat, model }));
      setChat("");
      setLoading(true); 
    }
  };

  return (
    <body>
    <div className="chat-container">
      <h1>A.R.C.A.S.</h1>
      <h2>Autonomous Real-time Chat & Analysis System</h2>
      <div className="chat-box">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}

        {loading && !isTyping && (
          <div className="message bot loading">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}

        {isTyping && (
          <div className="message bot typing">
            {typingText}
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="input-group">
        <input
          type="text"
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          placeholder="Enter your message"
        />
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="gemini-2.5-flash">gemini-2.5-flash</option>
          <option value="gemini-2.0-flash">gemini-2.0-flash</option>
          <option value="gemini-1.5-flash">gemini-1.5-flash</option>
          <option value="gemini-1.5-pro-latest">gemini-1.5-pro-latest</option>
        </select>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
    </body>
  );
}

export default App;
