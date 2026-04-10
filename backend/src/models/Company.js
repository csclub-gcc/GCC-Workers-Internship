// models/Company.js
//
// PURPOSE: Define the shape/schema for a Company (employer) document in MongoDB.
//
// Suggested document shape:
//   {
//     _id:         ObjectId,
//     name:        String    (unique),
//     industry:    String,
//     address:     {
//       street:    String,
//       city:      String,
//       state:     String,
//       zip:       String,
//     },
//     contactName:  String,
//     contactEmail: String,
//     supervisors:  [ObjectId]  (user _ids with role "supervisor" at this company),
//     createdAt:    Date,
//     updatedAt:    Date,
//   }
//
// Tip: when fetching a company, you can $lookup users where companyId matches
//   to get the full list of current interns without storing a redundant array.
