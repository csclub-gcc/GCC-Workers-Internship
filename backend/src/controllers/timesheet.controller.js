// controllers/timesheet.controller.js
//
// PURPOSE: Handle HTTP layer for timesheet CRUD and status transitions.
//
// Functions to implement:
//
//   getAll(req, res, next)
//     - Interns: filter by req.user._id automatically so they only see their own.
//     - Supervisors/admins: accept optional ?userId=, ?companyId=, ?status=, ?weekStart=
//     - Call timesheetService.getAll(filters) and respond 200.
//
//   getById(req, res, next)
//     - Parse ObjectId from req.params.id.
//     - Ensure the requesting user owns it OR has supervisor/admin role.
//     - Respond 200 with doc or 404.
//
//   create(req, res, next)
//     - Force userId = req.user._id (interns can only create for themselves).
//     - Call timesheetService.create(data) — service validates no duplicate weekStart.
//     - Respond 201 with created doc.
//
//   update(req, res, next)
//     - Only allowed if status === "draft".
//     - Call timesheetService.update(id, fields) — service recomputes totalHours.
//     - Respond 200 with updated doc.
//
//   submit(req, res, next)
//     - Transition status draft → submitted.
//     - Call timesheetService.updateStatus(id, "submitted").
//     - Respond 200 with updated doc.
//
//   approve(req, res, next)
//     - Supervisor/admin only. Transition submitted → approved.
//     - Set reviewedBy = req.user._id, reviewedAt = now.
//     - Respond 200 with updated doc.
//
//   reject(req, res, next)
//     - Supervisor/admin only. Transition submitted → rejected.
//     - Accept req.body.reason and store it on the doc.
//     - Respond 200 with updated doc.
//
//   remove(req, res, next)
//     - Only allowed if status === "draft" and user owns it (or admin).
//     - Respond 204 on success.
