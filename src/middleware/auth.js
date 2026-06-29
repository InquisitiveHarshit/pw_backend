const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ============================================================
// DEV MODE: Mock user is injected for ALL requests.
// Auth middleware functions are built but NOT applied to routes.
// TODO: enable auth before production
// ============================================================

/**
 * DEV: Injects a mock user into every request so you can develop
 * and test all routes without logging in.
 * Switch role between 'user' and 'admin' to test both roles.
 */
const devMockUser = (req, res, next) => {
  req.user = {
    _id: "mock-user-id-123",
    name: "Dev User",
    email: "dev@test.com",
    role: "admin", // ← switch to 'user' to test user-only routes
  };
  next();
};

/**
 * PRODUCTION: Verifies JWT token from Authorization header.
 * Usage: router.get('/route', requireLogin, controller)
 * TODO: enable auth before production — replace devMockUser with requireLogin
 */
const requireLogin = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Token invalid.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired.",
    });
  }
};

/**
 * PRODUCTION: Checks that req.user.role === 'admin'
 * Must be used AFTER requireLogin.
 * TODO: enable auth before production
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }
  next();
};

module.exports = { devMockUser, requireLogin, requireAdmin };
