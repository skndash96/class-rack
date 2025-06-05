import { useTopbar } from '@/contexts/Topbar'
import { View } from 'react-native'
import { Appbar } from 'react-native-paper'

export default function TopBar() {
  const { topBarOptions } = useTopbar()

  return (
    <Appbar.Header>
      <Appbar.Content title={topBarOptions.title || "Class Rack"} />

      {topBarOptions.rightActions?.map((el, index) => (
        <View key={index}>
          {el}
        </View>
      ))}
    </Appbar.Header>
  )
}