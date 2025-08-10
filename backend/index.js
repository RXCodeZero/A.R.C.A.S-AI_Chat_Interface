const express = require("express");
const http = require("http");
const axios = require("axios");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();
app.use(express.json());
app.use(cors());

app.post('/chat', async (req, res) => {
    const { chat, model } = req.body;
    try {
    const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=<your-api-key>`,
        {
        contents: [
            {
            parts: [{ text: chat }]
            }
        ]
        },
        {
        headers: {
            "x-goog-api-key": "<your-api-key>"
        }
        }
    );
    const ans = response.data.candidates[0].content.parts[0].text;
    res.json({ ans });
    } catch (err) {
    console.error("POST /chat error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
    }
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    ws.on("message", async (data) => {
    try {
        const { chat, model } = JSON.parse(data);
        const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=<your-api-key>`,
        {
            contents: [
            {
                parts: [{ text: chat }]
            }
            ]
        },
        {
            headers: {
                "x-goog-api-key": "<your-api-key>"
            }
        }
        );

        const ans = response.data.candidates[0].content.parts[0].text;
        ws.send(JSON.stringify({ type: "response", ans }));
    } catch (err) {
        console.error("WebSocket error:", err.message);
        ws.send(JSON.stringify({ type: "error", message: "Failed to fetch response" }));
    }
    });

    ws.on("close", () => {
        console.log("WebSocket client disconnected");
    });
});

server.listen(3000, () => {
    console.log("Server (HTTP + WebSocket) running on port 3000");
});
