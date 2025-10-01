const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./database/database');
const app = express();
const PORT = process.env.PORT || 5000;


// Trust proxy for rate limiting (needed on Railway, Heroku, etc.)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:3000',              // Local React dev
  'https://westbury.netlify.app',       // Deployed frontend
  'https://westburyhomes.com' // Future custom domain
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // limit each IP to 100 requests per window
  standardHeaders: true,    // return rate limit info in headers
  legacyHeaders: false,     // disable X-RateLimit-* headers
});

app.use(limiter);

// ----------------- Middleware -----------------
app.use(morgan("combined")); // Request logging
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files (uploads folder)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ----------------- API Routes -----------------
app.use("/api/properties", require("./routes/properties"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/staff", require("./routes/staff"));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Westbury Homes API is running",
  });
});


// ----------------- Error Handling -----------------
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Test DB connection and start server
testConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Westbury Homes server running on port ${PORT}`);
      console.log(`📧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database connected successfully`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  });