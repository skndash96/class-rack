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
    credits: number,
    initialPresent: number,
    initialTotalClasses: number
  }) => void,
  onClose: () => void
}) {
  const [name, setName] = useState(initialSubject?.name || '')
  const [code, setCode] = useState(initialSubject?.code || '')
  const [credits, setCredits] = useState(initialSubject?.credits.toString() || '')
  const [initialPresent, setInitialPresent] = useState(initialSubject?.initialPresent?.toString() || '0')
  const [initialTotalClasses, setInitialTotalClasses] = useState(initialSubject?.initialTotalClasses?.toString() || '0')
  const [loading, setLoading] = useState(false)
  const [moreVisible, setMoreVisible] = useState(false)

  const handleSubmit = () => {
    setLoading(true)

    const _credits = parseInt(credits, 10)
    const _initialPresent = parseInt(initialPresent, 10)
    const _initialTotalClasses = parseInt(initialTotalClasses, 10)

    if (!name || !code || isNaN(_credits) || _credits <= 0 || isNaN(_initialPresent) || isNaN(_initialTotalClasses) || _initialTotalClasses < 0 || _initialPresent < 0) {
      setLoading(false)
      Alert.alert('Invalid Input', 'Please fill all fields correctly. Credits must be a number.')
      return
    }

    if (initialTotalClasses < initialPresent) {
      setLoading(false)
      Alert.alert('Invalid Input', 'Initial Total Classes cannot be less than Initial Present.')
      return
    }

    onSubmit({
      name,
      code,
      credits: _credits,
      initialPresent: _initialPresent,
      initialTotalClasses: _initialTotalClasses
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
            <Button
              icon={moreVisible ? 'chevron-up' : 'chevron-down'}
              onPress={() => setMoreVisible(!moreVisible)}
              mode="text"
              compact
              style={{
                alignSelf: 'flex-start',
                marginTop: 12,
                marginBottom: 12
              }}
            >
              {moreVisible ? 'Less Options' : 'More Options'}
            </Button>
            {moreVisible && (
              <>
                <TextInput
                  label="Initial Total Classes"
                  value={initialTotalClasses}
                  onChangeText={(text) => setInitialTotalClasses(text)}
                  keyboardType="numeric"
                />
                <TextInput
                  label="Initial Classes Present"
                  value={initialPresent}
                  onChangeText={(text) => setInitialPresent(text)}
                  keyboardType="numeric"
                  style={{ marginVertical: 12 }}
                />
              </>
            )}
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