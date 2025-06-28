import { database } from '@/db'
import { AttendanceRecord } from '@/db/models/AttendanceRecord'
import { Subject } from '@/db/models/Subject'
import { getAttendancePercentage } from '@/utils/getAttendancePercentage'
import { withObservables } from '@nozbe/watermelondb/react'
import React from 'react'
import { Card, IconButton, Text, useTheme } from 'react-native-paper'
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated'
import Toast from 'react-native-simple-toast'

const RecordItem = ({
  record,
  subject,
  attendanceRecords
}: {
  record: AttendanceRecord,
  subject: Subject,
  attendanceRecords: AttendanceRecord[]
}) => {
  const theme = useTheme()
  const [loading, setLoading] = React.useState(false)
  const attendanceInfo = React.useMemo(() => {
    return getAttendancePercentage(attendanceRecords)
  }, [attendanceRecords])

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
      entering={FadeInDown}
      exiting={FadeOutUp}
    >
      <Card>
        <Card.Title
          title={subject.name}
          subtitle={`${subject.code} (${subject.credits} credits)`}
          left={() => (
            <>
              <Text style={{
                fontSize: 24,
                color: theme.colors.onSecondaryContainer
              }}>
                {attendanceInfo.percentage.split(".")[0]}
              </Text>
              <Text style={{
                fontSize: 12,
                color: theme.colors.onSecondaryContainer
              }}>
                {"." + (attendanceInfo.percentage.split('.')[1] || "00")} %
              </Text>
            </>
          )}
          leftStyle={{
            width: 60,
            height: 60,
            borderRadius: 40,
            backgroundColor: theme.colors.secondaryContainer,
            margin: 8,
            marginLeft: 0,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        />

        <Card.Content>
          <Text style={{
            textAlign: 'right',
            color: {
              GOOD: theme.colors.onSurfaceVariant,
              WARN: theme.colors.onSurface,
              BAD: theme.colors.error
            }[attendanceInfo.commentColor],
          }}>
            {attendanceInfo.comment}
          </Text>
        </Card.Content>

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

const withRecord = withObservables(['record'], ({ record }: { record: AttendanceRecord }) => ({
  record,
  subject: record.subject.observe(),
}))

const withAttendance = withObservables(['subject'], ({ subject }: { subject: Subject }) => ({
  attendanceRecords: subject.attendanceRecords.observeWithColumns(["status"]),
}))

const EnhancedRecordItem = withRecord(withAttendance(RecordItem))

export default EnhancedRecordItem