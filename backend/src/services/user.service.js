// services/user.service.js
//
// PURPOSE: Business logic for user/intern CRUD — all direct DB calls live here.
//
// Functions to implement:
//
//   getAll({ companyId, role, page, limit })
//     - Build a MongoDB filter object from whichever params are provided.
//     - Use skip/limit for pagination.  Default: page=1, limit=20.
//     - Return { users: [...sanitized], total, page, limit }.
//
//   getById(id)
//     - Query users collection by _id (convert string → ObjectId first).
//     - Return the doc or null.
//
//   update(id, fields)
//     - Use findOneAndUpdate with { returnDocument: 'after' }.
//     - Always set updatedAt = new Date().
//     - Return the updated doc.
//
//   remove(id)
//     - deleteOne by _id.
//     - Return the result (or throw if not found).
//
//   existsByEmail(email)
//     - Lightweight check used by auth.service — only fetch _id, not the full doc.
//
// Tip: import getDb() from config/db.js and call getDb().collection('users')
//   at the top of each function — don't store the collection reference at module level
//   or it may be undefined if called before connectDb() finishes.
