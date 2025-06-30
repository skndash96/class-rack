import { usePreferences } from '@/contexts/Preferences'
import { database } from '@/db'
import { AttendanceRecord } from '@/db/models/AttendanceRecord'
import { Subject } from '@/db/models/Subject'
import { getAttendancePercentage } from '@/utils/getAttendancePercentage'
import { withObservables } from '@nozbe/watermelondb/react'
import { useRouter } from 'expo-router'
import React from 'react'
import { Alert, TouchableOpacity } from 'react-native'
import { Card, Icon, IconButton, Text, useTheme } from 'react-native-paper'
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
  const router = useRouter()
  const theme = useTheme()
  const [loading, setLoading] = React.useState(false)
  const { attendanceThresholdPercentage } = usePreferences()

  const attendanceInfo = React.useMemo(() => {
    return getAttendancePercentage(attendanceRecords, attendanceThresholdPercentage, subject)
  }, [attendanceRecords])

  const handleUpdateStatus = async (status: number) => {
    if (status === null && record.date > new Date()) {
      const confirmed = await new Promise<boolean>(r => {
        Alert.alert(
          "Confirm Action",
          "You are trying to mark a record for a future date. Are you sure you want to proceed?",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => r(false)
            },
            {
              text: "OK",
              onPress: () => r(true)
            }
          ]
        )
      })

      if (!confirmed) return
    }

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
        <TouchableOpacity
          onPress={() => router.push('/subjects/' + subject.id as any)}
          activeOpacity={0.5}
        >
          <Card.Title
            title={subject.name}
            subtitle={`${subject.code} (${subject.credits} credits)`}
            left={() => (
              <>
                <Text style={{
                  fontSize: 24,
                  color: attendanceInfo.commentColor === 'BAD' ? theme.colors.onErrorContainer : theme.colors.onSecondaryContainer
                }}>
                  {attendanceInfo.percentage.split(".")[0]}
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: attendanceInfo.commentColor === 'BAD' ? theme.colors.onErrorContainer : theme.colors.onSecondaryContainer
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
            right={() => (
              <Icon
                source="chevron-right"
                size={24}
              />
            )}
            rightStyle={{
              marginRight: 16
            }}
          />
        </TouchableOpacity>

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
            icon="cancel"
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