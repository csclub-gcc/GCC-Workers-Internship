// models/User.js
//
// PURPOSE: Define the shape/schema for a User document in MongoDB.
//   Since we use the native driver (no Mongoose), this file exports plain
//   JS objects / validation helpers rather than a Model class.
//
// Suggested document shape:
//   {
//     _id:          ObjectId  (auto-generated),
//     firstName:    String,
//     lastName:     String,
//     email:        String    (unique index — create in db setup),
//     passwordHash: String    (bcrypt hash — NEVER store plaintext),
//     role:         String    ("intern" | "supervisor" | "admin"),
//     companyId:    ObjectId  (ref → companies collection, null if unassigned),
//     startDate:    Date,
//     endDate:      Date      (null while active),
//     createdAt:    Date,
//     updatedAt:    Date,
//   }
//
// Tip: export a `sanitizeUser(doc)` function that strips passwordHash before
//   sending user data to the client — call it in every controller response.
// Tip: enforce unique email at the MongoDB level with a sparse unique index,
//   not just in application logic.
//
// Packages to install: bcryptjs  (for hashing in auth.service, not here)