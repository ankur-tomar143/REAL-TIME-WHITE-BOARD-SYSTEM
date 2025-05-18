import express from "express";
import http from "http";
import { Server } from "socket.io";

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from 'public' folder
app.use(express.static("public"));

// Handle new socket connections
io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);

    // Handle drawing event
    socket.on("draw", (data) => {
        socket.broadcast.emit("draw", data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected: " + socket.id);
    });
});

// Start server on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
