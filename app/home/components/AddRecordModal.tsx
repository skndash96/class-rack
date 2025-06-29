import { database } from '@/db'
import { Subject } from '@/db/models/Subject'
import { withObservables } from '@nozbe/watermelondb/react'
import React, { useMemo, useState } from 'react'
import { Alert, Modal, ScrollView, StyleSheet, View } from 'react-native'
import DatePicker from 'react-native-date-picker'
import { Button, Card, List, Text, useTheme } from 'react-native-paper'
import Animated, { FadeInUp } from 'react-native-reanimated'

const AddRecordModal = ({
  title,
  initialDate,
  onClose,
  onSubmit,
  subjects
}: {
  subjects: Subject[],
  initialDate: Date,
  title: string
  onSubmit: ({
    date,
    subject,
  }: {
    date: Date,
    subject: Subject
  }) => void,
  onClose: () => void
}) => {
  const theme = useTheme()
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [date, setDate] = useState(initialDate)
  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const dateComment = useMemo(() => {
    if (date.setHours(0,0,0,0) === new Date().setHours(0,0,0,0)) {
      return 'Today'
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [date])

  const handleSubmit = () => {
    setLoading(true)

    if (!selectedSubject) {
      setLoading(false)
      Alert.alert('Invalid Input', 'Please select a subject.')
      return
    }

    onSubmit({
      date: date || new Date(),
      subject: selectedSubject
    })
  }

  return (
    <Modal visible={true} onDismiss={onClose} onRequestClose={onClose} transparent animationType="slide">
      <View style={styles.backdrop}>
        <Card style={styles.modalContainer}>
          <Card.Title titleVariant='headlineSmall' title={title} style={styles.cardTitle} />
          <Card.Content>
            <Text style={{
              marginBottom: 10,
              fontSize: 18
            }}>
              Occurence Date:
            </Text>

            <Button
              icon="calendar"
              mode="elevated"
              elevation={4}
              style={{
                backgroundColor: theme.colors.elevation.level4,
              }}
              onPress={() => setDatePickerVisible(true)}
            >
              {dateComment}
            </Button>

            {datePickerVisible && (
              <Animated.View
                entering={FadeInUp}
              >
                <DatePicker
                  date={date || new Date()}
                  mode="date"
                  onDateChange={(date) => {
                    setDate(date)
                  }}
                  style={{
                    marginHorizontal: 'auto'
                  }}
                />
              </Animated.View>
            )}

            <Text style={{
              marginTop: 20,
              marginBottom: 10,
              fontSize: 18
            }}>
              Select Subject:
            </Text>

            <ScrollView style={{
              backgroundColor: theme.colors.elevation.level4,
              maxHeight: 200,
              borderRadius: 20
            }}>
              {subjects.map((subject) => (
                <List.Item
                  title={subject.name}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.outlineVariant,
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
  subjects: database.get<Subject>('subjects').query().observe(),
}))

export default enhanceAddEntryModal(AddRecordModal)

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    marginTop: 80
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  cardTitle: {
    marginBottom: 0
  }
})