// services/timesheet.service.js
//
// PURPOSE: Business logic for timesheet CRUD and status transitions.
//
// Functions to implement:
//
//   getAll({ userId, companyId, status, weekStart, page, limit })
//     - Build filter from provided params, paginate, return docs.
//
//   getById(id)
//     - Find by _id, return doc or null.
//
//   create({ userId, companyId, weekStart, entries })
//     - Normalize weekStart to the Monday of that week at 00:00 UTC.
//     - Check for an existing doc with same userId + weekStart — throw if duplicate.
//     - Compute totalHours = sum of entries[].hoursWorked.
//     - Insert with status = "draft", createdAt/updatedAt = now.
//     - Return the inserted doc.
//
//   update(id, { entries, ...otherFields })
//     - Recompute totalHours from the new entries array server-side.
//     - findOneAndUpdate with { returnDocument: 'after' }, set updatedAt.
//     - Return updated doc.
//
//   updateStatus(id, status, { reviewedBy, reason } = {})
//     - Validate the status transition is legal:
//         draft → submitted   (by intern)
//         submitted → approved / rejected  (by supervisor/admin)
//     - Set the appropriate date fields (submittedAt, reviewedAt) and reviewedBy.
//     - Return updated doc.
//
// Tip: put status transition rules in a plain object/map so they're easy to
//   update without touching the function logic:
//   const ALLOWED_TRANSITIONS = { draft: ['submitted'], submitted: ['approved','rejected'] }
