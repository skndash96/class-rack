import { database } from '@/db'
import { Subject } from '@/db/models/Subject'
import React, { useState } from 'react'
import { FAB } from 'react-native-paper'
import Toast from 'react-native-simple-toast'
import SubjectModal from './SubjectModal'

export default function AddSubject() {
  const [visible, setVisible] = useState(false)

  const handleAdd = ({
    name,
    code,
    credits
  }: {
    name: string,
    code: string,
    credits: number
  }) => {
    database.write(async () => {
      await database.get<Subject>('subjects').create((subject) => {
        subject.name = name
        subject.code = code
        subject.credits = credits
        subject.isArchived = false
      })
    })
      .then(() => {
        setVisible(false)
        Toast.show("Subject added successfully!", Toast.SHORT)
      })
      .catch((error) => {
        console.error("Failed to add subject:", error)
        Toast.show("Failed to add subject. Please try again.", Toast.SHORT)
      })
  }

  return (
    <>
      {visible && (
        <SubjectModal
          title={"Add Subject"}
          initialSubject={null}
          onClose={() => setVisible(false)}
          onSubmit={handleAdd}
        />
      )}

      <FAB
        style={{
          marginHorizontal: 16,
          // position: 'absolute',
          // bottom: 24,
          // right: 16
        }}
        label='Add Subject'
        icon="plus"
        mode="elevated"
        elevation={0}
        onPress={() => setVisible(true)}
      />
    </>
  )
}