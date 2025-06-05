import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import migrations from './migrations'
import { AttendanceRecord } from './models/AttendanceRecord'
import { Subject } from './models/Subject'
import { Timetable } from './models/Timetable'
import schema from './schema'

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  dbName: 'classrack2',
  // (recommended option, should work flawlessly out of the box on iOS. On Android,
  // additional installation steps have to be taken - disable if you run into issues...)
  // jsi: true, /* Platform.OS === 'ios' */
  // (optional, but you should implement this method)
  onSetUpError: error => {
    // Database failed to load -- offer the user to reload the app or log out
  }
})

export const database = new Database({
  adapter,
  modelClasses: [
    Timetable,
    AttendanceRecord,
    Subject
  ],
})