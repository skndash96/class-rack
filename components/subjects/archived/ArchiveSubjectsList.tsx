import { useTopbar } from '@/contexts/Topbar'
import { database } from '@/db'
import { Subject } from '@/db/models/Subject'
import { Timetable } from '@/db/models/Timetable'
import { Q } from '@nozbe/watermelondb'
import { withObservables } from '@nozbe/watermelondb/react'
import { FlashList } from '@shopify/flash-list'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Alert, BackHandler, TouchableOpacity, View } from 'react-native'
import { Button, Card, Icon, IconButton, Text, useTheme } from 'react-native-paper'
import Animated, { LinearTransition, SlideInUp } from 'react-native-reanimated'
import Toast from 'react-native-simple-toast'

const ArchiveSubjectsList = ({
  subjects,
}: {
  subjects: Subject[]
}) => {
  const theme = useTheme()
  const [subjectsArchivedMap, setSubjectsArchivedMap] = React.useState<Record<string, boolean>>({})
  const { setTopBarOptions } = useTopbar()
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const isEditing = useMemo(() => {
    return subjects.some((subject) => subject.isArchived !== subjectsArchivedMap[subject.id])
  }, [subjects, subjectsArchivedMap])

  const resetSubjectsArchivedMap = () => {
    const map: Record<string, boolean> = {}
    subjects.forEach((subject) => {
      map[subject.id] = subject.isArchived
    })
    setSubjectsArchivedMap(map)
  }

  const handleToggleArchive = (subject: Subject) => {
    setSubjectsArchivedMap((prev) => ({
      ...prev,
      [subject.id]: !prev[subject.id],
    }))
  }

  const handleSave = useCallback(async () => {
    setLoading(true)
    const updates: Subject[] = []
    let isError = false

    for (const subject of subjects) {
      const isArchived = subjectsArchivedMap[subject.id] ?? subject.isArchived
      if (isArchived !== subject.isArchived) {
        const timetableCount = await subject.collections.get<Timetable>('timetable').query(Q.where('subject_id', subject.id)).fetchCount()

        if (timetableCount > 0) {
          Alert.alert(
            "Cannot Archive Subject",
            `The subject "${subject.name}" is associated with one or more timetables. Please remove it from all timetables before archiving.`,
          )
          isError = true
          break
        }

        updates.push(
          subject.prepareUpdate((subject) => {
            subject.isArchived = isArchived
          })
        )
      }
    }

    if (isError) {
      setLoading(false)
      return
    }

    if (updates.length > 0) {
      try {
        await database.write(async () => {
          await database.batch(...updates)
        })
        Toast.show("Subjects updated successfully", Toast.SHORT)
        router.back()
      } catch (error) {
        console.error("Failed to update subjects:", error)
        Toast.show("Failed to update subjects", Toast.SHORT)
      } finally {
        setLoading(false)
      }
    } else {
      router.back()
    }
  }, [subjects, subjectsArchivedMap])

  useFocusEffect(useCallback(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isEditing) {
        resetSubjectsArchivedMap()
        return true
      } else {
        return false
      }
    })

    setTopBarOptions({
      title: "Subjects Archive",
      isBackButtonVisible: true,
      rightActions: isEditing ? [
        <Button
          onPress={handleSave}
          mode="contained"
          icon="check"
          disabled={loading}
        >
          Save
        </Button>
      ] : undefined
    })

    return () => {
      subscription.remove()
    }
  }, [isEditing]))

  useEffect(() => {
    resetSubjectsArchivedMap()
  }, [subjects])

  return (
    <View style={{
      flex: 1
    }}>
      <FlashList
        data={[{ id: "info "}].concat(subjects as (Subject | { id: string })[])}
        keyExtractor={(item) => item.id}
        estimatedItemSize={100}
        renderItem={({ item: subject }) => !(subject instanceof Subject) ? (
          <Card mode="contained" style={{ marginVertical: 16, backgroundColor: theme.colors.elevation.level0 }}>
            <Card.Content style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
              <IconButton icon="information" size={20} />
              <Text style={{ flex: 1 }}>
                Archived subjects are not shown in the main list. You can archive completed courses or ones you no longer need.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          <Animated.View
            entering={SlideInUp}
            layout={LinearTransition}
            style={{
              marginBottom: 16
            }}
          >
            <TouchableOpacity disabled={loading} activeOpacity={0.7} onPress={() => handleToggleArchive(subject)}>
              <Card style={{
                backgroundColor: !subjectsArchivedMap[subject.id] || subjectsArchivedMap[subject.id] === subject.isArchived ? theme.colors.elevation.level2 : theme.colors.primaryContainer,
              }}>
                <Card.Title
                  title={subject.name + (subject.isArchived ? ' (Archived)' : '')}
                  titleStyle={{
                    fontSize: 18
                  }}
                  subtitle={`${subject.code} (${subject.credits} credits)`}
                  left={() => (
                    <Icon
                      size={24}
                      source={subjectsArchivedMap[subject.id] ? 'check-circle' : 'circle'}
                      color={subjectsArchivedMap[subject.id] ? theme.colors.primary : theme.colors.onSurfaceVariant}
                    />
                  )}
                />
              </Card>
            </TouchableOpacity>
          </Animated.View>
        )}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 96
        }}
        ListEmptyComponent={() => (
          <Text style={{
            padding: 12
          }}>No archived subjects found</Text>
        )}
      />
    </View >
  )
}

const enhanceArchiveSubjectsList = withObservables([], () => ({
  subjects: database.get<Subject>('subjects').query(
    Q.sortBy('created_at', Q.desc),
    Q.sortBy('is_archived', Q.desc),
  ).observeWithColumns(['is_archived']),
}))

const EnhancedArchiveSubjectsList = enhanceArchiveSubjectsList(ArchiveSubjectsList)

export default EnhancedArchiveSubjectsList