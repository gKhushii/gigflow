const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoute");
const gigRoutes = require("./routes/gigRoute");
const bidRoutes = require("./routes/bidRoute");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);


app.get("/", (req, res) => {
  res.send("GigFlow API running");
});

module.exports = app;
