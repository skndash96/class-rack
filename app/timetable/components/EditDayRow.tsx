import { Subject } from "@/db/models/Subject"
import { Timetable } from "@/db/models/Timetable"
import { withObservables } from "@nozbe/watermelondb/react"
import { Card, IconButton, Text, useTheme } from "react-native-paper"
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated'

const EditDayRow = ({ entry, subject, loading, totalEntries, onDelete, onMoveUp, onMoveDown }: {
  entry: Timetable,
  subject: Subject,
  totalEntries: number,
  loading: boolean,
  onDelete: (entry: Timetable) => void,
  onMoveUp: (entry: Timetable) => void,
  onMoveDown: (entry: Timetable) => void,
}) => {
  const theme = useTheme()

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeInDown}
      // exiting={FadeOutUp}
    >
      <Card style={{ marginVertical: 8 }}>
        <Card.Title
          right={() => <Text style={{ marginRight: 12 }}>Slot {entry.slotNumber}</Text>}
          titleVariant="titleLarge"
          title={subject.name}
          subtitle={`${subject.code} (${subject.credits} credits)`}
        />
        <Card.Actions>
          <IconButton
            mode="contained"
            disabled={loading || entry.slotNumber <= 1}
            icon="arrow-up"
            onPress={() => onMoveUp(entry)}
          />
          <IconButton
            mode="contained"
            disabled={loading || entry.slotNumber >= totalEntries}
            icon="arrow-down"
            onPress={() => onMoveDown(entry)}
          />
          <IconButton
            mode="contained"
            disabled={loading}
            icon="delete"
            iconColor={theme.colors.error}
            onPress={() => onDelete(entry)}
          />
        </Card.Actions>
      </Card>
    </Animated.View>
  )
}

const enhanceEditDayRow = withObservables(['entry'], ({ entry }: { entry: Timetable }) => ({
  entry,
  subject: entry.subject.observe(),
}))

const EnhancedEditDayRow = enhanceEditDayRow(EditDayRow)

export default EnhancedEditDayRow
