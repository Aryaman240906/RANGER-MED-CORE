const authService = require('../services/auth.service');
const asyncHandler = require('../middleware/async');
const AppError = require('../utils/AppError');

// Send token + user info
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  });
};

// @desc Register user
// @route POST /api/auth/register
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return next(new AppError('Name, email & password are required', 400));
  }

  if (password.length < 6) {
    return next(new AppError('Password must be at least 6 characters', 400));
  }

  // Security: prevent users from registering as admin directly
  const safeRole = role === 'admin' ? 'ranger' : role;

  const user = await authService.createUser({
    name,
    email,
    password,
    role: safeRole
  });

  sendTokenResponse(user, 201, res);
});

// @desc Login user
// @route POST /api/auth/login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide an email and password', 400));
  }

  const user = await authService.findUserByEmail(email, true);
  if (!user) return next(new AppError('Invalid credentials', 401));

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return next(new AppError('Invalid credentials', 401));

  sendTokenResponse(user, 200, res);
});

// @desc Get logged-in user
// @route GET /api/auth/me
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await authService.findUserById(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  });
});
