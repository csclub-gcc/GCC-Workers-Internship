// controllers/company.controller.js
//
// PURPOSE: Handle HTTP layer for company/employer CRUD.
//
// Functions to implement:
//
//   getAll(req, res, next)
//     - Accept optional ?name= search param.
//     - Call companyService.getAll(filters) and respond 200.
//
//   getById(req, res, next)
//     - Parse ObjectId from req.params.id.
//     - Optionally accept ?includeInterns=true to trigger a $lookup aggregation
//       that populates current interns and their latest timesheet status.
//     - Respond 200 or 404.
//
//   create(req, res, next)
//     - Admin only (enforced in route via requireRole).
//     - Call companyService.create(data).
//     - Respond 201 with created doc.
//
//   update(req, res, next)
//     - Admin only.
//     - Call companyService.update(id, fields).
//     - Respond 200 with updated doc.
//
//   remove(req, res, next)
//     - Admin only.
//     - Guard: reject if any users still have companyId pointing here —
//       don't orphan interns silently.
//     - Respond 204 on success.
