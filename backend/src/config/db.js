// config/db.js
//
// PURPOSE: Central MongoDB connection module.
//   - Export a function (e.g. connectDb) that creates a MongoClient and returns
//     both the client and the db instance.
//   - The index.js currently owns this logic inline — migrate it here so every
//     service can import `getDb()` instead of passing `mongoDb` around as a
//     global or through every route.
//   - Keep a module-level `db` variable so getDb() always returns the live
//     instance without reconnecting on every call.
//   - Tip: export a separate `getDb()` helper that throws a clear error if called
//     before connectDb() finishes — avoids silent "db is null" bugs.
//
// Packages already installed: mongodb
