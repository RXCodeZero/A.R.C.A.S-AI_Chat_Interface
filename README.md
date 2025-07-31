# A.R.C.A.S. - Autonomous Real-time Chat & Analysis System

## Overview

**A.R.C.A.S.** is a real-time chat application built with **React**, **Express**, and **WebSocket** that leverages **Google's Gemini API** for natural language responses. It supports both HTTP and WebSocket-based interactions, with smooth frontend animations mimicking real-time typing behavior for a more engaging experience.

---

## Features

* Real-time WebSocket chat with the Gemini API
* Model selection from multiple Gemini versions
* Typing animation effect for bot responses
* Responsive and user-friendly UI
* Error handling for failed API responses

---

## Technologies Used

### Frontend

* React
* JavaScript (ES6+)
* CSS

### Backend

* Node.js
* Express
* Axios
* WebSocket (`ws`)
* CORS

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

* Node.js v16 or later
* npm or yarn

### Clone the Repository

```bash
https://github.com/yourusername/arcas-chat.git
cd arcas-chat
```

---

## Backend Setup

### 1. Navigate to backend folder (if separated)

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
node index.js
```

Server will start on `http://localhost:3000` and WebSocket will also be available on the same port.

> Note: The backend requires a valid **Google AI Studio API key**. The key is hardcoded in this version. For production use, store it in environment variables.

---

## Frontend Setup

### 1. Navigate to frontend folder (if separated)

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the frontend

```bash
npm start
```

The app will be accessible at `http://localhost:3000` or `http://localhost:5173` (depending on config).

---

## Project Structure

```
arcas-chat/
├── backend/
│   ├── index.js       # Express + WebSocket server
│
├── frontend/
│   ├── App.jsx        # Main React component
│   ├── index.css      # Stylesheet
│   └── ...            # Other React configs

```

---

## How It Works

1. User inputs message and selects model.
2. Message is sent via WebSocket to the Node.js backend.
3. Backend makes a request to Gemini API.
4. Response is received and sent back to the frontend over WebSocket.
5. Typing animation is triggered to simulate real-time response.

---

## Supported Models

* gemini-1.5-pro-latest
* gemini-1.5-flash
* gemini-2.0-flash
* gemini-2.5-flash

You can modify or expand this list based on available APIs.

---

## To-Do / Future Improvements

* Add authentication for users
* Store chat history in a database
* Add error boundary components in React
* Improve mobile responsiveness
* Environment variable setup for API key security

---

## Acknowledgements

* [Google AI Studio](https://makersuite.google.com/) - for providing the Gemini API
* [WebSocket](https://www.npmjs.com/package/ws) - simple WebSocket server integration

---

## Contact

For queries or issues, feel free to open an issue or contact the maintainer.

---

**Enjoy building with A.R.C.A.S.!**
