import { database } from '@/db'
import { AttendanceRecord } from '@/db/models/AttendanceRecord'
import { Preference } from '@/db/models/Preference'
import { Timetable } from '@/db/models/Timetable'
import { Q } from '@nozbe/watermelondb'
import { withObservables } from '@nozbe/watermelondb/react'
import React, { useEffect } from 'react'
import { FlatList, View } from 'react-native'
import { Text } from 'react-native-paper'
import Toast from 'react-native-simple-toast'
import EnhancedRecordItem from './RecordItem'

const RecordsList = ({
  records
}: {
  records: AttendanceRecord[]
}) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startOfDay = today.getTime()

  useEffect(() => {
    database.get<Preference>('preferences').query(
      Q.where('name', 'last_date_attendance_recorded')
    ).fetch()
      .then(async (prefs) => {
        const pref = prefs[0]
        let lastDate = parseInt(pref?.value || "-1", 10)

        if (lastDate && !isNaN(lastDate) && lastDate >= startOfDay) return

        const batchWriter = [] as any[]

        // TODO: serious case if device's time zone changes

        if (new Date(lastDate).setHours(0, 0, 0, 0) === lastDate) {
          const diff = startOfDay - lastDate

          if (diff >= 7 * 24 * 60 * 60 * 1000) {
            Toast.show('More than a week since last attendance!!', Toast.SHORT)
            return
          }

          while (lastDate < startOfDay) {
            lastDate += 24 * 60 * 60 * 1000

            const date = new Date(lastDate)
            const dayOfWeek = date.getDay()

            const timetables = await database.get<Timetable>('timetable').query(
              Q.where('day_of_week', dayOfWeek)
            ).fetch()

            batchWriter.push(...timetables.map(timetable => {
              return database.get<AttendanceRecord>('attendance_records').prepareCreate(record => {
                record._setRaw("date", lastDate)
                record.subjectId = timetable.subjectId
              })
            }))
          }
        }

        batchWriter.push(
          pref ? (
            pref.prepareUpdate(p => {
              p.value = startOfDay.toString()
            })
          ) : (
            database.get<Preference>('preferences').prepareCreate(p => {
              p.name = 'last_date_attendance_recorded'
              p.value = startOfDay.toString()
            })
          )
        )

        await database.write(async () => {
          await database.batch(...batchWriter)
        })

        console.log('Created attendance records for today', batchWriter.length)
      })
      .catch(err => {
        console.error('Error fetching preferences or creating records:', err)
        Toast.show('Something went wrong while creating today\'s records', Toast.SHORT)
      })
  }, [])

  return (
    <View>
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 100,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EnhancedRecordItem record={item} />
        )}
        ListEmptyComponent={() => (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text>No Classes Today 🎉</Text>
          </View>
        )}
      />
    </View>
  )
}

const enhanceRecordsList = withObservables([], () => {
  const date = new Date() // local timezone
  date.setHours(0, 0, 0, 0) // set to start of the day

  const startOfDay = date.getTime()

  return {
    records: database.get<AttendanceRecord>('attendance_records').query(
      Q.where('date', Q.eq(startOfDay))
    ).observe(),
  }
})

const EnhancedRecordsList = enhanceRecordsList(RecordsList)

export default EnhancedRecordsList