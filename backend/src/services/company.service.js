// services/company.service.js
//
// PURPOSE: Business logic for company/employer CRUD.
//
// Functions to implement:
//
//   getAll({ name })
//     - If name provided, use a case-insensitive regex: { name: { $regex: name, $options: 'i' } }
//     - Return array of company docs.
//
//   getById(id, { includeInterns } = {})
//     - If includeInterns is true, run an aggregation pipeline:
//         $match _id → $lookup users where companyId matches → optionally
//         $lookup timesheets for each intern to get their latest status.
//     - Otherwise just findOne.
//     - Return doc or null.
//
//   create(data)
//     - Validate required fields (name at minimum).
//     - Insert into "companies" collection, return inserted doc.
//
//   update(id, fields)
//     - findOneAndUpdate, set updatedAt, return updated doc.
//
//   remove(id)
//     - Before deleting, check users collection for any { companyId: id } docs.
//     - If any exist, throw an error (or return a list so the controller can
//       respond with a descriptive 409 Conflict).
//     - deleteOne and return result.
