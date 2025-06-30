import React from 'react'
import { ScrollView, View } from 'react-native'
import { SegmentedButtons } from 'react-native-paper'
import EditDay from './EditDay'

const idxToDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

export default function EditView() {
  const [day, setDay] = React.useState(1)

  return (
    <View style={{
      flex: 1,
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <ScrollView horizontal style={{
        flexShrink: 0,
        flexGrow: 0,
      }} contentContainerStyle={{
        margin: 16,
        marginBottom: 16,
        paddingRight: 40
      }}>
        <SegmentedButtons
          value={idxToDay[day]}
          onValueChange={value => setDay(idxToDay.indexOf(value))}
          buttons={[...idxToDay.slice(1), idxToDay[0]].map(day => ({
            value: day,
            label: day
          }))}
        />
      </ScrollView>

      <EditDay dayOfWeek={day} />
    </View>
  )
}