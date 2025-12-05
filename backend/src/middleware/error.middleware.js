const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  // If the error is AppError (operational), use its status & message
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  // Handle MongoDB bad ObjectId
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    return res.status(400).json({ success: false, message });
  }

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue);
    const message = `Duplicate value for field: ${field}`;
    return res.status(400).json({ success: false, message });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ success: false, message });
  }

  // Log full error in development
  console.error('❌ UNHANDLED ERROR:', err);

  // Fallback 500 response
  return res.status(500).json({
    success: false,
    status: 'error',
    message: 'Something went wrong. Please try again later.',
  });
};

module.exports = errorHandler;
