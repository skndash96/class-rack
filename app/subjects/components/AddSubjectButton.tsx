import { database } from '@/db'
import { Subject } from '@/db/models/Subject'
import AntDesign from '@expo/vector-icons/AntDesign'
import React, { useState } from 'react'
import { Alert } from 'react-native'
import { Button } from 'react-native-paper'
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
      })
    })
      .then(() => {
        setVisible(false)
        Alert.alert("Success", "Subject added successfully!")
      })
      .catch((error) => {
        console.error("Failed to add subject:", error)
        Alert.alert("Error", "Failed to add subject. Please try again.")
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

      <Button
        mode='contained-tonal'
        icon={({ size, color }) => (
          <AntDesign name="plus" size={size} color={color} />
        )}
        onPress={() => setVisible(true)}
      >
        Add Subject
      </Button>
    </>
  )
}