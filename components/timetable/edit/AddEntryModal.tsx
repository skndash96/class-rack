import { database } from '@/db'
import { Subject } from '@/db/models/Subject'
import { Q } from '@nozbe/watermelondb'
import { withObservables } from '@nozbe/watermelondb/react'
import React, { useState } from 'react'
import { Alert, Modal, ScrollView, StyleSheet, View } from 'react-native'
import { Button, Card, List, useTheme } from 'react-native-paper'

const AddEntryModal = ({
  title,
  onClose,
  onSubmit,
  subjects
}: {
  subjects: Subject[],
  title: string
  onSubmit: ({
    subject
  }: {
    subject: Subject
  }) => void,
  onClose: () => void
}) => {
  const theme = useTheme()
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setLoading(true)

    if (!selectedSubject) {
      setLoading(false)
      Alert.alert('Invalid Input', 'Please select a subject.')
      return
    }

    onSubmit({
      subject: selectedSubject
    })
  }

  return (
    <Modal visible={true} onDismiss={onClose} onRequestClose={onClose} transparent animationType="slide">
      <View style={styles.backdrop}>
        <Card style={styles.modalContainer}>
          <Card.Title titleVariant='headlineSmall' title={title} style={styles.cardTitle} />
          <Card.Content>
            <ScrollView style={{ maxHeight: 300 }}>
              {subjects.map((subject) => (
                <List.Item
                  title={subject.name}
                  style={{
                    backgroundColor: selectedSubject && selectedSubject.id === subject.id ? theme.colors.primaryContainer : 'transparent',
                  }}
                  description={subject.code}
                  left={props => <List.Icon {...props} icon={(selectedSubject && selectedSubject.id === subject.id) ? "check-circle" : 'circle'} />}
                  onPress={() => setSelectedSubject(subject)}
                  key={subject.id}
                />
              ))}
            </ScrollView>
          </Card.Content>
          <Card.Actions style={{ marginTop: 12 }}>
            <Button onPress={onClose}>Cancel</Button>
            <Button disabled={loading} mode="contained" onPress={handleSubmit}>Add</Button>
          </Card.Actions>
        </Card>
      </View>
    </Modal>
  )
}

const enhanceAddEntryModal = withObservables([], () => ({
  subjects: database.get<Subject>('subjects').query(Q.where("is_archived", false)).observe(),
}))

export default enhanceAddEntryModal(AddEntryModal)

const styles = StyleSheet.create({
  modalContainer: {
    margin: 80,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  cardTitle: {
    marginBottom: 0
  }
})