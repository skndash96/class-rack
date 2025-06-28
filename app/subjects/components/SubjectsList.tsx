import { database } from '@/db'
import { Subject } from '@/db/models/Subject'
import { withObservables } from '@nozbe/watermelondb/react'
import React from 'react'
import { FlatList } from 'react-native'
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
  return (
    <>
      {editMode && (
        <AddSubject />
      )}

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubjectItem
            subject={item}
            editMode={editMode}
          />
        )}
        contentContainerStyle={{
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          paddingBottom: 96
        }}
        ListEmptyComponent={() => (
          <Text style={{
            padding: 12
          }}>No subject s found</Text>
        )}
      />
    </>
  )
}

export default enhanceSubjectsList(SubjectsList)