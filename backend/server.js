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
const createBackup = require("./utils/autoBackup");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"))
  .catch(err => console.log(err));

app.use(helmet());
app.use(mongoSanitize());

const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.1.16:5173",
  "https://streaming-app.vercel.app",
  // "https://yourdomain.com"
];

app.use(cors({
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
      // เอาออกได้ถ้าไม่ใช้ Postman
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error("Not allowed by CORS")
    );
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "DELETE"
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ]
}));

app.use(express.json({
  limit: "1mb"
}));

const statsRoutes =
  require("./routes/stats");

app.use(
  "/api/stats",
  statsRoutes
);

/* ======================
ROUTES
====================== */
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts. Please try again later.",
  },
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

const restoreRoutes =
  require(
    "./routes/restore"
  );

const movieRoutes = require("./routes/movies");

const bannerRoutes = require("./routes/banners");

const adminRoutes = require("./routes/admin");

const articleRoutes = require("./routes/articleRoutes");


app.use("/api/admin/login",loginLimiter);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/movies",
  movieRoutes
);

app.use(
  "/api/banners",
  bannerRoutes
);

app.use(
  "/images",
  express.static(
    "public/images"
  )
);

app.use(
  "/api/restore",
  adminActionLimiter,
  restoreRoutes
);

app.use(
  "/api/articles",
  articleRoutes
);


const PORT = 5000;

setInterval(async () => {
  await createBackup();
  console.log("Auto backup completed");
}, 1000 * 60 * 60);

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
