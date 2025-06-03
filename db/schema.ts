import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'timetable',
      columns: [
        {
          name: 'subject_name',
          type: 'string'
        },
        {
          name: 'day_of_week', // 0 = sunday
          type: 'number',
          isIndexed: true
        },
        {
          name: 'slot_number',
          type: 'number',
          isIndexed: true
        }
      ]
    }),
    tableSchema({
      name: 'attendance_records',
      columns: [
        {
          name: 'subject_id',
          type: 'string',
        },
        {
          name: 'status', // 0 = absent, 1 = present, 2 = leave
          type: 'number',
          isIndexed: true,
          isOptional: true
        },
        {
          name: 'updated_at',
          type: 'number'
        }
      ]
    })
  ]
})