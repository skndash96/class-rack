import { database } from "@/db"
import { Subject } from "@/db/models/Subject"
import { Timetable } from "@/db/models/Timetable"
import { Q } from "@nozbe/watermelondb"
import { Alert } from "react-native"
import Toast from "react-native-simple-toast"

export interface SubjectModalParams {
  name: string,
  code: string,
  credits: number,
  initialPresent: number,
  initialTotalClasses: number
}

export const handleAddSubject = async ({
  name,
  code,
  credits,
  initialPresent,
  initialTotalClasses
}: SubjectModalParams) => {
  try {
    await database.write(async () => {
      await database.get<Subject>("subjects").create((subject) => {
        subject.name = name
        subject.code = code
        subject.credits = credits
        subject.isArchived = false
        subject.initialPresent = initialPresent
        subject.initialTotalClasses = initialTotalClasses
      })
    })
    Toast.show("Subject added successfully!", Toast.SHORT)
  } catch (error) {
    console.error("Failed to add subject:", error)
    Toast.show("Failed to add subject. Please try again.", Toast.SHORT)
  }
}

export const handleEditSubject = async ({
  name,
  code,
  credits,
  initialPresent,
  initialTotalClasses
}: SubjectModalParams, subject: Subject) => {
  try {
    await database.write(async () => {
      await subject.update((s) => {
        s.name = name
        s.code = code
        s.credits = credits
        s.initialPresent = initialPresent
        s.initialTotalClasses = initialTotalClasses
      })
    })
    Toast.show("Subject updated successfully", Toast.SHORT)
  } catch (error) {
    console.error("Error updating subject:", error)
    Toast.show("Failed to update subject", Toast.SHORT)
    return
  }
}

export const handleDeleteSubject = async (subject: Subject) => {
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

  if (!confirmed) return

  try {
    const timetableEntries = await database.get<Timetable>('timetable').query(Q.where('subject_id', subject.id)).fetchCount()

    if (timetableEntries > 0) {
      Alert.alert(
        'Cannot Delete Subject',
        'This subject is currently scheduled in your timetable. Please remove it from your timetable before deleting.',
        [{ text: 'OK' }]
      )

      return
    }

    await database.write(async () => {
      await subject.markAsDeleted()
    })
    Toast.show("Subject deleted successfully", Toast.SHORT)
  } catch (error) {
    console.error("Error deleting subject:", error)
    Toast.show("Failed to delete subject", Toast.SHORT)
    return
  }
}