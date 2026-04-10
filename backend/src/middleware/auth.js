// middleware/auth.js
//
// PURPOSE: JWT authentication middleware.
//   - Read the Authorization header (format: "Bearer <token>").
//   - Verify the token with jsonwebtoken using JWT_SECRET from .env.
//   - If valid, attach the decoded payload to req.user and call next().
//   - If missing or invalid, return 401 Unauthorized immediately.
//   - Tip: also expose a `requireRole(role)` higher-order middleware for
//     role-based access (e.g. admin vs intern vs supervisor) — call it after
//     this middleware in the route chain.
//
// Packages to install: jsonwebtoken
// Add to .env: JWT_SECRET, JWT_EXPIRES_IN (e.g. "7d")
