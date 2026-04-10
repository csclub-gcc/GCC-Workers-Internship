// controllers/user.controller.js
//
// PURPOSE: Handle HTTP layer for user/intern CRUD operations.
//
// Functions to implement:
//
//   getAll(req, res, next)
//     - Accept optional query params: ?companyId=, ?role=, ?page=, ?limit=
//     - Call userService.getAll(filters) and respond 200 with the list.
//
//   getById(req, res, next)
//     - Parse ObjectId from req.params.id — catch invalid IDs and return 400.
//     - Call userService.getById(id) — service returns null if not found.
//     - Respond 200 with sanitizeUser(doc) or 404 if null.
//
//   update(req, res, next)
//     - Strip any fields the user shouldn't self-edit (role, passwordHash).
//     - Call userService.update(id, fields).
//     - Respond 200 with updated sanitizeUser(doc).
//
//   remove(req, res, next)
//     - Call userService.remove(id).
//     - Respond 204 No Content on success.
//
// Tip: when parsing MongoDB ObjectIds from req.params, wrap in try/catch —
//   `new ObjectId('bad-string')` throws and should be a 400, not a 500.