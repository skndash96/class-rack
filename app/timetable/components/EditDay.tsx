import { database } from '@/db'
import { Subject } from '@/db/models/Subject'
import { Timetable } from '@/db/models/Timetable'
import { Q } from '@nozbe/watermelondb'
import { withObservables } from '@nozbe/watermelondb/react'
import React from 'react'
import { Alert, FlatList, View } from 'react-native'
import { FAB, Text } from 'react-native-paper'
import Toast from 'react-native-simple-toast'
import AddEntryModal from './AddEntryModal'
import EnhancedEditDayRow from './EditDayRow'

const EditDay = ({
  dayOfWeek,
  entries
}: {
  dayOfWeek: number,
  entries: Timetable[]
}) => {
  const [loading, setLoading] = React.useState(false)
  const [addingEntry, setAddingEntry] = React.useState(false)

  const handleAddEntry = async ({
    subject
  }: {
    subject: Subject
  }) => {
    database.write(async () => {
      setLoading(true)

      await database.get<Timetable>('timetable').create((entry) => {
        entry.dayOfWeek = dayOfWeek
        entry.slotNumber = entries.length + 1
        entry.subject.set(subject)
      })
    })
      .then(() => {
        Toast.show("Entry added successfully!", Toast.SHORT)
      })
      .catch((error) => {
        console.error("Failed to add entry:", error)
        Toast.show("Failed to add entry. Please try again.", Toast.SHORT)
      })
      .finally(() => {
        setLoading(false)
        setAddingEntry(false)
      })
  }

  const handleDeleteEntry = async (entry: Timetable) => {
    setLoading(true)

    const confirmed = await new Promise<boolean>((resolve) => {
      Alert.alert(
        'Delete Subject',
        'Are you sure you want to delete this subject?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
          { text: 'Delete', style: 'destructive', onPress: () => resolve(true) }
        ],
        { cancelable: true }
      )
    })

    if (!confirmed) {
      setLoading(false)
      return
    }

    database.write(async () => {
      await entry.markAsDeleted()
    })
      .then(() => {
        Toast.show("Entry deleted successfully!", Toast.SHORT)
      })
      .catch((error) => {
        console.error("Failed to delete entry:", error)
        Toast.show("Failed to delete entry. Please try again.", Toast.SHORT)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleMoveEntry = async (entry: Timetable, direction: 1 | -1) => {
    setLoading(true)

    const newEntries = Array.from(entries)
    const currentIndex = newEntries.findIndex(e => e.id === entry.id)
    const newIndex = currentIndex + direction

    if (newIndex < 0 || newIndex >= newEntries.length) {
      setLoading(false)
      return
    }

    newEntries.splice(currentIndex, 1)
    newEntries.splice(newIndex, 0, entry)

    database.write(async () => {
      await database.batch(
        ...newEntries.map((e, index) => {
          return e.prepareUpdate((timetable) => {
            timetable.slotNumber = index + 1
          })
        })
      )
    })
      .then(() => {
        Toast.show(`Entry moved ${direction === 1 ? 'down' : 'up'} successfully!`, Toast.SHORT)
      })
      .catch((error) => {
        console.error("Failed to move entry:", error)
        Toast.show("Failed to move entry. Please try again.", Toast.SHORT)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <FlatList
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100
        }}
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EnhancedEditDayRow
            loading={loading}
            entry={item}
            totalEntries={entries.length}
            onDelete={handleDeleteEntry}
            onMoveUp={(entry: Timetable) => handleMoveEntry(entry, -1)}
            onMoveDown={(entry: Timetable) => handleMoveEntry(entry, 1)}
          />
        )}
        ListEmptyComponent={() => (
          <View style={{ padding: 16, alignItems: 'center' }}>
            <Text>No entries found for this day.</Text>
          </View>
        )}
      />

      {addingEntry && (
        <AddEntryModal
          title={`Add Entry`}
          onClose={() => setAddingEntry(false)}
          onSubmit={handleAddEntry}
        />
      )}

      <FAB
        icon="plus"
        label="Add Entry"
        onPress={() => setAddingEntry(true)}
        style={{ position: 'absolute', bottom: 40, right: 16 }}
      />
    </>
  )
}

const enhanceEditDay = withObservables(["dayOfWeek"], ({ dayOfWeek }: {
  dayOfWeek: number;
}) => ({
  entries: database.get<Timetable>('timetable').query(
    Q.where("day_of_week", dayOfWeek),
    Q.sortBy("slot_number", Q.asc),
  ).observe(),
}))

export default enhanceEditDay(EditDay)