import { useTopbar } from '@/contexts/Topbar'
import { database } from '@/db'
import { AttendanceRecord } from '@/db/models/AttendanceRecord'
import { Subject } from '@/db/models/Subject'
import { getAttendancePercentage } from '@/utils/getAttendancePercentage'
import { withObservables } from '@nozbe/watermelondb/react'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { SectionList, View } from 'react-native'
import { Card, Icon, Text, useTheme } from 'react-native-paper'
import SubjectPageRecordItem from './SubjectPageRecordItem'

const SubjectPage = ({
  subject,
  attendanceRecords
}: {
  subject: Subject,
  attendanceRecords: AttendanceRecord[]
}) => {
  const theme = useTheme()
  const { setTopBarOptions } = useTopbar()

  const attendanceRecordsGrouped = useMemo(() => {
    const grouped: { [key: string]: AttendanceRecord[] } = {}
    attendanceRecords.forEach(record => {
      const dateKey = new Date(record.date).toLocaleDateString("en-US", {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })

      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(record)
    })
    return Object.entries(grouped).map(([title, data]) => ({
      title,
      data
    }))
  }, [attendanceRecords])

  const attendanceInfo = useMemo(() => {
    return getAttendancePercentage(attendanceRecords)
  }, [attendanceRecords])

  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: `${subject.name}`,
      rightActions: undefined,
      isBackButtonVisible: true,
    })
  }, []))

  return (
    <View style={{
      padding: 16
    }}>
      <Card>
        <Card.Title
          title={subject.name}
          subtitle={`${subject.code} (${subject.credits} Credits)`}
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
          <View style={{
            display: "flex",
            flexDirection: "row",
            gap: 8,
            marginTop: 12
          }}>
            <Icon color="rgba(38,255,38,0.4)" source="check-circle" size={20} />
            <Text style={{
              width: 80
            }}>
              Present
            </Text>
            <Text>
              {attendanceInfo.totalPresent}
            </Text>
          </View>
          <View style={{
            display: "flex",
            flexDirection: "row",
            gap: 8,
            marginTop: 12
          }}>
            <Icon color="rgba(255,38,38,0.5)" source="close-circle" size={20} />
            <Text style={{
              width: 80
            }}>
              Absent
            </Text>
            <Text>
              {attendanceInfo.totalClasses - attendanceInfo.totalPresent}
            </Text>
          </View>
          <View style={{
            display: "flex",
            flexDirection: "row",
            gap: 8,
            marginTop: 12
          }}>
            <Icon color="rgba(255,156,38,0.5)" source="eye-off" size={20} />
            <Text style={{
              width: 80
            }}>
              Cancelled
            </Text>
            <Text>
              {attendanceInfo.totalCancelled}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <SectionList
        style={{ marginTop: 16 }}
        sections={attendanceRecordsGrouped}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => (
          <SubjectPageRecordItem
            subject={subject}
            record={item}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={{
            fontSize: 18,
            marginVertical: 8,
            color: theme.colors.onSurfaceVariant
          }}>
            {title}
          </Text>
        )}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>No attendance records found.</Text>
        )}
      />
    </View>
  )
}

const EnhancedSubjectPage = withObservables(['subjectId'], ({ subjectId }: { subjectId: string }) => ({
  subject: database.get<Subject>('subjects').findAndObserve(subjectId),
}))(props => {
  const { subject } = props

  const ObservedComponent = withObservables(['subject'], ({ subject }: { subject: Subject }) => ({
    attendanceRecords: subject.sortedAttendanceRecords.observeWithColumns(['status']),
  }))(SubjectPage)

  return <ObservedComponent subject={subject} />
})

export default EnhancedSubjectPage