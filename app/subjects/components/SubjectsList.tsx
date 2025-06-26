import { database } from '@/db'
import { Subject } from '@/db/models/Subject'
import { withObservables } from '@nozbe/watermelondb/react'
import React from 'react'
import { ScrollView } from 'react-native'
import { Text } from 'react-native-paper'
import AddSubject from './AddSubjectButton'
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
    <>
      <ScrollView contentContainerStyle={{
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        paddingBottom: 96
      }}>
        {subjects.map((subject) => (
          <SubjectItem
            key={subject.id}
            subject={subject}
            editMode={editMode}
          />
        ))}
      </ScrollView>

      {editMode && (
        <AddSubject />
      )}
    </>
  )
}

export default enhanceSubjectsList(SubjectsList)