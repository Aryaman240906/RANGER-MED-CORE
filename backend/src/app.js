const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const predictionRoutes = require('./routes/prediction.routes');
const { connectDB } = require('./config/db');

const { PORT, NODE_ENV, CLIENT_ORIGIN } = require('./config/env');
const AppError = require('./utils/AppError');
const errorHandler = require('./middleware/error.middleware');

// ROUTES
const authRoutes = require('./routes/auth.routes');

// --------------------------------------------------
// 1) CONNECT DATABASE BEFORE EVERYTHING ELSE
// --------------------------------------------------
connectDB()
  .then(() => console.log("🔥 MongoDB Atlas Connection Ready"))
  .catch((err) => {
    console.error("❌ MongoDB Initial Connection Failed");
    process.exit(1);
  });

const app = express();

// --------------------------------------------------
// 2) GLOBAL SECURITY MIDDLEWARE
// --------------------------------------------------
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '15kb' })); // safer limit
app.use(express.urlencoded({ extended: false }));
app.use('/api/prediction', predictionRoutes);
// Sanitizers
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiter
const limiter = rateLimit({
  max: 120,
  windowMs: 60 * 1000,
  message: 'Too many requests. Slow down.',
});
app.use('/api', limiter);

// CORS
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
    methods: "GET,POST,PUT,DELETE,PATCH",
  })
);

// --------------------------------------------------
// 3) API ROUTES
// --------------------------------------------------
app.use('/api/auth', authRoutes);

// HEALTH CHECK
app.get('/', (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Ranger Med-Core API",
    environment: NODE_ENV,
  });
});

// --------------------------------------------------
// 4) HANDLE 404 ROUTES
// --------------------------------------------------
app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// --------------------------------------------------
// 5) GLOBAL ERROR HANDLER
// --------------------------------------------------
app.use(errorHandler);

// --------------------------------------------------
// 6) START SERVER + SOCKET PLACEHOLDER (Phase 6)
// --------------------------------------------------
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend running in ${NODE_ENV} mode on port ${PORT}`);
});

// --------------------------------------------------
// 7) SAFETY: HANDLE UNHANDLED PROMISE REJECTIONS
// --------------------------------------------------
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION 💥', err);
  server.close(() => process.exit(1));
});

// --------------------------------------------------
// 8) SAFETY: HANDLE SIGTERM (HEROKU/VERCEL)
// --------------------------------------------------
process.on('SIGTERM', () => {
  console.log("🛑 SIGTERM RECEIVED. Gracefully shutting down.");
  server.close();
});

// --------------------------------------------------
// 9) EXPORT server FOR SOCKET.IO IN PHASE 6
// --------------------------------------------------
module.exports = server;
