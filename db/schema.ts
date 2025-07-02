import { appSchema } from '@nozbe/watermelondb'
import { attendanceRecordsTable } from './models/AttendanceRecord'
import { preferencesTable } from './models/Preference'
import { remindersTable } from './models/Reminder'
import { subjectsTable } from './models/Subject'
import { tasksTable } from './models/Task'
import { timetableTable } from './models/Timetable'

export default appSchema({
  version: 1,
  tables: [
    subjectsTable,
    attendanceRecordsTable,
    timetableTable,
    preferencesTable,
    tasksTable,
    remindersTable
  ]
})