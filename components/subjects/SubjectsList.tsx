import AddSubject from '@/components/subjects/edit/AddSubjectButton'
import { database } from '@/db'
import { Subject } from '@/db/models/Subject'
import { Q } from '@nozbe/watermelondb'
import { withObservables } from '@nozbe/watermelondb/react'
import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'
import SubjectItem from './SubjectItem'

const enhanceSubjectsList = withObservables([], () => ({
  subjects: database.get<Subject>('subjects').query(Q.where("is_archived", false)).observe(),
}))

function SubjectsList({ subjects, editMode = false }: {
  subjects: Subject[],
  editMode?: boolean
}) {
  return (
    <>
      {editMode && (
        <View style={{
          marginBottom: 16
        }}>
          <AddSubject />
        </View>
      )}

      <FlashList
        data={subjects}
        keyExtractor={(item) => item.id}
        estimatedItemSize={100}
        renderItem={({ item }) => (
          <SubjectItem
            subject={item}
            editMode={editMode}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 96
        }}
        ListEmptyComponent={() => (
          <Text style={{
            padding: 12
          }}>No subjects found</Text>
        )}
      />
    </>
  )
}

export default enhanceSubjectsList(SubjectsList)