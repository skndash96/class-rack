import SubjectModal from '@/components/subjects/edit/SubjectModal'
import { usePreferences } from '@/contexts/Preferences'
import { AttendanceRecord } from '@/db/models/AttendanceRecord'
import { Subject } from '@/db/models/Subject'
import { handleDeleteSubject, handleEditSubject } from '@/services/subjects'
import { getAttendancePercentage } from '@/utils/getAttendancePercentage'
import { withObservables } from '@nozbe/watermelondb/react'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import { Card, IconButton, Text, useTheme } from 'react-native-paper'
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated'

const SubjectItem = ({
  subject,
  editMode,
  attendanceRecords
}: {
  subject: Subject,
  editMode: boolean,
  attendanceRecords: AttendanceRecord[]
}) => {
  const theme = useTheme()
  const router = useRouter()
  const [editModalVisible, setEditModalVisible] = React.useState(false)
  const { attendanceThresholdPercentage } = usePreferences()

  const attendanceInfo = useMemo(() => {
    return getAttendancePercentage(attendanceRecords, attendanceThresholdPercentage, subject)
  }, [attendanceRecords])

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeInDown}
    // exiting={FadeOutUp}
    >
      <Card mode="elevated" style={{}} elevation={2}>
        <TouchableOpacity activeOpacity={editMode ? 1 : 0.6} onPress={() => !editMode && router.push("/subjects/" + subject.id as any)}>
          <Card.Title
            title={subject.name}
            subtitle={`${subject.code} (${subject.credits} credits)`}
            right={() => !editMode && (
              <IconButton
                icon="chevron-right"
                size={24}
              />
            )}
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
        </TouchableOpacity >

        {editMode && (
          <Card.Actions>
            {editModalVisible && (
              <SubjectModal
                initialSubject={subject}
                title='Edit Subject'
                onClose={() => setEditModalVisible(false)}
                onSubmit={async (params) => {
                  await handleEditSubject(params, subject)
                  setEditModalVisible(false)
                }}
              />
            )}

            <IconButton
              icon="pencil"
              onPress={() => setEditModalVisible(true)}
              size={24}
            />
            <IconButton
              icon="delete"
              onPress={() => handleDeleteSubject(subject)}
              size={24}
            />
          </Card.Actions>
        )}
      </Card>
    </Animated.View>
  )
}

const enhanceSubjectItem = withObservables(['subject'], ({ subject }: {
  subject: Subject
}) => ({
  subject: subject.observe(),
  attendanceRecords: subject.attendanceRecords.observeWithColumns(["status"]),
}))

export default enhanceSubjectItem(SubjectItem)
