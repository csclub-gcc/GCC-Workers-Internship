# GCC Workers Timesheet

A simple internal timesheet app for Glendale Community College student workers.

## What It Does

Student workers log their hours at the end of each week. No clock-in/clock-out — just enter your hours, submit, and you're done.

## How It Works

1. **Login** — Senior staff or student logs in
2. **Student Profile** — Each student has their pay grade, place of employment, and weekly hours on file
3. **Log Hours** — At the end of the week, enter hours worked per day (or a start/end time with break deducted)
4. **Review & Submit** — Confirm total hours and submit. Pay period runs from the 20th of one month to the 21st of the next.

## User Roles

- **Senior Person** — Creates and manages student employee accounts, confirms submissions, tracks number of students per department
- **Student** — Logs weekly hours and submits timesheet

## Notes

- Internal use only (not public-facing)
- Connects to Google Drive for recordkeeping
- Pay period: month 20th → following month 21st
- Example shift: 6:00 AM – 2:00 PM with a 2h break (e.g. 11 AM – 1 PM) = 6 hours worked
