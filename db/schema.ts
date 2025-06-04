import { appSchema } from '@nozbe/watermelondb'
import { attendanceRecordsTable } from './models/AttendanceRecord'
import { subjectsTable } from './models/Subject'
import { timetableTable } from './models/Timetable'

export default appSchema({
  version: 1,
  tables: [
    subjectsTable,
    attendanceRecordsTable,
    timetableTable,
  ]
})