// services/auth.service.js
//
// PURPOSE: Business logic for authentication — hashing, token generation, validation.
//   This is the only file that should touch bcrypt and jsonwebtoken.
//
// Functions to implement:
//
//   register({ firstName, lastName, email, password, role })
//     - Check if a user with that email already exists — throw if so.
//     - Hash the password: bcrypt.hash(password, SALT_ROUNDS)  ← use 12 rounds.
//     - Insert new user doc into the "users" collection.
//     - Return { token, user } — call generateToken(user) for the token.
//
//   login(email, password)
//     - Find user by email (case-insensitive index or .toLowerCase() before query).
//     - If not found or bcrypt.compare returns false → throw an "InvalidCredentials" error.
//       IMPORTANT: use the same generic message for both cases — don't leak whether
//       the email exists.
//     - Return { token, user }.
//
//   generateToken(user)
//     - Sign a JWT with payload { _id, email, role }.
//     - Use JWT_SECRET and JWT_EXPIRES_IN from process.env.
//     - Return the token string.
//
//   revokeToken(token)  [optional — only needed if building a blocklist]
//     - Store the token JTI (JWT ID) in a "revokedTokens" collection with a TTL index
//       matching the token's expiry so MongoDB auto-cleans expired entries.
//
// Packages to install: bcryptjs, jsonwebtoken
