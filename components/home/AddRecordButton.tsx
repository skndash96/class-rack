import { database } from '@/db'
import { AttendanceRecord } from '@/db/models/AttendanceRecord'
import { Subject } from '@/db/models/Subject'
import React from 'react'
import { FAB, Portal } from 'react-native-paper'
import Toast from 'react-native-simple-toast'
import AddRecordModal from './AddRecordModal'


export default function AddRecordButton({
  initialDate,
}: {
  initialDate: Date
}) {
  const [visible, setVisible] = React.useState(false)

  const handleAddRecord = async ({
    date,
    subject
  }: { date: Date, subject: Subject }) => {
    date.setHours(0, 0, 0, 0)
    try {
      await database.write(async () => {
        await database.get<AttendanceRecord>('attendance_records').create(record => {
          record.subject.set(subject)
          record.date = date
        })
      })

      Toast.show('Record added successfully', Toast.SHORT)
      setVisible(false)
    } catch (error) {
      console.error('Error adding record:', error)
      Toast.show('Failed to add record', Toast.SHORT)
    }
  }

  return (
    <>
      {visible && (
        <AddRecordModal
          initialDate={initialDate}
          onClose={() => setVisible(false)}
          onSubmit={handleAddRecord}
          title="Add Extra Class"
        />
      )}

      <Portal>
        <FAB
          icon="plus"
          label='Add Class'
          style={{ position: 'absolute', bottom: 108, right: 16 }} // bottom from layout so include the bottom bar height
          mode="flat"
          onPress={() => setVisible(true)}
        />
      </Portal>
    </>
  )
}