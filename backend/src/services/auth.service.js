const User = require('../models/User');
const AppError = require('../utils/AppError');

// Create User with safety guards
exports.createUser = async (userData) => {
  userData.email = userData.email.toLowerCase().trim();

  try {
    const user = await User.create(userData);
    return user;
  } catch (err) {
    // Friendly duplicate email message
    if (err.code === 11000) {
      throw new AppError('Email already registered', 400);
    }
    throw err;
  }
};

// Find user by email
exports.findUserByEmail = async (email, includePassword = false) => {
  email = email.toLowerCase().trim();

  if (includePassword) {
    return await User.findOne({ email }).select('+password');
  }
  return await User.findOne({ email });
};

// Find user by ID
exports.findUserById = async (id) => {
  return await User.findById(id).select('-password');
};
