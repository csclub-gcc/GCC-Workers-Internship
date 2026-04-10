// routes/company.routes.js
//
// PURPOSE: Mount company/employer management endpoints on /api/companies.
//   All routes require the auth middleware.
//
// Endpoints to wire up:
//   GET    /api/companies           → companyController.getAll     (any authenticated user)
//   GET    /api/companies/:id       → companyController.getById    (includes intern list via $lookup)
//   POST   /api/companies           → companyController.create     (admin only)
//   PUT    /api/companies/:id       → companyController.update     (admin only)
//   DELETE /api/companies/:id       → companyController.remove     (admin only)
//
// Tip: GET /api/companies/:id is useful for a supervisor's dashboard —
//   populate it with interns and their current timesheet status via aggregation.
