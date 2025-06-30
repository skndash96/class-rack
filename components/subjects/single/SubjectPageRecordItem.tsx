import { database } from '@/db'
import { AttendanceRecord } from '@/db/models/AttendanceRecord'
import { Subject } from '@/db/models/Subject'
import React from 'react'
import { Button, Card, Icon, IconButton, useTheme } from 'react-native-paper'
import Toast from 'react-native-simple-toast'

export default function SubjectPageRecordItem({
  record,
  subject
}: {
  subject: Subject,
  record: AttendanceRecord,
}) {
  const theme = useTheme()
  const [editMode, setEditMode] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleUpdateStatus = async (status: number) => {
    const toStatus = record.status === status ? undefined : status

    setLoading(true)

    try {
      await database.write(async () => {
        await record.update(r => {
          r.status = toStatus
        })
      })
    } catch (error) {
      console.error("Failed to update record status:", error)
      Toast.show("Failed to update record status. Please try again.", Toast.SHORT)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card style={{ marginBottom: 8 }}>
      <Card.Title
        title={subject.name}
        subtitle={`Status: ${record.status === 1 ? 'Present' : record.status === 0 ? 'Absent' : record.status === 2 ? 'Cancelled' : 'Not Marked'}`}
        left={() => (
          <Icon
            source={record.status === 1 ? 'check-circle' : record.status === 0 ? 'close-circle' : record.status === 2 ? 'cancel' : 'eye-off'}
            size={24}
            color={record.status === 1 ? theme.colors.primary : record.status === 0 ? theme.colors.error : record.status === 2 ? 'rgba(232, 150, 43, 0.8)' : 'rgba(34, 203, 206, 0.7)'}
          />
        )}
        right={() => (
          <Button onPress={() => setEditMode(b => !b)} icon={editMode ? 'check' : 'pencil'}>
            {editMode ? 'Done' : 'Edit'}
          </Button>
        )}
      />

      {editMode && (
        <Card.Actions>
          <IconButton
            disabled={loading}
            icon="eye-off-outline"
            mode="contained-tonal"
            containerColor={record.status === 2 ? "rgba(255,156,38,0.4)" : undefined}
            iconColor={record.status === 2 ? theme.colors.onSurface : undefined}
            onPress={() => handleUpdateStatus(2)}
          />
          <IconButton
            disabled={loading}
            icon="close"
            mode="contained-tonal"
            containerColor={record.status === 0 ? "rgba(255,38,38,0.4)" : undefined}
            iconColor={record.status === 1 ? theme.colors.onSurface : undefined}
            onPress={() => handleUpdateStatus(0)}
          />
          <IconButton
            disabled={loading}
            icon="check"
            mode="contained-tonal"
            containerColor={record.status === 1 ? "rgba(38,255,38,0.3)" : undefined}
            iconColor={record.status === 0 ? theme.colors.onSurface : undefined}
            onPress={() => handleUpdateStatus(1)}
          />
        </Card.Actions>
      )}
    </Card>
  )
}