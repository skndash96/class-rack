import { Subject } from "@/db/models/Subject"
import { withObservables } from "@nozbe/watermelondb/react"
import { useWindowDimensions, View } from "react-native"
import { Text } from "react-native-paper"

const Cell = ({ subject }: { subject: Subject }) => {
  const window = useWindowDimensions()
  const cellWidth = Math.max(40, (window.width - 32) / 7)

  return (
    <View style={[{
      width: cellWidth
    }]}>
      <Text style={{
        wordWrap: "break-word",
        textAlign: 'center',
        height: 48,
        borderWidth: 1,
        borderColor: '#444',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {subject.name}
      </Text>
    </View>
  )
}

const enhanceCell = withObservables(['entry'], ({ entry }) => ({
  subject: entry.subject.observe()
}))

export default enhanceCell(Cell)
