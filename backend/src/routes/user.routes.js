// routes/user.routes.js
//
// PURPOSE: Mount user/intern management endpoints on /api/users.
//   All routes here require the auth middleware.
//
// Endpoints to wire up:
//   GET    /api/users            → userController.getAll      (admin/supervisor only)
//   GET    /api/users/:id        → userController.getById     (own profile or admin)
//   PUT    /api/users/:id        → userController.update      (own profile or admin)
//   DELETE /api/users/:id        → userController.remove      (admin only)
//   GET    /api/users/:id/timesheets → timesheetController.getByUser  (convenience route)
//
// Tip: use requireRole('admin') from auth middleware on destructive operations.
// Tip: a user should always be able to GET/PUT their own :id — check req.user._id === params.id
//   before falling back to an admin role check.
