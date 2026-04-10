// controllers/auth.controller.js
//
// PURPOSE: Handle HTTP layer for auth — parse req, call auth.service, send res.
//   Controllers should NOT contain business logic; delegate everything to the service.
//
// Functions to implement:
//
//   register(req, res, next)
//     - Validate required fields (firstName, lastName, email, password).
//     - Call authService.register(data) — service handles hashing + DB insert.
//     - Respond 201 with { token, user: sanitizeUser(doc) }.
//     - Forward errors to next(err) — never catch and swallow.
//
//   login(req, res, next)
//     - Validate email + password present.
//     - Call authService.login(email, password).
//     - Respond 200 with { token, user: sanitizeUser(doc) }.
//     - If service throws "InvalidCredentials", respond 401 (or let errorHandler map it).
//
//   logout(req, res, next)
//     - If using stateless JWT, this can just respond 200 (client deletes the token).
//     - If using a token blocklist, call authService.revokeToken(token).
//
//   me(req, res, next)
//     - req.user is already populated by auth middleware.
//     - Fetch fresh user doc from DB via userService.getById(req.user._id).
//     - Respond with sanitizeUser(doc).