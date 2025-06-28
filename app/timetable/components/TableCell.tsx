import { Subject } from "@/db/models/Subject"
import { withObservables } from "@nozbe/watermelondb/react"
import { StyleProp, ViewStyle } from "react-native"
import { Surface, Text } from "react-native-paper"

const Cell = ({ subject, style }: {
  subject: Subject,
  style: StyleProp<ViewStyle>
}) => {
  return (
    <Surface style={style}>
      <Text style={{
        wordWrap: "break-word",
        textAlign: 'center',
        verticalAlign: 'middle',
      }}>
        {subject.name}
      </Text>
    </Surface>
  )
}

const enhanceCell = withObservables(['entry'], ({ entry }) => ({
  subject: entry.subject.observe()
}))

export default enhanceCell(Cell)
