require("dotenv").config();

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

//
// ENV CHECK
//
const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
  "ADMIN_PASSWORD_HASH"
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing ${key}`);
  }
});

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;

//
// SECURITY
//
app.use(helmet());
app.use(mongoSanitize());
app.use(express.json({ limit: "1mb" }));

//
// CORS
//
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.1.16:5173",
  "https://streaming-app.vercel.app",
  "http://doohd.vip",
  "https://doohd.vip",
  "http://www.doohd.vip",
  "https://www.doohd.vip"
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const allowed =
        allowedOrigins.includes(origin) ||
        (typeof origin === "string" &&
          origin.endsWith(".vercel.app"));

      if (allowed) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

//
// RATE LIMIT
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
// STATIC
//
app.use("/images", express.static("public/images"));

//
// ROUTES
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
// GLOBAL ERROR HANDLER
//
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    message: err.message || "Internal server error"
  });
});

//
// START SERVER
//
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await createBackup();
    console.log("Initial backup completed");

    setInterval(async () => {
      await createBackup();
      console.log("Auto backup completed");
    }, 1000 * 60 * 60);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

startServer();

