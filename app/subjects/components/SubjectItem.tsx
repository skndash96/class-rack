import { database } from '@/db'
import { AttendanceRecord } from '@/db/models/AttendanceRecord'
import { Subject } from '@/db/models/Subject'
import { getAttendancePercentage } from '@/utils/getAttendancePercentage'
import { withObservables } from '@nozbe/watermelondb/react'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { Alert } from 'react-native'
import { Card, IconButton, Text, useTheme } from 'react-native-paper'
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated'
import SubjectModal from './SubjectModal'

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

  const attendanceInfo = useMemo(() => {
    return getAttendancePercentage(attendanceRecords)
  }, [attendanceRecords])

  const handleEdit = async (updatedSubject: {
    name: string,
    code: string,
    credits: number
  }) => {
    await database.write(async () => {
      await subject.update((s) => {
        s.name = updatedSubject.name
        s.code = updatedSubject.code
        s.credits = updatedSubject.credits
      })
    })

    setEditModalVisible(false)
  }

  const handleDelete = async () => {
    const confirmed = await new Promise<boolean>((resolve) => {
      Alert.alert(
        'Delete Subject',
        'Are you sure you want to delete this subject?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
          { text: 'Delete', style: 'destructive', onPress: () => resolve(true) }
        ],
        { cancelable: true }
      )
    })

    if (!confirmed) return

    await database.write(async () => {
      await subject.markAsDeleted()
    })
  }

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeInDown}
      // exiting={FadeOutUp}
    >
      <Card onPress={() => !editMode && router.push("/subjects/"+subject.id as any)} mode="elevated" style={{}} elevation={2}>
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
        
        {editMode && (
          <Card.Actions>
            {editModalVisible && (
              <SubjectModal
                initialSubject={subject}
                title='Edit Subject'
                onClose={() => setEditModalVisible(false)}
                onSubmit={handleEdit}
              />
            )}

            <IconButton
              icon="pencil"
              onPress={() => setEditModalVisible(true)}
              size={24}
            />
            <IconButton
              icon="delete"
              onPress={handleDelete}
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
