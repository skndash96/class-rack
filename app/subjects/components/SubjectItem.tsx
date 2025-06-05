import { database } from '@/db'
import { Subject } from '@/db/models/Subject'
import AntDesign from '@expo/vector-icons/AntDesign'
import { withObservables } from '@nozbe/watermelondb/react'
import React from 'react'
import { Alert } from 'react-native'
import { Card, IconButton } from 'react-native-paper'
import SubjectModal from './SubjectModal'

const SubjectItem = ({
  subject,
  editMode
}: {
  subject: Subject,
  editMode: boolean
}) => {
  const [editModalVisible, setEditModalVisible] = React.useState(false)

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
    <Card mode="elevated" style={{ marginVertical: 8 }} elevation={2}>
      <Card.Title title={subject.name} subtitle={`${subject.code} (${subject.credits} credits)`} />

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
            icon={({ size, color }) => (<AntDesign name="edit" size={size} color={color} />)}
            onPress={() => setEditModalVisible(true)}
            size={24}
          />
          <IconButton
            icon={({ size, color }) => (<AntDesign name="delete" size={size} color={color} />)}
            onPress={handleDelete}
            size={24}
          />
        </Card.Actions>
      )}
    </Card>
  )
}

const enhanceSubjectItem = withObservables(['subject'], ({ subject }) => ({
  subject
}))

export default enhanceSubjectItem(SubjectItem)
