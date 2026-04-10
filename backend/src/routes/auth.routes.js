// routes/auth.routes.js
//
// PURPOSE: Mount authentication endpoints on /api/auth.
//   All routes here are PUBLIC (no auth middleware).
//
// Endpoints to wire up:
//   POST   /api/auth/register   → authController.register
//   POST   /api/auth/login      → authController.login
//   POST   /api/auth/logout     → authController.logout   (if using server-side sessions/token blocklist)
//   GET    /api/auth/me         → authController.me       (requires auth middleware — returns current user)
//
// Tip: import the auth middleware here and apply it only to /me, not to
//   login/register — those routes must be reachable before a token exists.
