require("dotenv").config();

if (!process.env.MONGO_URI) {
  throw new Error("Missing MONGO_URI");
}
if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET");
}
if (!process.env.ADMIN_PASSWORD_HASH) {
  throw new Error("Missing ADMIN_PASSWORD_HASH");
}

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");

const createBackup = require("./utils/autoBackup");

const statsRoutes = require("./routes/stats");
const restoreRoutes = require("./routes/restore");
const movieRoutes = require("./routes/movies");
const bannerRoutes = require("./routes/banners");
const adminRoutes = require("./routes/admin");
const articleRoutes = require("./routes/articleRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

//
// MongoDB
//
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"))
  .catch(err => console.error("Mongo error:", err));

//
// Security
//
app.use(helmet());
app.use(mongoSanitize());

//
// CORS
//
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.1.16:5173",
  "https://streaming-app.vercel.app"
];

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({
  limit: "1mb"
}));

//
// Rate Limit
//
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts. Please try again later."
  }
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests"
  }
});

const adminActionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many admin actions"
  }
});

app.use("/api", apiLimiter);

//
// Static
//
app.use(
  "/images",
  express.static("public/images")
);

//
// Routes
//
app.use("/api/stats", statsRoutes);

app.use("/api/admin/login", loginLimiter);
app.use("/api/admin", adminRoutes);

app.use("/api/movies", movieRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/articles", articleRoutes);

app.use(
  "/api/restore",
  adminActionLimiter,
  restoreRoutes
);

//
// Auto Backup ทุก 1 ชั่วโมง
//
setInterval(async () => {
  await createBackup();
  console.log("Auto backup completed");
}, 1000 * 60 * 60);

//
// Start Server
//
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // backup ครั้งแรกทันที
  await createBackup();
  console.log("Initial backup completed");
});