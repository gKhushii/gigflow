const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoute");
const gigRoutes = require("./routes/gigRoute");
const bidRoutes = require("./routes/bidRoute");

const app = express();

app.use(cors({ origin:require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://gigflow-frontend-39tt.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// store connected users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("User registered:", userId);
  });

  socket.on("disconnect", () => {
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
        break;
      }
    }
    console.log("Socket disconnected:", socket.id);
  });
});

global.io = io;
global.onlineUsers = onlineUsers;

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server running on port", PORT));
, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);


app.get("/", (req, res) => {
  res.send("GigFlow API running");
});

module.exports = app;
