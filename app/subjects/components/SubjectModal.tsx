import { Subject } from '@/db/models/Subject'
import React, { useState } from 'react'
import { Alert, Modal, StyleSheet, View } from 'react-native'
import { Button, Card, TextInput } from 'react-native-paper'

export default function SubjectModal({
  title,
  initialSubject = null,
  onClose,
  onSubmit,
}: {
  title: string
  initialSubject?: Subject | null,
  onSubmit: (subject: {
    name: string,
    code: string,
    credits: number
  }) => void,
  onClose: () => void
}) {
  const [name, setName] = useState(initialSubject?.name || '')
  const [code, setCode] = useState(initialSubject?.code || '')
  const [credits, setCredits] = useState(initialSubject?.credits.toString() || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setLoading(true)

    const _credits = parseInt(credits, 10)

    if (!name || !code || isNaN(_credits)) {
      setLoading(false)
      Alert.alert('Invalid Input', 'Please fill all fields correctly. Credits must be a number.')
      return
    }

    onSubmit({
      name,
      code,
      credits: _credits
    }) // will close the modal
  }

  return (
    <Modal visible={true} onDismiss={onClose} onRequestClose={onClose} transparent animationType="slide">
      <View style={styles.backdrop}>
        <Card style={styles.modalContainer}>
          <Card.Title titleVariant='headlineSmall' title={title} style={styles.cardTitle} />
          <Card.Content style={{ columnGap: 12 }}>
            <TextInput
              label="Subject Name"
              value={name}
              onChangeText={setName}
              style={{ marginBottom: 12 }}
            />
            <TextInput
              label="Subject Code"
              value={code}
              onChangeText={setCode}
              style={{ marginBottom: 12 }}
            />
            <TextInput
              label="Total Credits"
              value={credits}
              onChangeText={setCredits}
              keyboardType="numeric"
            />
          </Card.Content>
          <Card.Actions style={{ marginTop: 12 }}>
            <Button onPress={onClose}>Cancel</Button>
            <Button disabled={loading} mode="contained" onPress={handleSubmit}>Done</Button>
          </Card.Actions>
        </Card>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  cardTitle: {
    marginBottom: 0
  }
})