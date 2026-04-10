// models/Timesheet.js
//
// PURPOSE: Define the shape/schema for a Timesheet document in MongoDB.
//
// Suggested document shape:
//   {
//     _id:         ObjectId,
//     userId:      ObjectId  (ref → users),
//     companyId:   ObjectId  (ref → companies),
//     weekStart:   Date      (Monday of the work week — ISO, time zeroed to 00:00 UTC),
//     entries:     [         (array of daily entries for the week)
//       {
//         date:        Date,
//         hoursWorked: Number,
//         notes:       String,
//       }
//     ],
//     totalHours:  Number    (sum of entries.hoursWorked — compute before insert/update),
//     status:      String    ("draft" | "submitted" | "approved" | "rejected"),
//     submittedAt: Date,
//     reviewedBy:  ObjectId  (supervisor userId),
//     reviewedAt:  Date,
//     createdAt:   Date,
//     updatedAt:   Date,
//   }
//
// Tip: index on { userId, weekStart } with a unique constraint so a user
//   can't have two timesheets for the same week.
// Tip: totalHours should be recomputed server-side — never trust the client value.
