import { database } from '@/db'
import { Subject } from '@/db/models/Subject'
import { withObservables } from '@nozbe/watermelondb/react'
import React from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'
import SubjectItem from './SubjectItem'

const enhanceSubjectsList = withObservables([], () => ({
  subjects: database.get<Subject>('subjects').query().observe(),
}))

function SubjectsList({ subjects, editMode = false }: {
  subjects: Subject[],
  editMode?: boolean
}) {
  if (!subjects || subjects.length === 0) {
    return <Text>No subjects found</Text>
  }

  return (
    <View style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {subjects.map((subject) => (
        <SubjectItem
          key={subject.id}
          subject={subject}
          editMode={editMode}
        />
      ))}
    </View>
  )
}

export default enhanceSubjectsList(SubjectsList)