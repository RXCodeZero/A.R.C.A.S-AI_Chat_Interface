import React, { useState, useEffect, useRef } from "react";
import "./index.css";

// --- SVG Icon Component ---
const SendIcon = () => (
  <svg className="send-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// --- Child Components ---
const ChatMessage = ({ msg }) => (
  <div className={`message ${msg.sender}`}>{msg.text}</div>
);

const TypingIndicator = ({ isLoading, isTyping, typingText }) => {
  if (isLoading && !isTyping) {
    return (
      <div className="message bot loading">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    );
  }
  if (isTyping) {
    return <div className="message bot typing">{typingText}</div>;
  }
  return null;
};

// ChatInput is now simpler, only handling text and send button
const ChatInput = ({ chat, setChat, handleSend, disabled }) => (
  <div className="input-group">
    <input
      type="text"
      value={chat}
      onChange={(e) => setChat(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && !disabled && handleSend()}
      placeholder="Ask A.R.C.A.S. anything..."
      disabled={disabled}
    />
    <button onClick={handleSend} disabled={disabled}>
      <SendIcon />
    </button>
  </div>
);

// --- Main App Component ---
function App() {
  const [model, setModel] = useState("gemini-2.0-flash");
  const [chat, setChat] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const ws = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    setChatHistory([{ sender: "bot", text: "Welcome to A.R.C.A.S. How can I assist you today?" }]);

    ws.current = new WebSocket("ws://localhost:3000");
    ws.current.onopen = () => console.log("WebSocket connected");
    ws.current.onclose = () => console.log("WebSocket disconnected");

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setLoading(false);

      if (msg.type === "response") {
        animateTyping(msg.ans);
      } else if (msg.type === "error") {
        setChatHistory((prev) => [
          ...prev,
          { sender: "bot", text: `Error: ${msg.message}` },
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
    setIsTyping(true);
    let index = 0;
    const interval = setInterval(() => {
      setTypingText((prev) => prev + fullText.charAt(index));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
        setChatHistory((prev) => [
          ...prev,
          { sender: "bot", text: fullText },
        ]);
        setTypingText("");
      }
    }, 20);
  };

  const handleSend = () => {
    if (!chat.trim() || ws.current.readyState !== WebSocket.OPEN) return;

    setChatHistory((prev) => [...prev, { sender: "user", text: chat }]);
    ws.current.send(JSON.stringify({ chat, model }));
    setChat("");
    setLoading(true);
  };
  
  const isInputDisabled = loading || isTyping;

  return (
    <div className="app-container">
      {/* Sidebar for Desktop View */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>A.R.C.A.S.</h1>
          <h2>Autonomous Real-time Chat & Analysis System</h2>
        </div>
        <div className="controls">
          <h3>Model</h3>
          <select value={model} onChange={(e) => setModel(e.target.value)} disabled={isInputDisabled}>
            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
            <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            <option value="gemini-1.5-pro-latest">Gemini 1.5 Pro</option>
          </select>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Header for Mobile View */}
        <header className="header">
          <h1>A.R.C.A.S.</h1>
          <h2>Autonomous Real-time Chat & Analysis System</h2>
        </header>
      
        <div className="chat-box">
          {chatHistory.map((msg, index) => (
            <ChatMessage key={index} msg={msg} />
          ))}
          <TypingIndicator isLoading={loading} isTyping={isTyping} typingText={typingText} />
          <div ref={endRef} />
        </div>

        <ChatInput 
          chat={chat}
          setChat={setChat}
          handleSend={handleSend}
          disabled={isInputDisabled}
        />
      </main>
    </div>
  );
}

export default App;
