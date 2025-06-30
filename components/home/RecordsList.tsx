import { database } from '@/db'
import { AttendanceRecord } from '@/db/models/AttendanceRecord'
import { Q } from '@nozbe/watermelondb'
import { withObservables } from '@nozbe/watermelondb/react'
import { FlatList, View } from 'react-native'
import { Text } from 'react-native-paper'
import AddRecordButton from './AddRecordButton'
import EnhancedRecordItem from './RecordItem'

const RecordsList = ({
  dateString,
  records
}: {
  dateString: string | number, // YYYY-MM-DD or timestamp
  records: AttendanceRecord[]
}) => {  
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

      <AddRecordButton
        initialDate={new Date(dateString)}
      />
    </View>
  )
}

const enhanceRecordsList = withObservables([], ({
  dateString
}: {
  dateString?: string | number // YYYY-MM-DD or timestamp
}) => {
  const date = new Date(dateString!) // local timezone
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