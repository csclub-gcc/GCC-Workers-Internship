// routes/timesheet.routes.js
//
// PURPOSE: Mount timesheet CRUD endpoints on /api/timesheets.
//   All routes require the auth middleware.
//
// Endpoints to wire up:
//   GET    /api/timesheets              → timesheetController.getAll      (supervisor/admin sees all; intern sees own)
//   GET    /api/timesheets/:id          → timesheetController.getById
//   POST   /api/timesheets              → timesheetController.create      (intern creates a draft)
//   PUT    /api/timesheets/:id          → timesheetController.update      (intern edits draft)
//   PATCH  /api/timesheets/:id/submit   → timesheetController.submit      (intern submits for review)
//   PATCH  /api/timesheets/:id/approve  → timesheetController.approve     (supervisor/admin only)
//   PATCH  /api/timesheets/:id/reject   → timesheetController.reject      (supervisor/admin only, include reason)
//   DELETE /api/timesheets/:id          → timesheetController.remove      (draft only, own timesheet or admin)
//
// Tip: once a timesheet is "submitted", block further edits via a guard in the
//   update controller — only allow changes if status === "draft".
