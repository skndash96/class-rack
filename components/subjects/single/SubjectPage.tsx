import SubjectModal from '@/components/subjects/edit/SubjectModal'
import { usePreferences } from '@/contexts/Preferences'
import { useTopbar } from '@/contexts/Topbar'
import { database } from '@/db'
import { AttendanceRecord } from '@/db/models/AttendanceRecord'
import { Subject } from '@/db/models/Subject'
import { handleDeleteSubject, handleEditSubject } from '@/services/subjects'
import { getAttendancePercentage } from '@/utils/getAttendancePercentage'
import { withObservables } from '@nozbe/watermelondb/react'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { SectionList, View } from 'react-native'
import { Card, Icon, IconButton, Menu, Text, useTheme } from 'react-native-paper'
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
  const [moreMenuVisible, setMoreMenuVisible] = React.useState(false)
  const [editSubjectModalVisible, setEditSubjectModalVisible] = React.useState(false)
  const { attendanceThresholdPercentage } = usePreferences()

  const attendanceRecordsGrouped = useMemo(() => {
    const grouped: { [key: string]: AttendanceRecord[] } = {}
    attendanceRecords.forEach(record => {
      const dateKey = record.date.toLocaleDateString("en-US", {
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
    return getAttendancePercentage(attendanceRecords, attendanceThresholdPercentage, subject)
  }, [attendanceRecords])

  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: `${subject.name}`,
      isBackButtonVisible: true,
      rightActions: [
        <Menu
          visible={moreMenuVisible}
          onDismiss={() => setMoreMenuVisible(false)}
          anchorPosition='bottom'
          anchor={<IconButton
            icon="dots-vertical"
            onPress={() => setMoreMenuVisible(!moreMenuVisible)}
            size={24}
          />}>
          <Menu.Item onPress={() => {
            setMoreMenuVisible(false)
            setEditSubjectModalVisible(true)
          }} title="Edit" />
          <Menu.Item onPress={() => {
            setMoreMenuVisible(false)
            handleDeleteSubject(subject)
          }} title="Delete" />
        </Menu>
      ],
    })
  }, [moreMenuVisible]))

  return (
    <View style={{
      padding: 16
    }}>
      {editSubjectModalVisible && (
        <SubjectModal
          title="Edit Subject"
          initialSubject={subject}
          onClose={() => setEditSubjectModalVisible(false)}
          onSubmit={async (params) => {
            await handleEditSubject(params, subject)
            setEditSubjectModalVisible(false)
          }}
        />
      )}
      <Card>
        <Card.Title
          title={subject.name}
          subtitle={`${subject.code} (${subject.credits} Credits)`}
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
            <Icon color="rgba(255,156,38,0.5)" source="cancel" size={20} />
            <Text style={{
              width: 80
            }}>
              Cancelled
            </Text>
            <Text>
              {attendanceInfo.totalCancelled}
            </Text>
          </View>
          <View style={{
            display: "flex",
            flexDirection: "row",
            gap: 8,
            marginTop: 12
          }}>
            <Icon color="rgba(56, 223, 235, 0.5)" source="eye-off" size={20} />
            <Text style={{
              width: 80
            }}>
              Unmarked
            </Text>
            <Text>
              {attendanceInfo.totalUnmarked}
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

      {subject.initialTotalClasses > 0 && (
        <Card style={{ marginVertical: 20, padding: 12 }}>
          <View style={{ flexDirection: 'row', marginBottom: 6 }}>
            <Text variant="bodyMedium">Initial Total Classes:</Text>
            <Text variant="bodyMedium" style={{ marginLeft: 16, fontWeight: 'bold' }}>
              {subject.initialTotalClasses}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 6 }}>
            <Text variant="bodyMedium">Initial Total Present:</Text>
            <Text variant="bodyMedium" style={{ marginLeft: 16, fontWeight: 'bold' }}>
              {subject.initialPresent}
            </Text>
          </View>
        </Card>
      )}
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