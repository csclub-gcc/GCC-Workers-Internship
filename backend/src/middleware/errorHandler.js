// middleware/errorHandler.js
//
// PURPOSE: Global Express error-handling middleware (4-argument signature).
//   - Catches any error passed via next(err) from routes/controllers.
//   - Normalize the response shape: { success: false, message, ...(stack in dev) }
//   - Map known error types to HTTP status codes:
//       ValidationError  → 400
//       Unauthorized     → 401
//       NotFound         → 404
//       default          → 500
//   - In production, never leak stack traces to the client.
//   - Register this as the LAST app.use() in index.js so it catches everything.
//
// No extra packages needed.
