import { database } from '@/db'
import { AttendanceRecord } from '@/db/models/AttendanceRecord'
import { Subject } from '@/db/models/Subject'
import { withObservables } from '@nozbe/watermelondb/react'
import React from 'react'
import { Card, IconButton, useTheme } from 'react-native-paper'
import Animated, { FadeInUp, FadeOutDown, LinearTransition } from 'react-native-reanimated'
import Toast from 'react-native-simple-toast'

const RecordItem = ({
  record,
  subject
}: {
  record: AttendanceRecord,
  subject: Subject
}) => {
  const theme = useTheme()
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
    <Animated.View
      layout={LinearTransition}
      entering={FadeInUp}
      exiting={FadeOutDown}
    >
      <Card>
        <Card.Title
          title={subject.name}
          subtitle={`${subject.code} - (${subject.credits} credits)`}
        />
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
      </Card>
    </Animated.View>
  )
}

const enhancedRecordItem = withObservables(["record"], ({ record }: {
  record: AttendanceRecord
}) => {
  return {
    record: record,
    subject: record.subject
  }
})

const EnhancedRecordItem = enhancedRecordItem(RecordItem)

export default EnhancedRecordItem